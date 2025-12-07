"use server"

import { db } from "@/db/drizzle";
import { setJoins } from "@/db/schema";
import { revalidateTag } from "next/cache";
import { sql } from "drizzle-orm";

export async function trackSetJoin(setId: string, userId: string) {
    try {
        await db.insert(setJoins)
            .values({
                setId,
                userId,
                joinCount: 1,
            })
            .onConflictDoUpdate({
                target: [setJoins.userId, setJoins.setId],
                set: {
                    joinCount: sql`${setJoins.joinCount} + 1`,
                    updatedAt: new Date(),
                }
            });

        revalidateTag(`set-${setId}`, "max");
        revalidateTag("discover-sets", "max");

        return { success: true };
    } catch (error) {
        console.error("Error tracking set join:", error);
        return { success: false, error: "Failed to track join" };
    }
}
