import { getFolder } from "@/features/folders/services/folders";
import { FolderView } from "@/features/folders/components/folder-view";
import { notFound } from "next/navigation";
import { getUserId } from "@/features/user/services/user";

export const revalidate = 3600;

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function FolderPage({ params }: PageProps) {
    const { id } = await params;
    const userId = await getUserId()
    const folder = await getFolder(id, userId);

    if (!folder) {
        notFound();
    }

    return <FolderView folder={folder} />;
}
