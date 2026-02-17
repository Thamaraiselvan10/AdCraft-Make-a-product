import React from 'react';
import { STYLE_PRESETS } from '../data/templates';
import type { StylePreset } from '../data/templates';
import { cn } from '../lib/utils';

interface ColorPaletteProps {
    currentStyle: StylePreset;
    onStyleChange: (style: StylePreset) => void;
    onColorChange: (key: string, color: string) => void;
}

export const ColorPalette: React.FC<ColorPaletteProps> = ({ currentStyle, onStyleChange, onColorChange }) => {
    return (
        <div className="space-y-5">
            <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Style Presets</h4>
                <div className="grid grid-cols-2 gap-2">
                    {STYLE_PRESETS.map(style => {
                        const isSelected = style.id === currentStyle.id;
                        return (
                            <button
                                key={style.id}
                                onClick={() => onStyleChange(style)}
                                className={cn(
                                    'p-2.5 rounded-xl border transition-all text-left',
                                    isSelected
                                        ? 'border-primary bg-primary/10 ring-1 ring-primary/50'
                                        : 'border-border bg-card/30 hover:border-primary/30'
                                )}
                            >
                                <div className="flex gap-1 mb-1.5">
                                    {[style.colors.bg, style.colors.primary, style.colors.secondary, style.colors.accent].map((c, i) => (
                                        <div
                                            key={i}
                                            className="w-4 h-4 rounded-full border border-white/20"
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs font-medium block truncate">{style.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div>
                <h4 className="text-sm font-semibold text-foreground mb-3">Current Colors</h4>
                <div className="space-y-2">
                    {Object.entries(currentStyle.colors).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-3">
                            <input
                                type="color"
                                value={value}
                                onChange={e => onColorChange(key, e.target.value)}
                                className="w-8 h-8 rounded-lg border border-border cursor-pointer overflow-hidden bg-transparent"
                            />
                            <div className="flex-1">
                                <span className="text-xs font-medium text-foreground capitalize">{key}</span>
                                <span className="text-xs text-muted-foreground ml-2">{value}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
