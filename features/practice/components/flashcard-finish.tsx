"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle, RotateCcw } from "lucide-react";
import { useEffect, useRef } from "react";
import { addXP, updateStreak, incrementFlashcardCompleted } from "@/features/gamification/services/stats";
import { checkAndAwardAchievements } from "@/features/gamification/services/achievements";
import { toast } from "sonner";
import confetti from "canvas-confetti";

type FlashcardFinishProps = {
    cardsLength: number;
    setId: string;
    userId: string;
    restartPractice: () => void;
}

export function FlashcardFinish({ cardsLength, userId, restartPractice }: FlashcardFinishProps) {
    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        async function rewardCompletion() {
            const baseXp = 15;

            const { leveledUp, newLevel } = await addXP(userId, baseXp);
            await updateStreak(userId);
            await incrementFlashcardCompleted(userId);
            const newAchievements = await checkAndAwardAchievements(userId);

            if (leveledUp) {
                toast.success(`Level Up! You're now level ${newLevel}! 🎉`);
            }

            if (newAchievements.length > 0) {
                newAchievements.forEach(achievement => {
                    toast.success(`Achievement Unlocked: ${achievement.name}! ${achievement.icon}`);
                });
            }

            toast.success(`+${baseXp} XP earned!`);

            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }

        rewardCompletion();
    }, [userId, cardsLength]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] gap-8">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold">Set Completed!</h2>
                <div className="text-muted-foreground text-lg">
                    You&apos;ve reviewed all {cardsLength} cards in this set.
                </div>

                <div className="flex items-center justify-center text-green-500 gap-2 mt-4">
                    <CheckCircle className="h-6 w-6" />
                    <span className="font-semibold text-lg">All Cards Reviewed</span>
                </div>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-md mt-6">
                <Button size="lg" className="w-full" onClick={restartPractice}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Restart Flashcards
                </Button>
                <Button variant="outline" size="lg" className="w-full" onClick={() => window.history.back()}>
                    Back to Set
                </Button>
            </div>
        </div>
    )
}
