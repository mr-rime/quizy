"use client"

import { Heart } from "lucide-react";
import { useState, useTransition } from "react";
import { likeSet } from "../services/likes";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
    setId: string;
    userId: string;
    initialLiked: boolean;
    initialCount: number;
    variant?: "default" | "compact";
}

export function LikeButton({ setId, userId, initialLiked, initialCount, variant = "default" }: LikeButtonProps) {
    const [liked, setLiked] = useState(initialLiked);
    const [likeCount, setLikeCount] = useState(initialCount);
    const [isPending, startTransition] = useTransition();

    const handleLike = () => {
        const newLiked = !liked;
        const optimisticCount = likeCount + (newLiked ? 1 : -1);

        setLiked(newLiked);
        setLikeCount(optimisticCount);

        startTransition(async () => {
            const result = await likeSet(setId);

            if (!result.success) {
                // Revert on error
                setLiked(!newLiked);
                setLikeCount(likeCount);
                toast.error(result.error || "Failed to update like");
            }
        });
    };

    if (variant === "compact") {
        return (
            <button
                onClick={handleLike}
                disabled={isPending}
                className="flex items-center gap-1 text-sm text-muted-foreground hover:text-red-500 transition-colors disabled:opacity-50"
            >
                <Heart className={cn(
                    "h-4 w-4 transition-all",
                    liked && "fill-red-500 text-red-500"
                )} />
                <span>{likeCount}</span>
            </button>
        );
    }

    return (
        <button
            onClick={handleLike}
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-background hover:bg-accent transition-colors disabled:opacity-50"
        >
            <Heart className={cn(
                "h-5 w-5 transition-all",
                liked && "fill-red-500 text-red-500"
            )} />
            <span className="text-sm font-medium">{likeCount} {likeCount === 1 ? "Like" : "Likes"}</span>
        </button>
    );
}
