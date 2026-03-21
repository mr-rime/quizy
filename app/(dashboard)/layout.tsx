import { getFolders } from "@/features/folders/services/folders";
import { getOptionalUserId } from "@/features/user/services/user";
import { getUserStats } from "@/features/gamification/services/stats";
import { DashboardLayoutClient } from "./layout-client";
import { getCurrentUser } from "@/features/user/services/user";
import { redirect } from "next/navigation";
import { isSitePrivate } from "@/features/user/services/site-settings";

interface LayoutProps {
    children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
    const userId = await getOptionalUserId();

    if (!userId) {
        redirect("/login");
    }

    const [user, isPrivate] = await Promise.all([
        getCurrentUser(),
        isSitePrivate()
    ]);

    if (isPrivate && user?.role !== "admin") {
        redirect("/private");
    }

    const folders = getFolders(userId);
    const stats = getUserStats(userId);

    return (
        <DashboardLayoutClient foldersPromise={folders} statsPromise={stats} user={user}>
            {children}
        </DashboardLayoutClient>
    );
}
