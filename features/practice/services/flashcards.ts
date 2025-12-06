'use server'

import { db } from "@/db/drizzle";
import { flashcardSets } from "@/db/schema";
import { eq } from "drizzle-orm";

import { getSessionCookie } from "@/features/auth/services/session";
import { cookies } from "next/headers";
import { and } from "drizzle-orm";
import { getCurrentUser } from "@/features/user/services/user";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function getFlashcardSet(id: string) {
    if (!id) {
        console.error("ID is undefined or null");
        return null;
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    const session = await getSessionCookie(token);

    if (!session) return null;

    const set = await db.query.flashcardSets.findFirst({
        where: and(
            eq(flashcardSets.id, id),
            eq(flashcardSets.userId, session.userId)
        ),
        with: {
            cards: true,
        },
    });

    return set;
}

export async function getFlashcardSets() {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    const session = await getSessionCookie(token);

    if (!session) return [];

    const sets = await db.query.flashcardSets.findMany({
        where: eq(flashcardSets.userId, session.userId),
        with: {
            cards: true,
            user: true,
        },
        orderBy: (sets, { desc }) => [desc(sets.createdAt)],
    });
    return sets;
}

export async function deleteFlashcardSet(id: string) {
    const currentUser = await getCurrentUser();
    if (!currentUser?.id) return {
        success: false,
        error: "Unauthorized"
    };

    await db
        .delete(flashcardSets)
        .where(
            and(
                eq(flashcardSets.id, id),
                eq(flashcardSets.userId, currentUser.id)
            )
        );

    revalidatePath("/sets");
    redirect("/latest");
    return {
        success: true,
        message: "Set deleted successfully"
    };
}
