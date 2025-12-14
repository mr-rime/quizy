import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react"; // Added Check icon

interface FlashcardControlsProps {
    currentIndex: number;
    totalCards: number;
    setId: string
    onNext: () => void;
    onPrev: () => void;
}

export function FlashcardControls({
    currentIndex,
    totalCards,
    setId,
    onNext,
    onPrev
}: FlashcardControlsProps) {
    const isLastCard = currentIndex === totalCards - 1;

    return (
        <div className="flex items-center gap-2 sm:gap-4 w-full max-w-3xl justify-between">
            <div className="flex items-center gap-2">
                <Button variant="ghost" className="text-muted-foreground">
                    {currentIndex + 1} / {totalCards}
                </Button>
            </div>

            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={onPrev}
                    disabled={currentIndex === 0}
                    className="rounded-full h-10 w-10 sm:h-12 sm:w-12"
                >
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                {
                    setId === "favorites" ? (
                        <Button
                            variant={"outline"}
                            size="icon"
                            disabled={currentIndex === totalCards - 1}
                            className="rounded-full h-10 w-10 sm:h-12 sm:w-12"
                        >
                            <ArrowRight className="h-6 w-6" />
                        </Button>
                    ) : <Button
                        variant={isLastCard ? "default" : "outline"}
                        size="icon"
                        onClick={onNext}
                        className="rounded-full h-10 w-10 sm:h-12 sm:w-12"
                    >
                        {isLastCard ? <Check className="h-6 w-6" /> : <ArrowRight className="h-6 w-6" />}
                    </Button>
                }
            </div>
        </div>
    );
}
