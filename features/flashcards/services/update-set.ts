"use server"

import { db } from "@/db/drizzle";
import { flashcardSets, cards } from "@/db/schema";
import { getSessionCookie } from "@/features/auth/services/session";
import { cookies } from "next/headers";
import { createFlashcardSetSchema } from "../utils/validations";
import z from "zod";
import { revalidatePath, revalidateTag } from "next/cache";
import { eq, and } from "drizzle-orm";

export type UpdateFlashcardSetInput = z.infer<typeof createFlashcardSetSchema> & {
    setId: string;
};

export async function updateFlashcardSet(data: UpdateFlashcardSetInput) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("session_token")?.value;
        const session = await getSessionCookie(token);

        if (!session) {
            throw new Error("Unauthorized");
        }

        const validatedData = createFlashcardSetSchema.parse(data);
        const existingSet = await db.query.flashcardSets.findFirst({
            where: and(
                eq(flashcardSets.id, data.setId),
                eq(flashcardSets.userId, session.userId)
            ),
        });

        if (!existingSet) {
            throw new Error("Set not found or unauthorized");
        }

        await db.transaction(async (tx) => {
            await tx.update(flashcardSets)
                .set({
                    title: validatedData.title,
                    description: validatedData.description,
                })
                .where(eq(flashcardSets.id, data.setId));

            await tx.delete(cards)
                .where(eq(cards.setId, data.setId));

            if (validatedData.flashcards.length > 0) {
                await tx.insert(cards).values(
                    validatedData.flashcards.map((card) => ({
                        setId: data.setId,
                        term: card.term,
                        definition: card.definition,
                        imageUrl: card.image,
                    }))
                );
            }
        });

        revalidateTag("flashcard-sets", "max");
        revalidateTag("flashcard-set", "max");
        revalidateTag("recent-sets", "max");
        revalidatePath("/latest");
        revalidatePath("/library");
        revalidatePath(`/practice/${data.setId}`);
        revalidatePath("/");

        return { success: true, id: data.setId };
    } catch (err) {
        console.log(err);
        return { success: false, error: "Failed to update set" };
    }
}
