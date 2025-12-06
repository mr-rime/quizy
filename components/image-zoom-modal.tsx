"use client"

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface ImageZoomModalProps {
    imageUrl: string | null;
    alt: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ImageZoomModal({ imageUrl, alt, open, onOpenChange }: ImageZoomModalProps) {
    if (!imageUrl) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent
                className="max-w-[95vw] max-h-[95vh] p-0 overflow-hidden bg-transparent border-none shadow-none"
                showCloseButton={false}
            >
                <div className="relative w-full h-full flex items-center justify-center">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <img
                        src={imageUrl}
                        alt={alt}
                        className="max-w-full max-h-[95vh] object-contain rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
