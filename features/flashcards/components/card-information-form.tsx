"use client"

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useFormContext } from "react-hook-form";

import { FlashcardFormData } from "./flashcard-form";
import { SUPPORTED_LANGUAGES } from "@/shared/constants/languages";

export function CardInformationForm() {
    const { register, formState: { errors }, watch, setValue } = useFormContext<FlashcardFormData>();
    const isPublic = watch("isPublic") ?? false;

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

                    <div className="space-y-2">
                        <Label>Source Language</Label>
                        <div className="relative">
                            <select
                                id="sourceLanguage"
                                {...register("sourceLanguage")}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {SUPPORTED_LANGUAGES.map((lang) => (
                                    <option key={lang.code} value={lang.code}>
                                        {lang.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Target Language</Label>
                        <div className="relative">
                            <select
                                id="targetLanguage"
                                {...register("targetLanguage")}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {SUPPORTED_LANGUAGES.map((lang) => (
                                    <option key={lang.code} value={lang.code}>
                                        {lang.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Examples will be translated to this language
                        </p>
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label htmlFor="isPublic" className="text-base">Make this set public</Label>
                                <p className="text-sm text-muted-foreground">
                                    Public sets can be shared with others and viewed by anyone
                                </p>
                            </div>
                            <Switch
                                id="isPublic"
                                checked={isPublic}
                                onCheckedChange={(checked) => setValue("isPublic", checked)}
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
