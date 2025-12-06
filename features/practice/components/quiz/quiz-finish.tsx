"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, RotateCcw, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { addXP, updateStreak, incrementQuizCompleted } from "@/features/gamification/services/stats";
import { checkAndAwardAchievements } from "@/features/gamification/services/achievements";
import { toast } from "sonner";

type QuizFinishProps = {
    score: number;
    questions: { length: number };
    setId: string;
    userId: string;
    restartQuiz: () => void;
}

export function QuizFinish({ score, questions, setId, userId, restartQuiz }: QuizFinishProps) {
    useEffect(() => {
        async function rewardCompletion() {
            const isPerfect = score === questions.length;
            const baseXp = 20;
            const bonusXp = isPerfect ? 10 : 0;
            const totalXp = baseXp + bonusXp;

            const { leveledUp, newLevel } = await addXP(userId, totalXp);
            await updateStreak(userId);
            await incrementQuizCompleted(userId);
            const newAchievements = await checkAndAwardAchievements(userId);

            if (leveledUp) {
                toast.success(`Level Up! You're now level ${newLevel}! 🎉`);
            }

            if (newAchievements.length > 0) {
                newAchievements.forEach(achievement => {
                    toast.success(`Achievement Unlocked: ${achievement.name}! ${achievement.icon}`);
                });
            }

            toast.success(`+${totalXp} XP earned!`);
        }

        rewardCompletion();
    }, [userId, score, questions.length]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-8">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold">Way to go! You&apos;ve reviewed all the cards.</h2>
                <div className="flex items-center justify-center gap-8">
                    <div className="relative h-32 w-32 flex items-center justify-center">
                        <div className="absolute inset-0 rounded-full border-8 border-muted" />
                        <div className="absolute inset-0 rounded-full border-8 border-primary" style={{ clipPath: `inset(0 ${100 - (score / questions.length) * 100}% 0 0)` }} />
                        <div className="text-2xl font-bold">{Math.round((score / questions.length) * 100)}%</div>
                    </div>
                    <div className="text-left space-y-2">
                        <div className="flex items-center gap-2 text-green-500">
                            <CheckCircle className="h-5 w-5" />
                            <span className="font-semibold">Correct: {score}</span>
                        </div>
                        <div className="flex items-center gap-2 text-red-500">
                            <XCircle className="h-5 w-5" />
                            <span className="font-semibold">Incorrect: {questions.length - score}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-md">
                <Button size="lg" className="w-full" onClick={restartQuiz}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Restart Quiz
                </Button>
                <Link href={`/practice/${setId}`}>
                    <Button variant="outline" size="lg" className="w-full">
                        Back to Set
                    </Button>
                </Link>
            </div>
        </div>
    )
}

