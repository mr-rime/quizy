"use client";

import { useState, useEffect, useRef, useEffectEvent } from "react";
import { Button } from "@/components/ui/button";
import { CharacterInput } from "./character-input";
import { ArrowLeft, Lightbulb, CheckCircle2, XCircle, BookOpen } from "lucide-react";
import { ExamplesModal } from "./examples-modal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { OptimizedImage } from "@/components/optimized-image";


interface Flashcard {
    id: string;
    term: string;
    definition: string | null;
    imageUrl: string | null;
    examples?: { english: string; arabic: string }[] | null;
}

interface WritingGameProps {
    cards: Flashcard[];
    setId: string;
    setTitle: string;
}

export function WritingGame({ cards, setId, setTitle }: WritingGameProps) {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [inputs, setInputs] = useState<string[]>([]);
    const [inputStatus, setInputStatus] = useState<"idle" | "correct" | "incorrect">("idle");
    const [showExamples, setShowExamples] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const currentCard = cards[currentIndex];
    const answer = currentCard?.term || "";

    const setInputsEvent = useEffectEvent(setInputs);
    const setInputStatusEvent = useEffectEvent(setInputStatus);

    useEffect(() => {
        if (currentCard) {
            const initialInputs = currentCard.term.split("").map(char => char === " " ? " " : "");
            setInputsEvent(initialInputs);
            setInputStatusEvent("idle");
            setTimeout(() => {
                const firstNonSpace = currentCard.term.split("").findIndex(c => c !== " ");
                if (firstNonSpace !== -1) {
                    inputRefs.current[firstNonSpace]?.focus()
                }
            }, 100);
        }
    }, [currentIndex, currentCard]);


    const handleBack = (index: number) => {
        if (index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleForward = (index: number) => {
        if (index < answer.length - 1) {
            inputRefs.current[index + 1]?.focus();
        } else {
            checkAnswer(inputs);
        }
    };

    const onInput = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        const newInputs = [...inputs];
        newInputs[index] = val;
        setInputs(newInputs);

        if (val) {
            if (index === answer.length - 1) {
                checkAnswer(newInputs);
            } else {
                handleForward(index);
            }
        }
    };

    const checkAnswer = (currentInputs: string[]) => {
        const submission = currentInputs.join("");
        if (submission.toLowerCase() === answer.toLowerCase()) {
            handleCorrect();
        } else {
            if (submission.length === answer.length) {
                setInputStatus("incorrect");
                const audio = new Audio("/audio/incorrect-choice.mp3");
                audio.play().catch(e => console.error("Audio play failed", e));
            }
        }
    };

    const handleCorrect = () => {
        setInputStatus("correct");
        const audio = new Audio("/audio/correct-choice.mp3");
        audio.play().catch(e => console.error("Audio play failed", e));
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });

        setTimeout(() => {
            if (currentIndex < cards.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                toast.success("Set completed!");
                router.push(`/practice/${setId}`);
            }
        }, 1500);
    };

    const giveHint = () => {
        const firstMismatch = inputs.findIndex((char, i) => char.toLowerCase() !== answer[i].toLowerCase());

        if (firstMismatch !== -1) {
            const newInputs = [...inputs];
            newInputs[firstMismatch] = answer[firstMismatch];
            setInputs(newInputs);
            inputRefs.current[firstMismatch + 1]?.focus();
            if (firstMismatch === answer.length - 1) {
                checkAnswer(newInputs);
            }
        }
    };

    if (!currentCard) return null;

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 p-4 max-w-4xl mx-auto w-full">
            <div className="flex items-center gap-4 w-full justify-start">
                <Button variant="ghost" size="icon" onClick={() => router.back()}>
                    <ArrowLeft className="h-6 w-6" />
                </Button>
                <div className="text-left">
                    <h1 className="text-3xl font-bold">Writing: {setTitle}</h1>
                    <p className="text-muted-foreground">{currentIndex + 1} / {cards.length} terms</p>
                </div>
            </div>

            <div className="text-center space-y-6 w-full">
                <h2 className="text-3xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {currentCard.definition || "What's the term?"}
                </h2>

                <div className="h-[200px] w-full flex items-center justify-center">
                    {currentCard.imageUrl ? (
                        <div className="relative w-full max-w-md mx-auto aspect-video rounded-lg overflow-hidden border flex justify-center items-center h-full">
                            <OptimizedImage
                                src={currentCard.imageUrl}
                                alt="Hint"
                                className="object-cover "
                                width={200}
                                height={200}
                            />
                        </div>
                    ) : null}
                </div>

                <div className="flex flex-wrap justify-center gap-2 sm:gap-4 my-8">
                    {answer.split("").map((char, i) => {
                        if (char === " ") {
                            return <div key={`${currentIndex}-${i}`} className="w-4 sm:w-8 flex items-center justify-center pointer-events-none"></div>;
                        }
                        return (
                            <div key={`${currentIndex}-${i}`} className={cn(
                                "transition-transform",
                                inputStatus === "incorrect" && "animate-shake"
                            )}>
                                <CharacterInput
                                    index={i}
                                    value={inputs[i]}
                                    status={inputStatus}
                                    ref={el => { inputRefs.current[i] = el }}
                                    onChange={(e) => onInput(i, e)}
                                    onBack={() => handleBack(i)}
                                    disabled={inputStatus === "correct"}
                                />
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-center gap-4">
                    <Button
                        variant="outline"
                        onClick={giveHint}
                        disabled={inputStatus === "correct"}
                        className="gap-2"
                    >
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        Hint
                    </Button>

                    {currentCard.examples && currentCard.examples.length > 0 && (
                        <Button
                            variant="outline"
                            onClick={() => setShowExamples(true)}
                            className="gap-2"
                        >
                            <BookOpen className="h-4 w-4 text-blue-500" />
                            Examples
                        </Button>
                    )}
                </div>

                <ExamplesModal
                    open={showExamples}
                    onOpenChange={setShowExamples}
                    examples={currentCard.examples || []}
                />
            </div>

            <div className="h-8 flex items-center justify-center">
                {inputStatus === "incorrect" && (
                    <div className="flex items-center gap-2 text-destructive font-medium animate-in fade-in slide-in-from-bottom-2">
                        <XCircle className="h-5 w-5" />
                        Try again
                    </div>
                )}
                {inputStatus === "correct" && (
                    <div className="flex items-center gap-2 text-green-600 font-medium animate-in fade-in slide-in-from-bottom-2">
                        <CheckCircle2 className="h-5 w-5" />
                        Correct!
                    </div>
                )}
            </div>
        </div >
    );
}
