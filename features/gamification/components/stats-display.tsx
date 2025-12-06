import { Progress } from "@/components/ui/progress";
import { Flame } from "lucide-react";

interface StatsDisplayProps {
    level: number;
    totalXp: number;
    currentStreak: number;
}

export function StatsDisplay({ level, totalXp, currentStreak }: StatsDisplayProps) {
    const xpForCurrentLevel = Math.pow(level - 1, 2) * 50;
    const xpForNextLevel = Math.pow(level, 2) * 50;
    const xpInCurrentLevel = totalXp - xpForCurrentLevel;
    const xpNeededForLevel = xpForNextLevel - xpForCurrentLevel;
    const progressPercent = (xpInCurrentLevel / xpNeededForLevel) * 100;

    return (
        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold">
                    {level}
                </div>
                <div>
                    <div className="text-xs text-muted-foreground">Level {level}</div>
                    <div className="flex items-center gap-2">
                        <Progress value={progressPercent} className="h-1.5 w-32" />
                        <span className="text-xs text-muted-foreground">{Math.round(progressPercent)}%</span>
                    </div>
                </div>
            </div>

            {currentStreak > 0 && (
                <div className="flex items-center gap-2">
                    <Flame className="h-5 w-5 text-orange-500" />
                    <div>
                        <div className="font-semibold">{currentStreak}</div>
                        <div className="text-xs text-muted-foreground">day streak</div>
                    </div>
                </div>
            )}
        </div>
    );
}
