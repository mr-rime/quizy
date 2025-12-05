"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { getFlashcardSets } from "@/features/practice/services/flashcards";
import { addSetToFolder, removeSetFromFolder } from "../services/folders";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { FlashcardSet } from "@/types";
import { StudyMaterialList } from "./study-material-list";

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

                    <StudyMaterialList
                        sets={sets}
                        loading={loading}
                        selectedSets={selectedSets}
                        onToggle={toggleSet}
                    />
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
