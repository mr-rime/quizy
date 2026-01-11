"use server"

import { getFlashcardSets } from "@/features/practice/services/flashcards";
import { getUserId } from "@/features/user/services/user";
import { FlashcardSet } from "@/types";

export type GetLibrarySetsResult = {
    sets: FlashcardSet[];
    nextPage: number | null;
}

export async function getLibrarySetsAction(page: number = 0, limit: number = 20): Promise<GetLibrarySetsResult> {
    const userId = await getUserId();
    const offset = page * limit;

    const sets = await getFlashcardSets(userId, limit, offset);

    const hasMore = sets.length === limit;

    return {
        sets,
        nextPage: hasMore ? page + 1 : null
    };
}
