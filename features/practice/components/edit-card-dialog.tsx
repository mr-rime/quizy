import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editFlashcardSchema, EditFlashcardSchema } from "../utils/validations";
import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { Plus, Trash, Sparkles } from "lucide-react";

interface EditCardDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialTerm: string;
    initialDefinition: string | null;
    initialExamples?: { english: string; arabic: string }[];
    onSubmit: (data: EditFlashcardSchema) => Promise<void>;
}

export function EditCardDialog({
    open,
    onOpenChange,
    initialTerm,
    initialDefinition,
    initialExamples = [],
    onSubmit
}: EditCardDialogProps) {
    const { register, control, handleSubmit, reset, formState: { errors, isSubmitting }, setValue } = useForm<EditFlashcardSchema>({
        resolver: zodResolver(editFlashcardSchema),
        defaultValues: {
            term: initialTerm,
            definition: initialDefinition || "",
            examples: initialExamples || []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "examples"
    });

    useEffect(() => {
        if (open) {
            reset({
                term: initialTerm,
                definition: initialDefinition || "",
                examples: initialExamples || []
            });
        }
    }, [open, initialTerm, initialDefinition, initialExamples, reset]);

    const handleTranslate = async (index: number, text: string) => {
        if (!text) return;

        setValue(`examples.${index}.arabic`, "Translating...", { shouldValidate: true });
        try {
            const res = await fetch(`/api/translate?text=${encodeURIComponent(text)}`);
            const data = await res.json();
            if (data.translatedText) {
                setValue(`examples.${index}.arabic`, data.translatedText, { shouldValidate: true });
            }
        } catch (error) {
            console.error("Translation failed", error);
            setValue(`examples.${index}.arabic`, "", { shouldValidate: true });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Card</DialogTitle>
                    <DialogDescription>
                        Make changes to your flashcard here. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <form id="edit-card-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="term">Term</Label>
                        <Input
                            id="term"
                            {...register("term")}
                            className={cn(errors.term && "border-red-500 ring-red-500!")}
                            placeholder="Enter term"
                        />
                        <p className={cn("transition-all", errors.term ? "h-4" : "h-0 overflow-hidden")}>
                            {errors.term && <span className="text-red-500 text-sm">{errors.term.message}</span>}
                        </p>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="definition">Definition</Label>
                        <Textarea
                            id="definition"
                            {...register("definition")}
                            className={cn("min-h-[100px]", errors.definition && "border-red-500 ring-red-500!")}
                            placeholder="Enter definition"
                        />
                        <p className={cn("transition-all", errors.definition ? "h-4" : "h-0 overflow-hidden")}>
                            {errors.definition && <span className="text-red-500 text-sm">{errors.definition.message}</span>}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label>Examples</Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => append({ english: "", arabic: "" })}
                                className="h-8"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Example
                            </Button>
                        </div>

                        <div className="space-y-3">
                            {fields.map((field, index) => (
                                <div key={field.id} className="flex gap-3 items-start group/example p-3 border rounded-lg bg-muted/30">
                                    <div className="flex-1 space-y-2">
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground">English</Label>
                                            <Input
                                                placeholder="Example sentence..."
                                                className="h-9 text-sm"
                                                {...register(`examples.${index}.english`)}
                                                onBlur={(e) => {
                                                    const text = e.target.value;
                                                    const currentArabic = control._formValues.examples?.[index]?.arabic;
                                                    if (text && !currentArabic) {
                                                        handleTranslate(index, text);
                                                    }
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 space-y-2 relative">
                                        <div className="space-y-1">
                                            <Label className="text-xs text-muted-foreground block text-right">Arabic</Label>
                                            <div className="relative">
                                                <Input
                                                    placeholder="Translation..."
                                                    className="h-9 text-sm text-right font-arabic pr-8"
                                                    dir="rtl"
                                                    {...register(`examples.${index}.arabic`)}
                                                />
                                                <Sparkles className="absolute right-2 top-2.5 text-yellow-500/50 pointer-events-none" size={14} />
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="h-9 w-9 mt-6 text-muted-foreground hover:text-red-500"
                                        onClick={() => remove(index)}
                                    >
                                        <Trash size={16} />
                                    </Button>
                                </div>
                            ))}
                            {fields.length === 0 && (
                                <div className="text-center py-4 text-sm text-muted-foreground border border-dashed rounded-lg">
                                    No examples added yet.
                                </div>
                            )}
                        </div>
                    </div>

                </form>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button type="submit" form="edit-card-form" disabled={isSubmitting}>Save Changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
