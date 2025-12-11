import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { ProgressWithSet } from "../services/progress";
import { ProgressDropdown } from "./progress-dropdown";

interface JumpBackInProps {
    progressSessions: ProgressWithSet[];
}

export function JumpBackIn({ progressSessions }: JumpBackInProps) {
    if (progressSessions.length === 0) {
        return null;
    }

    return (
        <div className="w-full mb-10">
            <h2 className="text-[1.25rem] font-medium mb-5">Jump back in</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {progressSessions.map((progress) => {
                    const progressPercentage = Math.round(
                        (progress.currentIndex / progress.totalQuestions) * 100
                    );
                    const modeRoute = progress.mode === "quiz" ? "quizes" : "flashcards";

                    return (
                        <Card
                            key={progress.id}
                            className="hover:bg-accent transition-colors h-full"
                        >
                            <CardContent className="p-6 flex flex-col gap-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-1">
                                            {progress.setTitle} <span className="capitalize">({modeRoute})</span>
                                        </h3>
                                        <p className="text-sm text-muted-foreground">
                                            {progressPercentage}% of questions completed
                                        </p>
                                    </div>
                                    <ProgressDropdown progressId={progress.id} />
                                </div>

                                <Progress value={progressPercentage} className="h-2" />

                                <Link href={`/practice/${progress.setId}/${modeRoute}`}>
                                    <Button className="w-full rounded-full">
                                        Continue
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
