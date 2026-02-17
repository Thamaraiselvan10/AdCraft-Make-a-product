import { STYLE_PRESETS } from '../data/templates';
import type { DesignLayer, DesignState, StylePreset } from '../data/templates';

// ---- Chat Message Types ----
export interface ChatMessage {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
    suggestions?: string[];
    designUpdate?: Partial<DesignState>;
    imageUrl?: string;
}

// ---- Keyword Detection ----
const PRODUCT_KEYWORDS: Record<string, string[]> = {
    food: ['food', 'restaurant', 'cafe', 'pizza', 'burger', 'bakery', 'coffee', 'tea', 'juice', 'cake', 'dessert', 'biryani', 'chicken', 'ice cream'],
    fashion: ['fashion', 'clothing', 'wear', 'dress', 'shirt', 'shoe', 'brand', 'boutique', 'accessory', 'jewelry'],
    tech: ['tech', 'app', 'software', 'gadget', 'phone', 'laptop', 'saas', 'startup', 'digital', 'ai', 'website'],
    fitness: ['fitness', 'gym', 'yoga', 'health', 'workout', 'protein', 'supplement', 'sport'],
    beauty: ['beauty', 'skincare', 'makeup', 'cosmetic', 'salon', 'spa', 'hair'],
    education: ['education', 'course', 'school', 'college', 'tutor', 'learn', 'workshop', 'seminar'],
    event: ['event', 'concert', 'party', 'festival', 'wedding', 'conference', 'meetup', 'launch'],
    realestate: ['real estate', 'property', 'home', 'apartment', 'villa', 'construction', 'interior'],
};

function detectCategory(text: string): string {
    const lower = text.toLowerCase();
    for (const [cat, keywords] of Object.entries(PRODUCT_KEYWORDS)) {
        if (keywords.some(kw => lower.includes(kw))) return cat;
    }
    return 'general';
}

function pickStyle(category: string): StylePreset {
    const mapping: Record<string, string> = {
        food: 'warm-sunset', fashion: 'luxury-gold', tech: 'modern-dark',
        fitness: 'neon-pop', beauty: 'minimal-clean', education: 'ocean-breeze',
        event: 'neon-pop', realestate: 'ocean-breeze', general: 'modern-dark',
    };
    return STYLE_PRESETS.find(s => s.id === mapping[category]) || STYLE_PRESETS[0];
}

// ---- Design Generation ----
function generateLayers(prompt: string, category: string, style: StylePreset, uploadedImage?: string): DesignLayer[] {
    const words = prompt.split(' ').filter(w => w.length > 3);
    const headline = words.slice(0, 4).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    const layers: DesignLayer[] = [
        // Background shape / gradient overlay
        {
            id: 'bg-overlay',
            type: 'shape',
            content: '',
            x: 0, y: 0, width: 100, height: 100,
            opacity: 0.8,
            gradient: `linear-gradient(135deg, ${style.colors.bg} 0%, ${style.colors.primary}33 50%, ${style.colors.secondary}22 100%)`,
        },
        // Decorative accent shape
        {
            id: 'accent-shape',
            type: 'shape',
            content: '',
            x: 60, y: -10, width: 60, height: 60,
            opacity: 0.15,
            backgroundColor: style.colors.primary,
            borderRadius: 50,
        },
        // Headline
        {
            id: 'headline',
            type: 'text',
            content: headline || 'Your Brand Here',
            x: 8, y: 15,
            width: 84, height: 20,
            fontSize: 48,
            fontFamily: style.fontHeading,
            fontWeight: 700,
            color: style.colors.text,
            textAlign: 'left',
        },
        // Subheadline
        {
            id: 'subheadline',
            type: 'text',
            content: prompt.length > 60 ? prompt.substring(0, 60) + '...' : prompt,
            x: 8, y: 38,
            width: 60, height: 10,
            fontSize: 18,
            fontFamily: style.fontBody,
            fontWeight: 400,
            color: style.colors.secondary,
            textAlign: 'left',
        },
        // CTA Button
        {
            id: 'cta',
            type: 'shape',
            content: '',
            x: 8, y: 72,
            width: 35, height: 8,
            backgroundColor: style.colors.primary,
            borderRadius: 8,
        },
        {
            id: 'cta-text',
            type: 'text',
            content: getCTAText(category),
            x: 8, y: 73,
            width: 35, height: 6,
            fontSize: 16,
            fontFamily: style.fontBody,
            fontWeight: 600,
            color: style.colors.bg === '#ffffff' ? '#ffffff' : '#ffffff',
            textAlign: 'center',
        },
        // Brand watermark
        {
            id: 'brand',
            type: 'text',
            content: 'AdCraft AI',
            x: 8, y: 90,
            width: 30, height: 5,
            fontSize: 12,
            fontFamily: style.fontBody,
            fontWeight: 400,
            color: style.colors.secondary,
            textAlign: 'left',
            opacity: 0.6,
        },
    ];

    // Add uploaded product image layer
    if (uploadedImage) {
        layers.splice(2, 0, {
            id: 'product-image',
            type: 'image',
            content: uploadedImage,
            x: 55, y: 25,
            width: 40, height: 45,
            borderRadius: 12,
            objectFit: 'cover',
        });
    }

    return layers;
}

function getCTAText(category: string): string {
    const ctas: Record<string, string> = {
        food: 'Order Now →', fashion: 'Shop Collection →', tech: 'Try Free →',
        fitness: 'Join Today →', beauty: 'Book Now →', education: 'Enroll Now →',
        event: 'Get Tickets →', realestate: 'Schedule Tour →', general: 'Learn More →',
    };
    return ctas[category] || 'Learn More →';
}

// ---- Clarifying Questions ----
function needsClarification(prompt: string): boolean {
    return prompt.split(' ').length < 5;
}

function getClarifyingQuestion(category: string): { question: string; suggestions: string[] } {
    const questions: Record<string, { question: string; suggestions: string[] }> = {
        food: {
            question: "Looks like you're promoting food! What's the vibe — casual street food or fine dining? And should I highlight any offers?",
            suggestions: ['Casual & fun', 'Premium dining', '50% OFF offer', 'New item launch'],
        },
        fashion: {
            question: "Fashion it is! Is this for a seasonal collection, a sale event, or brand awareness?",
            suggestions: ['Summer Collection', 'Flash Sale', 'Brand Story', 'New Arrivals'],
        },
        tech: {
            question: "Tech product detected! Should the poster feel futuristic & techy, or clean & corporate?",
            suggestions: ['Futuristic / neon', 'Clean & minimal', 'Product showcase', 'Feature highlight'],
        },
        general: {
            question: "Tell me more! What's the product/service, who's the target audience, and what action should viewers take?",
            suggestions: ['Add more details', 'Just surprise me', 'Show me styles first', 'Upload a product image'],
        },
    };
    return questions[category] || questions.general;
}

// ---- Main AI Service ----
let messageIdCounter = 0;

function makeId(): string {
    return `msg-${Date.now()}-${messageIdCounter++}`;
}

export async function processUserMessage(
    userMessage: string,
    currentDesign: DesignState,
    conversationHistory: ChatMessage[],
    uploadedImage?: string,
): Promise<ChatMessage[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    const category = detectCategory(userMessage);
    const style = pickStyle(category);
    const responses: ChatMessage[] = [];

    // If first message or short prompt → ask clarifying question
    const isFirstReal = conversationHistory.filter(m => m.role === 'user').length <= 1;
    if (isFirstReal && needsClarification(userMessage)) {
        const { question, suggestions } = getClarifyingQuestion(category);
        responses.push({
            id: makeId(),
            role: 'ai',
            content: question,
            timestamp: new Date(),
            suggestions,
        });
        return responses;
    }

    // Generate design
    const layers = generateLayers(userMessage, category, style, uploadedImage);

    responses.push({
        id: makeId(),
        role: 'ai',
        content: `✨ I've created a **${style.mood}** design for your ${category} promotion! The layout includes a bold headline, descriptive subtext, and a clear call-to-action.\n\nFeel free to:\n• Click any text on the canvas to edit it\n• Change the color palette on the right\n• Switch formats using the format selector\n• Upload a product image to feature it`,
        timestamp: new Date(),
        suggestions: ['Make it bolder', 'Change colors', 'Add more text', 'Try another style'],
        designUpdate: {
            style,
            layers,
            backgroundColor: style.colors.bg,
            backgroundGradient: `linear-gradient(135deg, ${style.colors.bg}, ${style.colors.primary}15)`,
        },
    });

    return responses;
}

export async function processStyleChange(
    styleName: string,
    currentDesign: DesignState,
    uploadedImage?: string,
): Promise<{ message: ChatMessage; designUpdate: Partial<DesignState> }> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const style = STYLE_PRESETS.find(s => s.name.toLowerCase().includes(styleName.toLowerCase()))
        || STYLE_PRESETS.find(s => s.id.includes(styleName.toLowerCase()))
        || STYLE_PRESETS[0];

    // Regenerate layers with new style
    const existingText = currentDesign.layers.find(l => l.id === 'headline')?.content || 'Your Brand';
    const layers = generateLayers(existingText, 'general', style, uploadedImage);

    return {
        message: {
            id: makeId(),
            role: 'ai',
            content: `🎨 Switched to **${style.name}** — a ${style.mood} aesthetic. Looking great!`,
            timestamp: new Date(),
        },
        designUpdate: {
            style,
            layers,
            backgroundColor: style.colors.bg,
            backgroundGradient: `linear-gradient(135deg, ${style.colors.bg}, ${style.colors.primary}15)`,
        },
    };
}
