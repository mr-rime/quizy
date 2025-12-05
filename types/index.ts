export interface User {
    id: string;
    username: string;
    email: string;
    image?: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export interface FlashcardSet {
    id: string;
    title: string;
    description: string | null;
    userId: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    user?: User;
    cards?: Card[];
    folderSets?: FolderSet[];
}

export interface Card {
    id: string;
    setId: string;
    term: string;
    definition: string | null;
    imageUrl: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export interface Folder {
    id: string;
    title: string;
    description: string | null;
    userId: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    folderSets?: FolderSet[];
    user?: User;
}

export interface FolderSet {
    folderId: string;
    setId: string;
    folder?: Folder;
    set?: FlashcardSet;
}
