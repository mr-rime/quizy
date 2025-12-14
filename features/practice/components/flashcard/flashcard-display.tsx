import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Volume2, Star, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ImageZoomModal } from "@/components/image-zoom-modal";
import { OptimizedImage } from "@/components/optimized-image";
import { ExamplesModal } from "../examples-modal";
import { Flashcard } from "../../types";



interface FlashcardDisplayProps {
    card: Flashcard;
    isFlipped: boolean;
    isFavorite: boolean;
    isOwner?: boolean;
    onFlip: () => void;
    onEdit: () => void;
    onSpeak: (text: string) => void;
    onToggleFavorite: (e: React.MouseEvent) => void;
}

export function FlashcardDisplay({
    card,
    isFlipped,
    isFavorite,
    isOwner = false,
    onFlip,
    onEdit,
    onSpeak,
    onToggleFavorite
}: FlashcardDisplayProps) {
    const [showExamples, setShowExamples] = useState(false);
    const [isZoomOpen, setIsZoomOpen] = useState(false);

    const handleImageClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsZoomOpen(true);
    };

    return (
        <>
            <div className="w-full max-w-3xl perspective-1000 h-[280px] sm:h-[350px] lg:h-[400px] cursor-pointer group" onClick={onFlip}>
                <div className={cn(
                    "relative w-full h-full transition-all duration-500 transform-style-3d shadow-xl rounded-xl",
                    isFlipped ? "rotate-y-180" : ""
                )}>
                    <Card className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-card border-2 hover:border-primary/50 transition-colors">
                        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-1 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                            {isOwner && (
                                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" onClick={() => onEdit()}>
                                    <Edit2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                            )}
                            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" onClick={() => onSpeak(card.term)}>
                                <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            {card.examples && card.examples.length > 0 && (
                                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setShowExamples(true); }}>
                                    <Lightbulb className="h-4 w-4" />
                                </Button>
                            )}
                            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" onClick={onToggleFavorite}>
                                <Star className={cn("h-3 w-3 sm:h-4 sm:w-4", isFavorite && "fill-yellow-400 text-yellow-400")} />
                            </Button>
                        </div>
                        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 text-xs sm:text-sm text-muted-foreground">
                            Term
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center px-2">{card.term}</h2>
                    </Card>

                    <Card className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-card border-2 hover:border-primary/50 transition-colors overflow-y-auto">
                        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-1 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                            {isOwner && (
                                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" onClick={() => onEdit()}>
                                    <Edit2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                            )}
                            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" onClick={() => onSpeak(card.definition || "")}>
                                <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            {card.examples && card.examples.length > 0 && (
                                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setShowExamples(true); }}>
                                    <Lightbulb className="h-4 w-4" />
                                </Button>
                            )}
                            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" onClick={onToggleFavorite}>
                                <Star className={cn("h-3 w-3 sm:h-4 sm:w-4", isFavorite && "fill-yellow-400 text-yellow-400")} />
                            </Button>
                        </div>
                        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 text-xs sm:text-sm text-muted-foreground">
                            Definition
                        </div>
                        <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 w-full">
                            {card.imageUrl && (
                                <div className="relative w-full max-h-32 sm:max-h-40 lg:max-h-48 flex items-center justify-center">
                                    <OptimizedImage
                                        key={card.imageUrl}
                                        src={card.imageUrl}
                                        alt={card.term}
                                        width={170}
                                        height={170}
                                        className="max-w-full max-h-32 sm:max-h-40 lg:max-h-48 object-contain rounded-lg cursor-zoom-in hover:opacity-90 transition-opacity shadow-md"
                                        onClick={handleImageClick}
                                    />
                                </div>
                            )}
                            <p className="text-lg sm:text-xl lg:text-2xl text-center text-muted-foreground px-2">{card.definition}</p>
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

            <ExamplesModal
                open={showExamples}
                onOpenChange={setShowExamples}
                examples={card.examples || []}
            />

            <ImageZoomModal
                imageUrl={card.imageUrl}
                alt={card.term}
                open={isZoomOpen}
                onOpenChange={setIsZoomOpen}
            />
        </>
    );
}
