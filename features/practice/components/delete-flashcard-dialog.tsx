import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { deleteFlashcardSet } from "../services/flashcards";
import { Dispatch, SetStateAction, useTransition } from "react";
import { toast } from "sonner";
import { Loader } from "lucide-react";
export type PracticeDropdownButtonProps = {
    setId: string;
    setOpen: Dispatch<SetStateAction<boolean>>;
    open: boolean;
}

export function DeleteFlashcardDialog({ setId, open, setOpen }: PracticeDropdownButtonProps) {
    const [isPending, startTransition] = useTransition();
    const handleDelete = async () => {
        startTransition(async () => {
            const data = await deleteFlashcardSet(setId);

            if (data?.success) {
                toast.success("Set deleted successfully");
                setOpen(false);
            }

            if (!data?.success) {
                toast.error(data?.error);
                setOpen(false);
            }
        })
    }
    return (
        <AlertDialog open={open}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
                    {
                        isPending ? <AlertDialogAction className="w-20">
                            <Loader className="animate-spin spinner-border" />
                        </AlertDialogAction> : <AlertDialogAction className="w-20" onClick={handleDelete}>Delete</AlertDialogAction>
                    }
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
