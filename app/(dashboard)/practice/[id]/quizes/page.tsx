import { QuizGame } from "@/features/practice/components/quiz/quiz-game";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
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

export default async function QuizzesPage({ params }: PageProps) {
    const { id } = await params;
    const userId = await getUserId();
    const set = await getCachedFlashcardSet(id, userId);

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
                    <h1 className="text-3xl font-bold">Quiz: {set.title}</h1>
                    <p className="text-muted-foreground">{set.cards.length} questions</p>
                </div>
            </div>

            <QuizGame cards={set.cards as Flashcard[]} setId={set.id} userId={userId} />
        </div>
    );
}
