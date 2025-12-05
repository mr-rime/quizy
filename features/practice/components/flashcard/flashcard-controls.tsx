import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Maximize, Settings } from "lucide-react";

interface FlashcardControlsProps {
    currentIndex: number;
    totalCards: number;
    onNext: () => void;
    onPrev: () => void;
    onMaximize?: () => void;
    onSettings?: () => void;
}

export function FlashcardControls({
    currentIndex,
    totalCards,
    onNext,
    onPrev,
    onMaximize,
    onSettings
}: FlashcardControlsProps) {
    return (
        <div className="flex items-center gap-4 w-full max-w-3xl justify-between">
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
                    className="rounded-full h-12 w-12"
                >
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={onNext}
                    disabled={currentIndex === totalCards - 1}
                    className="rounded-full h-12 w-12"
                >
                    <ArrowRight className="h-6 w-6" />
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={onMaximize}>
                    <Maximize className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onSettings}>
                    <Settings className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}
