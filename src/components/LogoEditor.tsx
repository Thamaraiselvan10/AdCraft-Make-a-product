import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, Download, Sparkles, Type,
    Circle, Square, Triangle, Hexagon, Star, Wand2
} from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';

interface LogoEditorProps {
    onBack: () => void;
}

interface LogoConcept {
    id: string;
    brandName: string;
    icon: React.ElementType;
    bgColor: string;
    iconColor: string;
    textColor: string;
    shape: 'circle' | 'square' | 'rounded';
    fontWeight: number;
    layout: 'stacked' | 'horizontal';
}

const ICON_OPTIONS = [
    { Icon: Circle, label: 'Circle' },
    { Icon: Square, label: 'Square' },
    { Icon: Triangle, label: 'Triangle' },
    { Icon: Hexagon, label: 'Hexagon' },
    { Icon: Star, label: 'Star' },
    { Icon: Sparkles, label: 'Spark' },
];

const COLOR_PALETTES = [
    { name: 'Electric', bg: '#0f0518', icon: '#ff00cc', text: '#ffffff' },
    { name: 'Ocean', bg: '#0a192f', icon: '#64ffda', text: '#ccd6f6' },
    { name: 'Sunset', bg: '#fff8f0', icon: '#ff6b35', text: '#2d2d2d' },
    { name: 'Midnight', bg: '#1a1a2e', icon: '#d4af37', text: '#f0e6d3' },
    { name: 'Forest', bg: '#1a2e1a', icon: '#4ade80', text: '#e0f2e0' },
    { name: 'Minimal', bg: '#ffffff', icon: '#000000', text: '#111111' },
    { name: 'Coral', bg: '#1e1e2e', icon: '#f38ba8', text: '#cdd6f4' },
    { name: 'Neon', bg: '#0d0d0d', icon: '#00ff88', text: '#ffffff' },
];

export const LogoEditor: React.FC<LogoEditorProps> = ({ onBack }) => {
    const [brandName, setBrandName] = useState('');
    const [industry, setIndustry] = useState('');
    const [step, setStep] = useState<'input' | 'editor'>('input');
    const [concepts, setConcepts] = useState<LogoConcept[]>([]);
    const [activeConcept, setActiveConcept] = useState(0);
    const [selectedIcon, setSelectedIcon] = useState(0);
    const [selectedPalette, setSelectedPalette] = useState(0);
    const [logoShape, setLogoShape] = useState<'circle' | 'square' | 'rounded'>('circle');
    const [logoLayout, setLogoLayout] = useState<'stacked' | 'horizontal'>('stacked');

    const generateConcepts = useCallback(() => {
        const generated: LogoConcept[] = COLOR_PALETTES.slice(0, 6).map((palette, idx) => ({
            id: `concept-${idx}`,
            brandName: brandName || 'Brand',
            icon: ICON_OPTIONS[idx % ICON_OPTIONS.length].Icon,
            bgColor: palette.bg,
            iconColor: palette.icon,
            textColor: palette.text,
            shape: (['circle', 'square', 'rounded'] as const)[idx % 3],
            fontWeight: idx % 2 === 0 ? 700 : 600,
            layout: idx % 2 === 0 ? 'stacked' : 'horizontal',
        }));
        setConcepts(generated);
        setStep('editor');
    }, [brandName]);

    const currentPalette = COLOR_PALETTES[selectedPalette];
    const CurrentIcon = ICON_OPTIONS[selectedIcon].Icon;

    if (step === 'input') {
        return (
            <div className="flex h-screen flex-col bg-background">
                <header className="flex items-center gap-3 border-b border-border bg-card/50 px-6 py-4 backdrop-blur-md">
                    <Button variant="ghost" size="icon" onClick={onBack}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h2 className="text-sm font-semibold">AI Logo Maker</h2>
                        <p className="text-xs text-muted-foreground">Create your brand identity</p>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto">
                    <div className="max-w-xl mx-auto px-6 py-10 space-y-8">
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                                <Sparkles className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-2xl font-display font-bold mb-2">Design your logo</h3>
                            <p className="text-muted-foreground text-sm">Enter your brand details and we'll generate logo concepts.</p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1.5 block">Brand Name *</label>
                                <input
                                    value={brandName}
                                    onChange={e => setBrandName(e.target.value)}
                                    placeholder="e.g. NovaTech"
                                    className="w-full px-4 py-3 rounded-xl border border-border bg-card/50 text-sm outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground text-center text-lg font-semibold"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1.5 block">Industry / Type</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['Technology', 'Food & Drink', 'Fashion', 'Health', 'Education', 'Creative'].map(ind => (
                                        <button
                                            key={ind}
                                            onClick={() => setIndustry(ind)}
                                            className={cn(
                                                'px-3 py-2 rounded-lg border text-xs font-medium transition-all',
                                                industry === ind
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-border bg-card/30 hover:border-primary/30'
                                            )}
                                        >
                                            {ind}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Button className="w-full" onClick={generateConcepts} disabled={!brandName.trim()}>
                            <Wand2 className="mr-2 h-4 w-4" />
                            Generate Logo Concepts
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen flex-col bg-background">
            <header className="flex items-center justify-between border-b border-border bg-card/50 px-6 py-3 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={() => setStep('input')}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h2 className="text-sm font-semibold">Logo Editor — {brandName}</h2>
                        <p className="text-xs text-muted-foreground">{concepts.length} concepts generated</p>
                    </div>
                </div>
                <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" /> Export SVG
                </Button>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Left — Generated Concepts */}
                <aside className="w-72 border-r border-border bg-card/20 overflow-y-auto p-4">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">AI Concepts</h4>
                    <div className="grid grid-cols-2 gap-3">
                        {concepts.map((concept, idx) => (
                            <button
                                key={concept.id}
                                onClick={() => {
                                    setActiveConcept(idx);
                                    const paletteIdx = COLOR_PALETTES.findIndex(p => p.bg === concept.bgColor);
                                    if (paletteIdx >= 0) setSelectedPalette(paletteIdx);
                                    const iconIdx = ICON_OPTIONS.findIndex(i => i.Icon === concept.icon);
                                    if (iconIdx >= 0) setSelectedIcon(iconIdx);
                                    setLogoShape(concept.shape);
                                    setLogoLayout(concept.layout);
                                }}
                                className={cn(
                                    'aspect-square rounded-xl border flex items-center justify-center transition-all',
                                    activeConcept === idx ? 'ring-2 ring-primary border-primary' : 'border-border hover:border-primary/30'
                                )}
                                style={{ backgroundColor: concept.bgColor }}
                            >
                                <div className={`flex ${concept.layout === 'stacked' ? 'flex-col' : 'flex-row'} items-center gap-1.5`}>
                                    <concept.icon className="w-6 h-6" style={{ color: concept.iconColor }} />
                                    <span className="text-[10px] font-bold" style={{ color: concept.textColor }}>{concept.brandName}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Center — Live Preview */}
                <main className="flex-1 flex items-center justify-center bg-muted/5 relative">
                    <div className="absolute inset-0 opacity-5" style={{
                        backgroundImage: 'repeating-linear-gradient(45deg, var(--muted-foreground) 0, var(--muted-foreground) 1px, transparent 0, transparent 50%)',
                        backgroundSize: '16px 16px',
                    }} />

                    <motion.div
                        key={`${selectedPalette}-${selectedIcon}-${logoShape}-${logoLayout}`}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="w-72 h-72 flex items-center justify-center shadow-2xl"
                        style={{
                            backgroundColor: currentPalette.bg,
                            borderRadius: logoShape === 'circle' ? '50%' : logoShape === 'rounded' ? '32px' : '0',
                        }}
                    >
                        <div className={`flex ${logoLayout === 'stacked' ? 'flex-col' : 'flex-row'} items-center gap-4`}>
                            <CurrentIcon className="w-16 h-16" style={{ color: currentPalette.icon }} />
                            <span
                                className="text-2xl font-display tracking-tight"
                                style={{ color: currentPalette.text, fontWeight: 700 }}
                            >
                                {brandName}
                            </span>
                        </div>
                    </motion.div>
                </main>

                {/* Right — Controls */}
                <aside className="w-72 border-l border-border bg-card/20 overflow-y-auto p-4 space-y-5">
                    {/* Icon */}
                    <div>
                        <h4 className="text-sm font-semibold mb-2">Icon</h4>
                        <div className="grid grid-cols-3 gap-2">
                            {ICON_OPTIONS.map((opt, idx) => (
                                <button
                                    key={opt.label}
                                    onClick={() => setSelectedIcon(idx)}
                                    className={cn(
                                        'p-3 rounded-lg border flex flex-col items-center gap-1 transition-all',
                                        selectedIcon === idx ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/30'
                                    )}
                                >
                                    <opt.Icon className="w-5 h-5" />
                                    <span className="text-[10px] text-muted-foreground">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Shape */}
                    <div>
                        <h4 className="text-sm font-semibold mb-2">Shape</h4>
                        <div className="flex gap-2">
                            {(['circle', 'rounded', 'square'] as const).map(s => (
                                <button
                                    key={s}
                                    onClick={() => setLogoShape(s)}
                                    className={cn(
                                        'flex-1 py-2 rounded-lg border text-xs font-medium transition-all capitalize',
                                        logoShape === s ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/30'
                                    )}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Layout */}
                    <div>
                        <h4 className="text-sm font-semibold mb-2">Layout</h4>
                        <div className="flex gap-2">
                            {(['stacked', 'horizontal'] as const).map(l => (
                                <button
                                    key={l}
                                    onClick={() => setLogoLayout(l)}
                                    className={cn(
                                        'flex-1 py-2 rounded-lg border text-xs font-medium transition-all capitalize',
                                        logoLayout === l ? 'border-primary bg-primary/10 text-primary' : 'border-border hover:border-primary/30'
                                    )}
                                >
                                    {l}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Palette */}
                    <div>
                        <h4 className="text-sm font-semibold mb-2">Color Palette</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {COLOR_PALETTES.map((pal, idx) => (
                                <button
                                    key={pal.name}
                                    onClick={() => setSelectedPalette(idx)}
                                    className={cn(
                                        'p-2 rounded-lg border transition-all text-left',
                                        selectedPalette === idx ? 'border-primary ring-1 ring-primary/30' : 'border-border hover:border-primary/30'
                                    )}
                                >
                                    <div className="flex gap-0.5 mb-1">
                                        {[pal.bg, pal.icon, pal.text].map((c, i) => (
                                            <div key={i} className="w-4 h-4 rounded-full border border-white/20" style={{ backgroundColor: c }} />
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-medium">{pal.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Brand Name Edit */}
                    <div>
                        <h4 className="text-sm font-semibold mb-2">Brand Name</h4>
                        <input
                            value={brandName}
                            onChange={e => setBrandName(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-border bg-card/50 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                        />
                    </div>
                </aside>
            </div>
        </div>
    );
};
