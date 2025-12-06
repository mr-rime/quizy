"use server"

import { db } from "@/db/drizzle";
import { flashcardSets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getRecentSets = unstable_cache(
    async (userId: string, limit = 4) => {
        return db.query.flashcardSets.findMany({
            where: eq(flashcardSets.userId, userId),
            with: { cards: true },
            orderBy: (sets, { desc }) => [desc(sets.createdAt)],
            limit,
        });
    },
    ["recent-sets"],
    {
        revalidate: 3600,
        tags: ["recent-sets"]
    }
);
