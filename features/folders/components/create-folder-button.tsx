"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFolderSchema, CreateFolderSchema } from "../utils/validations";
import { createFolder, updateFolder } from "../services/folders";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Folder } from "@/types";
import { useEffect } from "react";

interface FolderDialogProps {
    open: boolean;
    onOpenChange: (o: boolean) => void;
    folder?: Folder;
}

export function FolderDialog({ open, onOpenChange, folder }: FolderDialogProps) {
    const router = useRouter();
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<CreateFolderSchema>({
        resolver: zodResolver(createFolderSchema),
        defaultValues: {
            title: "",
            description: ""
        }
    });

    useEffect(() => {
        if (folder) {
            reset({
                title: folder.title,
                description: folder.description || ""
            });
        } else {
            reset({
                title: "",
                description: ""
            });
        }
    }, [folder, reset, open]);

    const onSubmit = async (data: CreateFolderSchema) => {
        try {
            if (folder) {
                await updateFolder(folder.id, data);
                toast.success("Folder updated");
            } else {
                await createFolder(data);
                toast.success("Folder created");
            }
            onOpenChange(false);
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error(folder ? "Failed to update folder" : "Failed to create folder");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{folder ? "Edit Folder" : "Create Folder"}</DialogTitle>
                    <DialogDescription>
                        {folder ? "Update your folder details." : "Add a new folder to organize your flashcard sets."}
                    </DialogDescription>
                </DialogHeader>
                <form id="folder-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder="e.g. Biology 101"
                            {...register("title")}
                            className={errors.title ? "border-red-500" : ""}
                        />
                        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description (optional)</Label>
                        <Textarea
                            id="description"
                            placeholder="Description..."
                            {...register("description")}
                            className={errors.description ? "border-red-500" : ""}
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                    </div>
                </form>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button type="submit" form="folder-form" disabled={isSubmitting}>
                        {isSubmitting ? (folder ? "Saving..." : "Creating...") : (folder ? "Save Changes" : "Create Folder")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
