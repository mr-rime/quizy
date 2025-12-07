import { PracticeLayout } from "@/features/practice/components/practice-layout";
import { getFlashcardSet } from "@/features/practice/services/flashcards";
import { getUserId } from "@/features/user/services/user";
import { notFound } from "next/navigation";
import { getSetComments } from "@/features/social/services/comments";
import { isSetSaved } from "@/features/saved-sets/services/saved-sets";
import { isSetLikedByUser } from "@/features/social/services/likes";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function PracticePage({ params }: PageProps) {
    const { id } = await params;
    const userId = await getUserId();

    const setPromise = getFlashcardSet(id, userId);

    if (!setPromise) {
        notFound();
    }

    const [comments, isSaved, isLiked] = await Promise.all([
        getSetComments(id),
        isSetSaved(id),
        isSetLikedByUser(id, userId),
    ]);

    return <PracticeLayout<Awaited<ReturnType<typeof getFlashcardSet>>>
        flashcardSetPromise={setPromise}
        currentUserId={userId}
        isSaved={isSaved}
        isLiked={isLiked}
        commentsPromise={Promise.resolve(comments)}
    />
}
