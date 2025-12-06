
export interface LibraryItem {
    id: string;
    title: string;
    termCount: number;
    createdAt: Date;
    type: 'set' | 'folder';
    progress?: number;
}
