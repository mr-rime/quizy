"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Folder, MoreHorizontal, Plus, Trash2, Edit2, Globe } from "lucide-react";
import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AddStudyMaterialsModal } from "./add-study-materials-modal";
import Image from "next/image";
import { Folder as FolderType } from "@/types";
import { FolderDialog } from "./create-folder-button";
import { togglePublishFolder } from "../services/publish-folder";
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
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
    arrayMove
} from '@dnd-kit/sortable';
import { SortableSetCard } from "./sortable-set-card";
import { updateFolderSetsOrder, deleteFolder } from "../services/folders";


interface FolderViewProps {
    folder: FolderType;
    currentUserId: string;
}

export function FolderView({ folder, currentUserId }: FolderViewProps) {
    const router = useRouter();
    const [isAddMaterialsOpen, setIsAddMaterialsOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [isPublishing, startPublishing] = useTransition();

    const isOwner = currentUserId === folder.userId;

    const [localFolderSets, setLocalFolderSets] = useState(folder.folderSets || []);

    useEffect(() => {
        setLocalFolderSets(folder.folderSets || []);
    }, [folder.folderSets]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = localFolderSets.findIndex((fs) => fs.setId === active.id);
            const newIndex = localFolderSets.findIndex((fs) => fs.setId === over.id);

            const newOrder = arrayMove(localFolderSets, oldIndex, newIndex);
            setLocalFolderSets(newOrder);

            try {
                await updateFolderSetsOrder(folder.id, newOrder.map(fs => fs.setId));
                toast.success("Order updated");
            } catch (err) {
                console.error(err);
                toast.error("Failed to update order");
                setLocalFolderSets(localFolderSets);
            }
        }
    };


    const handleDelete = async () => {
        try {
            await deleteFolder(folder.id);
            toast.success("Folder deleted");
            router.push("/");
        } catch (err) {
            console.error(err)
            toast.error("Failed to delete folder");
        }
    };

    const handlePublish = () => {
        startPublishing(async () => {
            const result = await togglePublishFolder(folder.id);
            if (result.success) {
                toast.success(result.isPublished ? "Folder published" : "Folder unpublished");
            } else {
                toast.error(result.error || "Failed to update publish status");
            }
        });
    }

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg shrink-0">
                        <Folder className="h-8 w-8" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-xl sm:text-2xl font-bold truncate">{folder.title}</h1>
                            {folder.isPublished && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 shrink-0">
                                    <Globe className="h-3 w-3" />
                                    Public
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                            <span>{folder.folderSets?.length || 0} sets</span>
                            {folder.description && (
                                <>
                                    <span>•</span>
                                    <span className="truncate max-w-[200px] sm:max-w-none">{folder.description}</span>
                                </>
                            )}
                            {folder.user && (
                                <>
                                    <span>•</span>
                                    <span>By {folder.user.username}</span>
                                </>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start">
                    {isOwner && (
                        <>
                            {folder.isPublished ? (
                                <Button
                                    variant="outline"
                                    onClick={handlePublish}
                                    disabled={isPublishing}
                                >
                                    {isPublishing ? "Updating..." : "Unpublish"}
                                </Button>
                            ) : (
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            disabled={isPublishing}
                                        >
                                            {isPublishing ? "Updating..." : "Publish"}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Publish this folder?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This will make your folder visible to everyone.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={handlePublish}>Publish</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            )}

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="rounded-full">
                                        <MoreHorizontal className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                                        <Edit2 className="mr-2 h-4 w-4" />
                                        Edit
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => setIsDeleteDialogOpen(true)}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    )}
                </div>
            </div>

            {(folder.folderSets?.length || 0) === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 bg-zinc-50 dark:bg-zinc-900 rounded-xl border-2 border-dashed">
                    <div className="flex gap-4 mb-6">
                        <div className="w-12 h-16 bg-blue-500 rounded-md rotate-[-10deg] opacity-80"></div>
                        <div className="w-12 h-16 bg-pink-500 rounded-md rotate-[5deg] opacity-80"></div>
                        <div className="w-12 h-16 bg-orange-500 rounded-md rotate-15 opacity-80"></div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Let&apos;s start building your folder</h3>
                    {isOwner && (
                        <Button onClick={() => setIsAddMaterialsOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                            Add study materials
                        </Button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {isOwner && (
                        <div className="flex justify-start">
                            <Button onClick={() => setIsAddMaterialsOpen(true)} variant="outline" className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add set
                            </Button>
                        </div>
                    )}
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext
                            items={localFolderSets.map(fs => fs.setId)}
                            strategy={rectSortingStrategy}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {localFolderSets.map(({ set }) => {
                                    if (!set) return null;
                                    return (
                                        <SortableSetCard
                                            key={set.id}
                                            set={set}
                                            isOwner={isOwner}
                                        />
                                    );
                                })}
                            </div>
                        </SortableContext>
                    </DndContext>
                </div>

            )}

            <AddStudyMaterialsModal
                open={isAddMaterialsOpen}
                onOpenChange={setIsAddMaterialsOpen}
                folderId={folder.id}
                currentSetIds={folder.folderSets?.map((fs) => fs.setId) || []}
            />

            <FolderDialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                folder={folder}
            />

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your folder.
                            The sets inside the folder will not be deleted.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
