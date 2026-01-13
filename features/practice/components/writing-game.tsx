"use client";

import { motion } from "framer-motion";

import { useState, useEffect, useRef, useEffectEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Lightbulb, CheckCircle2, XCircle, BookOpen, Loader2 } from "lucide-react";
import { ExamplesModal } from "./examples-modal";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/optimized-image";
import { useSoundEffects } from "@/shared/hooks/use-sound-effects";
import { useAutoPlayAudio } from "@/features/practice/hooks/use-auto-play-audio";
import { LanguageSelector } from "./language-selector";

interface Flashcard {
    id: string;
    term: string;
    definition: string | null;
    imageUrl: string | null;
    examples?: { english: string; arabic: string }[] | null;
    wordType?: string | null;
}

interface WritingGameProps {
    cards: Flashcard[];
    setId: string;
    setTitle: string;
    playAudioOnProgress?: boolean;
    category?: string;
}

export function WritingGame({ cards, setId, setTitle, playAudioOnProgress = false, category }: WritingGameProps) {
    const router = useRouter();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [inputValue, setInputValue] = useState("");
    const [inputStatus, setInputStatus] = useState<"idle" | "correct" | "incorrect">("idle");
    const [showExamples, setShowExamples] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const { playCorrect, playIncorrect } = useSoundEffects();
    const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>();
    const [translatedDefinition, setTranslatedDefinition] = useState<string>("");
    const [isTranslating, setIsTranslating] = useState(false);

    const currentCard = cards[currentIndex];
    const nextCard = cards[currentIndex + 1];
    const answer = currentCard?.term || "";

    const { playIfEnabled } = useAutoPlayAudio(playAudioOnProgress, nextCard?.term || "");

    const setInputValueEvent = useEffectEvent(setInputValue);
    const setInputStatusEvent = useEffectEvent(setInputStatus);

    useEffect(() => {
        if (currentCard) {
            setInputValueEvent("");
            setInputStatusEvent("idle");

            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [currentIndex, currentCard]);

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setInputValue(val);

        if (val.length >= answer.length) {
            checkSubmission(val);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        checkSubmission(inputValue);
    };

    const handleBlur = (e: React.FocusEvent) => {
        const relatedTarget = e.relatedTarget as HTMLElement;

        if (relatedTarget && (
            relatedTarget.tagName === 'BUTTON' ||
            relatedTarget.closest('button') ||
            relatedTarget.closest('[role="dialog"]')
        )) return;

        setTimeout(() => {
            inputRef.current?.focus();
        }, 10);
    };



    const checkSubmission = (value: string) => {
        if (value.toLowerCase().trim() === answer.toLowerCase().trim()) {
            handleCorrect();
        } else {
            if (value.length >= answer.length) {
                setInputStatus("incorrect");
                playIncorrect();
            }
        }
    };

    const handleCorrect = () => {
        setInputStatus("correct");
        playCorrect();


        setTimeout(() => {
            if (currentIndex < cards.length - 1) {
                playIfEnabled();
                setCurrentIndex(prev => prev + 1);
            } else {
                toast.success("Set completed!");
                router.push(`/practice/${setId}`);
            }
        }, 1500);
    };

    const giveHint = () => {
        // Find the first index where the input doesn't match the answer
        let firstMismatch = -1;
        for (let i = 0; i < answer.length; i++) {
            if (inputValue[i]?.toLowerCase() !== answer[i]?.toLowerCase()) {
                firstMismatch = i;
                break;
            }
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
    };

    const handleSelectLanguage = async (languageCode: string, languageName: string) => {
        if (!currentCard.definition) return;

        setSelectedLanguage(languageCode);
        setIsTranslating(true);
        setTranslatedDefinition("");

        try {
            const response = await fetch(
                `/api/translate?text=${encodeURIComponent(currentCard.definition)}&lang=${languageCode}&source=auto`
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

    useEffect(() => {
        setSelectedLanguage(undefined);
        setTranslatedDefinition("");
        setIsTranslating(false);
    }, [currentIndex]);

    if (!currentCard) return null;

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-8 p-4 max-w-4xl mx-auto w-full">
            {nextCard?.imageUrl && (
                <link rel="preload" as="image" href={nextCard.imageUrl} />
            )}

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
                <div className="flex items-center justify-center gap-4">
                    {category === "english" && (
                        <LanguageSelector
                            onSelectLanguage={handleSelectLanguage}
                            selectedLanguage={selectedLanguage}
                        />
                    )}
                </div>
                <h2 className="text-3xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {currentCard.definition || "What's the term?"}
                </h2>
                {isTranslating && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Translating...</span>
                    </div>
                )}
                {!isTranslating && translatedDefinition && (
                    <div className="text-xl text-muted-foreground italic">
                        {translatedDefinition}
                    </div>
                )}
                {currentCard.wordType && (
                    <div className="text-xl font-serif text-muted-foreground italic mt-2">
                        ({currentCard.wordType})
                    </div>
                )}

                <div className="h-[200px] w-full flex items-center justify-center">
                    {currentCard.imageUrl ? (
                        <div className="relative w-full max-w-md mx-auto aspect-video rounded-lg overflow-hidden border flex justify-center items-center h-full">
                            <OptimizedImage
                                src={currentCard.imageUrl}
                                alt="Hint"
                                className="object-cover "
                                width={200}
                                height={200}
                                preload
                            />
                        </div>
                    ) : null}
                </div>

                <div className="flex flex-wrap justify-center gap-2 sm:gap-4 my-8">
                    <form onSubmit={handleSubmit} className="w-full max-w-md px-4">
                        <motion.div
                            animate={inputStatus === "incorrect" ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                            transition={{ duration: 0.4 }}
                        >
                            <Input
                                ref={inputRef}
                                value={inputValue}
                                onChange={onInputChange}
                                placeholder="Type the answer..."
                                className={cn(
                                    "text-center text-lg h-12 transition-all",
                                    inputStatus === "correct" && "border-green-500 bg-green-50 text-green-700 ring-2 ring-green-500/20",
                                    inputStatus === "incorrect" && "border-red-500 bg-red-50 text-red-700 ring-2 ring-red-500/20"
                                )}
                                disabled={inputStatus === "correct"}
                                autoCorrect="off"
                                autoComplete="off"
                                autoCapitalize="off"
                                onBlur={handleBlur}
                            />
                        </motion.div>
                    </form>
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
