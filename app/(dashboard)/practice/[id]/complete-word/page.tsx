import { CompleteWordGame } from "@/features/practice/components/complete-word-game";
import { notFound } from "next/navigation";
import { getFlashcardSet } from "@/features/practice/services/flashcards";
import { cache } from "react";
import { Flashcard } from "@/features/practice/types";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

const getData = cache(async (id: string) => {
    return await getFlashcardSet(id);
});

export default async function CompleteWordPage({ params }: PageProps) {
    const { id } = await params;
    const set = await getData(id);

    if (!set) {
        notFound();
    }

    return (
        <div className="container mx-auto p-6 max-w-5xl space-y-8">
            <CompleteWordGame
                cards={set.cards as Flashcard[]}
                setId={set.id}
                setTitle={set.title}
                category={set.category}
            />
        </div>
    );
}
