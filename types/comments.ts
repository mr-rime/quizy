export interface CommentUser {
    id: string;
    username: string;
    image: string | null;
}

export interface Comment {
    id: string;
    userId: string;
    setId: string;
    content: string;
    isPinned: boolean;
    createdAt: Date | null;
    updatedAt: Date | null;
}

export interface CommentWithUser extends Comment {
    user: CommentUser | null;
}
