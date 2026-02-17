import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, Image as ImageIcon } from 'lucide-react';
import type { ChatMessage } from '../services/aiService';
import { Button } from './ui/Button';

interface AIChatPanelProps {
    messages: ChatMessage[];
    onSendMessage: (message: string) => void;
    onSuggestionClick: (suggestion: string) => void;
    onImageUpload: (file: File) => void;
    isLoading: boolean;
}

export const AIChatPanel: React.FC<AIChatPanelProps> = ({
    messages,
    onSendMessage,
    onSuggestionClick,
    onImageUpload,
    isLoading,
}) => {
    const [input, setInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        onSendMessage(input.trim());
        setInput('');
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onImageUpload(file);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="px-4 py-3 border-b border-border flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold">AI Design Assistant</h3>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {messages.length === 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 space-y-3">
                        <div className="w-12 h-12 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                            <Sparkles className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Describe what you want to promote and I'll create a design for you!
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {['Create a poster for my coffee shop', 'Design a tech startup ad', 'Promote my fitness class'].map(s => (
                                <button
                                    key={s}
                                    onClick={() => onSuggestionClick(s)}
                                    className="text-xs px-3 py-1.5 rounded-full border border-border bg-card/50 text-muted-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-all"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                <AnimatePresence>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === 'user'
                                ? 'bg-primary text-primary-foreground rounded-br-md'
                                : 'bg-card border border-border text-foreground rounded-bl-md'
                                }`}>
                                {msg.imageUrl && (
                                    <img src={msg.imageUrl} alt="Uploaded" className="w-full h-32 object-cover rounded-lg mb-2" />
                                )}
                                <div className="whitespace-pre-wrap" dangerouslySetInnerHTML={{
                                    __html: msg.content
                                        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                        .replace(/\n/g, '<br />')
                                }} />
                                {msg.suggestions && msg.suggestions.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                        {msg.suggestions.map(s => (
                                            <button
                                                key={s}
                                                onClick={() => onSuggestionClick(s)}
                                                className="text-xs px-2.5 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="bg-card border border-border rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border">
                <div className="flex items-center gap-2 bg-card/50 border border-border rounded-xl px-3 py-1">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="p-1.5 text-muted-foreground hover:text-primary transition-colors"
                        title="Upload product image"
                    >
                        <ImageIcon className="w-4 h-4" />
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                    <input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Describe what you need..."
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground py-2"
                    />
                    <Button
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                    >
                        <Send className="w-3.5 h-3.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
};
