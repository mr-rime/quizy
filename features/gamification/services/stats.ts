"use server";

import { db } from "@/db/drizzle";
import { userStats } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getUserStats(userId: string) {
    const stats = await db.query.userStats.findFirst({
        where: eq(userStats.userId, userId),
    });
    return stats;
}

export async function initializeUserStats(userId: string) {
    await db.insert(userStats).values({
        userId,
        totalXp: 0,
        level: 1,
        currentStreak: 0,
        longestStreak: 0,
        quizzesCompleted: 0,
        flashcardsCompleted: 0,
    });
}

export async function calculateLevel(totalXp: number): Promise<number> {
    return Math.floor(Math.sqrt(totalXp / 50)) + 1;
}

export async function addXP(userId: string, amount: number) {
    const stats = await getUserStats(userId);
    if (!stats) {
        await initializeUserStats(userId);
        return addXP(userId, amount);
    }

    const newTotalXp = stats.totalXp + amount;
    const newLevel = await calculateLevel(newTotalXp);

    await db
        .update(userStats)
        .set({
            totalXp: newTotalXp,
            level: newLevel,
            updatedAt: new Date(),
        })
        .where(eq(userStats.userId, userId));

    revalidatePath("/achievements");
    revalidatePath("/latest");

    return { newLevel, leveledUp: newLevel > stats.level };
}

export async function updateStreak(userId: string) {
    const stats = await getUserStats(userId);
    if (!stats) {
        await initializeUserStats(userId);
        return updateStreak(userId);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastPractice = stats.lastPracticeDate ? new Date(stats.lastPracticeDate) : null;
    if (lastPractice) {
        lastPractice.setHours(0, 0, 0, 0);
    }

    let newStreak = stats.currentStreak;

    if (!lastPractice || lastPractice < today) {
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastPractice && lastPractice.getTime() === yesterday.getTime()) {
            newStreak += 1;
        } else if (!lastPractice || lastPractice < yesterday) {
            newStreak = 1;
        }

        const newLongest = Math.max(newStreak, stats.longestStreak);

        await db
            .update(userStats)
            .set({
                currentStreak: newStreak,
                longestStreak: newLongest,
                lastPracticeDate: new Date(),
                updatedAt: new Date(),
            })
            .where(eq(userStats.userId, userId));

        if (newStreak > 0 && newStreak % 7 === 0) {
            await addXP(userId, 5);
        }

        revalidatePath("/achievements");
        revalidatePath("/latest");
    }

    return newStreak;
}

export async function incrementQuizCompleted(userId: string) {
    const stats = await getUserStats(userId);
    if (!stats) {
        await initializeUserStats(userId);
        return incrementQuizCompleted(userId);
    }

    await db
        .update(userStats)
        .set({
            quizzesCompleted: stats.quizzesCompleted + 1,
            updatedAt: new Date(),
        })
        .where(eq(userStats.userId, userId));

    revalidatePath("/achievements");
}

export async function incrementFlashcardCompleted(userId: string) {
    const stats = await getUserStats(userId);
    if (!stats) {
        await initializeUserStats(userId);
        return incrementFlashcardCompleted(userId);
    }

    await db
        .update(userStats)
        .set({
            flashcardsCompleted: stats.flashcardsCompleted + 1,
            updatedAt: new Date(),
        })
        .where(eq(userStats.userId, userId));

    revalidatePath("/achievements");
}
