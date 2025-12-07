"use client"

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addComment } from "../services/comments";
import { toast } from "sonner";

interface CommentFormProps {
    setId: string;
    userId: string;
    onCommentAdded?: () => void;
}

export function CommentForm({ setId, userId, onCommentAdded }: CommentFormProps) {
    const [content, setContent] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) {
            toast.error("Comment cannot be empty");
            return;
        }

        startTransition(async () => {
            const result = await addComment(setId, userId, content);

            if (result.success) {
                setContent("");
                toast.success("Comment added successfully");
                onCommentAdded?.();
            } else {
                toast.error(result.error || "Failed to add comment");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Add a comment..."
                maxLength={1000}
                rows={3}
                className="resize-none"
            />
            <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                    {content.length}/1000
                </span>
                <Button type="submit" disabled={isPending || !content.trim()} size="sm">
                    {isPending ? "Posting..." : "Post Comment"}
                </Button>
            </div>
        </form>
    );
}
