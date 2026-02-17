import React, { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, ChevronLeft, PanelRightOpen, PanelRightClose, Layers } from 'lucide-react';
import { Button } from './ui/Button';
import { AIChatPanel } from './AIChatPanel';
import { DesignCanvas } from './DesignCanvas';
import { FormatSelector } from './FormatSelector';
import { ColorPalette } from './ColorPalette';
import { ImageUploader } from './ImageUploader';
import { processUserMessage, processStyleChange } from '../services/aiService';
import type { ChatMessage } from '../services/aiService';
import { createDefaultDesign } from '../data/templates';
import type { DesignState, DesignLayer, FormatPreset, StylePreset } from '../data/templates';
import { cn } from '../lib/utils';
import html2canvas from 'html2canvas';

interface PosterEditorProps {
    onBack: () => void;
}

type RightTab = 'format' | 'colors' | 'layers';

export const PosterEditor: React.FC<PosterEditorProps> = ({ onBack }) => {
    const canvasRef = useRef<HTMLDivElement>(null);
    const [design, setDesign] = useState<DesignState>(createDefaultDesign);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [rightTab, setRightTab] = useState<RightTab>('format');
    const [showRightPanel, setShowRightPanel] = useState(true);

    // ---- AI Chat Handlers ----
    const handleSendMessage = useCallback(async (message: string) => {
        const userMsg: ChatMessage = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: message,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, userMsg]);
        setIsLoading(true);

        try {
            const responses = await processUserMessage(message, design, [...messages, userMsg], uploadedImage || undefined);
            setMessages(prev => [...prev, ...responses]);

            // Apply any design updates from AI
            const designUpdate = responses.find(r => r.designUpdate)?.designUpdate;
            if (designUpdate) {
                setDesign(prev => ({ ...prev, ...designUpdate }));
            }
        } catch {
            setMessages(prev => [...prev, {
                id: `err-${Date.now()}`,
                role: 'ai',
                content: 'Oops, something went wrong. Please try again!',
                timestamp: new Date(),
            }]);
        } finally {
            setIsLoading(false);
        }
    }, [design, messages, uploadedImage]);

    const handleSuggestionClick = useCallback((suggestion: string) => {
        handleSendMessage(suggestion);
    }, [handleSendMessage]);

    // ---- Image Upload ----
    const handleImageUpload = useCallback((file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target?.result as string;
            setUploadedImage(dataUrl);

            // Add as a chat message
            const uploadMsg: ChatMessage = {
                id: `upload-${Date.now()}`,
                role: 'user',
                content: '📷 Uploaded a product image',
                timestamp: new Date(),
                imageUrl: dataUrl,
            };
            setMessages(prev => [...prev, uploadMsg]);

            // AI acknowledges
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    id: `ack-${Date.now()}`,
                    role: 'ai',
                    content: "Great image! I'll incorporate it into your design. Now tell me about your product and what kind of promotional material you need.",
                    timestamp: new Date(),
                    suggestions: ['Create a poster for this product', 'Make an Instagram ad', 'Design a sale banner'],
                }]);
            }, 600);
        };
        reader.readAsDataURL(file);
    }, []);

    const handleRemoveImage = useCallback(() => {
        setUploadedImage(null);
        // Remove product-image layer from design
        setDesign(prev => ({
            ...prev,
            layers: prev.layers.filter(l => l.id !== 'product-image'),
        }));
    }, []);

    // ---- Design Controls ----
    const handleFormatChange = useCallback((format: FormatPreset) => {
        setDesign(prev => ({ ...prev, format }));
    }, []);

    const handleStyleChange = useCallback(async (style: StylePreset) => {
        setIsLoading(true);
        try {
            const result = await processStyleChange(style.name, design, uploadedImage || undefined);
            setMessages(prev => [...prev, result.message]);
            setDesign(prev => ({ ...prev, ...result.designUpdate }));
        } finally {
            setIsLoading(false);
        }
    }, [design, uploadedImage]);

    const handleColorChange = useCallback((key: string, color: string) => {
        setDesign(prev => {
            const newStyle = {
                ...prev.style,
                colors: { ...prev.style.colors, [key]: color },
            };
            // Update layers that reference colors
            const newLayers = prev.layers.map(layer => {
                if (layer.id === 'headline' && key === 'text') return { ...layer, color };
                if (layer.id === 'subheadline' && key === 'secondary') return { ...layer, color };
                if (layer.id === 'cta' && key === 'primary') return { ...layer, backgroundColor: color };
                return layer;
            });
            return {
                ...prev,
                style: newStyle,
                layers: newLayers,
                backgroundColor: key === 'bg' ? color : prev.backgroundColor,
            };
        });
    }, []);

    const handleLayerUpdate = useCallback((layerId: string, updates: Partial<DesignLayer>) => {
        setDesign(prev => ({
            ...prev,
            layers: prev.layers.map(l => l.id === layerId ? { ...l, ...updates } : l),
        }));
    }, []);

    // ---- Export ----
    const handleExport = useCallback(async () => {
        if (!canvasRef.current) return;
        setIsLoading(true);
        try {
            const canvas = await html2canvas(canvasRef.current, {
                useCORS: true, // For cross-origin images (like Unsplash/uploads)
                scale: 2,      // High res
                backgroundColor: null,
            });
            const link = document.createElement('a');
            link.download = `design-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();

            setMessages(prev => [...prev, {
                id: `export-${Date.now()}`,
                role: 'ai',
                content: '🎉 Design downloaded successfully!',
                timestamp: new Date(),
            }]);
        } catch (err) {
            console.error(err);
            setMessages(prev => [...prev, {
                id: `err-${Date.now()}`,
                role: 'ai',
                content: 'Failed to export design. Please try again.',
                timestamp: new Date(),
            }]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="flex h-screen flex-col bg-background">
            {/* Top Bar */}
            <header className="flex items-center justify-between border-b border-border bg-card/50 px-4 py-3 backdrop-blur-md z-20">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={onBack}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h2 className="text-sm font-semibold">AI Design Studio</h2>
                        <p className="text-xs text-muted-foreground">
                            {design.format.name} • {design.format.label}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowRightPanel(!showRightPanel)}
                        title={showRightPanel ? 'Hide panel' : 'Show panel'}
                    >
                        {showRightPanel ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExport}>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel — AI Chat + Upload */}
                <aside className="w-80 border-r border-border bg-card/20 flex flex-col overflow-hidden">
                    {/* Image uploader at top */}
                    <div className="p-4 border-b border-border">
                        <ImageUploader
                            uploadedImage={uploadedImage}
                            onUpload={handleImageUpload}
                            onRemove={handleRemoveImage}
                        />
                    </div>

                    {/* Chat fills remaining */}
                    <div className="flex-1 overflow-hidden">
                        <AIChatPanel
                            messages={messages}
                            onSendMessage={handleSendMessage}
                            onSuggestionClick={handleSuggestionClick}
                            onImageUpload={handleImageUpload}
                            isLoading={isLoading}
                        />
                    </div>
                </aside>

                {/* Center — Canvas */}
                <main className="flex-1 bg-muted/5 overflow-hidden">
                    <DesignCanvas design={design} onLayerUpdate={handleLayerUpdate} />
                </main>

                {/* Right Panel — Controls */}
                {showRightPanel && (
                    <motion.aside
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 280, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        className="border-l border-border bg-card/20 overflow-y-auto"
                    >
                        {/* Tabs */}
                        <div className="flex border-b border-border">
                            {([
                                { id: 'format' as RightTab, label: 'Format' },
                                { id: 'colors' as RightTab, label: 'Colors' },
                                { id: 'layers' as RightTab, label: 'Layers' },
                            ]).map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setRightTab(tab.id)}
                                    className={cn(
                                        'flex-1 px-3 py-2.5 text-xs font-medium transition-colors',
                                        rightTab === tab.id
                                            ? 'text-primary border-b-2 border-primary bg-primary/5'
                                            : 'text-muted-foreground hover:text-foreground'
                                    )}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-4">
                            {rightTab === 'format' && (
                                <FormatSelector selectedFormat={design.format} onSelect={handleFormatChange} />
                            )}
                            {rightTab === 'colors' && (
                                <ColorPalette
                                    currentStyle={design.style}
                                    onStyleChange={handleStyleChange}
                                    onColorChange={handleColorChange}
                                />
                            )}
                            {rightTab === 'layers' && (
                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-foreground mb-3">Design Layers</h4>
                                    {design.layers.length === 0 ? (
                                        <p className="text-xs text-muted-foreground py-4 text-center">
                                            No layers yet. Start chatting to generate a design!
                                        </p>
                                    ) : (
                                        design.layers.map(layer => (
                                            <div
                                                key={layer.id}
                                                className="flex items-center gap-2 p-2 rounded-lg border border-border bg-card/30 text-xs"
                                            >
                                                <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                                                <div className="flex-1 truncate">
                                                    <span className="font-medium capitalize">{layer.type}</span>
                                                    {layer.type === 'text' && (
                                                        <span className="text-muted-foreground ml-1.5 truncate">
                                                            — {layer.content.substring(0, 25)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.aside>
                )}
            </div>
        </div>
    );
};
