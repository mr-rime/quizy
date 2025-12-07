import { CreateFlashcardMenu } from "@/features/flashcards/components/create-flashcard-menu";
import { ProfileMenu } from "../../features/user/components/profile-menu";
import { ThemeToggle } from "../theme-toggle";
import { Menu } from "lucide-react";
import { StatsDisplay } from "@/features/gamification/components/stats-display";
import { User } from "@/types/auth";

interface Stats {
    level: number;
    totalXp: number;
    currentStreak: number;
}

interface HeaderProps {
    stats?: Stats;
    user: User | null;
    onToggleMobileMenu?: () => void;
}

export function Header({ stats, user, onToggleMobileMenu }: HeaderProps) {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 sm:px-6 lg:pl-5 lg:pr-8 border-b bg-card">
            <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
                {onToggleMobileMenu && (
                    <button
                        onClick={onToggleMobileMenu}
                        className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        aria-label="Toggle menu"
                    >
                        <Menu size={24} />
                    </button>
                )}

                <h1 className="text-black dark:text-white text-xl sm:text-2xl">
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

            <div className="flex gap-2 sm:gap-3 lg:gap-5">
                <div className="hidden sm:block">
                    <CreateFlashcardMenu />
                </div>
                <ThemeToggle />
                <ProfileMenu user={user} />
            </div>
        </header>
    )
}
