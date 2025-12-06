'use client'

import { useState, useEffect, useCallback, useEffectEvent } from "react";
import { toast } from "sonner";
import { updateFlashcard } from "@/features/flashcards/services/cards";
import { toggleFavorite } from "@/features/flashcards/services/favorites";
import { EditFlashcardSchema } from "../utils/validations";
import { FlashcardDisplay } from "./flashcard-display";
import { FlashcardControls } from "./flashcard-controls";
import { EditCardDialog } from "./edit-card-dialog";

interface Flashcard {
    id: string;
    term: string;
    definition: string | null;
    imageUrl: string | null;
}

interface FlashcardViewerProps {
    cards: Flashcard[];
    setId: string;
    initialFavoriteIds: string[];
}

export function FlashcardViewer({ cards, initialFavoriteIds }: FlashcardViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set(initialFavoriteIds));

    const currentCard = cards[currentIndex];

    const handleNext = useCallback(() => {
        if (currentIndex < cards.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setIsFlipped(false);
        }
    }, [currentIndex, cards.length]);

    const handlePrev = useCallback(() => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
            setIsFlipped(false);
        }
    }, [currentIndex]);

    const handleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleSpeak = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    };

    const openEdit = () => {
        setIsEditOpen(true);
    };

    const onSubmit = async (data: EditFlashcardSchema) => {
        try {
            await updateFlashcard({
                id: currentCard.id,
                term: data.term,
                definition: data.definition || undefined
            });
            setIsEditOpen(false);
            toast.success("Card updated");
        } catch (error) {
            console.error("Failed to update card:", error);
            toast.error("Failed to update card");
        }
    };

    const handleToggleFavorite = async (e: React.MouseEvent) => {
        e.stopPropagation();
        const cardId = currentCard.id;
        const isFavorite = favoriteIds.has(cardId);

        setFavoriteIds(prev => {
            const next = new Set(prev);
            if (isFavorite) {
                next.delete(cardId);
            } else {
                next.add(cardId);
            }
            return next;
        });

        try {
            await toggleFavorite(cardId);
            toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
        } catch (error) {
            console.error("Failed to toggle favorite:", error);
            toast.error("Failed to toggle favorite");
            setFavoriteIds(prev => {
                const next = new Set(prev);
                if (isFavorite) {
                    next.add(cardId);
                } else {
                    next.delete(cardId);
                }
                return next;
            });
        }
    };

    const handleNextEvent = useEffectEvent(handleNext)
    const handlePrevEvent = useEffectEvent(handlePrev)
    const handleFlipEvent = useEffectEvent(handleFlip)

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") handleNextEvent();
            if (e.key === "ArrowLeft") handlePrevEvent();
            if (e.key === " " || e.key === "Enter") handleFlipEvent();
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    if (!currentCard) return <div>No cards found.</div>;

    const isFavorite = favoriteIds.has(currentCard.id);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
            <FlashcardDisplay
                card={currentCard}
                isFlipped={isFlipped}
                isFavorite={isFavorite}
                onFlip={handleFlip}
                onEdit={openEdit}
                onSpeak={handleSpeak}
                onToggleFavorite={handleToggleFavorite}
            />

            <FlashcardControls
                currentIndex={currentIndex}
                totalCards={cards.length}
                onNext={handleNext}
                onPrev={handlePrev}
            />

            <EditCardDialog
                open={isEditOpen}
                onOpenChange={setIsEditOpen}
                initialTerm={currentCard.term}
                initialDefinition={currentCard.definition}
                onSubmit={onSubmit}
            />
        </div>
    );
}
