"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Folder, MoreHorizontal, Plus, Trash2, Edit2, Globe, Lock } from "lucide-react";
import { useState, useTransition } from "react";
import Link from "next/link";
import { deleteFolder } from "../services/folders";
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
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
                        <Folder className="h-8 w-8" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <h1 className="text-2xl font-bold">{folder.title}</h1>
                            {folder.isPublished && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100">
                                    <Globe className="h-3 w-3" />
                                    Public
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{folder.folderSets?.length || 0} sets</span>
                            {folder.description && (
                                <>
                                    <span>•</span>
                                    <span>{folder.description}</span>
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
                <div className="flex items-center gap-2">
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
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {isOwner && (
                        <div className="col-span-full flex justify-start">
                            <Button onClick={() => setIsAddMaterialsOpen(true)} variant="outline" className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add set
                            </Button>
                        </div>
                    )}
                    {folder.folderSets?.map(({ set }) => {
                        if (!set) return null;
                        return (
                            <Link key={set.id} href={`/practice/${set.id}`}>
                                <Card className="hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer h-full">
                                    <CardHeader>
                                        <CardTitle className="flex items-start justify-between gap-2">
                                            <span className="line-clamp-2">{set.title}</span>
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground">{set.cards?.length || 0} terms</p>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <div className="h-6 w-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                                                {set.user?.image ? (
                                                    <Image src={set.user.image} alt={set.user.username} className="h-full w-full object-cover" />
                                                ) : (
                                                    <span className="text-xs">{set.user?.username?.[0]?.toUpperCase()}</span>
                                                )}
                                            </div>
                                            <span>{set.user?.username}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        );
                    })}
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
