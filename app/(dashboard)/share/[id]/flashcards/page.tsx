import { getPublicSet } from "@/features/share/services/share";
import { notFound } from "next/navigation";
import { FlashcardViewer } from "@/features/practice/components/flashcard-viewer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Flashcard } from "@/features/practice/types";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PublicFlashcardsPage({ params }: PageProps) {
    const { id } = await params;

    const set = await getPublicSet(id);

    if (!set || !set.user) {
        notFound();
    }

    return (
        <div className="container mx-auto p-6 max-w-5xl space-y-8">
            <div className="flex items-center gap-4">
                <Link href={`/share/${id}`}>
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold">Flashcards</h1>
                    <p className="text-muted-foreground">{set.title}</p>
                </div>
            </div>

            <FlashcardViewer cards={set.cards as Flashcard[]} setId={set.id} userId={set.user.id} />
        </div>
    );
}
