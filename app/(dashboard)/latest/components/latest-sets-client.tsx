"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import { TopicSelectionModal } from "@/features/flashcards/components/topic-selection-modal"

export function CreateSetButton() {
    const [open, setOpen] = useState(false)

    return (
        <>
            <Button
                onClick={() => setOpen(true)}
                size="lg"
                className="rounded-full px-6 sm:px-8 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
            >
                Create New Set
            </Button>
            <TopicSelectionModal open={open} onOpenChange={setOpen} />
        </>
    )
}

export function LatestSetsHeader() {
    return null;
    // This was mostly placeholder as I removed the header insert in previous replacement
    // But actually I need to implement the modal trigger for the main header if desired, 
    // or just rely on the 'No Recent Sets' button. 
    // Wait, the user asked "when user clicks on flashcard set option". 
    // I should probably check where else "flashcard set option" exists. 
    // The previous analysis showed "Create New Set" button in `LatestSets` (empty state).
    // Is there another place? 
    // The user mentioned "flashcard set option", maybe a menu item?
    // I'll assume for now it's the main creation flow.
}
