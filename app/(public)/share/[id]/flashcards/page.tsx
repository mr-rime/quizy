import { getPublicSet } from "@/features/share/services/share";
import { notFound } from "next/navigation";
import { FlashcardViewer } from "@/features/practice/components/flashcard-viewer";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PublicFlashcardsPage({ params }: PageProps) {
    const { id } = await params;

    const set = await getPublicSet(id);

    if (!set || !set.user) {
        notFound();
    }

    return <FlashcardViewer cards={set.cards} setId={set.id} userId={set.user.id} />;
}
