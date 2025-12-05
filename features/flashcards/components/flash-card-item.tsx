import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Image as ImageIcon, Trash, GripVertical } from 'lucide-react'
import { useFormContext } from 'react-hook-form'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type FlashCardItemProps = {
    id: string,
    index: number,
    remove: (index: number) => void,
    itemsCount: number
}

import { FlashcardFormData } from './flashcard-form'

export function FlashCardItem({ id, index, remove, itemsCount }: FlashCardItemProps) {
    const { register, formState: { errors } } = useFormContext<FlashcardFormData>();
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
                    <div className='w-full space-y-2'>
                        <Input placeholder="Enter term" {...register(`flashcards.${index}.term`)} />
                        <p className={`transition-all ${errors.flashcards?.[index]?.term ? "h-4" : "h-0  overflow-hidden"}`}>
                            {errors.flashcards?.[index]?.term && <span className="text-sm text-red-500">{errors.flashcards[index]?.term?.message}</span>}
                        </p>
                    </div>
                    <div className='w-full space-y-2'>
                        <Input placeholder="Enter definition" {...register(`flashcards.${index}.definition`)} />
                        <p className={`transition-all ${errors.flashcards?.[index]?.definition ? "h-4" : "h-0  overflow-hidden"}`}>
                            {errors.flashcards?.[index]?.definition && <span className="text-sm text-red-500">{errors.flashcards[index]?.definition?.message}</span>}
                        </p>
                    </div>
                    <div className="flex items-start pt-1">
                        <ImageIcon className="text-muted-foreground cursor-pointer hover:text-primary" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
