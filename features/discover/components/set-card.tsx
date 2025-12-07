"use client"

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { AuthorInfo } from "./author-info";
import { Heart, MessageSquare, Users, Layers, EyeOff } from "lucide-react";
import { PublicFlashcardSet } from "@/types";
import { Button } from "@/components/ui/button";
import { useState, useTransition } from "react";
import { makeSetPrivate } from "@/features/flashcards/services/admin-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SetCardProps {
    set: PublicFlashcardSet;
    isAdmin?: boolean;
}

export function SetCard({ set, isAdmin = false }: SetCardProps) {
    const [isPending, startTransition] = useTransition();
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const router = useRouter();

    const handleMakePrivate = () => {
        startTransition(async () => {
            const result = await makeSetPrivate(set.id);
            if (result.success) {
                toast.success("Set made private successfully");
                setIsAlertOpen(false);
                router.refresh();
            } else {
                toast.error(result.error || "Failed to make set private");
            }
        });
    };

    return (
        <Link href={`/practice/${set.id}`}>
            <Card className="hover:bg-accent transition-colors cursor-pointer h-full relative">
                {isAdmin && (
                    <div className="absolute top-2 right-2 z-10" onClick={(e) => e.preventDefault()}>
                        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="gap-1"
                                >
                                    <EyeOff className="h-3 w-3" />
                                    Make Private
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Make set private?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will remove &quot;{set.title}&quot; from the discover page. The set will become private and only visible to its owner.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleMakePrivate}
                                        disabled={isPending}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        {isPending ? "Making private..." : "Make Private"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )}
                <CardContent className="p-5 space-y-4">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg truncate">{set.title}</h3>
                        {set.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {set.description}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Layers className="h-4 w-4" />
                            <span>{set.cardCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Heart className="h-4 w-4" />
                            <span>{set.likeCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" />
                            <span>{set.commentCount}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{set.joinCount}</span>
                        </div>
                    </div>

                    {set.username && (
                        <div className="pt-2 border-t">
                            <AuthorInfo username={set.username} image={set.userImage} size="sm" />
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}
