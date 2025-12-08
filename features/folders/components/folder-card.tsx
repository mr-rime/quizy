"use client"

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Folder, Layers } from "lucide-react";
import { AuthorInfo } from "@/features/discover/components/author-info";

interface FolderCardProps {
    folder: {
        id: string;
        title: string;
        description: string | null;
        setCount: number;
        username: string | null;
        userImage: string | null;
    };
}

export function FolderCard({ folder }: FolderCardProps) {
    return (
        <Link href={`/folders/${folder.id}`}>
            <Card className="hover:bg-accent transition-colors cursor-pointer h-full">
                <CardContent className="p-5 space-y-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-primary/80">
                            <Folder className="h-4 w-4" />
                            <span className="text-xs uppercase font-medium tracking-wider">Folder</span>
                        </div>
                        <h3 className="font-semibold text-lg truncate">{folder.title}</h3>
                        {folder.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
                                {folder.description}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <Layers className="h-4 w-4" />
                            <span>{folder.setCount} sets</span>
                        </div>
                    </div>

                    {folder.username && (
                        <div className="pt-2 border-t">
                            <AuthorInfo username={folder.username} image={folder.userImage} size="sm" />
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}
