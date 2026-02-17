import React from 'react';
import { FORMAT_PRESETS } from '../data/templates';
import type { FormatPreset } from '../data/templates';
import { cn } from '../lib/utils';

interface FormatSelectorProps {
    selectedFormat: FormatPreset;
    onSelect: (format: FormatPreset) => void;
}

const categoryLabels: Record<string, string> = {
    social: '📱 Social',
    banner: '🖼️ Banners',
    poster: '📄 Posters',
    card: '💳 Cards',
    logo: '✨ Logo',
};

export const FormatSelector: React.FC<FormatSelectorProps> = ({ selectedFormat, onSelect }) => {
    const groupedFormats = FORMAT_PRESETS.reduce((acc, f) => {
        if (!acc[f.category]) acc[f.category] = [];
        acc[f.category].push(f);
        return acc;
    }, {} as Record<string, FormatPreset[]>);

    return (
        <div className="space-y-4">
            <h4 className="text-sm font-semibold text-foreground">Format</h4>
            {Object.entries(groupedFormats).map(([category, formats]) => (
                <div key={category}>
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                        {categoryLabels[category] || category}
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                        {formats.map(f => {
                            const isSelected = f.id === selectedFormat.id;
                            const ratio = f.width / f.height;
                            const previewW = ratio >= 1 ? 32 : 24 * ratio;
                            const previewH = ratio >= 1 ? 32 / ratio : 24;

                            return (
                                <button
                                    key={f.id}
                                    onClick={() => onSelect(f)}
                                    className={cn(
                                        'flex flex-col items-center gap-1 p-2 rounded-lg border text-xs transition-all',
                                        isSelected
                                            ? 'border-primary bg-primary/10 text-primary'
                                            : 'border-border bg-card/30 text-muted-foreground hover:border-primary/30 hover:bg-card/50'
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'rounded-sm border',
                                            isSelected ? 'border-primary' : 'border-muted-foreground/30'
                                        )}
                                        style={{ width: previewW, height: previewH }}
                                    />
                                    <span className="font-medium truncate w-full text-center">{f.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};
