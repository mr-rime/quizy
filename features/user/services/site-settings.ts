"use server"

import { db } from "@/db/drizzle";
import { siteSettings } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidateTag, unstable_cache } from "next/cache";
import { getUserId } from "./user";
import { requireAdmin } from "@/lib/auth-helpers";

export const getSiteSetting = unstable_cache(
    async (key: string) => {
        const [setting] = await db
            .select({ value: siteSettings.value })
            .from(siteSettings)
            .where(eq(siteSettings.key, key));

        return setting?.value || null;
    },
    ["site-setting"],
    {
        revalidate: 300,
        tags: ["site-setting"]
    }
);

export async function isSitePrivate() {
    const value = await getSiteSetting("is_private_mode");
    return value === "true";
}

export async function updateSitePrivacy(isPrivate: boolean) {
    try {
        const userId = await getUserId();
        await requireAdmin(userId);

        await db
            .insert(siteSettings)
            .values({
                key: "is_private_mode",
                value: String(isPrivate)
            })
            .onConflictDoUpdate({
                target: siteSettings.key,
                set: { value: String(isPrivate), updatedAt: new Date() }
            });

        revalidateTag("site-setting", "max");

        return { success: true };
    } catch (error) {
        console.error("Error updating site privacy:", error);
        return { success: false, error: "Unauthorized or failed to update" };
    }
}
