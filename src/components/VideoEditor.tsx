import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, Play, Pause, SkipForward, Download, Film,
    Clock, Wand2, Music, Type, Layers, Sparkles, Image as ImageIcon, Upload, X
} from 'lucide-react';
import { Button } from './ui/Button';
import { STYLE_PRESETS } from '../data/templates';
import type { StylePreset } from '../data/templates';
import { cn } from '../lib/utils';

interface VideoEditorProps {
    onBack: () => void;
}

interface VideoScene {
    id: string;
    text: string;
    duration: number; // seconds
    style: StylePreset;
    imageUrl?: string;
}

const DURATIONS = [
    { label: '15s — Story / Reel', value: 15 },
    { label: '30s — Short Ad', value: 30 },
    { label: '60s — Full Ad', value: 60 },
];

export const VideoEditor: React.FC<VideoEditorProps> = ({ onBack }) => {
    const [step, setStep] = useState<'setup' | 'editor'>('setup');
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState(15);
    const [selectedStyle, setSelectedStyle] = useState(STYLE_PRESETS[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [scenes, setScenes] = useState<VideoScene[]>([]);
    const [activeScene, setActiveScene] = useState(0);
    const [uploadedImages, setUploadedImages] = useState<string[]>([]);

    const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        files.forEach(f => {
            const reader = new FileReader();
            reader.onload = ev => setUploadedImages(prev => [...prev, ev.target?.result as string]);
            reader.readAsDataURL(f);
        });
    }, []);

    const generateScenes = useCallback(() => {
        const numScenes = Math.ceil(duration / 5);
        const words = productName.split(' ');
        const generated: VideoScene[] = [
            {
                id: 'intro',
                text: productName || 'Your Brand',
                duration: Math.min(5, duration),
                style: selectedStyle,
                imageUrl: uploadedImages[0],
            },
            {
                id: 'feature',
                text: description ? description.substring(0, 60) : 'Key Feature Highlight',
                duration: Math.min(5, duration),
                style: selectedStyle,
                imageUrl: uploadedImages[1],
            },
        ];

        if (numScenes > 2) {
            generated.push({
                id: 'showcase',
                text: 'See the difference',
                duration: 5,
                style: selectedStyle,
                imageUrl: uploadedImages[2],
            });
        }

        generated.push({
            id: 'cta',
            text: 'Get Started Today →',
            duration: Math.min(5, duration),
            style: selectedStyle,
        });

        setScenes(generated);
        setStep('editor');
    }, [productName, description, duration, selectedStyle, uploadedImages]);

    const handlePlay = useCallback(() => {
        setIsPlaying(prev => !prev);
        if (!isPlaying) {
            // Simple playback simulation
            const interval = setInterval(() => {
                setCurrentTime(prev => {
                    if (prev >= duration) {
                        clearInterval(interval);
                        setIsPlaying(false);
                        return 0;
                    }
                    return prev + 0.1;
                });
            }, 100);
        }
    }, [isPlaying, duration]);

    if (step === 'setup') {
        return (
            <div className="flex h-screen flex-col bg-background">
                <header className="flex items-center gap-3 border-b border-border bg-card/50 px-6 py-4 backdrop-blur-md">
                    <Button variant="ghost" size="icon" onClick={onBack}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h2 className="text-sm font-semibold">AI Video Creator</h2>
                        <p className="text-xs text-muted-foreground">Set up your video ad</p>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-2xl mx-auto px-6 py-10 space-y-8">
                        <div>
                            <h3 className="text-2xl font-display font-bold mb-2">Create a video ad</h3>
                            <p className="text-muted-foreground text-sm">Tell us about your product and we'll generate a multi-scene video.</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1.5 block">Product / Brand Name *</label>
                                <input
                                    value={productName}
                                    onChange={e => setProductName(e.target.value)}
                                    placeholder="e.g. NovaTech Pro"
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-card/50 text-sm outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1.5 block">Description</label>
                                <textarea
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="Key features, selling points…"
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-card/50 text-sm outline-none focus:ring-2 focus:ring-primary/50 resize-none placeholder:text-muted-foreground"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Duration</label>
                            <div className="grid grid-cols-3 gap-3">
                                {DURATIONS.map(d => (
                                    <button
                                        key={d.value}
                                        onClick={() => setDuration(d.value)}
                                        className={cn(
                                            'p-3 rounded-xl border text-sm transition-all text-center',
                                            duration === d.value
                                                ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/30'
                                                : 'border-border bg-card/30 hover:border-primary/30'
                                        )}
                                    >
                                        <Clock className="w-4 h-4 mx-auto mb-1" />
                                        {d.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Visual Style</label>
                            <div className="grid grid-cols-3 gap-3">
                                {STYLE_PRESETS.map(style => (
                                    <button
                                        key={style.id}
                                        onClick={() => setSelectedStyle(style)}
                                        className={cn(
                                            'p-3 rounded-xl border transition-all text-left',
                                            selectedStyle.id === style.id
                                                ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                                                : 'border-border bg-card/30 hover:border-primary/30'
                                        )}
                                    >
                                        <div className="flex gap-0.5 mb-2">
                                            {[style.colors.bg, style.colors.primary, style.colors.secondary].map((c, i) => (
                                                <div key={i} className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c }} />
                                            ))}
                                        </div>
                                        <span className="text-xs font-medium">{style.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-2 block">Product Images (optional)</label>
                            <label className="flex flex-col items-center gap-2 p-6 rounded-xl border-2 border-dashed border-border cursor-pointer hover:border-primary/40 transition-all">
                                <Upload className="w-6 h-6 text-muted-foreground" />
                                <span className="text-xs text-muted-foreground">Upload images for your video scenes</span>
                                <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                            </label>
                            {uploadedImages.length > 0 && (
                                <div className="flex gap-2 mt-3">
                                    {uploadedImages.map((img, i) => (
                                        <div key={i} className="relative group">
                                            <img src={img} alt="" className="w-16 h-16 rounded-lg object-cover border border-border" />
                                            <button
                                                onClick={() => setUploadedImages(prev => prev.filter((_, idx) => idx !== i))}
                                                className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Button className="w-full" onClick={generateScenes} disabled={!productName.trim()}>
                            <Wand2 className="mr-2 h-4 w-4" />
                            Generate Video
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    // Editor view with timeline
    const currentScene = scenes[activeScene] || scenes[0];

    return (
        <div className="flex h-screen flex-col bg-background">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-border bg-card/50 px-6 py-3 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => setStep('setup')}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h2 className="text-sm font-semibold">Video Editor — {productName}</h2>
                        <p className="text-xs text-muted-foreground">{scenes.length} scenes • {duration}s</p>
                    </div>
                </div>
                <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" /> Export MP4
                </Button>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Left — Scene List */}
                <aside className="w-64 border-r border-border bg-card/20 overflow-y-auto p-4 space-y-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Scenes</h4>
                    {scenes.map((scene, idx) => (
                        <button
                            key={scene.id}
                            onClick={() => setActiveScene(idx)}
                            className={cn(
                                'w-full p-3 rounded-xl border text-left transition-all',
                                activeScene === idx
                                    ? 'border-primary bg-primary/10'
                                    : 'border-border bg-card/30 hover:border-primary/30'
                            )}
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <Film className="w-3.5 h-3.5 text-primary" />
                                <span className="text-xs font-semibold capitalize">{scene.id}</span>
                                <span className="text-[10px] text-muted-foreground ml-auto">{scene.duration}s</span>
                            </div>
                            <p className="text-xs text-muted-foreground truncate">{scene.text}</p>
                        </button>
                    ))}
                </aside>

                {/* Center — Preview */}
                <main className="flex-1 flex flex-col">
                    <div className="flex-1 flex items-center justify-center p-8">
                        <motion.div
                            key={activeScene}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative w-full max-w-lg aspect-video rounded-xl overflow-hidden shadow-2xl"
                            style={{ background: `linear-gradient(135deg, ${currentScene.style.colors.bg}, ${currentScene.style.colors.primary}40)` }}
                        >
                            {currentScene.imageUrl && (
                                <img src={currentScene.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                            )}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 z-10">
                                <motion.p
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-2xl font-display font-bold text-center"
                                    style={{ color: currentScene.style.colors.text }}
                                >
                                    {currentScene.text}
                                </motion.p>
                                {currentScene.id === 'intro' && (
                                    <motion.div
                                        initial={{ scaleX: 0 }}
                                        animate={{ scaleX: 1 }}
                                        transition={{ delay: 0.5, duration: 0.6 }}
                                        className="mt-3 h-1 w-16 rounded-full"
                                        style={{ backgroundColor: currentScene.style.colors.primary }}
                                    />
                                )}
                            </div>
                        </motion.div>
                    </div>

                    {/* Playback Controls + Timeline */}
                    <div className="border-t border-border bg-card/30 px-6 py-3">
                        <div className="flex items-center gap-4 mb-3">
                            <button onClick={handlePlay} className="p-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </button>
                            <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${(currentTime / duration) * 100}%` }} />
                            </div>
                            <span className="text-xs text-muted-foreground font-mono">{currentTime.toFixed(1)}s / {duration}s</span>
                        </div>
                        {/* Scene timeline blocks */}
                        <div className="flex gap-1">
                            {scenes.map((scene, idx) => (
                                <button
                                    key={scene.id}
                                    onClick={() => setActiveScene(idx)}
                                    className={cn(
                                        'h-8 rounded-md transition-all text-[10px] font-medium flex items-center justify-center',
                                        activeScene === idx ? 'ring-2 ring-primary' : ''
                                    )}
                                    style={{
                                        flex: scene.duration,
                                        backgroundColor: scene.style.colors.primary + '30',
                                        color: scene.style.colors.primary,
                                    }}
                                >
                                    {scene.id}
                                </button>
                            ))}
                        </div>
                    </div>
                </main>

                {/* Right — Scene Properties */}
                <aside className="w-72 border-l border-border bg-card/20 overflow-y-auto p-4 space-y-4">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Scene Properties</h4>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Text</label>
                        <textarea
                            value={currentScene.text}
                            onChange={e => {
                                const updated = [...scenes];
                                updated[activeScene] = { ...updated[activeScene], text: e.target.value };
                                setScenes(updated);
                            }}
                            rows={3}
                            className="w-full px-3 py-2 rounded-lg border border-border bg-card/50 text-sm outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Duration (seconds)</label>
                        <input
                            type="number"
                            min={1}
                            max={30}
                            value={currentScene.duration}
                            onChange={e => {
                                const updated = [...scenes];
                                updated[activeScene] = { ...updated[activeScene], duration: parseInt(e.target.value) || 5 };
                                setScenes(updated);
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-border bg-card/50 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">Scene Image</label>
                        {currentScene.imageUrl ? (
                            <div className="relative group">
                                <img src={currentScene.imageUrl} alt="" className="w-full h-24 object-cover rounded-lg border border-border" />
                                <button
                                    onClick={() => {
                                        const updated = [...scenes];
                                        updated[activeScene] = { ...updated[activeScene], imageUrl: undefined };
                                        setScenes(updated);
                                    }}
                                    className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ) : (
                            <label className="flex flex-col items-center p-4 rounded-lg border-2 border-dashed border-border cursor-pointer hover:border-primary/30 transition-all">
                                <ImageIcon className="w-5 h-5 text-muted-foreground mb-1" />
                                <span className="text-xs text-muted-foreground">Add image</span>
                                <input type="file" accept="image/*" className="hidden" onChange={e => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onload = ev => {
                                            const updated = [...scenes];
                                            updated[activeScene] = { ...updated[activeScene], imageUrl: ev.target?.result as string };
                                            setScenes(updated);
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }} />
                            </label>
                        )}
                    </div>
                </aside>
            </div>
        </div>
    );
};
