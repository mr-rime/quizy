import { Suspense } from "react";
import { cookies } from "next/headers";
import { getSessionCookie } from "@/features/auth/services/session";
import { getCurrentUser } from "@/features/user/services/user";
import { WelcomeHeader } from "@/features/dashboard/components/welcome-header";
import { DashboardShell, DashboardSection } from "@/features/dashboard/components/dashboard-shell";
import { LatestStats } from "./components/latest-stats";
import { LatestActivity } from "./components/latest-activity";
import { LatestSets } from "./components/latest-sets";
import { DashboardSkeleton } from "@/features/flashcards/components/dashboard-skeleton";
import { Skeleton } from "@/components/skeleton";

const ActivitySkeleton = () => (
    <div className="w-full h-40 bg-card rounded-2xl border border-border/50 animate-pulse" />
);

const StatsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
    </div>
);

export default async function LatestPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    const session = await getSessionCookie(token);
    const userId = session?.userId || "";
    const user = await getCurrentUser();

    return (
        <DashboardShell>
            <div className="p-4 sm:p-6 lg:p-8">
                <WelcomeHeader userName={user?.username || "Student"} />

                <Suspense fallback={<StatsSkeleton />}>
                    <LatestStats userId={userId} />
                </Suspense>

                <DashboardSection delay={0.2}>
                    <Suspense fallback={<ActivitySkeleton />}>
                        <LatestActivity userId={userId} />
                    </Suspense>
                </DashboardSection>

                <DashboardSection delay={0.3}>
                    <Suspense fallback={<DashboardSkeleton />}>
                        <LatestSets userId={userId} />
                    </Suspense>
                </DashboardSection>
            </div>
        </DashboardShell>
    );
}
