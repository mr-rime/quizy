export interface Flashcard {
    id: string;
    term: string;
    definition: string | null;
    imageUrl: string | null;
    examples?: { english: string; arabic: string }[] | null;
    wordType?: string | null;
}
