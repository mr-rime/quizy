"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { FlashCardIcon } from "@/shared/ui/icons/flashcard-icon"
import { Plus } from "lucide-react"
import Link from "next/link"
import { FolderDialog } from "@/features/folders/components/create-folder-button"
import { TopicSelectionModal } from "./topic-selection-modal"

export function CreateFlashcardMenu() {
    const [openFolderDialog, setOpenFolderDialog] = useState(false)
    const [openTopicModal, setOpenTopicModal] = useState(false)

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="relative flex size-9 shrink-0 overflow-hidden rounded-full">
                        <Plus className="text-4xl" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-40 relative -left-2" align="end">

                    <DropdownMenuItem onSelect={() => setOpenTopicModal(true)}>
                        <FlashCardIcon /> Flashcard set
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setOpenFolderDialog(true)}>
                        <FlashCardIcon /> Create folder
                    </DropdownMenuItem>

                </DropdownMenuContent>
            </DropdownMenu>

            <FolderDialog
                open={openFolderDialog}
                onOpenChange={setOpenFolderDialog}
            />
            <TopicSelectionModal
                open={openTopicModal}
                onOpenChange={setOpenTopicModal}
            />
        </>
    )
}
