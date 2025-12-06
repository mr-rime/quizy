"use client";

import { Button } from "@/components/ui/button";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { useState, useTransition } from "react";
import { saveSet, unsaveSet } from "../services/saved-sets";
import { toast } from "sonner";

interface SaveButtonProps {
    setId: string;
    initialSaved: boolean;
}

export function SaveButton({ setId, initialSaved }: SaveButtonProps) {
    const [isSaved, setIsSaved] = useState(initialSaved);
    const [isPending, startTransition] = useTransition();

    const handleToggle = () => {
        startTransition(async () => {
            const action = isSaved ? unsaveSet : saveSet;
            const result = await action(setId);

            if (result.success) {
                setIsSaved(!isSaved);
                toast.success(isSaved ? "Removed from saved" : "Saved successfully");
            } else {
                toast.error(result.error || "Failed to update");
            }
        });
    };

    return (
        <Button
            variant={isSaved ? "default" : "outline"}
            className="gap-2"
            onClick={handleToggle}
            disabled={isPending}
        >
            {isSaved ? (
                <>
                    <BookmarkCheck className="h-4 w-4" />
                    Saved
                </>
            ) : (
                <>
                    <Bookmark className="h-4 w-4" />
                    Save
                </>
            )}
        </Button>
    );
}
