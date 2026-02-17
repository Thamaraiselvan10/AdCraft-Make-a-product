import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { DesignLayer, DesignState } from '../data/templates';

interface DesignCanvasProps {
    design: DesignState;
    onLayerUpdate: (layerId: string, updates: Partial<DesignLayer>) => void;
}

export const DesignCanvas: React.FC<DesignCanvasProps> = ({ design, onLayerUpdate }) => {
    const [editingLayer, setEditingLayer] = useState<string | null>(null);
    const [editText, setEditText] = useState('');

    const aspectRatio = design.format.width / design.format.height;

    // Dynamically size the canvas to fit the container
    const canvasStyle: React.CSSProperties = {
        aspectRatio: `${design.format.width} / ${design.format.height}`,
        maxHeight: '85vh',
        maxWidth: '100%',
        backgroundColor: design.backgroundColor,
        background: design.backgroundGradient || design.backgroundColor,
        position: 'relative',
        overflow: 'hidden',
    };

    const handleDoubleClick = (layer: DesignLayer) => {
        if (layer.type === 'text') {
            setEditingLayer(layer.id);
            setEditText(layer.content);
        }
    };

    const handleEditBlur = (layerId: string) => {
        onLayerUpdate(layerId, { content: editText });
        setEditingLayer(null);
    };

    const handleEditKeyDown = (e: React.KeyboardEvent, layerId: string) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleEditBlur(layerId);
        }
    };

    const renderLayer = (layer: DesignLayer) => {
        const commonStyle: React.CSSProperties = {
            position: 'absolute',
            left: `${layer.x}%`,
            top: `${layer.y}%`,
            width: `${layer.width}%`,
            height: `${layer.height}%`,
            opacity: layer.opacity ?? 1,
            transform: layer.rotation ? `rotate(${layer.rotation}deg)` : undefined,
            borderRadius: layer.borderRadius ? `${layer.borderRadius}px` : undefined,
        };

        switch (layer.type) {
            case 'text':
                return (
                    <div
                        key={layer.id}
                        style={{
                            ...commonStyle,
                            display: 'flex',
                            alignItems: 'center',
                            cursor: 'pointer',
                        }}
                        onDoubleClick={() => handleDoubleClick(layer)}
                    >
                        {editingLayer === layer.id ? (
                            <textarea
                                value={editText}
                                onChange={e => setEditText(e.target.value)}
                                onBlur={() => handleEditBlur(layer.id)}
                                onKeyDown={e => handleEditKeyDown(e, layer.id)}
                                autoFocus
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '2px solid var(--primary)',
                                    borderRadius: 4,
                                    color: layer.color || '#fff',
                                    fontSize: layer.fontSize ? `${layer.fontSize * (aspectRatio > 1.5 ? 0.6 : 1)}px` : '16px',
                                    fontFamily: layer.fontFamily || 'inherit',
                                    fontWeight: layer.fontWeight || 400,
                                    textAlign: layer.textAlign || 'left',
                                    padding: '4px 8px',
                                    resize: 'none',
                                    outline: 'none',
                                }}
                            />
                        ) : (
                            <span
                                style={{
                                    width: '100%',
                                    color: layer.color || '#fff',
                                    fontSize: layer.fontSize ? `${layer.fontSize * (aspectRatio > 1.5 ? 0.6 : 1)}px` : '16px',
                                    fontFamily: layer.fontFamily || 'inherit',
                                    fontWeight: layer.fontWeight || 400,
                                    textAlign: layer.textAlign || 'left',
                                    lineHeight: 1.2,
                                    wordBreak: 'break-word',
                                }}
                                className="hover:outline hover:outline-2 hover:outline-primary/50 hover:outline-offset-2 rounded transition-all"
                            >
                                {layer.content}
                            </span>
                        )}
                    </div>
                );

            case 'image':
                return (
                    <div key={layer.id} style={commonStyle} className="overflow-hidden">
                        <img
                            src={layer.content}
                            alt="Design element"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: layer.objectFit || 'cover',
                                borderRadius: layer.borderRadius ? `${layer.borderRadius}px` : undefined,
                            }}
                        />
                    </div>
                );

            case 'shape':
                return (
                    <div
                        key={layer.id}
                        style={{
                            ...commonStyle,
                            backgroundColor: layer.backgroundColor,
                            background: layer.gradient || layer.backgroundColor,
                        }}
                    />
                );

            default:
                return null;
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center p-6 overflow-auto relative">
            {/* Grid background */}
            <div
                className="absolute inset-0 z-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle at 1px 1px, var(--muted-foreground) 1px, transparent 0)',
                    backgroundSize: '20px 20px',
                }}
            />

            <motion.div
                layout
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="relative shadow-2xl shadow-black/40"
                style={canvasStyle}
            >
                {/* Background image */}
                {design.backgroundImage && (
                    <img
                        src={design.backgroundImage}
                        alt="Background"
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{ zIndex: 0 }}
                    />
                )}

                {/* Render layers */}
                {design.layers.map(layer => renderLayer(layer))}

                {/* Empty state */}
                {design.layers.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
                        <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                        <p className="text-sm">Describe your design in the chat to get started</p>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

// Import needed for empty state icon
import { Sparkles } from 'lucide-react';
