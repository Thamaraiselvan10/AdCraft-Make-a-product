import React from 'react';
import { motion } from 'framer-motion';
import { LayoutDashboard, Image, Video, PenTool, Settings, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './ui/Button';

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    active?: boolean;
    onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon: Icon, label, active, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
        >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
            {active && <motion.div layoutId="sidebar-active" className="absolute left-0 w-1 h-8 bg-primary rounded-r-full" />}
        </button>
    );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-background">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card/50 backdrop-blur-xl hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        Ai.Design
                    </h1>
                </div>

                <nav className="flex-1 space-y-1 px-4">
                    <div className="mb-4">
                        <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Create
                        </h2>
                        <SidebarItem icon={Image} label="Poster Generator" active />
                        <SidebarItem icon={Video} label="Video Creator" />
                        <SidebarItem icon={PenTool} label="Logo Maker" />
                    </div>

                    <div>
                        <h2 className="mb-2 px-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Manage
                        </h2>
                        <SidebarItem icon={LayoutDashboard} label="Dashboard" />
                        <SidebarItem icon={Settings} label="Settings" />
                    </div>
                </nav>

                <div className="p-4 border-t border-border">
                    <Button variant="ghost" className="w-full justify-start text-muted-foreground">
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto relative">
                <div className="absolute inset-0 z-[-1] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background pointer-events-none" />
                {children}
            </main>
        </div>
    );
};
