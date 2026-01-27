import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export interface Example {
    english: string;
    arabic: string;
    [key: string]: string;
}

interface ExamplesModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    examples: Example[];
}

export function ExamplesModal({ open, onOpenChange, examples }: ExamplesModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Examples</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto py-2">
                    {examples && examples.length > 0 ? (
                        examples.map((example, i) => {
                            const sortedEntries = Object.entries(example).sort(([keyA], [keyB]) => {
                                const order = ['english', 'arabic', 'egyptian'];
                                const indexA = order.indexOf(keyA);
                                const indexB = order.indexOf(keyB);

                                if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                                if (indexA !== -1) return -1;
                                if (indexB !== -1) return 1;
                                return keyA.localeCompare(keyB);
                            });

                            return (
                                <div key={i} className="bg-muted/30 p-4 rounded-lg space-y-3">
                                    {sortedEntries.map(([key, value]) => {
                                        if (key === 'english') {
                                            return (
                                                <div key={key} className="flex gap-2">
                                                    <span className="text-primary font-bold">•</span>
                                                    <p className="text-base leading-relaxed">{value}</p>
                                                </div>
                                            );
                                        }
                                        if (key === 'arabic') {
                                            return (
                                                <p key={key} className="text-lg text-right font-arabic text-muted-foreground leading-relaxed" dir="rtl">
                                                    {value}
                                                </p>
                                            );
                                        }
                                        if (key === 'egyptian') {
                                            return (
                                                <p key={key} className="text-lg text-right font-arabic text-amber-600/80 leading-relaxed" dir="rtl">
                                                    (Egyptian: {value})
                                                </p>
                                            );
                                        }
                                        return (
                                            <div key={key} className="text-sm text-muted-foreground flex justify-between border-t pt-2 mt-2">
                                                <span className="font-semibold capitalize">{key}:</span>
                                                <span>{value}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })
                    ) : (
                        <p className="text-center text-muted-foreground py-4">No examples available.</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
