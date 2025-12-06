import { PracticeLayout } from "@/features/practice/components/practice-layout";
import { getFlashcardSet } from "@/features/practice/services/flashcards";
import { getUserId } from "@/features/user/services/user";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PracticePage({ params }: PageProps) {
    const { id } = await params;
    const userId = await getUserId();

    const setPromise = getFlashcardSet(id, userId);

    if (!setPromise) {
        notFound();
    }

    return <PracticeLayout<Awaited<ReturnType<typeof getFlashcardSet>>>
        flashcardSetPromise={setPromise}
    />
}
