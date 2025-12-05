import { FlashcardViewer } from "@/features/practice/components/flashcard-viewer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getFlashcardSet } from "@/features/practice/services/flashcards";
import { getFavorites } from "@/features/flashcards/services/favorites";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function FlashcardsPage({ params }: PageProps) {
    const { id } = await params;
    const set = await getFlashcardSet(id);
    const favorites = await getFavorites();
    const favoriteIds = favorites.map(f => f.id);

    if (!set) {
        notFound();
    }

    return (
        <div className="container mx-auto p-6 max-w-5xl space-y-8">
            <div className="flex items-center gap-4">
                <Link href={`/practice/${id}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Flashcards</h1>
                    <p className="text-muted-foreground">{set.title}</p>
                </div>
            </div>

            <FlashcardViewer cards={set.cards} setId={set.id} initialFavoriteIds={favoriteIds} />
        </div>
    );
}
