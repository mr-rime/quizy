"use server"

import { db } from "@/db/drizzle";
import { setComments } from "@/db/schema";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath, revalidateTag } from "next/cache";
import { flashcardSets } from "@/db/schema";

export async function addComment(setId: string, userId: string, content: string) {
    try {
        if (!content.trim()) {
            return { success: false, error: "Comment cannot be empty" };
        }

        if (content.length > 1000) {
            return { success: false, error: "Comment is too long (max 1000 characters)" };
        }

        const [comment] = await db.insert(setComments)
            .values({
                setId,
                userId,
                content: content.trim(),
            })
            .returning();

        revalidatePath(`/practice/${setId}`);

        revalidateTag(`set-${setId}-comments`, "max");
        revalidateTag(`set-${setId}`, "max");
        revalidateTag("discover-sets", "max");
        // ... (keeping other tags)
        revalidateTag("recent-sets", "max");

        return { success: true, comment };
    } catch (error) {
        console.error("Error adding comment:", error);
        return { success: false, error: "Failed to add comment" };
    }
}

export async function updateComment(commentId: string, userId: string, content: string) {
    try {
        if (!content.trim()) {
            return { success: false, error: "Comment cannot be empty" };
        }

        if (content.length > 1000) {
            return { success: false, error: "Comment is too long (max 1000 characters)" };
        }

        const [comment] = await db.update(setComments)
            .set({ content: content.trim() })
            .where(and(
                eq(setComments.id, commentId),
                eq(setComments.userId, userId)
            ))
            .returning();

        if (!comment) {
            return { success: false, error: "Comment not found or unauthorized" };
        }

        revalidateTag(`set-${comment.setId}-comments`, "max");
        revalidateTag(`set-${comment.setId}`, "max");
        revalidateTag("discover-sets", "max");
        revalidateTag("flashcard-set", "max");
        revalidateTag("flashcard-sets", "max");
        revalidateTag("public-sets", "max");

        return { success: true, comment };
    } catch (error) {
        console.error("Error updating comment:", error);
        return { success: false, error: "Failed to update comment" };
    }
}

export async function deleteComment(commentId: string, userId: string) {
    try {
        // First get the comment to find the set ID
        const comment = await db.query.setComments.findFirst({
            where: eq(setComments.id, commentId),
            with: {
                set: {
                    columns: {
                        userId: true,
                        id: true
                    }
                }
            }
        });

        if (!comment) {
            return { success: false, error: "Comment not found" };
        }

        // Check permissions: either the comment author OR the set author can delete
        const isCommentAuthor = comment.userId === userId;
        const isSetAuthor = comment.set.userId === userId;

        if (!isCommentAuthor && !isSetAuthor) {
            return { success: false, error: "Unauthorized to delete this comment" };
        }

        await db.delete(setComments)
            .where(eq(setComments.id, commentId));

        revalidatePath(`/practice/${comment.setId}`);
        revalidateTag(`set-${comment.setId}-comments`, "max");
        // ... other tags

        return { success: true };
    } catch (error) {
        console.error("Error deleting comment:", error);
        return { success: false, error: "Failed to delete comment" };
    }
}

export async function togglePinComment(commentId: string, userId: string) {
    try {
        const comment = await db.query.setComments.findFirst({
            where: eq(setComments.id, commentId),
            with: {
                set: {
                    columns: {
                        userId: true,
                        id: true
                    }
                }
            }
        });

        if (!comment) {
            return { success: false, error: "Comment not found" };
        }

        // Only set author can pin/unpin
        if (comment.set.userId !== userId) {
            return { success: false, error: "Only the set author can pin comments" };
        }

        const [updatedComment] = await db.update(setComments)
            .set({ isPinned: !comment.isPinned })
            .where(eq(setComments.id, commentId))
            .returning();

        revalidatePath(`/practice/${comment.setId}`);

        return { success: true, isPinned: updatedComment.isPinned };
    } catch (error) {
        console.error("Error toggling pin:", error);
        return { success: false, error: "Failed to toggle pin" };
    }
}

export async function getSetComments(setId: string) {
    try {
        const comments = await db.query.setComments.findMany({
            where: eq(setComments.setId, setId),
            with: {
                user: {
                    columns: {
                        id: true,
                        username: true,
                        image: true,
                    }
                }
            },
            orderBy: [desc(setComments.isPinned), desc(setComments.createdAt)],
        });

        return comments;
    } catch (error) {
        console.error("Error getting comments:", error);
        return [];
    }
}
