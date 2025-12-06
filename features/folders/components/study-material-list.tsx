import { FlashcardSet } from "@/types";
import { StudyMaterialItem } from "./study-material-item";
import { Skeleton } from "@/components/skeleton";


interface StudyMaterialListProps {
    sets: FlashcardSet[];
    loading: boolean;
    selectedSets: Set<string>;
    onToggle: (setId: string) => void;
}

export function StudyMaterialList({ sets, loading, selectedSets, onToggle }: StudyMaterialListProps) {
    if (loading) {
        return (
            <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                        <Skeleton className="h-5 w-5 rounded-sm" />
                        <div className="flex-1 space-y-2">
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-3 w-1/4" />
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {sets.map((set) => (
                <StudyMaterialItem
                    key={set.id}
                    set={set}
                    isSelected={selectedSets.has(set.id)}
                    onToggle={onToggle}
                />
            ))}
        </div>
    );
}
