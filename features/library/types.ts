export interface Author {
    name: string;
    avatarUrl?: string;
}

export interface LibraryItem {
    id: string;
    title: string;
    termCount: number;
    author: Author;
    createdAt: Date;
    type: 'set' | 'folder';
    progress?: number;
}
