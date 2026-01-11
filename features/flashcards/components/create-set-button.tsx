"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { TopicSelectionModal } from "./topic-selection-modal"
import { cn } from "@/lib/utils"

interface CreateSetButtonProps {
    className?: string;
    children?: React.ReactNode;
    size?: "default" | "sm" | "lg" | "icon";
}

export function CreateSetButton({ className, children, size = "lg" }: CreateSetButtonProps) {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                size={size}
                className={cn(className)}
            >
                {children || "Create New Set"}
            </Button>
            <TopicSelectionModal open={open} onOpenChange={setOpen} />
        </>
    )
}
