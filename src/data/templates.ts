// ---- Format & Template Definitions ----

export interface FormatPreset {
    id: string;
    name: string;
    category: 'poster' | 'banner' | 'social' | 'card' | 'logo';
    width: number;
    height: number;
    label: string; // e.g. "1080 × 1080"
}

export const FORMAT_PRESETS: FormatPreset[] = [
    { id: 'ig-post', name: 'Instagram Post', category: 'social', width: 1080, height: 1080, label: '1080 × 1080' },
    { id: 'ig-story', name: 'Instagram Story', category: 'social', width: 1080, height: 1920, label: '1080 × 1920' },
    { id: 'fb-ad', name: 'Facebook Ad', category: 'social', width: 1200, height: 628, label: '1200 × 628' },
    { id: 'linkedin', name: 'LinkedIn Banner', category: 'banner', width: 1584, height: 396, label: '1584 × 396' },
    { id: 'yt-thumb', name: 'YouTube Thumbnail', category: 'social', width: 1280, height: 720, label: '1280 × 720' },
    { id: 'poster-a3', name: 'Poster (A3)', category: 'poster', width: 1191, height: 1684, label: 'A3 Portrait' },
    { id: 'poster-sq', name: 'Poster (Square)', category: 'poster', width: 1200, height: 1200, label: '1200 × 1200' },
    { id: 'biz-card', name: 'Business Card', category: 'card', width: 1050, height: 600, label: '3.5 × 2 in' },
    { id: 'logo', name: 'Logo', category: 'logo', width: 800, height: 800, label: '800 × 800' },
    { id: 'web-banner', name: 'Web Banner', category: 'banner', width: 1920, height: 600, label: '1920 × 600' },
];

export interface StylePreset {
    id: string;
    name: string;
    colors: { bg: string; primary: string; secondary: string; text: string; accent: string };
    fontHeading: string;
    fontBody: string;
    mood: string;
}

export const STYLE_PRESETS: StylePreset[] = [
    {
        id: 'modern-dark',
        name: 'Modern Dark',
        colors: { bg: '#0f0f0f', primary: '#ff00cc', secondary: '#00e5ff', text: '#ffffff', accent: '#9d00ff' },
        fontHeading: 'Space Grotesk', fontBody: 'Instrument Sans', mood: 'sleek & futuristic',
    },
    {
        id: 'warm-sunset',
        name: 'Warm Sunset',
        colors: { bg: '#fff8f0', primary: '#ff6b35', secondary: '#f7c948', text: '#2d2d2d', accent: '#e8451e' },
        fontHeading: 'Space Grotesk', fontBody: 'Instrument Sans', mood: 'warm & inviting',
    },
    {
        id: 'ocean-breeze',
        name: 'Ocean Breeze',
        colors: { bg: '#0a192f', primary: '#64ffda', secondary: '#8892b0', text: '#ccd6f6', accent: '#00bcd4' },
        fontHeading: 'Space Grotesk', fontBody: 'Instrument Sans', mood: 'calm & professional',
    },
    {
        id: 'neon-pop',
        name: 'Neon Pop',
        colors: { bg: '#1a0030', primary: '#ff0080', secondary: '#00ff88', text: '#ffffff', accent: '#ffff00' },
        fontHeading: 'Space Grotesk', fontBody: 'Instrument Sans', mood: 'bold & energetic',
    },
    {
        id: 'minimal-clean',
        name: 'Minimal Clean',
        colors: { bg: '#ffffff', primary: '#000000', secondary: '#888888', text: '#111111', accent: '#0066ff' },
        fontHeading: 'Space Grotesk', fontBody: 'Instrument Sans', mood: 'clean & elegant',
    },
    {
        id: 'luxury-gold',
        name: 'Luxury Gold',
        colors: { bg: '#1a1a2e', primary: '#d4af37', secondary: '#c9b037', text: '#f0e6d3', accent: '#ffd700' },
        fontHeading: 'Space Grotesk', fontBody: 'Instrument Sans', mood: 'premium & luxurious',
    },
];

export interface DesignLayer {
    id: string;
    type: 'text' | 'image' | 'shape' | 'background';
    content: string;
    x: number; // percentage 0-100
    y: number;
    width: number;
    height: number;
    fontSize?: number;
    fontFamily?: string;
    fontWeight?: number;
    color?: string;
    textAlign?: 'left' | 'center' | 'right';
    opacity?: number;
    rotation?: number;
    borderRadius?: number;
    backgroundColor?: string;
    gradient?: string;
    objectFit?: 'cover' | 'contain' | 'fill';
}

export interface DesignState {
    format: FormatPreset;
    style: StylePreset;
    layers: DesignLayer[];
    backgroundColor: string;
    backgroundGradient?: string;
    backgroundImage?: string;
}

export function createDefaultDesign(): DesignState {
    return {
        format: FORMAT_PRESETS[0], // Instagram Post
        style: STYLE_PRESETS[0],  // Modern Dark
        layers: [],
        backgroundColor: STYLE_PRESETS[0].colors.bg,
    };
}
