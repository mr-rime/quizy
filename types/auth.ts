export type User = {
    id: string;
    username: string;
    email: string;
    password?: string | null;
    image?: string | null;
    role?: string;
    playAudioOnProgress?: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export type Session = {
    id: string;
    userId: string;
    token: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
};
