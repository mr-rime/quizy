"use client"

import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { getFolders } from "@/features/folders/services/folders";
import { getUserStats } from "@/features/gamification/services/stats";
import { use, useState, Suspense } from "react";
import { User } from "@/types/auth";
import { Skeleton } from "@/components/skeleton";

interface DashboardLayoutClientProps {
    children: React.ReactNode;
    foldersPromise: ReturnType<typeof getFolders>;
    statsPromise: ReturnType<typeof getUserStats>;
    user: User | null;
}

export function DashboardLayoutClient({ children, foldersPromise, statsPromise, user }: DashboardLayoutClientProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const stats = use(statsPromise);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans flex flex-col pt-16">
            <Header stats={stats} user={user} onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

            <div className="flex flex-1">
                <Suspense
                    fallback={
                        <aside className="hidden lg:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r bg-white dark:bg-card p-5 shadow-md">
                            <div className="space-y-3">
                                {[...Array(5)].map((_, i) => (
                                    <Skeleton key={i} className="h-9 w-full rounded-lg" />
                                ))}
                            </div>
                        </aside>
                    }
                >
                    <Sidebar
                        foldersPromise={foldersPromise}
                        isMobileMenuOpen={isMobileMenuOpen}
                        onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
                    />
                </Suspense>

                <main className="flex-1 p-4 sm:p-6 lg:ml-64">{children}</main>
            </div>
        </div>
    );
}
