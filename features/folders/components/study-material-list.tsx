import { FlashcardSet } from "@/types";
import { StudyMaterialItem } from "./study-material-item";

interface StudyMaterialListProps {
    sets: FlashcardSet[];
    loading: boolean;
    selectedSets: Set<string>;
    onToggle: (setId: string) => void;
}

export function StudyMaterialList({ sets, loading, selectedSets, onToggle }: StudyMaterialListProps) {
    if (loading) {
        return <div className="text-center py-8 text-muted-foreground">Loading...</div>;
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
