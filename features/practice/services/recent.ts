import { db } from "@/db/drizzle";
import { flashcardSets } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getRecentSets(userId: string, limit = 4) {
    return db.query.flashcardSets.findMany({
        where: eq(flashcardSets.userId, userId),
        with: { cards: true },
        orderBy: (sets, { desc }) => [desc(sets.createdAt)],
        limit,
    });
}
