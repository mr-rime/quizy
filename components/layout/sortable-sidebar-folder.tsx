"use client"

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import { Folder as FolderIcon, GripVertical } from "lucide-react";
import { Folder as FolderType } from "@/types";

interface SortableSidebarFolderProps {
    folder: FolderType;
    isActive: boolean;
    onClick: () => void;
}

export function SortableSidebarFolder({ folder, isActive, onClick }: SortableSidebarFolderProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: folder.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 10 : 0,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <li ref={setNodeRef} style={style} className={`group relative flex items-center rounded-lg transition-all duration-200 ${isActive ? "bg-zinc-200 dark:bg-zinc-700 font-semibold" : "hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white"}`}>
            <Link
                href={`/folders/${folder.id}`}
                onClick={onClick}
                className="flex-1 flex items-center gap-3 p-3 text-zinc-700 dark:text-zinc-300"
                prefetch
            >
                <div className="shrink-0 w-5 h-5 flex items-center justify-center">
                    <FolderIcon size={20} />
                </div>
                <span className="truncate text-sm sm:text-base flex-1">{folder.title}</span>
            </Link>
            <div
                {...attributes}
                {...listeners}
                className="shrink-0 p-3 cursor-grab active:cursor-grabbing opacity-40 group-hover:opacity-100 transition-opacity"
            >
                <GripVertical size={16} className="text-zinc-500" />
            </div>
        </li>
    );
}
