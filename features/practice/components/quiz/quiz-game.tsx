"use client"

import { motion, AnimatePresence } from "framer-motion";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Volume2, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { QuizFinish } from "./quiz-finish";
import { QuizSkeleton } from "./quiz-skeleton";
import { ImageZoomModal } from "@/components/image-zoom-modal";
import { ExamplesModal } from "../examples-modal";
import { OptimizedImage } from "@/components/optimized-image";
import { saveProgress, getProgressForSet, deleteProgressBySet } from "../../services/progress";
import { useSpeech } from "../../hooks/use-speech";

interface Flashcard {
    id: string;
    term: string;
    definition: string | null;
    imageUrl: string | null;
    examples?: { english: string; arabic: string }[] | null;
}

interface QuizGameProps {
    cards: Flashcard[];
    setId: string;
    userId: string;
}

interface Question {
    card: Flashcard;
    options: Flashcard[];
    correctOptionId: string;
}

export function QuizGame({ cards, setId, userId }: QuizGameProps) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [isZoomOpen, setIsZoomOpen] = useState(false);
    const [showExamples, setShowExamples] = useState(false);
    const [isLoadingProgress, setIsLoadingProgress] = useState(true);
    const [hasInitialized, setHasInitialized] = useState(false);
    const { speak } = useSpeech();

    const correctAudio = typeof window !== 'undefined' ? new Audio('/audio/correct-choice.mp3') : null;
    const incorrectAudio = typeof window !== 'undefined' ? new Audio('/audio/incorrect-choice.mp3') : null;

    useEffect(() => {
        if (hasInitialized) return;

        const generatedQuestions = cards.map(card => {
            const otherCards = cards.filter(c => c.id !== card.id);
            const distractors = otherCards.sort(() => Math.random() - 0.5).slice(0, 3);
            const options = [card, ...distractors].sort(() => Math.random() - 0.5);

            return {
                card,
                options,
                correctOptionId: card.id
            };
        });

        setQuestions(generatedQuestions);
        setHasInitialized(true);
    }, [cards, hasInitialized]);

    useEffect(() => {
        if (!hasInitialized || questions.length === 0) return;

        async function loadProgress() {
            try {
                const progress = await getProgressForSet(userId, setId, "quiz");
                if (progress && progress.currentIndex < questions.length) {
                    setCurrentIndex(progress.currentIndex);
                    setScore(progress.score ?? 0);
                }
            } catch (error) {
                console.error("Error loading progress:", error);
            } finally {
                setIsLoadingProgress(false);
            }
        }

        loadProgress();
    }, [hasInitialized, questions.length, userId, setId]);

    const handleAnswer = async (optionId: string) => {
        if (selectedOptionId) return;

        setSelectedOptionId(optionId);
        const currentQuestion = questions[currentIndex];
        const correct = optionId === currentQuestion.correctOptionId;

        setIsCorrect(correct);

        const newScore = correct ? score + 1 : score;
        if (correct) {
            setScore(newScore);
            correctAudio?.play().catch(err => console.error('Error playing correct sound:', err));
        } else {
            incorrectAudio?.play().catch(err => console.error('Error playing incorrect sound:', err));
        }

        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                const nextIndex = currentIndex + 1;

                setCurrentIndex(nextIndex);
                setSelectedOptionId(null);
                setIsCorrect(null);

                saveProgress({
                    userId,
                    setId,
                    mode: "quiz",
                    currentIndex: nextIndex,
                    totalQuestions: questions.length,
                    score: newScore,
                }).catch(error => {
                    console.error("Error saving progress:", error);
                });
            } else {
                setIsFinished(true);

                deleteProgressBySet(userId, setId, "quiz").catch(error => {
                    console.error("Error deleting progress:", error);
                });

                confetti({
                    particleCount: 100,
                    spread: 70,
                    origin: { y: 0.6 }
                });
            }
        }, 1500);
    };

    const restartQuiz = () => {
        setCurrentIndex(0);
        setSelectedOptionId(null);
        setIsCorrect(null);
        setScore(0);
        setIsFinished(false);
    };



    const handleImageClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsZoomOpen(true);
    };

    if (questions.length === 0 || isLoadingProgress) return <QuizSkeleton />;

    if (isFinished) {
        return (
            <QuizFinish
                score={score}
                questions={questions}
                setId={setId}
                userId={userId}
                restartQuiz={restartQuiz}
            />
        );
    }

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex) / questions.length) * 100;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6 sm:gap-8 max-w-3xl mx-auto"
            >
                <div className="flex items-center gap-3 sm:gap-4">
                    <div className="bg-green-600 text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-bold text-xs sm:text-sm">
                        {score}
                    </div>
                    <Progress value={progress} className="h-2 sm:h-3" />
                    <div className="bg-muted text-muted-foreground rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center font-bold text-xs sm:text-sm">
                        {questions.length - currentIndex}
                    </div>
                </div>

                <Card className="p-4 sm:p-8 lg:p-12 flex flex-col items-center justify-center text-center gap-3 sm:gap-4 lg:gap-6 relative">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 sm:top-4 right-2 sm:right-4 h-10 w-10 sm:h-11 sm:w-11"
                        onClick={() => speak(currentQuestion.card.term)}
                    >
                        <Volume2 className="h-5 w-5 sm:h-6 sm:w-6" />
                    </Button>
                    {currentQuestion.card.examples && currentQuestion.card.examples.length > 0 && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 sm:top-4 left-2 sm:left-4 h-10 w-10 sm:h-11 sm:w-11"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowExamples(true);
                            }}
                        >
                            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
                        </Button>
                    )}
                    <div className="text-xs sm:text-sm text-muted-foreground uppercase tracking-wider">Term</div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold px-2">{currentQuestion.card.term}</h2>
                    {currentQuestion.card.imageUrl && (
                        <div className="relative w-full max-w-md max-h-32 sm:max-h-40 lg:max-h-48 flex items-center justify-center mt-2">
                            <OptimizedImage
                                key={currentQuestion.card.imageUrl}
                                src={currentQuestion.card.imageUrl}
                                alt={currentQuestion.card.term}
                                width={200}
                                height={150}
                                className="max-w-full max-h-32 sm:max-h-40 lg:max-h-48 object-contain rounded-lg cursor-zoom-in hover:opacity-90 transition-opacity shadow-md"
                                onClick={handleImageClick}
                            />
                        </div>
                    )}
                </Card>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {currentQuestion.options.map((option, index) => {
                        const isSelected = selectedOptionId === option.id;
                        const isCorrectOption = option.id === currentQuestion.correctOptionId;
                        return (
                            <motion.div
                                key={option.id}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                animate={
                                    isSelected && !isCorrect
                                        ? { x: [0, -10, 10, -10, 10, 0] }
                                        : {}
                                }
                                transition={{ duration: 0.4 }}
                            >
                                <Button
                                    variant="outline"
                                    className={cn(
                                        "w-full h-auto min-h-11 py-3 sm:py-5 lg:py-6 text-sm sm:text-base sm:text-lg justify-start px-3 sm:px-6 relative overflow-hidden transition-all whitespace-normal text-left",
                                        selectedOptionId && isCorrectOption && "border-green-500 bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 hover:bg-green-50 dark:hover:bg-green-950 hover:text-green-700 dark:hover:text-green-300",
                                        selectedOptionId && isSelected && !isCorrect && "border-red-500 bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-950 hover:text-red-700 dark:hover:text-red-300",
                                        !selectedOptionId && "hover:border-primary/50"
                                    )}
                                    onClick={() => handleAnswer(option.id)}
                                    disabled={!!selectedOptionId}
                                >
                                    <span className="mr-3 sm:mr-4 opacity-50 font-mono text-sm sm:text-base">{index + 1}</span>
                                    <span className="flex-1 text-left wrap-break-word">{option.definition || "No definition"}</span>

                                    {selectedOptionId && isCorrectOption && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                        >
                                            <CheckCircle className="shrink-0 ml-2 h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                                        </motion.div>
                                    )}
                                    {selectedOptionId && isSelected && !isCorrect && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                        >
                                            <XCircle className="shrink-0 ml-2 h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                                        </motion.div>
                                    )}
                                </Button>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            <ImageZoomModal
                imageUrl={currentQuestion.card.imageUrl}
                alt={currentQuestion.card.term}
                open={isZoomOpen}
                onOpenChange={setIsZoomOpen}
            />
            <ExamplesModal
                open={showExamples}
                onOpenChange={setShowExamples}
                examples={currentQuestion.card.examples || []}
            />
        </AnimatePresence>
    );
}
