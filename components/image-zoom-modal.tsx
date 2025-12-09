"use client"

import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import Image from 'next/image';

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
                className="max-w-[95vw] sm:max-w-[90vw] max-h-[95vh] p-2 sm:p-4 overflow-hidden bg-transparent border-none shadow-none"
                showCloseButton={false}
            >
                <div className="relative w-full h-[90vh] sm:h-[95vh] flex items-center justify-center">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="absolute top-2 sm:top-4 right-2 sm:right-4 z-50 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 sm:p-3 transition-colors min-h-11 min-w-11 flex items-center justify-center"
                        aria-label="Close"
                    >
                        <X size={20} className="sm:w-6 sm:h-6" />
                    </button>
                    <div className="relative w-full h-full">
                        <Image
                            src={imageUrl}
                            alt={alt}
                            fill
                            className="object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                            unoptimized
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
