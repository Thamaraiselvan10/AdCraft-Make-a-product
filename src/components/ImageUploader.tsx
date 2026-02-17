import React, { useRef, useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
    uploadedImage: string | null;
    onUpload: (file: File) => void;
    onRemove: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ uploadedImage, onUpload, onRemove }) => {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            onUpload(file);
        }
    }, [onUpload]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    }, []);

    const handleDragLeave = useCallback(() => setIsDragOver(false), []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onUpload(file);
    };

    if (uploadedImage) {
        return (
            <div className="relative group">
                <h4 className="text-sm font-semibold text-foreground mb-2">Product Image</h4>
                <div className="relative rounded-xl overflow-hidden border border-border">
                    <img
                        src={uploadedImage}
                        alt="Uploaded product"
                        className="w-full h-32 object-cover"
                    />
                    <button
                        onClick={onRemove}
                        className="absolute top-2 right-2 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-destructive transition-colors"
                    >
                        <X className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <h4 className="text-sm font-semibold text-foreground mb-2">Product Image</h4>
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`
          flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all
          ${isDragOver
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border text-muted-foreground hover:border-primary/40 hover:bg-card/50'
                    }
        `}
            >
                <Upload className="w-6 h-6" />
                <span className="text-xs font-medium text-center">
                    Drop image here or click to upload
                </span>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>
        </div>
    );
};
