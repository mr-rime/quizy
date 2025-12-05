import { PracticeLayout } from "@/features/practice/components/practice-layout";
import { getFlashcardSet } from "@/features/practice/services/flashcards";
import { notFound } from "next/navigation";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function PracticePage({ params }: PageProps) {
    const { id } = await params;
    const set = await getFlashcardSet(id);

    if (!set) {
        notFound();
    }

    return (
        <PracticeLayout
            setId={set.id}
            title={set.title}
            cardCount={set.cards.length}
        />
    );
}
