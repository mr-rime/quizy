import { QuizGame } from "@/features/practice/components/quiz/quiz-game";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getFlashcardSet } from "@/features/practice/services/flashcards";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function QuizzesPage({ params }: PageProps) {
    const { id } = await params;
    const set = await getFlashcardSet(id);

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

            <QuizGame cards={set.cards} setId={set.id} />
        </div>
    );
}
