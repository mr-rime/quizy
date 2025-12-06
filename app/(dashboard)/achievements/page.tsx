import { getAchievementProgress } from "@/features/gamification/services/achievements";
import { getUserStats } from "@/features/gamification/services/stats";
import { getUserId } from "@/features/user/services/user";
import { AchievementCard } from "@/features/gamification/components/achievement-card";
import { StatsDisplay } from "@/features/gamification/components/stats-display";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy } from "lucide-react";

export const revalidate = 0;

export default async function AchievementsPage() {
    const userId = await getUserId();
    const [stats, achievements] = await Promise.all([
        getUserStats(userId),
        getAchievementProgress(userId)
    ]);

    const categories = ["all", "quiz", "flashcard", "streak", "level"];

    // Default stats if user hasn't started yet
    const currentStats = stats || {
        level: 1,
        totalXp: 0,
        currentStreak: 0,
        longestStreak: 0,
        quizzesCompleted: 0,
        flashcardsCompleted: 0
    };

    return (
        <div className="container mx-auto p-6 max-w-5xl space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <Trophy className="h-8 w-8 text-yellow-500" />
                        Achievements
                    </h1>
                    <p className="text-muted-foreground mt-1">Track your progress and earn rewards</p>
                </div>

                <div className="bg-card p-4 rounded-lg border shadow-sm">
                    <StatsDisplay
                        level={currentStats.level}
                        totalXp={currentStats.totalXp}
                        currentStreak={currentStats.currentStreak}
                    />
                </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
                <TabsList>
                    {categories.map(category => (
                        <TabsTrigger key={category} value={category} className="capitalize">
                            {category}
                        </TabsTrigger>
                    ))}
                </TabsList>

                {categories.map(category => (
                    <TabsContent key={category} value={category}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {achievements
                                .filter(a => category === "all" || a.category === category)
                                .map((achievement) => (
                                    <AchievementCard
                                        key={achievement.id}
                                        {...achievement}
                                    />
                                ))}

                            {achievements.filter(a => category === "all" || a.category === category).length === 0 && (
                                <div className="col-span-full text-center py-12 text-muted-foreground">
                                    No achievements found in this category.
                                </div>
                            )}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
