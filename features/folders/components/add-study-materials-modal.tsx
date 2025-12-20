"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { searchUserFlashcardSets } from "@/features/practice/services/flashcards";
import { addSetToFolder, removeSetFromFolder } from "../services/folders";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { FlashcardSet } from "@/types";
import { StudyMaterialList } from "./study-material-list";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/hooks/use-debounce";

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
    const [searchQuery, setSearchQuery] = useState("");

    const debouncedSearchQuery = useDebounce(searchQuery, 300);

    useEffect(() => {
        if (open) {
            setSearchQuery("");
            loadSets("");
            setSelectedSets(new Set(currentSetIds));
        }
    }, [open, currentSetIds]);

    useEffect(() => {
        if (open) {
            loadSets(debouncedSearchQuery);
        }
    }, [debouncedSearchQuery, open]);

    const loadSets = async (query: string) => {
        setLoading(true);
        try {
            const data = await searchUserFlashcardSets(query, 7);
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
        } catch (err) {
            console.error(err)
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
                    <div className="flex flex-col gap-4 mb-4">
                        <div className="flex justify-between items-center">
                            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">Flashcard sets</h3>
                            <Button variant="ghost" asChild className="text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                                <Link href={"/create-set"}>
                                    <Plus className="h-4 w-4" />
                                    Create new
                                </Link>
                            </Button>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search sets..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9"
                            />
                        </div>
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
