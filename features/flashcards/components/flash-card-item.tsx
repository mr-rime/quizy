import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Image as ImageIcon, Trash, GripVertical, X } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import { ImageSearchModal } from './image-search-modal'

import { FlashcardFormData } from './flashcard-form'
import Image from 'next/image'

type FlashCardItemProps = {
    id: string,
    index: number,
    remove: (index: number) => void,
    itemsCount: number
}
export function FlashCardItem({ id, index, remove, itemsCount }: FlashCardItemProps) {
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
                                <Image
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
            </Card>

            <ImageSearchModal
                open={isImageModalOpen}
                onOpenChange={setIsImageModalOpen}
                onSelectImage={handleSelectImage}
            />
        </div>
    )
}
