import { useState, useTransition } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateComment, deleteComment, togglePinComment } from "../services/comments";
import { toast } from "sonner";
import { Pencil, Trash2, Pin, PinOff } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface CommentItemProps {
    comment: {
        id: string;
        content: string;
        createdAt: Date | null;
        userId: string;
        isPinned: boolean;
        user: {
            id: string;
            username: string;
            image: string | null;
        } | null;
    };
    currentUserId: string;
    isSetOwner: boolean;
    onCommentUpdated?: () => void;
}

export function CommentItem({ comment, currentUserId, isSetOwner, onCommentUpdated }: CommentItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [isPending, startTransition] = useTransition();

    const isCommentAuthor = comment.userId === currentUserId;

    const handleUpdate = () => {
        if (!editContent.trim()) {
            toast.error("Comment cannot be empty");
            return;
        }

        startTransition(async () => {
            const result = await updateComment(comment.id, currentUserId, editContent);

            if (result.success) {
                setIsEditing(false);
                toast.success("Comment updated");
                onCommentUpdated?.();
            } else {
                toast.error(result.error || "Failed to update comment");
            }
        });
    };

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this comment?")) {
            return;
        }

        startTransition(async () => {
            const result = await deleteComment(comment.id, currentUserId);

            if (result.success) {
                toast.success("Comment deleted");
                onCommentUpdated?.();
            } else {
                toast.error(result.error || "Failed to delete comment");
            }
        });
    };

    const handleTogglePin = () => {
        startTransition(async () => {
            const result = await togglePinComment(comment.id, currentUserId);

            if (result.success) {
                toast.success(result.isPinned ? "Comment pinned" : "Comment unpinned");
                onCommentUpdated?.();
            } else {
                toast.error(result.error || "Failed to update pin status");
            }
        });
    };

    return (
        <div className={cn(
            "flex gap-3 p-4 rounded-lg transition-colors border",
            comment.isPinned ? "bg-primary/5 border-primary/20" : "bg-muted/50 border-transparent"
        )}>
            <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                        {comment.user?.username?.[0]?.toUpperCase() || "U"}
                    </span>
                </div>
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{comment.user?.username || "Unknown"}</span>
                        {comment.createdAt && (
                            <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                            </span>
                        )}
                    </div>
                    {comment.isPinned && (
                        <div className="flex items-center gap-1 text-xs font-medium text-primary">
                            <Pin className="h-3 w-3 fill-current" />
                            <span>Pinned</span>
                        </div>
                    )}
                </div>

                {isEditing ? (
                    <div className="space-y-2">
                        <Textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            maxLength={1000}
                            rows={3}
                            className="resize-none"
                        />
                        <div className="flex gap-2">
                            <Button onClick={handleUpdate} disabled={isPending} size="sm">
                                Save
                            </Button>
                            <Button onClick={() => setIsEditing(false)} disabled={isPending} variant="outline" size="sm">
                                Cancel
                            </Button>
                        </div>
                    </div>
                ) : (
                    <>
                        <p className="text-sm text-foreground whitespace-pre-wrap break-words">{comment.content}</p>
                        <div className="flex items-center gap-2 mt-2">
                            {isCommentAuthor && (
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                                >
                                    <Pencil className="h-3 w-3" />
                                    Edit
                                </button>
                            )}
                            {(isCommentAuthor || isSetOwner) && (
                                <button
                                    onClick={handleDelete}
                                    disabled={isPending}
                                    className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1"
                                >
                                    <Trash2 className="h-3 w-3" />
                                    Delete
                                </button>
                            )}
                            {isSetOwner && (
                                <button
                                    onClick={handleTogglePin}
                                    disabled={isPending}
                                    className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                                >
                                    {comment.isPinned ? <PinOff className="h-3 w-3" /> : <Pin className="h-3 w-3" />}
                                    {comment.isPinned ? "Unpin" : "Pin"}
                                </button>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
