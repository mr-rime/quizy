import { FlashcardSet } from "@/types";
import { motion } from "framer-motion";
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
        <motion.div
            className="space-y-2"
            initial="hidden"
            animate="show"
            variants={{
                hidden: { opacity: 0 },
                show: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.05
                    }
                }
            }}
        >
            {sets.map((set) => (
                <motion.div
                    key={set.id}
                    variants={{
                        hidden: { opacity: 0, x: -10 },
                        show: { opacity: 1, x: 0 }
                    }}
                >
                    <StudyMaterialItem
                        set={set}
                        isSelected={selectedSets.has(set.id)}
                        onToggle={onToggle}
                    />
                </motion.div>
            ))}
        </motion.div>
    );
}
