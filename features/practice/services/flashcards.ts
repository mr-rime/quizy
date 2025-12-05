'use server'

import { db } from "@/db/drizzle";
import { flashcardSets } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getFlashcardSet(id: string) {
    console.log("getFlashcardSet called with id:", id);
    if (!id) {
        console.error("ID is undefined or null");
        return null;
    }

    const set = await db.query.flashcardSets.findFirst({
        where: eq(flashcardSets.id, id),
        with: {
            cards: true,
        },
    });

    return set;
}

export async function getFlashcardSets() {
    const sets = await db.query.flashcardSets.findMany({
        with: {
            cards: true,
            user: true,
        },
        orderBy: (sets, { desc }) => [desc(sets.createdAt)],
    });
    return sets;
}
