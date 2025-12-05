import { getFolder } from "@/features/folders/services/folders";
import { FolderView } from "@/features/folders/components/folder-view";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function FolderPage({ params }: PageProps) {
    const { id } = await params;
    const folder = await getFolder(id);

    if (!folder) {
        notFound();
    }

    return <FolderView folder={folder} />;
}
