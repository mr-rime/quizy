'use server'
import { db } from "@/db/drizzle";


import { flashcardSets } from "@/db/schema";
import { getSessionCookie } from "@/features/auth/services/session";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";

export async function getRecentSets(limit = 2) {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    const session = await getSessionCookie(token);

    if (!session) return [];

    const sets = await db.query.flashcardSets.findMany({
        where: eq(flashcardSets.userId, session.userId),
        with: {
            cards: true,
        },
        orderBy: (sets, { desc }) => [desc(sets.createdAt)],
        limit: limit,
    });
    return sets;
}
