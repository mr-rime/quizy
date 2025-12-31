"use server";
import { db } from "@/db/drizzle";
import { practiceProgress } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath, unstable_cache } from "next/cache";

export interface SaveProgressData {
    userId: string;
    setId: string;
    mode: "quiz" | "flashcard";
    currentIndex: number;
    totalQuestions: number;
    score?: number;
}

export interface ProgressWithSet {
    id: string;
    userId: string;
    setId: string;
    setTitle: string;
    mode: string;
    currentIndex: number;
    totalQuestions: number;
    score: number | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}


export const getActiveProgress = unstable_cache(
    async (userId: string): Promise<ProgressWithSet[]> => {
        const progress = await db.query.practiceProgress.findMany({
            where: eq(practiceProgress.userId, userId),
            orderBy: [desc(practiceProgress.updatedAt)],
            with: {
                set: {
                    columns: {
                        title: true,
                    },
                },
            },
        });

        return progress.map((p) => ({
            id: p.id,
            userId: p.userId,
            setId: p.setId,
            setTitle: p.set.title,
            mode: p.mode,
            currentIndex: p.currentIndex,
            totalQuestions: p.totalQuestions,
            score: p.score,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
        }));
    },
    ["active-progress"],
    {
        revalidate: 60,
        tags: ["progress"]
    }
);


export async function getProgressForSet(
    userId: string,
    setId: string,
    mode: "quiz" | "flashcard"
) {
    const progress = await db.query.practiceProgress.findFirst({
        where: and(
            eq(practiceProgress.userId, userId),
            eq(practiceProgress.setId, setId),
            eq(practiceProgress.mode, mode)
        ),
    });

    return progress;
}


export async function saveProgress(data: SaveProgressData) {
    const existing = await getProgressForSet(data.userId, data.setId, data.mode);

    if (existing) {
        await db
            .update(practiceProgress)
            .set({
                currentIndex: data.currentIndex,
                totalQuestions: data.totalQuestions,
                score: data.score ?? existing.score,
                updatedAt: new Date(),
            })
            .where(eq(practiceProgress.id, existing.id));

        revalidatePath("/latest");
        return existing.id;
    } else {
        const [newProgress] = await db
            .insert(practiceProgress)
            .values({
                userId: data.userId,
                setId: data.setId,
                mode: data.mode,
                currentIndex: data.currentIndex,
                totalQuestions: data.totalQuestions,
                score: data.score ?? 0,
            })
            .returning();

        revalidatePath("/latest");
        return newProgress.id;
    }
}


export async function deleteProgress(progressId: string) {
    await db.delete(practiceProgress).where(eq(practiceProgress.id, progressId));
    revalidatePath("/latest");
}


export async function deleteProgressBySet(
    userId: string,
    setId: string,
    mode: "quiz" | "flashcard"
) {
    await db
        .delete(practiceProgress)
        .where(
            and(
                eq(practiceProgress.userId, userId),
                eq(practiceProgress.setId, setId),
                eq(practiceProgress.mode, mode)
            )
        );
    revalidatePath("/latest");
}
