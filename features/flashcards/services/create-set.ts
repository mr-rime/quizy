"use server"

import { db } from "@/db/drizzle";
import { flashcardSets, cards } from "@/db/schema";
import { getSessionCookie } from "@/features/auth/services/session";
import { cookies } from "next/headers";
import { createFlashcardSetSchema } from "../utils/validations";
import { redirect } from "next/navigation";
import z from "zod";
import { revalidatePath, revalidateTag } from "next/cache";

export type CreateFlashcardSetInput = z.infer<typeof createFlashcardSetSchema>;

export async function createFlashcardSet(data: CreateFlashcardSetInput) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("session_token")?.value;
        const session = await getSessionCookie(token);

        if (!session) {
            throw new Error("Unauthorized");
        }

        const validatedData = createFlashcardSetSchema.parse(data);

        await db.transaction(async (tx) => {
            const [newSet] = await tx.insert(flashcardSets).values({
                title: validatedData.title,
                description: validatedData.description,
                userId: session.userId,
            }).returning({ id: flashcardSets.id });

            if (validatedData.flashcards.length > 0) {
                await tx.insert(cards).values(
                    validatedData.flashcards.map((card) => ({
                        setId: newSet.id,
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
        revalidatePath("/"); 
        redirect("/")
    } catch (err) {
        console.log(err)
    };
}
