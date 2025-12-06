"use server";

import { db } from "@/db/drizzle";
import { achievements, userAchievements } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUserStats } from "./stats";

export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon: string;
    requiredValue: number;
    category: string;
}

const ACHIEVEMENTS: Achievement[] = [
    { id: "quiz_beginner", name: "Quiz Beginner", description: "Complete your first quiz", icon: "🎯", requiredValue: 1, category: "quiz" },
    { id: "quiz_apprentice", name: "Quiz Apprentice", description: "Complete 10 quizzes", icon: "🎓", requiredValue: 10, category: "quiz" },
    { id: "quiz_master", name: "Quiz Master", description: "Complete 50 quizzes", icon: "👑", requiredValue: 50, category: "quiz" },
    { id: "quiz_legend", name: "Quiz Legend", description: "Complete 100 quizzes", icon: "⭐", requiredValue: 100, category: "quiz" },

    { id: "flashcard_starter", name: "Flashcard Starter", description: "Complete your first flashcard set", icon: "📚", requiredValue: 1, category: "flashcard" },
    { id: "flashcard_pro", name: "Flashcard Pro", description: "Complete 25 flashcard sets", icon: "📖", requiredValue: 25, category: "flashcard" },
    { id: "flashcard_expert", name: "Flashcard Expert", description: "Complete 75 flashcard sets", icon: "🏆", requiredValue: 75, category: "flashcard" },

    { id: "streak_3", name: "Getting Started", description: "Maintain a 3 day streak", icon: "🔥", requiredValue: 3, category: "streak" },
    { id: "streak_7", name: "Committed", description: "Maintain a 7 day streak", icon: "💪", requiredValue: 7, category: "streak" },
    { id: "streak_30", name: "Dedicated", description: "Maintain a 30 day streak", icon: "🌟", requiredValue: 30, category: "streak" },
    { id: "streak_100", name: "Unstoppable", description: "Maintain a 100 day streak", icon: "🚀", requiredValue: 100, category: "streak" },

    { id: "level_5", name: "Rising Star", description: "Reach level 5", icon: "⭐", requiredValue: 5, category: "level" },
    { id: "level_10", name: "Skilled Learner", description: "Reach level 10", icon: "💫", requiredValue: 10, category: "level" },
    { id: "level_25", name: "Elite Scholar", description: "Reach level 25", icon: "👨‍🎓", requiredValue: 25, category: "level" },
    { id: "level_50", name: "Master Mind", description: "Reach level 50", icon: "🧠", requiredValue: 50, category: "level" },
];

export async function seedAchievements() {
    for (const achievement of ACHIEVEMENTS) {
        await db.insert(achievements).values(achievement).onConflictDoNothing();
    }
}

export async function getAchievements() {
    let allAchievements = await db.query.achievements.findMany();

    if (allAchievements.length === 0) {
        await seedAchievements();
        allAchievements = await db.query.achievements.findMany();
    }

    return allAchievements;
}

export async function getUserAchievements(userId: string) {
    const unlocked = await db.query.userAchievements.findMany({
        where: eq(userAchievements.userId, userId),
        with: {
            achievement: true,
        },
    });

    return unlocked;
}

export async function checkAndAwardAchievements(userId: string) {
    const stats = await getUserStats(userId);
    if (!stats) return [];

    const allAchievements = await getAchievements();
    const userUnlocked = await getUserAchievements(userId);
    const unlockedIds = new Set(userUnlocked.map(ua => ua.achievementId));

    const newAchievements = [];

    for (const achievement of allAchievements) {
        if (unlockedIds.has(achievement.id)) continue;

        let currentValue = 0;
        switch (achievement.category) {
            case "quiz":
                currentValue = stats.quizzesCompleted;
                break;
            case "flashcard":
                currentValue = stats.flashcardsCompleted;
                break;
            case "streak":
                currentValue = stats.currentStreak;
                break;
            case "level":
                currentValue = stats.level;
                break;
        }

        if (currentValue >= achievement.requiredValue) {
            await db.insert(userAchievements).values({
                userId,
                achievementId: achievement.id,
            });
            newAchievements.push(achievement);
        }
    }

    return newAchievements;
}

export async function getAchievementProgress(userId: string) {
    const stats = await getUserStats(userId);
    if (!stats) return [];

    const allAchievements = await getAchievements();
    const userUnlocked = await getUserAchievements(userId);
    const unlockedIds = new Set(userUnlocked.map(ua => ua.achievementId));

    return allAchievements.map(achievement => {
        let currentValue = 0;
        switch (achievement.category) {
            case "quiz":
                currentValue = stats.quizzesCompleted;
                break;
            case "flashcard":
                currentValue = stats.flashcardsCompleted;
                break;
            case "streak":
                currentValue = stats.currentStreak;
                break;
            case "level":
                currentValue = stats.level;
                break;
        }

        return {
            ...achievement,
            unlocked: unlockedIds.has(achievement.id),
            progress: Math.min(100, (currentValue / achievement.requiredValue) * 100),
            currentValue,
        };
    });
}
