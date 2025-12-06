import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { getFolders } from "@/features/folders/services/folders";
import { getUserId } from "@/features/user/services/user";
import { getUserStats } from "@/features/gamification/services/stats";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const userId = await getUserId();
    const folders = getFolders(userId);
    const stats = await getUserStats(userId);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans flex flex-col pt-16">
            <Header stats={stats} />

            <div className="flex flex-1">
                <Sidebar foldersPromise={folders} />

                <main className="flex-1 p-6 ml-64">{children}</main>
            </div>
        </div>
    );
}
