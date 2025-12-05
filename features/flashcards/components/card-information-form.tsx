"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext } from "react-hook-form";

import { FlashcardFormData } from "./flashcard-form";

export function CardInformationForm() {
    const { register, formState: { errors } } = useFormContext<FlashcardFormData>();

    return (
        <Card>
            <CardContent>
                <div className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" placeholder="Enter a title, like “Biology - Chapter 22: Evolution”" {...register("title")} />
                        <p className={`transition-all ${errors.title ? "h-4" : "h-0  overflow-hidden"}`}>
                            {errors.title && <span className="text-sm text-red-500">{errors.title.message}</span>}
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder="Add a description..." className="resize-none" {...register("description")} />
                        <p className={`transition-all ${errors.description ? "h-4" : "h-0  overflow-hidden"}`}>
                            {errors.description && <span className="text-sm text-red-500">{errors.description.message}</span>}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
