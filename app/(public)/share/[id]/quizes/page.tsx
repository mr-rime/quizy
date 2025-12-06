import { getPublicSet } from "@/features/share/services/share";
import { notFound } from "next/navigation";
import { QuizGame } from "@/features/practice/components/quiz/quiz-game";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PublicQuizPage({ params }: PageProps) {
    const { id } = await params;

    const set = await getPublicSet(id);

    if (!set || !set.user) {
        notFound();
    }

    return <QuizGame cards={set.cards} setId={set.id} userId={set.user.id} />;
}
