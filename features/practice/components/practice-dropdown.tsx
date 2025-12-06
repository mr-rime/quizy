"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { DeleteFlashcardDialog } from "./delete-flashcard-dialog";
import { useState } from "react";
import Link from "next/link";



export function PracticeDropdown({ setId }: { setId: string }) {
    const [openDelete, setOpenDelete] = useState(false);
    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-5 w-5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <Link href={`/edit-set/${setId}`}>
                        <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem onClick={() => setOpenDelete(true)} className="text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <DeleteFlashcardDialog setId={setId} open={openDelete} setOpen={setOpenDelete} />
        </>
    )
}
