"use client"

import { FlashCardItem } from "./flash-card-item";
import { Button } from "@/components/ui/button";
import { useFieldArray, useFormContext } from "react-hook-form";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToParentElement } from '@dnd-kit/modifiers';
import { useCallback } from "react";

export default function CreateFlashcardForm() {
    const { control } = useFormContext();
    const { fields, append, remove, move } = useFieldArray({
        control,
        name: "flashcards"
    });

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = fields.findIndex((field) => field.id === active.id);
            const newIndex = fields.findIndex((field) => field.id === over.id);
            move(oldIndex, newIndex);
        }
    }, [fields, move]);

    const handleAddFlashcard = () => {
        append({
            term: "",
            definition: "",
            image: ""
        });
    }

    return (
        <div className="mt-10">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
                modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            >
                <SortableContext
                    items={fields}
                    strategy={verticalListSortingStrategy}
                >
                    {fields.map((field, index) => (
                        <FlashCardItem
                            key={field.id}
                            id={field.id}
                            index={index}
                            remove={remove}
                            itemsCount={fields.length}
                        />
                    ))}
                </SortableContext>
            </DndContext>

            <div className="w-full flex justify-center">
                <Button type="button" className="mt-5" onClick={handleAddFlashcard}>Add a card</Button>
            </div>
        </div>
    )
}
