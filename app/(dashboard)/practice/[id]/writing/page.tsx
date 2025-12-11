import { WritingGame } from "@/features/practice/components/writing-game";
import { notFound } from "next/navigation";
import { getFlashcardSet } from "@/features/practice/services/flashcards";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { getUserId } from "@/features/user/services/user";
import { Flashcard } from "@/features/practice/types";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

const getCachedFlashcardSet = cache(unstable_cache(
    async (id: string, userId: string) => {
        return await getFlashcardSet(id, userId);
    },
    ["flashcards"],
    { revalidate: 3600, tags: ["flashcards"] }
))

export default async function WritingPage({ params }: PageProps) {
    const { id } = await params;
    const userId = await getUserId();
    const set = await getCachedFlashcardSet(id, userId);

    if (!set) {
        notFound();
    }

    return (
        <div className="container mx-auto p-6 max-w-5xl space-y-8">
            <WritingGame cards={set.cards as Flashcard[]} setId={set.id} setTitle={set.title} />
        </div>
    );
}
