import { QuickStats } from "@/features/dashboard/components/quick-stats";
import { getUserStats } from "@/features/gamification/services/stats";
import { getRecentSets } from "@/features/practice/services/recent";

interface LatestStatsProps {
    userId: string;
}

export async function LatestStats({ userId }: LatestStatsProps) {
    const [stats, recentSets] = await Promise.all([
        getUserStats(userId),
        getRecentSets(userId, 100)
    ]);

    return (
        <QuickStats
            streak={stats?.currentStreak || 0}
            totalXp={stats?.totalXp || 0}
            setsCreated={recentSets.length}
        />
    );
}
