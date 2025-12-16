"use server"

import { db } from "@/db/drizzle";
import { cards } from "@/db/schema";
import { getSessionCookie } from "@/features/auth/services/session";
import { cookies } from "next/headers";
import { eq } from "drizzle-orm";
import { revalidateTag, revalidatePath } from "next/cache";
import { z } from "zod";

const updateCardSchema = z.object({
    id: z.string(),
    term: z.string().min(1),
    definition: z.string().optional(),
    examples: z.array(z.object({
        english: z.string(),
        arabic: z.string()
    })).optional(),
});

export async function updateFlashcard(data: z.infer<typeof updateCardSchema>) {
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    const session = await getSessionCookie(token);

    if (!session) {
        throw new Error("Unauthorized");
    }

    const validatedData = updateCardSchema.parse(data);

    const card = await db.query.cards.findFirst({
        where: eq(cards.id, validatedData.id),
        with: {
            set: true,
        },
    });

    if (!card) throw new Error("Card not found");
    if (card.set.userId !== session.userId) throw new Error("Unauthorized");

    await db.update(cards)
        .set({
            term: validatedData.term,
            definition: validatedData.definition,
            examples: validatedData.examples,
        })
        .where(eq(cards.id, validatedData.id));

    revalidatePath(`/practice/${card.set.id}`);
    revalidatePath("/library");
    revalidatePath("/favorites");

    revalidateTag("flashcard-set", "max");
    revalidateTag("favorites", "max");
}
