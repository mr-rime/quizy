import { getFolders } from "@/features/folders/services/folders";
import { getUserId } from "@/features/user/services/user";
import { getUserStats } from "@/features/gamification/services/stats";
import { DashboardLayoutClient } from "./layout-client";
import { getCurrentUser } from "@/features/user/services/user";

interface LayoutProps {
    children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
    const userId = await getUserId();
    const folders = getFolders(userId);
    const stats = getUserStats(userId);
    const user = await getCurrentUser();

    return (
        <DashboardLayoutClient foldersPromise={folders} statsPromise={stats} user={user}>
            {children}
        </DashboardLayoutClient>
    );
}
