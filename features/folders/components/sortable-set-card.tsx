"use client"

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GripVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FlashcardSet } from "@/types";

interface SortableSetCardProps {
    set: FlashcardSet;
    isOwner: boolean;
}

export function SortableSetCard({ set, isOwner }: SortableSetCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: set.id, disabled: !isOwner });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 0,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group">
            <Link href={`/practice/${set.id}`}>
                <Card className="hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-pointer h-full">
                    <CardHeader>
                        <CardTitle className="flex items-start justify-between gap-2">
                            <span className="line-clamp-2">{set.title}</span>
                            {isOwner && (
                                <div
                                    {...attributes}
                                    {...listeners}
                                    className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded cursor-grab active:cursor-grabbing opacity-40 group-hover:opacity-100 transition-opacity"
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                </div>
                            )}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">{set.cards?.length || 0} terms</p>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="shrink-0 h-6 w-6 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden">
                                {set.user?.image ? (
                                    <Image src={set.user.image} alt={set.user.username} className="h-full w-full object-cover" unoptimized width={24} height={24} />
                                ) : (
                                    <span className="text-xs">{set.user?.username?.[0]?.toUpperCase()}</span>
                                )}
                            </div>
                            <span className="truncate">{set.user?.username}</span>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </div>
    );
}
