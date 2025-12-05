import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editFlashcardSchema, EditFlashcardSchema } from "../utils/validations";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface EditCardDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialTerm: string;
    initialDefinition: string | null;
    onSubmit: (data: EditFlashcardSchema) => Promise<void>;
}

export function EditCardDialog({
    open,
    onOpenChange,
    initialTerm,
    initialDefinition,
    onSubmit
}: EditCardDialogProps) {
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<EditFlashcardSchema>({
        resolver: zodResolver(editFlashcardSchema),
        defaultValues: {
            term: initialTerm,
            definition: initialDefinition || ""
        }
    });

    useEffect(() => {
        if (open) {
            reset({
                term: initialTerm,
                definition: initialDefinition || ""
            });
        }
    }, [open, initialTerm, initialDefinition, reset]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Card</DialogTitle>
                </DialogHeader>
                <form id="edit-card-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="term">Term</Label>
                        <Input
                            id="term"
                            {...register("term")}
                            className={cn(errors.term && "border-red-500 ring-red-500!")}
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
                            className={cn(errors.definition && "border-red-500 ring-red-500!")}
                        />
                        <p className={cn("transition-all", errors.definition ? "h-4" : "h-0 overflow-hidden")}>
                            {errors.definition && <span className="text-red-500 text-sm">{errors.definition.message}</span>}
                        </p>
                    </div>
                </form>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button type="submit" form="edit-card-form" disabled={isSubmitting}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
