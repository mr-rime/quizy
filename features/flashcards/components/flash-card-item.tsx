import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Image as ImageIcon, Trash, GripVertical, X, Plus, Sparkles } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState, memo } from 'react'
import { ImageSearchModal } from './image-search-modal'

import { FlashcardFormData } from './flashcard-form'
import { OptimizedImage } from '@/components/optimized-image'

type FlashCardItemProps = {
    id: string,
    index: number,
    remove: (index: number) => void,
    itemsCount: number
}

function FlashCardItemComponent({ id, index, remove, itemsCount }: FlashCardItemProps) {
    const { register, formState: { errors }, setValue, watch } = useFormContext<FlashcardFormData>();

    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const imageUrl = watch(`flashcards.${index}.image`);

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
                <CardContent className="flex gap-3 pt-4">
                    <div className="w-2/4 space-y-2">
                        <Label htmlFor={`term-${index}`}>Term</Label>
                        <Input id={`term-${index}`} placeholder="Enter term" {...register(`flashcards.${index}.term`)} />
                        <p className={`transition-all ${errors.flashcards?.[index]?.term ? "h-4" : "h-0 overflow-hidden"}`}>
                            {errors.flashcards?.[index]?.term && <span className="text-sm text-red-500">{errors.flashcards[index]?.term?.message}</span>}
                        </p>
                    </div>

                    <div className="w-2/4 space-y-2">
                        <Label htmlFor={`definition-${index}`}>Definition</Label>
                        <Input id={`definition-${index}`} placeholder="Enter definition" {...register(`flashcards.${index}.definition`)} />
                        <p className={`transition-all ${errors.flashcards?.[index]?.definition ? "h-4" : "h-0 overflow-hidden"}`}>
                            {errors.flashcards?.[index]?.definition && <span className="text-sm text-red-500">{errors.flashcards[index]?.definition?.message}</span>}
                        </p>
                    </div>

                    <div className="w-1/9 flex items-start pt-1">
                        {imageUrl ? (
                            <div className="relative group w-full">
                                <OptimizedImage
                                    src={imageUrl}
                                    alt="Selected"
                                    width={128}
                                    height={128}
                                    className="w-full h-auto object-cover rounded-lg cursor-pointer shadow-lg hover:shadow-xl transition-all border-2 border-border hover:border-primary"
                                    onClick={() => setIsImageModalOpen(true)}
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
                                onClick={() => setIsImageModalOpen(true)}
                            >
                                <ImageIcon className="text-muted-foreground group-hover:text-primary transition-colors" size={32} />
                            </div>
                        )}
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
                            <div key={exIndex} className="flex gap-3 items-start group/example">
                                <div className="flex-1 space-y-1">
                                    <Input
                                        placeholder="English example..."
                                        className="h-8 text-sm"
                                        {...register(`flashcards.${index}.examples.${exIndex}.english`)}
                                        onBlur={(e) => {
                                            const text = e.target.value;
                                            if (text && !watch(`flashcards.${index}.examples.${exIndex}.arabic`)) {
                                                setValue(`flashcards.${index}.examples.${exIndex}.arabic`, "Translating...", { shouldValidate: true });
                                                fetch(`/api/translate?text=${encodeURIComponent(text)}`)
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
                                <div className="flex-1 space-y-1 relative">
                                    <Input
                                        placeholder="Arabic translation..."
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
        </div>
    )
}

export const FlashCardItem = memo(FlashCardItemComponent);
