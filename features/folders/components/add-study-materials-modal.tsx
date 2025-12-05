"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { getFlashcardSets } from "@/features/practice/services/flashcards";
import { addSetToFolder, removeSetFromFolder } from "../services/folders";
import { Plus, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { FlashcardSet } from "@/types";

interface AddStudyMaterialsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    folderId: string;
    currentSetIds: string[];
}

export function AddStudyMaterialsModal({ open, onOpenChange, folderId, currentSetIds }: AddStudyMaterialsModalProps) {
    const [sets, setSets] = useState<FlashcardSet[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedSets, setSelectedSets] = useState<Set<string>>(new Set(currentSetIds));

    useEffect(() => {
        if (open) {
            loadSets();
            setSelectedSets(new Set(currentSetIds));
        }
    }, [open, currentSetIds]);

    const loadSets = async () => {
        setLoading(true);
        try {
            const data = await getFlashcardSets();
            setSets(data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load sets");
        } finally {
            setLoading(false);
        }
    };

    const toggleSet = async (setId: string) => {
        const isSelected = selectedSets.has(setId);
        const newSelected = new Set(selectedSets);

        try {
            if (isSelected) {
                await removeSetFromFolder(folderId, setId);
                newSelected.delete(setId);
                toast.success("Removed from folder");
            } else {
                await addSetToFolder(folderId, setId);
                newSelected.add(setId);
                toast.success("Added to folder");
            }
            setSelectedSets(newSelected);
        } catch (error) {
            toast.error("Failed to update folder");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl h-[600px] flex flex-col p-0 gap-0">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-2xl">Add study materials</DialogTitle>
                </DialogHeader>

                <div className="flex gap-2 px-6 pb-4 border-b">
                    <Button variant="outline" className="rounded-full">Your library</Button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Flashcard sets</h3>
                        <Button variant="ghost" className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                            <Plus className="h-4 w-4 mr-2" />
                            Create new
                        </Button>
                    </div>

                    <div className="space-y-2">
                        {loading ? (
                            <div className="text-center py-8 text-muted-foreground">Loading...</div>
                        ) : (
                            sets.map((set) => {
                                const isSelected = selectedSets.has(set.id);
                                return (
                                    <div
                                        key={set.id}
                                        className="flex items-center justify-between p-4 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer group transition-colors"
                                        onClick={() => toggleSet(set.id)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400">
                                                <div className="w-5 h-6 border-2 border-current rounded-sm relative">
                                                    <div className="absolute top-1 left-1 w-full h-full border-2 border-current rounded-sm opacity-50"></div>
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">{set.title}</h4>
                                                <p className="text-sm text-muted-foreground">Flashcard set • {set.cards?.length || 0} terms</p>
                                            </div>
                                        </div>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className={cn(
                                                "rounded-full border transition-all",
                                                isSelected
                                                    ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:text-white"
                                                    : "border-zinc-200 dark:border-zinc-700 text-transparent hover:text-zinc-500"
                                            )}
                                        >
                                            {isSelected ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                <div className="p-6 border-t flex justify-end">
                    <Button onClick={() => onOpenChange(false)} className="bg-blue-600 hover:bg-blue-700 text-white px-8">
                        Done
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
