"use client"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { deleteProgress } from "../services/progress"
import { toast } from "sonner"
import { useState } from "react"

export function ProgressDropdown({ progressId }: { progressId: string }) {
    const [open, setOpen] = useState(false)

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation()
        try {
            await deleteProgress(progressId)
            toast.success("Progress removed")
            setOpen(false)
        } catch (err) {
            console.error("Failed to remove progress:", err)
            toast.error("Failed to remove progress")
        }
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-destructive focus:text-destructive"
                >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
