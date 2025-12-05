'use server'
import { db } from "@/db/drizzle";


export async function getRecentSets(limit = 2) {
    const sets = await db.query.flashcardSets.findMany({
        with: {
            cards: true,
        },
        orderBy: (sets, { desc }) => [desc(sets.createdAt)],
        limit: limit,
    });
    return sets;
}
