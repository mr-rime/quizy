export interface Flashcard {
    id: string;
    term: string;
    definition: string | null;
    imageUrl: string | null;
    examples?: { english: string; arabic: string;[key: string]: string }[] | null;
    wordType?: string | null;
}
