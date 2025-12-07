"use client"

import { use } from "react";
import { CommentForm } from "./comment-form";
import { CommentItem } from "./comment-item";
import { MessageSquare } from "lucide-react";
import type { CommentWithUser } from "@/types";

interface CommentSectionProps {
    setId: string;
    userId: string;
    setOwnerId: string;
    isAdmin?: boolean;
    commentsPromise: Promise<CommentWithUser[]>;
}

export function CommentSection({ setId, userId, setOwnerId, isAdmin = false, commentsPromise }: CommentSectionProps) {
    const comments = use(commentsPromise);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                <h3 className="text-lg font-semibold">
                    Comments ({comments.length})
                </h3>
            </div>

            <CommentForm setId={setId} userId={userId} />

            <div className="space-y-3">
                {comments.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                        No comments yet. Be the first to comment!
                    </p>
                ) : (
                    comments.map((comment) => (
                        <CommentItem
                            key={comment.id}
                            comment={comment}
                            currentUserId={userId}
                            isSetOwner={userId === setOwnerId}
                            isAdmin={isAdmin}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
