import { WritingGame } from "@/features/practice/components/writing-game";
import { notFound } from "next/navigation";
import { getFlashcardSet } from "@/features/practice/services/flashcards";
import { cache } from "react";
import { getCurrentUser } from "@/features/user/services/user";
import { Flashcard } from "@/features/practice/types";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

const getData = cache(async (id: string, userId: string) => {
    return await getFlashcardSet(id, userId);
});

export default async function WritingPage({ params }: PageProps) {
    const { id } = await params;
    const user = await getCurrentUser();
    const userId = user?.id || "";
    const set = await getData(id, userId);

    if (!set) {
        notFound();
    }

    return (
        <div className="container mx-auto p-6 max-w-5xl space-y-8">
            <WritingGame
                cards={set.cards as Flashcard[]}
                setId={set.id}
                setTitle={set.title}

            />
        </div>
    );
}
