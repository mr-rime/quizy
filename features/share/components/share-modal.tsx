"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Check, Copy, Globe, Lock } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toggleSetPrivacy } from "../services/share";
import { useRouter } from "next/navigation";

interface ShareModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    setId: string;
    isPublic: boolean;
    shareUrl: string;
}

export function ShareModal({ open, onOpenChange, setId, isPublic: initialIsPublic, shareUrl }: ShareModalProps) {
    const [copied, setCopied] = useState(false);
    const [isPublic, setIsPublic] = useState(initialIsPublic);
    const [isUpdating, setIsUpdating] = useState(false);
    const router = useRouter();

    const handleCopy = async () => {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleTogglePrivacy = async (checked: boolean) => {
        setIsUpdating(true);
        try {
            await toggleSetPrivacy(setId, checked);
            setIsPublic(checked);
            router.refresh();
        } catch (error) {
            console.error("Failed to toggle privacy:", error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Share this set</DialogTitle>
                    <DialogDescription>
                        {isPublic
                            ? "Anyone with this link can view your set."
                            : "Make this set public to share it with others."}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                            {isPublic ? (
                                <Globe className="h-5 w-5 text-green-600" />
                            ) : (
                                <Lock className="h-5 w-5 text-muted-foreground" />
                            )}
                            <div>
                                <Label htmlFor="privacy-toggle" className="font-medium">
                                    {isPublic ? "Public" : "Private"}
                                </Label>
                                <p className="text-sm text-muted-foreground">
                                    {isPublic
                                        ? "Everyone can view this set"
                                        : "Only you can view this set"}
                                </p>
                            </div>
                        </div>
                        <Switch
                            id="privacy-toggle"
                            checked={isPublic}
                            onCheckedChange={handleTogglePrivacy}
                            disabled={isUpdating}
                        />
                    </div>

                    {isPublic && (
                        <div className="space-y-2">
                            <Label>Share link</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={shareUrl}
                                    readOnly
                                    className="font-mono text-sm"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={handleCopy}
                                    className="shrink-0"
                                >
                                    {copied ? (
                                        <Check className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <Copy className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            {copied && (
                                <p className="text-sm text-green-600">Link copied to clipboard!</p>
                            )}
                        </div>
                    )}

                    {!isPublic && (
                        <div className="p-3 bg-muted rounded-lg">
                            <p className="text-sm text-muted-foreground">
                                Turn on public sharing to generate a shareable link.
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
