"use client"

import { useState, useEffect, useEffectEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, XCircle, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import confetti from "canvas-confetti";
import { QuizFinish } from "./quiz-finish";

interface Flashcard {
    id: string;
    term: string;
    definition: string | null;
    imageUrl: string | null;
}

interface QuizGameProps {
    cards: Flashcard[];
    setId: string;
}

interface Question {
    card: Flashcard;
    options: Flashcard[];
    correctOptionId: string;
}

export function QuizGame({ cards, setId }: QuizGameProps) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    const setGeneratedQuestions = useEffectEvent(setQuestions)

    useEffect(() => {
        // if (cards.length < 4) {
        //     // Not enough cards for a quiz with 4 options
        //     // In a real app, handle this gracefully. For now, we proceed with what we have or duplicate.
        // }

        const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
        const generatedQuestions = shuffledCards.map(card => {
            const otherCards = cards.filter(c => c.id !== card.id);
            const distractors = otherCards.sort(() => Math.random() - 0.5).slice(0, 3);
            const options = [card, ...distractors].sort(() => Math.random() - 0.5);

            return {
                card,
                options,
                correctOptionId: card.id
            };
        });

        setGeneratedQuestions(generatedQuestions);
    }, [cards]);

    const handleAnswer = (optionId: string) => {
        if (selectedOptionId) return;

        setSelectedOptionId(optionId);
        const currentQuestion = questions[currentIndex];
        const correct = optionId === currentQuestion.correctOptionId;

        setIsCorrect(correct);
        if (correct) {
            setScore(prev => prev + 1);
        }

        setTimeout(() => {
            if (currentIndex < questions.length - 1) {
                setCurrentIndex(prev => prev + 1);
                setSelectedOptionId(null);
                setIsCorrect(null);
            } else {
                setIsFinished(true);
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

    const handleSpeak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    };

    if (questions.length === 0) return <div>Loading quiz...</div>;

    if (isFinished) {
        return (
            <QuizFinish
                score={score}
                questions={questions}
                setId={setId}
                restartQuiz={restartQuiz}
            />
        );
    }

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex) / questions.length) * 100;

    return (
        <div className="flex flex-col gap-8 max-w-3xl mx-auto">
            <div className="flex items-center gap-4">
                <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    {score}
                </div>
                <Progress value={progress} className="h-3" />
                <div className="bg-muted text-muted-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                    {questions.length - currentIndex}
                </div>
            </div>

            <Card className="p-12 min-h-[300px] flex flex-col items-center justify-center text-center gap-6 relative">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4"
                    onClick={() => handleSpeak(currentQuestion.card.term)}
                >
                    <Volume2 className="h-6 w-6" />
                </Button>
                <div className="text-sm text-muted-foreground uppercase tracking-wider">Term</div>
                <h2 className="text-4xl font-bold">{currentQuestion.card.term}</h2>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => {
                    const isSelected = selectedOptionId === option.id;
                    const isCorrectOption = option.id === currentQuestion.correctOptionId;
                    return (
                        <Button
                            key={option.id}
                            variant="outline"
                            className={cn(
                                "h-auto py-6 text-lg justify-start px-6 relative overflow-hidden transition-all",
                                selectedOptionId && isCorrectOption && "border-green-500 bg-green-50 text-green-700 hover:bg-green-50 hover:text-green-700",
                                selectedOptionId && isSelected && !isCorrect && "border-red-500 bg-red-50 text-red-700 hover:bg-red-50 hover:text-red-700",
                                !selectedOptionId && "hover:border-primary/50"
                            )}
                            onClick={() => handleAnswer(option.id)}
                            disabled={!!selectedOptionId}
                        >
                            <span className="mr-4 opacity-50 font-mono">{index + 1}</span>
                            <span className="truncate">{option.definition || "No definition"}</span>

                            {selectedOptionId && isCorrectOption && (
                                <CheckCircle className="absolute right-4 h-5 w-5 text-green-600" />
                            )}
                            {selectedOptionId && isSelected && !isCorrect && (
                                <XCircle className="absolute right-4 h-5 w-5 text-red-600" />
                            )}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
