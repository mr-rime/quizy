'use client'

import { useState, useEffect, useCallback, useEffectEvent } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
    ArrowLeft,
    ArrowRight,
    Volume2,
    Edit2,
    Star,
    Maximize,
    Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editFlashcardSchema, EditFlashcardSchema } from "../utils/validations";
import { toast } from "sonner";
import { updateFlashcard } from "@/features/flashcards/services/cards";
import { toggleFavorite } from "@/features/flashcards/services/favorites";

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

export function FlashcardViewer({ cards, setId, initialFavoriteIds }: FlashcardViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set(initialFavoriteIds));

    const currentCard = cards[currentIndex];

    const { register, handleSubmit, reset, formState: { errors } } = useForm<EditFlashcardSchema>({
        resolver: zodResolver(editFlashcardSchema),
        defaultValues: {
            term: "",
            definition: ""
        }
    });

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
        reset({
            term: currentCard.term,
            definition: currentCard.definition || ""
        });
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

        // Optimistic update
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
            // Revert on error
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
            <div className="w-full max-w-3xl perspective-1000 h-[400px] cursor-pointer group" onClick={handleFlip}>
                <div className={cn(
                    "relative w-full h-full transition-all duration-500 transform-style-3d shadow-xl rounded-xl",
                    isFlipped ? "rotate-y-180" : ""
                )}>
                    <Card className="absolute w-full h-full backface-hidden flex flex-col items-center justify-center p-8 bg-card border-2 hover:border-primary/50 transition-colors">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" onClick={() => openEdit()}>
                                <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleSpeak(currentCard.term)}>
                                <Volume2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={handleToggleFavorite}>
                                <Star className={cn("h-4 w-4", isFavorite && "fill-yellow-400 text-yellow-400")} />
                            </Button>
                        </div>
                        <div className="absolute top-4 left-4 text-sm text-muted-foreground">
                            Term
                        </div>
                        <h2 className="text-4xl font-bold text-center">{currentCard.term}</h2>
                    </Card>

                    <Card className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center p-8 bg-card border-2 hover:border-primary/50 transition-colors">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                            <Button variant="ghost" size="icon" onClick={() => openEdit()}>
                                <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleSpeak(currentCard.definition || "")}>
                                <Volume2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={handleToggleFavorite}>
                                <Star className={cn("h-4 w-4", isFavorite && "fill-yellow-400 text-yellow-400")} />
                            </Button>
                        </div>
                        <div className="absolute top-4 left-4 text-sm text-muted-foreground">
                            Definition
                        </div>
                        <p className="text-2xl text-center text-muted-foreground">{currentCard.definition}</p>
                        {currentCard.imageUrl && (
                            <Image src={currentCard.imageUrl} alt="Card image" className="mt-4 max-h-40 rounded-md" />
                        )}
                    </Card>
                </div>
            </div>

            <div className="flex items-center gap-4 w-full max-w-3xl justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" className="text-muted-foreground">
                        {currentIndex + 1} / {cards.length}
                    </Button>
                </div>

                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={handlePrev} disabled={currentIndex === 0} className="rounded-full h-12 w-12">
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleNext} disabled={currentIndex === cards.length - 1} className="rounded-full h-12 w-12">
                        <ArrowRight className="h-6 w-6" />
                    </Button>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                        <Maximize className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon">
                        <Settings className="h-5 w-5" />
                    </Button>
                </div>
            </div>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Card</DialogTitle>
                    </DialogHeader>
                    <form id="edit-card-form" onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="term">Term</Label>
                            <Input
                                id="term"
                                {...register("term")}
                                className={cn(errors.term && "border-red-500 ring-red-500!")}
                            />
                            <p className={cn("transition-all", errors.term ? "h-4" : "h-0 overflow-hidden")}>
                                {errors.term && <span className="text-red-500 text-sm">{errors.term.message}</span>}
                            </p>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="definition">Definition</Label>
                            <Textarea
                                id="definition"
                                {...register("definition")}
                                className={cn(errors.definition && "border-red-500 ring-red-500!")}
                            />
                            <p className={cn("transition-all", errors.definition ? "h-4" : "h-0 overflow-hidden")}>
                                {errors.definition && <span className="text-red-500 text-sm">{errors.definition.message}</span>}
                            </p>
                        </div>
                    </form>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)}>Cancel</Button>
                        <Button type="submit" form="edit-card-form">Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <style jsx global>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .transform-style-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                }
                .rotate-y-180 {
                    transform: rotateY(180deg);
                }
            `}</style>
        </div>
    );
}
