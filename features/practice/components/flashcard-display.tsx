import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Volume2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ImageZoomModal } from "@/components/image-zoom-modal";
import Image from "next/image";

interface Flashcard {
    id: string;
    term: string;
    definition: string | null;
    imageUrl: string | null;
}

interface FlashcardDisplayProps {
    card: Flashcard;
    isFlipped: boolean;
    isFavorite: boolean;
    onFlip: () => void;
    onEdit: () => void;
    onSpeak: (text: string) => void;
    onToggleFavorite: (e: React.MouseEvent) => void;
}

export function FlashcardDisplay({
    card,
    isFlipped,
    isFavorite,
    onFlip,
    onEdit,
    onSpeak,
    onToggleFavorite
}: FlashcardDisplayProps) {
    const [isZoomOpen, setIsZoomOpen] = useState(false);

    const handleImageClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsZoomOpen(true);
    };

    return (
        <>
            <div className="w-full max-w-3xl perspective-1000 h-[400px] cursor-pointer group" onClick={onFlip}>
                <div className={cn(
                    "relative w-full h-full transition-all duration-500 transform-style-3d shadow-xl rounded-xl",
                    isFlipped ? "rotate-y-180" : ""
                )}>
                    <Card className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center p-8 bg-card border-2 hover:border-primary/50 transition-colors">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" onClick={() => onEdit()}>
                                <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => onSpeak(card.term)}>
                                <Volume2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={onToggleFavorite}>
                                <Star className={cn("h-4 w-4", isFavorite && "fill-yellow-400 text-yellow-400")} />
                            </Button>
                        </div>
                        <div className="absolute top-4 left-4 text-sm text-muted-foreground">
                            Term
                        </div>
                        <h2 className="text-4xl font-bold text-center">{card.term}</h2>
                    </Card>

                    <Card className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center p-8 bg-card border-2 hover:border-primary/50 transition-colors overflow-y-auto">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" onClick={() => onEdit()}>
                                <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => onSpeak(card.definition || "")}>
                                <Volume2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={onToggleFavorite}>
                                <Star className={cn("h-4 w-4", isFavorite && "fill-yellow-400 text-yellow-400")} />
                            </Button>
                        </div>
                        <div className="absolute top-4 left-4 text-sm text-muted-foreground">
                            Definition
                        </div>
                        <div className="flex flex-col items-center justify-center gap-4 w-full">
                            {card.imageUrl && (
                                <div className="relative w-full max-h-48 flex items-center justify-center">
                                    <Image
                                        src={card.imageUrl}
                                        alt={card.term}
                                        width={400}
                                        height={192}
                                        className="max-w-full max-h-48 object-contain rounded-lg cursor-zoom-in hover:opacity-90 transition-opacity shadow-md"
                                        onClick={handleImageClick}
                                    />
                                </div>
                            )}
                            <p className="text-2xl text-center text-muted-foreground">{card.definition}</p>
                        </div>
                    </Card>
                </div>

                <style jsx global>{`
                    .perspective-1000 {
                        perspective: 1000px;
                    }
                    .transform-style-3d {
                        transform-style: preserve-3d;
                    }
                    .backface-hidden {
                        backface-visibility: hidden;
                    }
                    .rotate-y-180 {
                        transform: rotateY(180deg);
                    }
                `}</style>
            </div>

            <ImageZoomModal
                imageUrl={card.imageUrl}
                alt={card.term}
                open={isZoomOpen}
                onOpenChange={setIsZoomOpen}
            />
        </>
    );
}
