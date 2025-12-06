import { getFolder } from "@/features/folders/services/folders";
import { FolderView } from "@/features/folders/components/folder-view";
import { notFound } from "next/navigation";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getUserId } from "@/features/user/services/user";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

const getCachedFolder = cache(unstable_cache(
    async (id: string, userId: string) => {
        return getFolder(id, userId);
    }, ["folder"]));

export default async function FolderPage({ params }: PageProps) {
    const { id } = await params;
    const userId = await getUserId()
    const folder = await getCachedFolder(id, userId);

    if (!folder) {
        notFound();
    }

    return <FolderView folder={folder} />;
}
