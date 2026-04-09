import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, ChevronRight, Upload, X, Sparkles, Package,
    Palette, Users, Target, Image as ImageIcon, MessageSquare
} from 'lucide-react';
import { Button } from './ui/Button';
import { STYLE_PRESETS, FORMAT_PRESETS } from '../data/templates';
import type { StylePreset, FormatPreset } from '../data/templates';
import { cn } from '../lib/utils';

export interface PosterBrief {
    productName: string;
    productDescription: string;
    targetAudience: string;
    platform: FormatPreset;
    style: StylePreset;
    offerText: string;
    productImages: string[];
    additionalNotes: string;
}

interface PosterWizardProps {
    onComplete: (brief: PosterBrief) => void;
    onBack: () => void;
}

const STEPS = [
    { id: 'product', label: 'Product', icon: Package },
    { id: 'audience', label: 'Audience', icon: Users },
    { id: 'theme', label: 'Theme', icon: Palette },
    { id: 'format', label: 'Format', icon: Target },
    { id: 'images', label: 'Images', icon: ImageIcon },
    { id: 'review', label: 'Review', icon: MessageSquare },
] as const;



export const PosterWizard: React.FC<PosterWizardProps> = ({ onComplete, onBack }) => {
    const [currentStep, setCurrentStep] = useState<number>(0);
    const [brief, setBrief] = useState<PosterBrief>({
        productName: '',
        productDescription: '',
        targetAudience: '',
        platform: FORMAT_PRESETS[0],
        style: STYLE_PRESETS[0],
        offerText: '',
        productImages: [],
        additionalNotes: '',
    });

    const step = STEPS[currentStep];

    const updateBrief = useCallback(<K extends keyof PosterBrief>(key: K, value: PosterBrief[K]) => {
        setBrief(prev => ({ ...prev, [key]: value }));
    }, []);

    const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (ev) => {
                const url = ev.target?.result as string;
                setBrief(prev => ({ ...prev, productImages: [...prev.productImages, url] }));
            };
            reader.readAsDataURL(file);
        });
    }, []);

    const removeImage = useCallback((index: number) => {
        setBrief(prev => ({
            ...prev,
            productImages: prev.productImages.filter((_, i) => i !== index),
        }));
    }, []);

    const canProceed = (): boolean => {
        switch (step.id) {
            case 'product': return brief.productName.trim().length >= 2;
            case 'audience': return true; // optional
            case 'theme': return true; // always has a default
            case 'format': return true;
            case 'images': return true; // optional
            case 'review': return true;
            default: return true;
        }
    };

    const handleNext = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            onComplete(brief);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) setCurrentStep(prev => prev - 1);
        else onBack();
    };

    const audienceOptions = ['Young Adults (18-25)', 'Professionals (25-40)', 'Parents & Families', 'Students', 'Senior Citizens', 'Everyone'];

    const slideVariants = {
        enter: { x: 30, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: -30, opacity: 0 },
    };

    return (
        <div className="flex h-screen flex-col bg-background">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-border bg-card/50 px-6 py-4 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={handleBack}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h2 className="text-sm font-semibold">Create Poster</h2>
                        <p className="text-xs text-muted-foreground">Step {currentStep + 1} of {STEPS.length}</p>
                    </div>
                </div>
            </header>

            {/* Progress Steps */}
            <div className="border-b border-border bg-card/30 px-6 py-3">
                <div className="flex items-center gap-1 max-w-3xl mx-auto">
                    {STEPS.map((s, i) => (
                        <React.Fragment key={s.id}>
                            <button
                                onClick={() => i <= currentStep && setCurrentStep(i)}
                                className={cn(
                                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                                    i === currentStep
                                        ? 'bg-primary text-primary-foreground'
                                        : i < currentStep
                                            ? 'bg-primary/20 text-primary cursor-pointer'
                                            : 'bg-muted/30 text-muted-foreground'
                                )}
                            >
                                <s.icon className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{s.label}</span>
                            </button>
                            {i < STEPS.length - 1 && (
                                <div className={cn('flex-1 h-0.5 rounded-full', i < currentStep ? 'bg-primary/40' : 'bg-muted/30')} />
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-2xl mx-auto px-6 py-10">
                    <AnimatePresence mode="wait">
                        <motion.div key={step.id} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }}>

                            {/* STEP: Product */}
                            {step.id === 'product' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-display font-bold mb-2">Tell us about your product</h3>
                                        <p className="text-muted-foreground text-sm">What are you promoting? Be as specific as you can.</p>
                                    </div>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium mb-1.5 block">Product / Business Name *</label>
                                            <input
                                                value={brief.productName}
                                                onChange={e => updateBrief('productName', e.target.value)}
                                                placeholder="e.g. Sunrise Coffee Shop"
                                                className="w-full px-4 py-3 rounded-xl border border-border bg-card/50 text-sm outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium mb-1.5 block">Description</label>
                                            <textarea
                                                value={brief.productDescription}
                                                onChange={e => updateBrief('productDescription', e.target.value)}
                                                placeholder="Explain about your poster in a few sentences..."
                                                rows={4}
                                                className="w-full px-4 py-3 rounded-xl border border-border bg-card/50 text-sm outline-none focus:ring-2 focus:ring-primary/50 resize-none placeholder:text-muted-foreground"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium mb-1.5 block">Offer / Tagline (optional)</label>
                                            <input
                                                value={brief.offerText}
                                                onChange={e => updateBrief('offerText', e.target.value)}
                                                placeholder="e.g. 50% OFF First Order, Free Shipping, etc."
                                                className="w-full px-4 py-3 rounded-xl border border-border bg-card/50 text-sm outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP: Audience */}
                            {step.id === 'audience' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-display font-bold mb-2">Who is your audience?</h3>
                                        <p className="text-muted-foreground text-sm">This helps the AI tailor tone and visuals.</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        {audienceOptions.map(opt => (
                                            <button
                                                key={opt}
                                                onClick={() => updateBrief('targetAudience', opt)}
                                                className={cn(
                                                    'p-4 rounded-xl border text-sm font-medium text-left transition-all',
                                                    brief.targetAudience === opt
                                                        ? 'border-primary bg-primary/10 text-primary ring-1 ring-primary/30'
                                                        : 'border-border bg-card/30 text-foreground hover:border-primary/30'
                                                )}
                                            >
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block">Or describe your audience</label>
                                        <input
                                            value={brief.targetAudience}
                                            onChange={e => updateBrief('targetAudience', e.target.value)}
                                            placeholder="e.g. Tech-savvy millennials in urban areas"
                                            className="w-full px-4 py-3 rounded-xl border border-border bg-card/50 text-sm outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* STEP: Theme */}
                            {step.id === 'theme' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-display font-bold mb-2">Choose a visual theme</h3>
                                        <p className="text-muted-foreground text-sm">Pick a style that matches your brand personality.</p>
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                        {STYLE_PRESETS.map(style => (
                                            <button
                                                key={style.id}
                                                onClick={() => updateBrief('style', style)}
                                                className={cn(
                                                    'p-4 rounded-2xl border transition-all text-left group',
                                                    brief.style.id === style.id
                                                        ? 'border-primary bg-primary/10 ring-2 ring-primary/30'
                                                        : 'border-border bg-card/30 hover:border-primary/30'
                                                )}
                                            >
                                                {/* Color Preview Bar */}
                                                <div className="h-16 rounded-lg mb-3 overflow-hidden flex">
                                                    {[style.colors.bg, style.colors.primary, style.colors.secondary, style.colors.accent].map((c, i) => (
                                                        <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                                                    ))}
                                                </div>
                                                <p className="font-semibold text-sm">{style.name}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{style.mood}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* STEP: Format */}
                            {step.id === 'format' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-display font-bold mb-2">Where will this be used?</h3>
                                        <p className="text-muted-foreground text-sm">Choose the platform or format.</p>
                                    </div>
                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                                        {FORMAT_PRESETS.map(fmt => {
                                            const ratio = fmt.width / fmt.height;
                                            const previewW = ratio >= 1 ? 48 : 36 * ratio;
                                            const previewH = ratio >= 1 ? 48 / ratio : 36;
                                            return (
                                                <button
                                                    key={fmt.id}
                                                    onClick={() => updateBrief('platform', fmt)}
                                                    className={cn(
                                                        'flex flex-col items-center gap-2 p-4 rounded-xl border transition-all',
                                                        brief.platform.id === fmt.id
                                                            ? 'border-primary bg-primary/10 ring-1 ring-primary/30'
                                                            : 'border-border bg-card/30 hover:border-primary/30'
                                                    )}
                                                >
                                                    <div
                                                        className={cn('rounded-sm border', brief.platform.id === fmt.id ? 'border-primary' : 'border-muted-foreground/30')}
                                                        style={{ width: previewW, height: previewH }}
                                                    />
                                                    <span className="text-xs font-medium">{fmt.name}</span>
                                                    <span className="text-[10px] text-muted-foreground">{fmt.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* STEP: Images */}
                            {step.id === 'images' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-display font-bold mb-2">Upload product images</h3>
                                        <p className="text-muted-foreground text-sm">Add photos of your product for the AI to incorporate. (Optional)</p>
                                    </div>
                                    <label className="flex flex-col items-center justify-center gap-3 p-10 rounded-2xl border-2 border-dashed border-border cursor-pointer hover:border-primary/40 hover:bg-card/30 transition-all">
                                        <Upload className="w-8 h-8 text-muted-foreground" />
                                        <span className="text-sm font-medium text-muted-foreground">Click or drag to upload product images</span>
                                        <span className="text-xs text-muted-foreground/60">PNG, JPG up to 5MB each</span>
                                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                                    </label>
                                    {brief.productImages.length > 0 && (
                                        <div className="grid grid-cols-3 gap-3">
                                            {brief.productImages.map((img, idx) => (
                                                <div key={idx} className="relative rounded-xl overflow-hidden border border-border group">
                                                    <img src={img} alt={`Product ${idx + 1}`} className="w-full h-28 object-cover" />
                                                    <button
                                                        onClick={() => removeImage(idx)}
                                                        className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-destructive transition-colors opacity-0 group-hover:opacity-100"
                                                    >
                                                        <X className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* STEP: Review */}
                            {step.id === 'review' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-display font-bold mb-2">Review your brief</h3>
                                        <p className="text-muted-foreground text-sm">Everything look good? Hit "Generate" to create your poster!</p>
                                    </div>
                                    <div className="space-y-3">
                                        {[
                                            { label: 'Product', value: brief.productName || '—' },
                                            { label: 'Description', value: brief.productDescription || '—' },
                                            { label: 'Audience', value: brief.targetAudience || 'General' },
                                            { label: 'Theme', value: brief.style.name },
                                            { label: 'Format', value: `${brief.platform.name} (${brief.platform.label})` },
                                            { label: 'Offer', value: brief.offerText || 'None' },
                                            { label: 'Images', value: `${brief.productImages.length} uploaded` },
                                        ].map(item => (
                                            <div key={item.label} className="flex items-start gap-3 p-3 rounded-lg bg-card/30 border border-border">
                                                <span className="text-xs font-semibold text-muted-foreground w-24 shrink-0">{item.label}</span>
                                                <span className="text-sm text-foreground">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                    {brief.productImages.length > 0 && (
                                        <div className="flex gap-2">
                                            {brief.productImages.map((img, i) => (
                                                <img key={i} src={img} alt="" className="w-16 h-16 rounded-lg object-cover border border-border" />
                                            ))}
                                        </div>
                                    )}
                                    <div>
                                        <label className="text-sm font-medium mb-1.5 block">Any additional notes?</label>
                                        <textarea
                                            value={brief.additionalNotes}
                                            onChange={e => updateBrief('additionalNotes', e.target.value)}
                                            placeholder="Anything else the AI should know..."
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-xl border border-border bg-card/50 text-sm outline-none focus:ring-2 focus:ring-primary/50 resize-none placeholder:text-muted-foreground"
                                        />
                                    </div>
                                </div>
                            )}

                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Footer Nav */}
            <div className="border-t border-border bg-card/50 px-6 py-4 flex items-center justify-between backdrop-blur-md">
                <Button variant="ghost" onClick={handleBack}>
                    <ChevronLeft className="mr-1 h-4 w-4" />
                    {currentStep === 0 ? 'Cancel' : 'Back'}
                </Button>
                <Button onClick={handleNext} disabled={!canProceed()}>
                    {currentStep === STEPS.length - 1 ? (
                        <>
                            <Sparkles className="mr-2 h-4 w-4" />
                            Generate Poster
                        </>
                    ) : (
                        <>
                            Next
                            <ChevronRight className="ml-1 h-4 w-4" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};
