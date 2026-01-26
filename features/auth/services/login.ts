'use server'

import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { compare } from "bcryptjs";
import { createSession } from "./session";
import { eq } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";

export async function login(email: string, password: string, ipAddress?: string, userAgent?: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) return { user: null, session: null };

    const isPasswordValid = await compare(password, user.password!);
    if (!isPasswordValid) return { user: null, session: null };

    const session = await createSession(user.id, ipAddress, userAgent);

    revalidateTag("user", "max");
    revalidateTag("current-user", "max");
    revalidateTag("flashcard-sets", "max");
    revalidateTag("flashcard-set", "max");
    revalidateTag("recent-sets", "max");
    revalidateTag("folders", "max");
    revalidateTag("folder", "max");
    revalidateTag("favorites", "max");
    revalidateTag("saved-sets", "max");
    revalidateTag("discover-sets", "max");
    revalidateTag("public-sets", "max");

    revalidatePath("/", "layout");

    return { user, session };
}