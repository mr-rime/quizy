import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit2, Volume2, Star, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Flashcard } from "../../types";
import { useState } from "react";
import { ExamplesModal } from "../examples-modal";

interface FlashcardDisplayProps {
    card: Flashcard;
    isFlipped: boolean;
    onFlip: () => void;
    onSpeak: (text: string) => void;
    onEdit: () => void;
}

export function FlashcardDisplay({
    card,
    isFlipped,
    onFlip,
    onSpeak,
    onEdit
}: FlashcardDisplayProps) {
    const [showExamples, setShowExamples] = useState(false);

    return (
        <div className="w-full max-w-3xl perspective-1000 h-[400px] cursor-pointer group" onClick={onFlip}>
            <div className={cn(
                "relative w-full h-full transition-all duration-500 transform-style-3d shadow-xl rounded-xl",
                isFlipped ? "rotate-y-180" : ""
            )}>
                <Card className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center p-8 bg-card border-2 hover:border-primary/50 transition-colors">
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                            <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onSpeak(card.term); }}>
                            <Volume2 className="h-4 w-4" />
                        </Button>
                        {card.examples && card.examples.length > 0 && (
                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setShowExamples(true); }}>
                                <Lightbulb className="h-4 w-4" />
                            </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                            <Star className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="absolute top-4 left-4 text-sm text-muted-foreground">
                        Term
                    </div>
                    <h2 className="text-4xl font-bold text-center">{card.term}</h2>
                </Card>

                <Card className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center p-8 bg-card border-2 hover:border-primary/50 transition-colors">
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                            <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); onSpeak(card.definition || ""); }}>
                            <Volume2 className="h-4 w-4" />
                        </Button>
                        {card.examples && card.examples.length > 0 && (
                            <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setShowExamples(true); }}>
                                <Lightbulb className="h-4 w-4" />
                            </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                            <Star className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="absolute top-4 left-4 text-sm text-muted-foreground">
                        Definition
                    </div>
                    <p className="text-2xl text-center text-muted-foreground">{card.definition}</p>
                    {card.imageUrl && (
                        <Image
                            src={card.imageUrl}
                            alt="Card image"
                            className="mt-4 rounded-md max-w-[85%] md:max-w-full max-h-40 md:max-h-40 w-auto h-auto"
                            width={200}
                            height={160}
                            style={{ objectFit: "contain" }}
                            unoptimized
                        />
                    )}
                </Card>
            </div>

            <ExamplesModal
                open={showExamples}
                onOpenChange={setShowExamples}
                examples={card.examples || []}
            />

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
    );
}
