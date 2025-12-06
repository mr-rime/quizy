import { CreateFlashcardMenu } from "@/features/flashcards/components/create-flashcard-menu";
import { ProfileMenu } from "../../features/user/components/profile-menu";
import { ThemeToggle } from "../theme-toggle";

import { StatsDisplay } from "@/features/gamification/components/stats-display";

interface Stats {
    level: number;
    totalXp: number;
    currentStreak: number;
}

export function Header({ stats }: { stats?: Stats }) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 p-2 h-16 flex items-center justify-between pl-5 pr-20 border-b bg-card">
            <div className="flex items-center gap-8">
                <h1 className="text-black dark:text-white text-2xl">
                    <span className="font-bold">Q</span>uizy
                </h1>

                {stats && (
                    <div className="hidden md:block">
                        <StatsDisplay
                            level={stats.level}
                            totalXp={stats.totalXp}
                            currentStreak={stats.currentStreak}
                        />
                    </div>
                )}
            </div>

            <div className="flex gap-5">
                <CreateFlashcardMenu />
                <ThemeToggle />
                <ProfileMenu />
            </div>
        </header>
    )
}
