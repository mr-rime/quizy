import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export interface Example {
    english: string;
    arabic: string;
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
                        examples.map((example, i) => (
                            <div key={i} className="bg-muted/30 p-4 rounded-lg space-y-3">
                                <div className="flex gap-2">
                                    <span className="text-primary font-bold">•</span>
                                    <p className="text-base leading-relaxed">{example.english}</p>
                                </div>
                                <p className="text-lg text-right font-arabic text-muted-foreground leading-relaxed" dir="rtl">{example.arabic}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted-foreground py-4">No examples available.</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
