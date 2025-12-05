import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { getFolders } from "@/features/folders/services/folders";

export default async function Layout({ children }: { children: React.ReactNode }) {
    const folders = await getFolders();

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans flex flex-col">
            <Header />

            <div className="flex flex-1">
                <Sidebar folders={folders} />

                <main className="flex-1 p-6">{children}</main>
            </div>
        </div>
    );
}
