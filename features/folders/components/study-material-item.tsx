import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { FlashcardSet } from "@/types";
import { Check, Plus } from "lucide-react";

interface StudyMaterialItemProps {
    set: FlashcardSet;
    isSelected: boolean;
    onToggle: (setId: string) => void;
}

export function StudyMaterialItem({ set, isSelected, onToggle }: StudyMaterialItemProps) {
    return (
        <div
            className="flex items-center justify-between p-4 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer group transition-colors"
            onClick={() => onToggle(set.id)}
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
}
