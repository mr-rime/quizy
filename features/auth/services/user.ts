import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import { User } from "@/types/auth";
import { eq } from "drizzle-orm";

export async function getUserByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user as User || null;
}
