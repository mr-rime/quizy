import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Edit2, Volume2, Star, Lightbulb, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { ImageZoomModal } from "@/components/image-zoom-modal";
import { OptimizedImage } from "@/components/optimized-image";
import { ExamplesModal } from "../examples-modal";
import { Flashcard } from "../../types";
import { LanguageSelector } from "../language-selector";



interface FlashcardDisplayProps {
    card: Flashcard;
    isFlipped: boolean;
    isFavorite: boolean;
    isOwner?: boolean;
    category?: string;
    onFlip: () => void;
    onEdit: () => void;
    onSpeak: (text: string) => void;
    onToggleFavorite: (e: React.MouseEvent) => void;
}

export function FlashcardDisplay({
    card,
    isFlipped,
    isFavorite,
    isOwner = false,
    category,
    onFlip,
    onEdit,
    onSpeak,
    onToggleFavorite
}: FlashcardDisplayProps) {
    const [showExamples, setShowExamples] = useState(false);
    const [isZoomOpen, setIsZoomOpen] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState<string | undefined>();
    const [translatedText, setTranslatedText] = useState<string>("");
    const [isTranslating, setIsTranslating] = useState(false);
    const [selectedTermLanguage, setSelectedTermLanguage] = useState<string | undefined>();
    const [translatedTerm, setTranslatedTerm] = useState<string>("");
    const [isTranslatingTerm, setIsTranslatingTerm] = useState(false);

    const handleImageClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsZoomOpen(true);
    };

    const handleSelectLanguage = async (languageCode: string, languageName: string) => {
        if (!card.definition) return;

        setSelectedLanguage(languageCode);
        setIsTranslating(true);
        setTranslatedText("");

        try {
            const response = await fetch(
                `/api/translate?text=${encodeURIComponent(card.definition)}&lang=${languageCode}&source=auto`
            );

            if (!response.ok) {
                throw new Error("Translation failed");
            }

            const data = await response.json();
            if (data.translatedText) {
                setTranslatedText(data.translatedText);
            }
        } catch (error) {
            console.error("Translation error:", error);
            setTranslatedText("Translation failed. Please try again.");
        } finally {
            setIsTranslating(false);
        }
    };

    const handleSelectTermLanguage = async (languageCode: string, languageName: string) => {
        setSelectedTermLanguage(languageCode);
        setIsTranslatingTerm(true);
        setTranslatedTerm("");

        try {
            const response = await fetch(
                `/api/translate?text=${encodeURIComponent(card.term)}&lang=${languageCode}&source=auto`
            );

            if (!response.ok) {
                throw new Error("Translation failed");
            }

            const data = await response.json();
            if (data.translatedText) {
                setTranslatedTerm(data.translatedText);
            }
        } catch (error) {
            console.error("Translation error:", error);
            setTranslatedTerm("Translation failed. Please try again.");
        } finally {
            setIsTranslatingTerm(false);
        }
    };

    useEffect(() => {
        setSelectedLanguage(undefined);
        setTranslatedText("");
        setIsTranslating(false);
        setSelectedTermLanguage(undefined);
        setTranslatedTerm("");
        setIsTranslatingTerm(false);
    }, [card.id]);

    return (
        <>
            <div className="w-full max-w-3xl perspective-1000 h-[280px] sm:h-[350px] lg:h-[400px] cursor-pointer group" onClick={onFlip}>
                <motion.div
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="relative w-full h-full shadow-xl rounded-xl"
                >
                    <Card
                        className="absolute w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-card border-2 hover:border-primary/50 transition-colors"
                        style={{ backfaceVisibility: "hidden" }}
                    >
                        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-1 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                            {isOwner && (
                                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" onClick={() => onEdit()}>
                                    <Edit2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                            )}
                            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" onClick={() => onSpeak(card.term)}>
                                <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            {card.examples && card.examples.length > 0 && (
                                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setShowExamples(true); }}>
                                    <Lightbulb className="h-4 w-4" />
                                </Button>
                            )}
                            {category === "english" && (
                                <LanguageSelector
                                    onSelectLanguage={handleSelectTermLanguage}
                                    selectedLanguage={selectedTermLanguage}
                                />
                            )}
                            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" onClick={onToggleFavorite}>
                                <Star className={cn("h-3 w-3 sm:h-4 sm:w-4", isFavorite && "fill-yellow-400 text-yellow-400")} />
                            </Button>
                        </div>
                        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 text-xs sm:text-sm text-muted-foreground">
                            Term
                        </div>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center px-2">{card.term}</h2>
                        {isTranslatingTerm && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Translating...</span>
                            </div>
                        )}
                        {!isTranslatingTerm && translatedTerm && (
                            <div className="text-base sm:text-lg text-muted-foreground italic mt-2">
                                {translatedTerm}
                            </div>
                        )}
                        {card.wordType && (
                            <span className="text-sm sm:text-base text-muted-foreground mt-2 italic font-serif">
                                ({card.wordType})
                            </span>
                        )}
                    </Card>

                    <Card
                        className="absolute w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-card border-2 hover:border-primary/50 transition-colors overflow-y-auto"
                        style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                    >
                        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-1 sm:gap-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                            {isOwner && (
                                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" onClick={() => onEdit()}>
                                    <Edit2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                </Button>
                            )}
                            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" onClick={() => onSpeak(card.definition || "")}>
                                <Volume2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                            {card.examples && card.examples.length > 0 && (
                                <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); setShowExamples(true); }}>
                                    <Lightbulb className="h-4 w-4" />
                                </Button>
                            )}
                            {category === "english" && (
                                <LanguageSelector
                                    onSelectLanguage={handleSelectLanguage}
                                    selectedLanguage={selectedLanguage}
                                />
                            )}
                            <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" onClick={onToggleFavorite}>
                                <Star className={cn("h-3 w-3 sm:h-4 sm:w-4", isFavorite && "fill-yellow-400 text-yellow-400")} />
                            </Button>
                        </div>
                        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 text-xs sm:text-sm text-muted-foreground">
                            Definition
                        </div>
                        <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 w-full">
                            {card.imageUrl && (
                                <div className="relative w-full max-h-32 sm:max-h-40 lg:max-h-48 flex items-center justify-center">
                                    <OptimizedImage
                                        key={card.imageUrl}
                                        src={card.imageUrl}
                                        alt={card.term}
                                        width={170}
                                        height={170}
                                        className="max-w-full max-h-32 sm:max-h-40 lg:max-h-48 object-contain rounded-lg cursor-zoom-in hover:opacity-90 transition-opacity shadow-md"
                                        onClick={handleImageClick}
                                    />
                                </div>
                            )}
                            <div className="flex flex-col items-center gap-2 w-full">
                                <p className="text-lg sm:text-xl lg:text-2xl text-center text-muted-foreground px-2">{card.definition}</p>
                                {isTranslating && (
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Translating...</span>
                                    </div>
                                )}
                                {!isTranslating && translatedText && (
                                    <div className="mt-2 p-3 bg-accent/50 rounded-lg max-w-full">
                                        <p className="text-sm text-muted-foreground mb-1 font-medium">Translation:</p>
                                        <p className="text-base text-foreground text-center">{translatedText}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <style jsx global>{`
                    .perspective-1000 {
                        perspective: 1000px;
                    }
                `}</style>
            </div>

            <ExamplesModal
                open={showExamples}
                onOpenChange={setShowExamples}
                examples={card.examples || []}
            />

            <ImageZoomModal
                imageUrl={card.imageUrl}
                alt={card.term}
                open={isZoomOpen}
                onOpenChange={setIsZoomOpen}
            />
        </>
    );
}
