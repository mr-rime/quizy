import { FlashcardForm } from "@/features/flashcards/components/flashcard-form";
import { getFlashcardSet } from "@/features/practice/services/flashcards";
import { getUserId } from "@/features/user/services/user";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function EditSetPage({ params }: PageProps) {
    const { id } = await params;
    const userId = await getUserId();

    const set = await getFlashcardSet(id, userId);

    if (!set) {
        notFound();
    }

    const initialData = {
        title: set.title,
        description: set.description || "",
        category: set.category as "english" | "other",
        flashcards: set.cards.map((card) => ({
            id: card.id,
            term: card.term,
            definition: card.definition || "",
            image: card.imageUrl || "",
            examples: (card.examples as { english: string; arabic: string }[]) || [],
        })),
    };

    return (
        <div>
            <FlashcardForm key={id} setId={id} initialData={initialData} />
        </div>
    );
}
