"use client"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { BookA, Grid2X2 } from "lucide-react"

interface TopicSelectionModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function TopicSelectionModal({ open, onOpenChange }: TopicSelectionModalProps) {
    const router = useRouter()

    const handleSelect = (category: "english" | "other") => {
        onOpenChange(false)
        router.push(`/create-set?category=${category}`)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Select Topic Category</DialogTitle>
                    <DialogDescription>
                        Choose the type of flashcard set you want to create.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    <button
                        onClick={() => handleSelect("english")}
                        className="flex flex-col items-center justify-center gap-4 p-8 rounded-xl border-2 border-border/50 hover:border-indigo-500/50 hover:bg-indigo-500/5 transition-all text-center group"
                    >
                        <div className="p-4 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                            <BookA className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-1">English Vocabulary</h3>
                            <p className="text-sm text-muted-foreground">Perfect for words, definitions, and language learning</p>
                        </div>
                    </button>

                    <button
                        onClick={() => handleSelect("other")}
                        className="flex flex-col items-center justify-center gap-4 p-8 rounded-xl border-2 border-border/50 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all text-center group"
                    >
                        <div className="p-4 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform">
                            <Grid2X2 className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-1">Other Topics</h3>
                            <p className="text-sm text-muted-foreground">General purpose flashcards for any subject</p>
                        </div>
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
