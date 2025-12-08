"use server";

import { db } from "@/db/drizzle";
import { flashcardSets, users } from "@/db/schema";
import { eq, desc, ilike, or, sql } from "drizzle-orm";

export const getPublicSets = async (searchQuery?: string, limit = 20, offset = 0) => {
    const whereConditions = [eq(flashcardSets.isPublic, true)];

    if (searchQuery && searchQuery.trim()) {
        whereConditions.push(
            or(
                ilike(flashcardSets.title, `%${searchQuery}%`),
                ilike(flashcardSets.description, `%${searchQuery}%`)
            )!
        );
    }

    const sets = await db
        .select({
            id: flashcardSets.id,
            title: flashcardSets.title,
            description: flashcardSets.description,
            createdAt: flashcardSets.createdAt,
            userId: flashcardSets.userId,
            username: users.username,
            userImage: users.image,
            likeCount: flashcardSets.likeCount,
            cardCount: sql<number>`(select count(*) from card where card.set_id = ${flashcardSets.id})`,
            commentCount: sql<number>`(select count(*) from set_comment where set_comment.set_id = ${flashcardSets.id})`,
            joinCount: sql<number>`(select sum(join_count) from set_join where set_join.set_id = ${flashcardSets.id})`,
        })
        .from(flashcardSets)
        .leftJoin(users, eq(flashcardSets.userId, users.id))
        .where(whereConditions.length > 1 ? sql`${whereConditions[0]} and ${whereConditions[1]}` : whereConditions[0])
        .orderBy(desc(flashcardSets.createdAt))
        .limit(limit)
        .offset(offset);

    return sets;
};

export async function searchPublicSets(query: string) {
    return getPublicSets(query);
}
