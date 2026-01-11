import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Image as ImageIcon, Trash, GripVertical, X, Plus, Sparkles, UploadCloud } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState, memo, type ChangeEvent, useRef } from 'react'
import { ImageSearchModal } from './image-search-modal'

import { FlashcardFormData } from './flashcard-form'
import { OptimizedImage } from '@/components/optimized-image'
import { SUPPORTED_LANGUAGES } from '@/shared/constants/languages'
import { useSearchParams } from 'next/navigation';

type FlashCardItemProps = {
    id: string,
    index: number,
    remove: (index: number) => void,
    itemsCount: number
}

function FlashCardItemComponent({ id, index, remove, itemsCount }: FlashCardItemProps) {
    const { register, formState: { errors }, setValue, watch } = useFormContext<FlashcardFormData>();

    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const imageUrl = watch(`flashcards.${index}.image`);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 1 : 0,
        opacity: isDragging ? 0.5 : 1
    };

    const handleSelectImage = (url: string) => {
        setValue(`flashcards.${index}.image`, url, { shouldValidate: true });
    };

    const handleRemoveImage = () => {
        setValue(`flashcards.${index}.image`, '', { shouldValidate: true });
    };

    const handleUploadLocalImage = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload-flashcard-image', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                console.error('Failed to upload image');
                return;
            }

            const data = await res.json();
            if (data?.success && data?.url) {
                setValue(`flashcards.${index}.image`, data.url, { shouldValidate: true });
            }
        } catch (error) {
            console.error('Error uploading image', error);
        } finally {
            setIsUploading(false);
            event.target.value = '';
        }
    };

    const searchParams = useSearchParams();
    const category = watch("category") || searchParams.get("category");

    return (
        <div ref={setNodeRef} style={style} className="mb-5">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center gap-2">
                        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                            <GripVertical size={20} className="text-muted-foreground" />
                        </div>
                        <span className="font-semibold">{index + 1}</span>
                    </div>
                    <div>
                        {itemsCount > 1 ? (
                            <Trash onClick={() => remove(index)} size={20} className='hover:text-red-400 cursor-pointer ' />
                        ) : (
                            <Trash size={20} className='hover:text-red-400 cursor-not-allowed text-muted-foreground' />
                        )}
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-3 pt-4">
                    <div className="flex flex-col md:flex-row gap-3 w-full">
                        <div className="w-full md:w-1/2 space-y-2">
                            <Label htmlFor={`term-${index}`}>Term</Label>
                            <Input id={`term-${index}`} placeholder="Enter term" {...register(`flashcards.${index}.term`)} />
                            <p className={`transition-all ${errors.flashcards?.[index]?.term ? "h-4" : "h-0 overflow-hidden"}`}>
                                {errors.flashcards?.[index]?.term && <span className="text-sm text-red-500">{errors.flashcards[index]?.term?.message}</span>}
                            </p>
                        </div>

                        <div className="w-full md:w-1/2 space-y-2">
                            <Label htmlFor={`definition-${index}`}>Definition</Label>
                            <Input id={`definition-${index}`} placeholder="Enter definition" {...register(`flashcards.${index}.definition`)} />
                            <p className={`transition-all ${errors.flashcards?.[index]?.definition ? "h-4" : "h-0 overflow-hidden"}`}>
                                {errors.flashcards?.[index]?.definition && <span className="text-sm text-red-500">{errors.flashcards[index]?.definition?.message}</span>}
                            </p>
                        </div>

                        {category === "english" && (
                            <div className="w-full md:w-1/4 space-y-2">
                                <Label htmlFor={`wordType-${index}`}>Type <span className="text-muted-foreground font-normal">(Optional)</span></Label>
                                <select
                                    id={`wordType-${index}`}
                                    className="file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                                    {...register(`flashcards.${index}.wordType`)}
                                >
                                    <option value="" className="bg-popover text-popover-foreground">Select Type</option>
                                    <option value="Noun" className="bg-popover text-popover-foreground">Noun</option>
                                    <option value="Verb" className="bg-popover text-popover-foreground">Verb</option>
                                    <option value="Adjective" className="bg-popover text-popover-foreground">Adjective</option>
                                    <option value="Adverb" className="bg-popover text-popover-foreground">Adverb</option>
                                    <option value="Phrasal Verb" className="bg-popover text-popover-foreground">Phrasal Verb</option>
                                    <option value="Preposition" className="bg-popover text-popover-foreground">Preposition</option>
                                    <option value="Conjunction" className="bg-popover text-popover-foreground">Conjunction</option>
                                    <option value="Pronoun" className="bg-popover text-popover-foreground">Pronoun</option>
                                    <option value="Interjection" className="bg-popover text-popover-foreground">Interjection</option>
                                    <option value="Idiom" className="bg-popover text-popover-foreground">Idiom</option>
                                </select>
                                <p className={`transition-all ${errors.flashcards?.[index]?.wordType ? "h-4" : "h-0 overflow-hidden"}`}>
                                    {errors.flashcards?.[index]?.wordType && <span className="text-sm text-red-500">{errors.flashcards[index]?.wordType?.message}</span>}
                                </p>
                            </div>
                        )}

                        <div className="w-full md:w-1/6 flex flex-col items-start gap-2 pt-1">
                            {imageUrl ? (
                                <div className="relative group w-full">
                                    <OptimizedImage
                                        src={imageUrl}
                                        alt="Selected"
                                        width={128}
                                        height={128}
                                        className="w-full h-auto object-cover rounded-lg cursor-pointer shadow-lg hover:shadow-xl transition-all border-2 border-border hover:border-primary"
                                        onClick={() => fileInputRef.current?.click()}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div
                                    className="w-full h-32 border-2 border-dashed border-muted-foreground/30 rounded-lg flex items-center justify-center cursor-pointer hover:border-primary hover:bg-accent/50 transition-all group"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <ImageIcon className="text-muted-foreground group-hover:text-primary transition-colors" size={32} />
                                </div>
                            )}

                            <div className="flex flex-col gap-1 w-full">
                                <label className="w-full">
                                    <span className="sr-only">Upload image</span>
                                    <div className="flex items-center justify-center gap-1 rounded-md border border-dashed px-2 py-1 text-xs cursor-pointer hover:bg-accent">
                                        <UploadCloud className="h-3 w-3" />
                                        <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                                    </div>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleUploadLocalImage}
                                        disabled={isUploading}
                                        ref={fileInputRef}
                                    />
                                </label>

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-[11px]"
                                    onClick={() => setIsImageModalOpen(true)}
                                >
                                    <ImageIcon className="h-3 w-3 mr-1" /> Search
                                </Button>
                            </div>
                        </div>
                    </div>


                </CardContent>

                <div className="px-6 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Label>Examples</Label>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={() => {
                                const currentExamples = watch(`flashcards.${index}.examples`) || [];
                                setValue(`flashcards.${index}.examples`, [...currentExamples, { english: "", arabic: "" }]);
                            }}
                        >
                            <Plus size={14} className="mr-1" /> Add Example
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {watch(`flashcards.${index}.examples`)?.map((_, exIndex: number) => (
                            <div key={exIndex} className="flex flex-col md:flex-row gap-3 items-start group/example">
                                <div className="w-full md:flex-1 space-y-1">
                                    <Input
                                        placeholder={`${SUPPORTED_LANGUAGES.find(l => l.code === (watch("sourceLanguage") || "en"))?.name} example...`}
                                        className="h-8 text-sm"
                                        {...register(`flashcards.${index}.examples.${exIndex}.english`)}
                                        onBlur={(e) => {
                                            const text = e.target.value;
                                            if (text && !watch(`flashcards.${index}.examples.${exIndex}.arabic`)) {
                                                setValue(`flashcards.${index}.examples.${exIndex}.arabic`, "Translating...", { shouldValidate: true });
                                                const targetLang = watch("targetLanguage") || "ar";
                                                const sourceLang = watch("sourceLanguage") || "en";
                                                fetch(`/api/translate?text=${encodeURIComponent(text)}&lang=${targetLang}&source=${sourceLang}`)
                                                    .then(res => res.json())
                                                    .then(data => {
                                                        if (data.translatedText) {
                                                            setValue(`flashcards.${index}.examples.${exIndex}.arabic`, data.translatedText, { shouldValidate: true });
                                                        }
                                                    })
                                                    .catch(() => {
                                                        setValue(`flashcards.${index}.examples.${exIndex}.arabic`, "", { shouldValidate: true });
                                                    });
                                            }
                                        }}
                                    />
                                </div>
                                <div className="w-full md:flex-1 space-y-1 relative">
                                    <Input
                                        placeholder={`${SUPPORTED_LANGUAGES.find(l => l.code === (watch("targetLanguage") || "ar"))?.name} translation...`}
                                        className="h-8 text-sm text-right font-arabic"
                                        dir="rtl"
                                        {...register(`flashcards.${index}.examples.${exIndex}.arabic`)}
                                    />
                                    <Sparkles className="absolute left-2 top-2 text-yellow-500/50 pointer-events-none" size={12} />
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-muted-foreground hover:text-red-500 opacity-0 group-hover/example:opacity-100 transition-opacity"
                                    onClick={() => {
                                        const currentExamples = watch(`flashcards.${index}.examples`) || [];
                                        const newExamples = currentExamples.filter((_, i: number) => i !== exIndex);
                                        setValue(`flashcards.${index}.examples`, newExamples);
                                    }}
                                >
                                    <Trash size={14} />
                                </Button>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            <ImageSearchModal
                open={isImageModalOpen}
                onOpenChange={setIsImageModalOpen}
                onSelectImage={handleSelectImage}
            />
        </div >
    )
}

export const FlashCardItem = memo(FlashCardItemComponent);
