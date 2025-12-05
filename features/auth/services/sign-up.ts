'use server'

import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { hash } from "bcryptjs";
import { signupSchema } from "../utils/validations";
import z from "zod";

export async function signUp(email: string, password: string, username: string, confirmPassword?: string) {
    const validatedFields = signupSchema.safeParse({ email, password, confirmPassword, username });

    if (!validatedFields.success) {
        return {
            errors: z.treeifyError(validatedFields.error),
        }
    }

    const hashedPassword = await hash(password, 10);

    const [user] = await db
        .insert(users)
        .values({
            email,
            password: hashedPassword,
            username,
            image: null,
        }).returning({ id: users.id });

    return user;
}
