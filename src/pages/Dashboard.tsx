import { useState } from 'react'
import { Layout } from '../components/Layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Plus, Wand2, Film, PenTool, Frame, Sparkles, Image as ImageIcon } from 'lucide-react'
import { PosterEditor } from '../components/PosterEditor'
import { PosterWizard } from '../components/PosterWizard'
import type { PosterBrief } from '../components/PosterWizard'
import { VideoEditor } from '../components/VideoEditor'
import { LogoEditor } from '../components/LogoEditor'
import { BusinessCardEditor } from '../components/BusinessCardEditor'

type View = 'dashboard' | 'poster-wizard' | 'poster-editor' | 'video' | 'logo' | 'business-card';

const creativeTypes = [
    {
        id: 'poster' as const,
        title: 'AI Poster',
        description: 'Multi-step guided poster creation',
        icon: Wand2,
        view: 'poster-wizard' as View,
        available: true,
        gradient: 'from-primary/20 to-accent/10',
    },
    {
        id: 'social' as const,
        title: 'Social Media Ad',
        description: 'Instagram, Facebook, LinkedIn creatives',
        icon: ImageIcon,
        view: 'poster-editor' as View, // reuses the design studio with social presets
        available: true,
        gradient: 'from-secondary/20 to-primary/10',
    },
    {
        id: 'banner' as const,
        title: 'Web Banner',
        description: 'Headers, banners & promotional strips',
        icon: Frame,
        view: 'poster-editor' as View,
        available: true,
        gradient: 'from-accent/20 to-secondary/10',
    },
    {
        id: 'video' as const,
        title: 'AI Video',
        description: 'Generate multi-scene video ads',
        icon: Film,
        view: 'video' as View,
        available: true,
        gradient: 'from-primary/20 to-secondary/10',
    },
    {
        id: 'logo' as const,
        title: 'AI Logo',
        description: 'Create your brand identity',
        icon: Sparkles,
        view: 'logo' as View,
        available: true,
        gradient: 'from-accent/20 to-primary/10',
    },
    {
        id: 'card' as const,
        title: 'Business Card',
        description: 'Coming Soon',
        icon: PenTool,
        view: 'business-card' as View,
        available: true,
        gradient: 'from-orange-500/20 to-red-500/10',
    },
];

export function Dashboard() {
    const [currentView, setCurrentView] = useState<View>('dashboard');
    const [posterBrief, setPosterBrief] = useState<PosterBrief | null>(null);

    const handleWizardComplete = (brief: PosterBrief) => {
        setPosterBrief(brief);
        setCurrentView('poster-editor');
    };

    // --- Render sub-editors ---
    if (currentView === 'poster-wizard') {
        return <PosterWizard onComplete={handleWizardComplete} onBack={() => setCurrentView('dashboard')} />;
    }

    if (currentView === 'poster-editor') {
        return <PosterEditor onBack={() => { setPosterBrief(null); setCurrentView('dashboard'); }} />;
    }

    if (currentView === 'video') {
        return <VideoEditor onBack={() => setCurrentView('dashboard')} />;
    }

    if (currentView === 'logo') {
        return <LogoEditor onBack={() => setCurrentView('dashboard')} />;
    }

    if (currentView === 'business-card') {
        return <BusinessCardEditor onBack={() => setCurrentView('dashboard')} />;
    }

    // --- Dashboard ---
    return (
        <Layout>
            <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-display font-bold">Welcome back, Creator</h2>
                        <p className="text-muted-foreground">What will you design today?</p>
                    </div>
                    <Button onClick={() => setCurrentView('poster-wizard')}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Design
                    </Button>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {creativeTypes.map(type => (
                        <Card
                            key={type.id}
                            className={`transition-all cursor-pointer group relative overflow-hidden ${type.available
                                ? 'hover:border-primary/50'
                                : 'opacity-50 cursor-not-allowed'
                                }`}
                            onClick={() => type.available && setCurrentView(type.view)}
                        >
                            {type.available && (
                                <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
                            )}
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-lg">
                                    <type.icon className={`h-5 w-5 ${type.available ? 'text-primary' : 'text-muted-foreground'}`} />
                                    {type.title}
                                </CardTitle>
                                <CardDescription>{type.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="aspect-video rounded-md bg-muted/20 flex items-center justify-center group-hover:bg-primary/5 transition-colors border border-border/50">
                                    <span className={`text-xs font-semibold ${type.available
                                        ? 'text-muted-foreground group-hover:text-primary'
                                        : 'text-muted-foreground/50'
                                        }`}>
                                        {type.available ? 'Click to Create' : 'Under Development'}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-12">
                    <h3 className="text-xl font-display font-semibold mb-4">Recent Projects</h3>
                    <div className="text-center py-12 border border-dashed rounded-lg border-border">
                        <p className="text-muted-foreground">No projects yet. Start creating!</p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}
