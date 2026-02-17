import { motion } from 'framer-motion';
import { ArrowRight, Zap, PenTool, Layout as LayoutIcon, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function LandingPage() {
    return (
        <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary selection:text-white font-sans">

            {/* Navigation */}
            <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center backdrop-blur-md bg-background/50 border-b border-white/5">
                <div className="font-display font-bold text-xl tracking-tighter text-white">
                    ADCRAFT<span className="text-primary">.AI</span>
                </div>
                <Link to="/app">
                    <button className="px-6 py-2 border border-white/10 bg-white/5 rounded-full text-sm font-medium hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 backdrop-blur-md">
                        Login
                    </button>
                </Link>
            </nav>

            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col justify-center items-center px-6 pt-20 overflow-hidden">

                {/* Vibrant Gradient Blobs */}
                <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px] pointer-events-none animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-secondary/30 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[30%] right-[20%] w-[300px] h-[300px] bg-accent/20 rounded-full blur-[100px] pointer-events-none" />

                <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,var(--background))] pointer-events-none" />

                <motion.div
                    initial={{ opacity: 0, y: 50, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-10 text-center max-w-5xl mx-auto"
                >
                    <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-sm font-medium text-primary">
                        ✨ The Future of Social Ads is Here
                    </div>

                    <h1 className="text-6xl md:text-9xl font-display font-bold tracking-tighter leading-none mb-6 drop-shadow-2xl">
                        DESIGN <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary animate-gradient-x">
                            AMPLIFIED
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-10 font-light leading-relaxed">
                        Stop struggling with generic tools. Create <span className="text-white font-medium">hyper-visual</span> social media content with AI that actually understands aesthetics.
                    </p>

                    <Link to="/app">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-bold text-lg tracking-tight rounded-full shadow-[0_0_20px_rgba(255,0,255,0.5)] hover:shadow-[0_0_40px_rgba(255,0,255,0.7)] transition-all"
                        >
                            START CREATING
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </motion.button>
                    </Link>
                </motion.div>
            </section>

            {/* Feature Grid - Glassmorphism */}
            <section className="py-24 px-6 md:px-12 relative">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[300px]">

                        {/* Feature 1: Large */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="md:col-span-2 row-span-1 border border-white/10 bg-white/5 backdrop-blur-xl p-8 rounded-3xl relative overflow-hidden group hover:border-primary/50 transition-all hover:bg-white/10"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-50 group-hover:opacity-100 transition-opacity bg-primary/20 rounded-bl-3xl">
                                <Zap className="w-8 h-8 text-primary" />
                            </div>
                            <h3 className="text-3xl font-display font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Instant Generation</h3>
                            <p className="text-muted-foreground max-w-md">
                                Type a prompt, get a masterpiece. Our engine understands composition, color theory, and brand consistency better than your ex-designer.
                            </p>
                            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/20 blur-[80px] group-hover:bg-primary/30 transition-colors" />
                        </motion.div>

                        {/* Feature 2: Tall */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="md:col-span-1 md:row-span-2 border border-white/10 bg-white/5 backdrop-blur-xl p-8 rounded-3xl flex flex-col justify-end relative overflow-hidden hover:border-secondary/50 transition-all group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" />
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-110 transition-transform duration-700" />
                            <div className="relative z-20">
                                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-md">
                                    <LayoutIcon className="w-6 h-6 text-secondary" />
                                </div>
                                <h3 className="text-2xl font-display font-bold mb-2 text-white">Smart Layouts</h3>
                                <p className="text-sm text-muted-foreground">Auto-adapts to Instagram, TikTok, and LinkedIn formats instantly.</p>
                            </div>
                        </motion.div>

                        {/* Feature 3: Standard */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="border border-white/10 bg-white/5 backdrop-blur-xl p-8 rounded-3xl group hover:border-accent/50 transition-colors hover:bg-white/10 relative overflow-hidden"
                        >
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-accent/20 blur-[60px]" />
                            <PenTool className="w-8 h-8 text-accent mb-6" />
                            <h3 className="text-xl font-display font-bold mb-2 text-white">Brand Control</h3>
                            <p className="text-sm text-muted-foreground">Upload your assets. We lock your fonts and colors so AI doesn't go rogue.</p>
                        </motion.div>

                        {/* Feature 4: CTA Block */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="border border-white/10 bg-gradient-to-br from-primary via-accent to-secondary p-8 rounded-3xl flex flex-col justify-center items-center text-center cursor-pointer hover:scale-[1.02] transition-transform shadow-2xl relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <h3 className="text-3xl font-display font-bold mb-2 text-white drop-shadow-md">Ready?</h3>
                            <Link to="/app" className="flex items-center gap-2 font-bold tracking-tight text-white hover:gap-4 transition-all relative z-10">
                                LAUNCH APP <ChevronRight className="w-6 h-6" />
                            </Link>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* Ticker / Marquee */}
            <div className="bg-black/30 backdrop-blur-md border-y border-white/10 py-6 overflow-hidden">
                <div className="flex gap-8 items-center whitespace-nowrap animate-marquee font-bold font-display tracking-widest text-2xl text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-primary">
                    {Array(10).fill("ADCRAFT AI • GENERATE • DESIGN • PUBLISH • ").map((text, i) => (
                        <span key={i}>{text}</span>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-white/5 text-center relative">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
                <div className="font-display font-bold text-2xl tracking-tighter mb-4 text-white">
                    ADCRAFT<span className="text-primary">.AI</span>
                </div>
                <p className="text-muted-foreground text-sm">
                    © 2026 AdCraft AI. All rights reserved. <br />
                    Designed for the bold.
                </p>
            </footer>

            <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 20s linear infinite;
        }
        @keyframes gradient-x {
            0%, 100% { background-position: 0% 50% }
            50% { background-position: 100% 50% }
        }
        .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 3s ease infinite;
        }
      `}</style>
        </div>
    );
}
