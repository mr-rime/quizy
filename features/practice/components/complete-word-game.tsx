"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, useMemo, useCallback, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Lightbulb, CheckCircle2, XCircle, BookOpen, Timer, Infinity, Loader2 } from "lucide-react";
import { ExamplesModal } from "./examples-modal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { OptimizedImage } from "@/components/optimized-image";
import { useSoundEffects } from "@/shared/hooks/use-sound-effects";
import { useAutoPlayAudio } from "@/features/practice/hooks/use-auto-play-audio";
import { Card } from "@/components/ui/card";
import { LanguageSelector } from "./language-selector";

interface Flashcard {
    id: string;
    term: string;
    definition: string | null;
    imageUrl: string | null;
    examples?: { english: string; arabic: string }[] | null;
    wordType?: string | null;
}

interface CompleteWordGameProps {
    cards: Flashcard[];
    setId: string;
    setTitle: string;
    playAudioOnProgress?: boolean;
    category?: string;
}

type GameMode = "timed" | "untimed" | null;

const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const createPartialWord = (word: string): { partial: string; hiddenIndices: number[] } => {
    const letterIndices: number[] = [];
    word.split("").forEach((char, i) => {
        if (char.trim() !== "" && char !== " ") {
            letterIndices.push(i);
        }
    });

    const numLetters = letterIndices.length;
    const minVisible = Math.ceil(numLetters * 0.3);
    const maxHidden = numLetters - minVisible;
    const numToHide = Math.max(1, Math.floor(Math.random() * maxHidden) + 1);

    const shuffledLetterIndices = shuffleArray(letterIndices);
    const hiddenIndices = shuffledLetterIndices.slice(0, numToHide).sort((a, b) => a - b);

    const partial = word
        .split("")
        .map((char, i) => {
            if (char === " " || char.trim() === "") return char;
            return hiddenIndices.includes(i) ? "_" : char;
        })
        .join("");

    return { partial, hiddenIndices };
};

const ModeSelection = memo(({ onSelectMode }: { onSelectMode: (mode: GameMode) => void }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 p-4 max-w-4xl mx-auto w-full animate-in fade-in zoom-in duration-500">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    Choose Your Mode
                </h2>
                <p className="text-muted-foreground text-lg">
                    How would you like to practice?
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-2xl">
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Card
                        className="p-8 cursor-pointer hover:bg-accent transition-colors border-2 hover:border-primary h-full"
                        onClick={() => onSelectMode("timed")}
                    >
                        <div className="flex flex-col items-center gap-4 text-center h-full justify-center">
                            <div className="p-4 rounded-full bg-primary/10 text-primary">
                                <Timer className="h-10 w-10" />
                            </div>
                            <h3 className="text-2xl font-bold">Timed Mode</h3>
                            <p className="text-muted-foreground">
                                15 seconds per word. Challenge yourself with time pressure!
                            </p>
                        </div>
                    </Card>
                </motion.div>

                <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Card
                        className="p-8 cursor-pointer hover:bg-accent transition-colors border-2 hover:border-primary h-full"
                        onClick={() => onSelectMode("untimed")}
                    >
                        <div className="flex flex-col items-center gap-4 text-center h-full justify-center">
                            <div className="p-4 rounded-full bg-primary/10 text-primary">
                                <Infinity className="h-10 w-10" />
                            </div>
                            <h3 className="text-2xl font-bold">Untimed Mode</h3>
                            <p className="text-muted-foreground">
                                Take your time. No pressure, just learning!
                            </p>
                        </div>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
});

ModeSelection.displayName = "ModeSelection";

// Separated Timer Component to prevent re-renders of the parent
const GameTimer = memo(({
    duration,
    onTimeUp,
    isActive,
    isPaused
}: {
    duration: number;
    onTimeUp: () => void;
    isActive: boolean;
    isPaused: boolean;
}) => {
    const [timeLeft, setTimeLeft] = useState(duration);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Reset timer when duration changes (new card)
        setTimeLeft(duration);
    }, [duration]);

    useEffect(() => {
        if (isActive && timeLeft > 0 && !isPaused) {
            timerRef.current = setTimeout(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isActive) {
            onTimeUp();
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isActive, timeLeft, isPaused, onTimeUp]);

    return (
        <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg border-2 font-bold text-lg transition-colors",
            timeLeft <= 5 ? "border-red-500 bg-red-50 text-red-600 animate-pulse" : "border-primary bg-primary/10 text-primary"
        )}>
            <Timer className="h-5 w-5" />
            <span>{timeLeft}s</span>
        </div>
    );
});
GameTimer.displayName = "GameTimer";

const ActiveGameCard = memo(({
    card,
    mode,
    onNext,
    category,
}: {
    card: Flashcard;
    mode: "timed" | "untimed";
    onNext: () => void;
    category?: string;
}) => {
    const [inputValue, setInputValue] = useState("");
    const [inputStatus, setInputStatus] = useState<"idle" | "correct" | "incorrect">("idle");
    const [showExamples, setShowExamples] = useState(false);
    const [isTimerActive, setIsTimerActive] = useState(mode === "timed");
    const [isPaused, setIsPaused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { playCorrect, playIncorrect } = useSoundEffects();
    const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>();
    const [translatedDefinition, setTranslatedDefinition] = useState<string>("");
    const [isTranslating, setIsTranslating] = useState(false);

    const answer = card.term;

    const partialWordData = useMemo(() => {
        return createPartialWord(card.term);
    }, [card.term]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsPaused(document.hidden);
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    // Initial focus only
    useEffect(() => {
        const timer = setTimeout(() => {
            inputRef.current?.focus();
        }, 100);
        return () => clearTimeout(timer);
    }, [card.id]);

    const handleTimeUp = useCallback(() => {
        setIsTimerActive(false);
        setInputStatus("incorrect");
        setInputValue(answer);
        playIncorrect();
        toast.error("Time's up!");

        setTimeout(() => {
            onNext();
        }, 2000);
    }, [answer, playIncorrect, onNext]);

    const handleCorrect = useCallback(() => {
        setInputStatus("correct");
        setIsTimerActive(false);
        playCorrect();

        const end = Date.now() + 1000;
        const colors = ['#bb0000', '#ffffff'];

        (function frame() {
            confetti({
                particleCount: 2,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 2,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());

        setTimeout(() => {
            onNext();
        }, 1500);
    }, [playCorrect, onNext]);

    const checkSubmission = useCallback((value: string) => {
        if (value.toLowerCase().trim() === answer.toLowerCase().trim()) {
            handleCorrect();
        } else {
            if (value.length >= answer.length) {
                setInputStatus("incorrect");
                playIncorrect();
            }
        }
    }, [answer, handleCorrect, playIncorrect]);

    const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);

        // Reset status when user starts typing again after error
        if (inputStatus === "incorrect" && val.length < answer.length) {
            setInputStatus("idle");
        }

        if (val.length >= answer.length) {
            checkSubmission(val);
        }
    }, [answer.length, checkSubmission, inputStatus]);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        checkSubmission(inputValue);
    }, [inputValue, checkSubmission]);

    const giveHint = useCallback(() => {
        let firstMismatch = -1;
        for (let i = 0; i < answer.length; i++) {
            if (inputValue[i]?.toLowerCase() !== answer[i]?.toLowerCase()) {
                firstMismatch = i;
                break;
            }
        }

        if (firstMismatch === -1 && inputValue.length < answer.length) {
            firstMismatch = inputValue.length;
        }

        if (firstMismatch !== -1) {
            const nextChar = answer[firstMismatch];
            const correctPrefix = answer.slice(0, firstMismatch);
            const newValue = correctPrefix + nextChar;
            setInputValue(newValue);

            inputRef.current?.focus();

            if (newValue.length === answer.length) {
                checkSubmission(newValue);
            }
        }
    }, [answer, inputValue, checkSubmission]);

    const handleSelectLanguage = async (languageCode: string, languageName: string) => {
        if (!card.definition) return;

        setSelectedLanguage(languageCode);
        setIsTranslating(true);
        setTranslatedDefinition("");

        try {
            const response = await fetch(
                `/api/translate?text=${encodeURIComponent(card.definition)}&lang=${languageCode}&source=auto`
            );

            if (!response.ok) {
                throw new Error("Translation failed");
            }

            const data = await response.json();
            if (data.translatedText) {
                setTranslatedDefinition(data.translatedText);
            }
        } catch (error) {
            console.error("Translation error:", error);
            setTranslatedDefinition("Translation failed. Please try again.");
        } finally {
            setIsTranslating(false);
        }
    };

    // Clear translations when moving to next word
    useEffect(() => {
        setSelectedLanguage(undefined);
        setTranslatedDefinition("");
        setIsTranslating(false);
        setInputValue("");
        setInputStatus("idle");
        setIsTimerActive(mode === "timed");
    }, [card.id, mode]);

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto min-h-[50vh] justify-start py-4 sm:py-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="flex items-center gap-4 w-full justify-between sm:justify-end px-4 mb-8">
                {category === "english" && (
                    <LanguageSelector
                        onSelectLanguage={handleSelectLanguage}
                        selectedLanguage={selectedLanguage}
                    />
                )}
                {mode === "timed" && (
                    <GameTimer
                        duration={15}
                        onTimeUp={handleTimeUp}
                        isActive={isTimerActive}
                        isPaused={isPaused}
                    />
                )}
            </div>

            <div className="text-center space-y-6 w-full px-2 sm:px-0">
                <div className="text-4xl sm:text-6xl font-mono font-bold tracking-widest text-primary mb-8 break-all">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={card.id + "word"}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="flex flex-wrap justify-center gap-1"
                        >
                            {(mode === "timed" && !isTimerActive && inputStatus === "incorrect" ? answer : partialWordData.partial).split("").map((char, i) => (
                                <span key={i} className={char === "_" ? "text-muted-foreground" : ""}>
                                    {char}
                                </span>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {card.definition && (
                    <div className="mb-4 px-4">
                        <p className="text-lg text-muted-foreground">{card.definition}</p>
                        {isTranslating && (
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Translating...</span>
                            </div>
                        )}
                        {!isTranslating && translatedDefinition && (
                            <div className="text-base text-muted-foreground italic mt-2 animate-in fade-in">
                                {translatedDefinition}
                            </div>
                        )}
                    </div>
                )}

                {card.wordType && (
                    <div className="text-xl font-serif text-muted-foreground italic mb-4">
                        ({card.wordType})
                    </div>
                )}

                <div className="min-h-[200px] w-full flex items-center justify-center mb-6">
                    {card.imageUrl ? (
                        <div className="relative w-full max-w-sm mx-auto aspect-video rounded-lg overflow-hidden border bg-muted/20 flex justify-center items-center shadow-sm">
                            <OptimizedImage
                                src={card.imageUrl}
                                alt="Hint"
                                className="object-cover"
                                width={400}
                                height={300}
                                priority
                            />
                        </div>
                    ) : null}
                </div>

                <div className="flex flex-wrap justify-center gap-2 sm:gap-4 my-8 w-full">
                    <form onSubmit={handleSubmit} className="w-full max-w-md px-4">
                        <motion.div
                            animate={inputStatus === "incorrect" ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                            transition={{ duration: 0.4 }}
                        >
                            <Input
                                ref={inputRef}
                                value={inputValue}
                                onChange={onInputChange}
                                placeholder="Type the complete word..."
                                className={cn(
                                    "text-center text-lg h-14 transition-all shadow-sm",
                                    inputStatus === "correct" && "border-green-500 bg-green-50 text-green-700 ring-2 ring-green-500/20",
                                    inputStatus === "incorrect" && "border-red-500 bg-red-50 text-red-700 ring-2 ring-red-500/20"
                                )}
                                disabled={inputStatus === "correct" || (mode === "timed" && !isTimerActive && inputStatus === "incorrect")}
                                autoCorrect="off"
                                autoComplete="off"
                                autoCapitalize="off"
                                enterKeyHint="done"
                            />
                        </motion.div>
                    </form>
                </div>

                <div className="flex justify-center gap-4 px-4 pb-8">
                    <Button
                        variant="outline"
                        onClick={giveHint}
                        disabled={inputStatus === "correct" || (mode === "timed" && !isTimerActive)}
                        className="gap-2 flex-1 sm:flex-none h-12"
                    >
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        Hint
                    </Button>

                    {card.examples && card.examples.length > 0 && (
                        <Button
                            variant="outline"
                            onClick={() => setShowExamples(true)}
                            className="gap-2 flex-1 sm:flex-none h-12"
                        >
                            <BookOpen className="h-4 w-4 text-blue-500" />
                            Examples
                        </Button>
                    )}
                </div>

                <ExamplesModal
                    open={showExamples}
                    onOpenChange={setShowExamples}
                    examples={card.examples || []}
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
        </div>
    );
});
ActiveGameCard.displayName = "ActiveGameCard";

export const CompleteWordGame = memo(function CompleteWordGame({ cards, setId, setTitle, playAudioOnProgress = false, category }: CompleteWordGameProps) {
    const router = useRouter();
    const [mode, setMode] = useState<GameMode>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [shuffledCards, setShuffledCards] = useState<Flashcard[]>([]);

    const currentCard = shuffledCards[currentIndex];
    const nextCard = shuffledCards[currentIndex + 1];

    const { playIfEnabled } = useAutoPlayAudio(playAudioOnProgress, nextCard?.term || "");

    const handleModeSelect = useCallback((selectedMode: GameMode) => {
        setShuffledCards(shuffleArray(cards));
        setMode(selectedMode);
    }, [cards]);

    const handleNext = useCallback(() => {
        if (currentIndex < shuffledCards.length - 1) {
            playIfEnabled();
            setCurrentIndex(prev => prev + 1);
        } else {
            toast.success("Set completed!");
            router.push(`/practice/${setId}`);
        }
    }, [currentIndex, shuffledCards.length, playIfEnabled, router, setId]);

    if (!mode) {
        return <ModeSelection onSelectMode={handleModeSelect} />;
    }

    if (!currentCard) return null;

    return (
        <div className="flex flex-col items-center justify-start min-h-[100dvh] w-full bg-background">
            {nextCard?.imageUrl && (
                <link rel="preload" as="image" href={nextCard.imageUrl} />
            )}

            <div className="bg-background/80 backdrop-blur-sm sticky top-0 z-10 w-full border-b">
                <div className="max-w-4xl mx-auto p-4 flex items-center gap-4 justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                        <div className="text-left">
                            <h1 className="text-xl sm:text-3xl font-bold truncate max-w-[200px] sm:max-w-md">{setTitle}</h1>
                            <p className="text-sm text-muted-foreground">{currentIndex + 1} / {shuffledCards.length} terms</p>
                        </div>
                    </div>
                    {/* Placeholder for header actions if needed */}
                </div>
            </div>

            <ActiveGameCard
                key={currentCard.id}
                card={currentCard}
                mode={mode}
                onNext={handleNext}
                category={category}
            />
        </div>
    );
});
