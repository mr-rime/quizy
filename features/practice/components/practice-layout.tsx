"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Share, Layers, BrainCircuit, PenTool } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PracticeDropdown } from "./practice-dropdown";
import { use, useState, useEffect, useTransition, Suspense } from "react";
import { getFlashcardSet } from "../services/flashcards";
import { ShareModal } from "@/features/share/components/share-modal";
import { generateShareUrl } from "@/features/share/services/share";
import { AuthorInfo } from "@/features/discover/components/author-info";
import { LikeButton } from "@/features/social/components/like-button";
import { CommentSection } from "@/features/social/components/comment-section";
import { trackSetJoin } from "@/features/social/services/joins";
import { saveSet, unsaveSet } from "@/features/saved-sets/services/saved-sets";
import { toast } from "sonner";
import { togglePublishSet } from "@/features/flashcards/services/publish-set";
import type { CommentWithUser } from "@/types";
import { Skeleton } from "@/components/skeleton";
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



interface PracticeLayoutProps<T> {
    flashcardSetPromise: Promise<T>;
    currentUserId: string;
    currentUsername?: string | null;
    isSaved?: boolean;
    isLiked?: boolean;
    isAdmin?: boolean;
    commentsPromise: Promise<CommentWithUser[]>;
    children?: React.ReactNode;
}

export function PracticeLayout<T>({
    flashcardSetPromise,
    currentUserId,
    isSaved = false,
    isLiked = false,
    isAdmin = false,
    commentsPromise,
    children
}: PracticeLayoutProps<T>) {
    const router = useRouter();
    const [shareModalOpen, setShareModalOpen] = useState(false);
    const [shareUrl, setShareUrl] = useState("");
    const [saved, setSaved] = useState(isSaved);
    const [isPending, startTransition] = useTransition();
    const [isPublishing, startPublishing] = useTransition();

    const set = use(flashcardSetPromise) as Awaited<ReturnType<typeof getFlashcardSet>>;

    useEffect(() => {
        if (set?.id) {
            generateShareUrl(set.id).then(setShareUrl);

            if (set.userId !== currentUserId) {
                trackSetJoin(set.id, currentUserId).catch(console.error);
            }
        }
    }, [set?.id, currentUserId, set?.userId]);

    const handleSave = () => {
        startTransition(async () => {
            const newSavedState = !saved;
            setSaved(newSavedState);

            const result = newSavedState
                ? await saveSet(set?.id || "")
                : await unsaveSet(set?.id || "");

            if (!result.success) {
                setSaved(!newSavedState);
                toast.error(result.error || "Failed to update save status");
            } else {
                toast.success(newSavedState ? "Set saved" : "Set unsaved");
            }
        });
    };

    const handlePublish = () => {
        startPublishing(async () => {
            if (!set?.id) return;

            const result = await togglePublishSet(set.id);

            if (result.success) {
                toast.success(result.isPublished ? "Set published to Discover" : "Set unpublished from Discover");
            } else {
                toast.error(result.error || "Failed to update publish status");
            }
        });
    }

    if (!set) {
        return <p className="text-center py-8 text-muted-foreground">Flashcard set not found.</p>;
    }

    const { id: setId, title, cards, isPublic, isPublished } = set;



    const cardCount = cards.length;

    return (
        <div className="container mx-auto p-4 sm:p-6 max-w-5xl space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <Button variant="ghost" size="icon" onClick={() => router.push("/latest")} className="shrink-0">
                        <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                    </Button>
                    <div className="min-w-0">
                        <h1 className="text-2xl sm:text-3xl font-bold truncate">{title}</h1>
                        <p className="text-sm sm:text-base text-muted-foreground">{cardCount} terms</p>
                    </div>
                </div>
                {set.userId === currentUserId ? (
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Button variant="outline" className="gap-2 flex-1 sm:flex-initial" onClick={() => setShareModalOpen(true)}>
                            <Share className="h-4 w-4" />
                            <span className="sm:inline">Share</span>
                        </Button>

                        {isPublished ? (
                            <Button
                                variant="secondary"
                                onClick={handlePublish}
                                disabled={isPublishing}
                            >
                                {isPublishing ? "Updating..." : "Unpublish"}
                            </Button>
                        ) : (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button
                                        variant="default"
                                        disabled={isPublishing}
                                    >
                                        {isPublishing ? "Updating..." : "Publish"}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Publish this set?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This will make your flashcard set visible to everyone in the Discover section.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction onClick={handlePublish}>Publish</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                        <PracticeDropdown setId={setId} />
                    </div>
                ) : set.userId !== currentUserId && (
                    <Button
                        variant={saved ? "default" : "outline"}
                        onClick={handleSave}
                        disabled={isPending}
                        className="w-full sm:w-auto"
                    >
                        {saved ? "Saved" : "Save"}
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <Link href={`/practice/${setId}/flashcards`}>
                    <Card className="p-4 sm:p-6 hover:bg-accent transition-colors cursor-pointer flex items-center justify-between group">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2 sm:p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Layers className="h-5 w-5 sm:h-6 sm:w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-base sm:text-lg">Flashcards</h3>
                                <p className="text-xs sm:text-sm text-muted-foreground">Review terms and definitions</p>
                            </div>
                        </div>
                    </Card>
                </Link>
                <Link href={`/practice/${setId}/quizes`}>
                    <Card className="p-4 sm:p-6 hover:bg-accent transition-colors cursor-pointer flex items-center justify-between group">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2 sm:p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <BrainCircuit className="h-5 w-5 sm:h-6 sm:w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-base sm:text-lg">Quizzes</h3>
                                <p className="text-xs sm:text-sm text-muted-foreground">Test your knowledge</p>
                            </div>
                        </div>
                    </Card>
                </Link>
                <Link href={`/practice/${setId}/writing`}>
                    <Card className="p-4 sm:p-6 hover:bg-accent transition-colors cursor-pointer flex items-center justify-between group">
                        <div className="flex items-center gap-3 sm:gap-4">
                            <div className="p-2 sm:p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <PenTool className="h-5 w-5 sm:h-6 sm:w-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-base sm:text-lg">Writing</h3>
                                <p className="text-xs sm:text-sm text-muted-foreground">Type the answer</p>
                            </div>
                        </div>
                    </Card>
                </Link>
            </div>

            {children}

            {set.user && (
                <div className="border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-muted-foreground mb-2">Created by</p>
                            <AuthorInfo
                                username={set.user.username}
                                image={set.user.image}
                                size="md"
                            />
                        </div>
                        <LikeButton
                            setId={set.id}
                            userId={currentUserId}
                            initialLiked={isLiked}
                            initialCount={set.likeCount ?? 0}
                        />
                    </div>
                </div>
            )}

            <div className="border-t pt-6">
                <Suspense
                    fallback={
                        <div className="space-y-4">
                            <Skeleton className="h-6 w-40 rounded" />
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <Skeleton key={i} className="h-16 w-full rounded" />
                                ))}
                            </div>
                        </div>
                    }
                >
                    <CommentSection
                        setId={set.id}
                        userId={currentUserId}
                        setOwnerId={set.userId}
                        isAdmin={isAdmin}
                        commentsPromise={commentsPromise}
                    />
                </Suspense>
            </div>

            <ShareModal
                open={shareModalOpen}
                onOpenChange={setShareModalOpen}
                setId={setId}
                isPublic={isPublic ?? false}
                shareUrl={shareUrl}
            />
        </div>
    );
}
