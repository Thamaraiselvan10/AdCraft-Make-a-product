import React, { useState, useRef } from 'react';
import { ChevronLeft, Download, Upload, Smartphone, Mail, Globe, MapPin, User, Briefcase, CreditCard } from 'lucide-react';
import { Button } from './ui/Button';
import { cn } from '../lib/utils';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface BusinessCardEditorProps {
    onBack: () => void;
}

const CARD_TEMPLATES = [
    { id: 'modern', name: 'Modern Minimal', bg: '#f8f9fa', text: '#212529', accent: '#000000' },
    { id: 'dark', name: 'Sleek Dark', bg: '#1a1a1a', text: '#ffffff', accent: '#d4af37' },
    { id: 'bold', name: 'Bold Brand', bg: '#3b82f6', text: '#ffffff', accent: '#1e40af' },
    { id: 'elegant', name: 'Elegant Serif', bg: '#fdf2f8', text: '#831843', accent: '#be185d' },
];

export const BusinessCardEditor: React.FC<BusinessCardEditorProps> = ({ onBack }) => {
    const [activeSide, setActiveSide] = useState<'front' | 'back'>('front');
    const [template, setTemplate] = useState(CARD_TEMPLATES[0]);
    const [data, setData] = useState({
        name: 'Alex Morgan',
        title: 'Creative Director',
        phone: '+1 (555) 123-4567',
        email: 'alex@example.com',
        website: 'www.alexmorgan.design',
        address: '123 Design St, Creative City',
        company: 'AM Studio',
        logo: null as string | null,
    });

    const frontRef = useRef<HTMLDivElement>(null);
    const backRef = useRef<HTMLDivElement>(null);

    const handleExport = async () => {
        // Only works if both refs are rendered. We might need to momentarily render both.
        // For simplicity in this version, we only export the active side or handle it differently.
        // Better approach: toggle states to capture. But to keep it simple:

        if (!frontRef.current) return;

        const canvas = await html2canvas(frontRef.current, { scale: 4 });
        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF({
            orientation: 'landscape',
            unit: 'in',
            format: [3.5, 2]
        });

        pdf.addImage(imgData, 'PNG', 0, 0, 3.5, 2);
        pdf.save('business-card-front.pdf');
    };

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = ev => setData(prev => ({ ...prev, logo: ev.target?.result as string }));
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex h-screen flex-col bg-background">
            <header className="flex items-center justify-between border-b border-border bg-card/50 px-6 py-3 backdrop-blur-md">
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="icon" onClick={onBack}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h2 className="text-sm font-semibold">Business Card Maker</h2>
                        <p className="text-xs text-muted-foreground">Design front & back</p>
                    </div>
                </div>
                <Button variant="outline" size="sm" onClick={handleExport}>
                    <Download className="mr-2 h-4 w-4" /> Export PDF (Front)
                </Button>
            </header>

            <div className="flex flex-1 overflow-hidden">
                <aside className="w-80 border-r border-border bg-card/20 overflow-y-auto p-6 space-y-6">
                    <div>
                        <h4 className="text-sm font-semibold mb-3">Templates</h4>
                        <div className="grid grid-cols-2 gap-2">
                            {CARD_TEMPLATES.map(t => (
                                <button
                                    key={t.id}
                                    onClick={() => setTemplate(t)}
                                    className={cn(
                                        'h-12 rounded-lg border flex items-center justify-center text-xs font-medium transition-all',
                                        template.id === t.id ? 'border-primary ring-1 ring-primary/30' : 'border-border hover:border-primary/30'
                                    )}
                                    style={{ backgroundColor: t.bg, color: t.text }}
                                >
                                    {t.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-semibold">Contact Info</h4>
                        {[
                            { icon: User, key: 'name', label: 'Name' },
                            { icon: Briefcase, key: 'title', label: 'Title' },
                            { icon: CreditCard, key: 'company', label: 'Company' },
                            { icon: Smartphone, key: 'phone', label: 'Phone' },
                            { icon: Mail, key: 'email', label: 'Email' },
                            { icon: Globe, key: 'website', label: 'Website' },
                            { icon: MapPin, key: 'address', label: 'Address' },
                        ].map((field) => (
                            <div key={field.key} className="grid gap-1.5">
                                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                                    <field.icon className="w-3 h-3" /> {field.label}
                                </label>
                                <input
                                    value={data[field.key as keyof typeof data] || ''}
                                    onChange={e => setData(prev => ({ ...prev, [field.key]: e.target.value }))}
                                    className="w-full px-3 py-2 rounded-md border border-border bg-card/50 text-sm outline-none focus:ring-1 focus:ring-primary"
                                />
                            </div>
                        ))}
                        <div className="grid gap-1.5">
                            <label className="text-xs font-medium text-muted-foreground flex items-center gap-1"><Upload className="w-3 h-3" /> Logo</label>
                            <input type="file" accept="image/*" onChange={handleLogoUpload} className="text-xs" />
                        </div>
                    </div>
                </aside>

                <main className="flex-1 bg-muted/5 flex flex-col items-center justify-center p-10 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-5" style={{
                        backgroundImage: 'radial-gradient(circle, var(--muted-foreground) 1px, transparent 1px)',
                        backgroundSize: '24px 24px',
                    }} />

                    <div className="flex gap-2 mb-8 bg-card/50 p-1 rounded-lg border border-border backdrop-blur-sm z-10">
                        {(['front', 'back'] as const).map(side => (
                            <button
                                key={side}
                                onClick={() => setActiveSide(side)}
                                className={cn(
                                    'px-4 py-1.5 rounded-md text-xs font-medium transition-all capitalize',
                                    activeSide === side ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:bg-muted/50'
                                )}
                            >
                                {side} Side
                            </button>
                        ))}
                    </div>

                    {activeSide === 'front' ? (
                        <div
                            ref={frontRef}
                            className="w-[420px] h-[240px] shadow-2xl relative overflow-hidden"
                            style={{ backgroundColor: template.bg, color: template.text }}
                        >
                            <div className="absolute inset-0 p-8 flex flex-col justify-between">
                                <div className="flex justify-between items-start">
                                    {data.logo ? (
                                        <img src={data.logo} alt="Logo" className="h-10 object-contain" />
                                    ) : (
                                        <div className="text-lg font-bold tracking-tight" style={{ color: template.accent }}>{data.company.toUpperCase()}</div>
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold mb-1">{data.name}</h2>
                                    <p className="text-xs uppercase tracking-widest opacity-80" style={{ color: template.accent }}>{data.title}</p>
                                </div>
                                <div className="space-y-1.5 text-[10px] opacity-90">
                                    <div className="flex items-center gap-2"><Smartphone className="w-3 h-3" /> {data.phone}</div>
                                    <div className="flex items-center gap-2"><Mail className="w-3 h-3" /> {data.email}</div>
                                    <div className="flex items-center gap-2"><Globe className="w-3 h-3" /> {data.website}</div>
                                    <div className="flex items-center gap-2"><MapPin className="w-3 h-3" /> {data.address}</div>
                                </div>
                                <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full opacity-10" style={{ backgroundColor: template.accent }} />
                            </div>
                        </div>
                    ) : (
                        <div
                            ref={backRef}
                            className="w-[420px] h-[240px] shadow-2xl relative overflow-hidden"
                            style={{ backgroundColor: template.bg, color: template.text }}
                        >
                            <div className="absolute inset-0 flex items-center justify-center flex-col gap-3">
                                {data.logo ? (
                                    <img src={data.logo} alt="Logo" className="h-16 object-contain" />
                                ) : (
                                    <div className="text-3xl font-bold tracking-tight" style={{ color: template.accent }}>{data.company.toUpperCase()}</div>
                                )}
                                <div className="text-xs opacity-60 tracking-widest">{data.website}</div>
                                <div className="absolute top-0 left-0 w-full h-1" style={{ backgroundColor: template.accent }} />
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};
