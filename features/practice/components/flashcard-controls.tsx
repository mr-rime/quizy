import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Check, X } from "lucide-react";

interface FlashcardControlsProps {
    currentIndex: number;
    totalCards: number;
    setId: string
    onNext: () => void;
    onPrev: () => void;
    onKnow?: () => void;
    onDontKnow?: () => void;
}

export function FlashcardControls({
    currentIndex,
    totalCards,
    setId,
    onNext,
    onPrev,
    onKnow,
    onDontKnow
}: FlashcardControlsProps) {
    const isLastCard = currentIndex === totalCards - 1;

    return (
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-3xl justify-between">
            <div className="flex items-center gap-2 order-2 sm:order-1">
                <Button variant="ghost" className="text-muted-foreground">
                    {currentIndex + 1} / {totalCards}
                </Button>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 order-1 sm:order-2 w-full sm:w-auto justify-center">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={onPrev}
                    disabled={currentIndex === 0}
                    className="rounded-full h-12 w-12 shrink-0"
                >
                    <ArrowLeft className="h-6 w-6" />
                </Button>

                <div className="flex gap-3 sm:gap-4">
                    {
                        setId === "favorites" ? (
                            <Button
                                variant={"outline"}
                                size="icon"
                                onClick={onNext}
                                disabled={currentIndex === totalCards - 1}
                                className="rounded-full h-12 w-12"
                            >
                                <ArrowRight className="h-6 w-6" />
                            </Button>
                        ) : (
                            <>
                                <Button
                                    variant="default"
                                    onClick={onDontKnow || onNext}
                                    disabled={currentIndex === totalCards - 1}
                                    className="rounded-full h-12 px-6 bg-red-500 hover:bg-red-600 text-white border-red-600"
                                >
                                    <X className="h-5 w-5 mr-2" />
                                    I don't know
                                </Button>
                                <Button
                                    variant="default"
                                    onClick={onKnow || onNext}
                                    disabled={currentIndex === totalCards - 1}
                                    className="rounded-full h-12 px-6 bg-green-600 hover:bg-green-700 text-white border-green-700"
                                >
                                    <Check className="h-5 w-5 mr-2" />
                                    I know
                                </Button>
                            </>
                        )
                    }
                </div>
            </div>
            <div className="w-12 hidden sm:block order-3"></div>
        </div>
    );
}
