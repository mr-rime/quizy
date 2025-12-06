import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface AchievementCardProps {
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
    progress: number;
    currentValue: number;
    requiredValue: number;
}

export function AchievementCard({
    name,
    description,
    icon,
    unlocked,
    progress,
    currentValue,
    requiredValue,
}: AchievementCardProps) {
    return (
        <Card className={cn(
            "relative overflow-hidden transition-all",
            unlocked ? "border-primary bg-primary/5" : "opacity-60"
        )}>
            <CardContent className="p-6">
                <div className="flex items-start gap-4">
                    <div className={cn(
                        "text-4xl",
                        !unlocked && "grayscale"
                    )}>
                        {unlocked ? icon : <Lock className="h-10 w-10 text-muted-foreground" />}
                    </div>

                    <div className="flex-1 space-y-2">
                        <div>
                            <h3 className="font-semibold text-lg">{name}</h3>
                            <p className="text-sm text-muted-foreground">{description}</p>
                        </div>

                        {!unlocked && (
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{currentValue} / {requiredValue}</span>
                                    <span>{Math.round(progress)}%</span>
                                </div>
                                <Progress value={progress} className="h-2" />
                            </div>
                        )}

                        {unlocked && (
                            <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                ✓ Unlocked
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
