import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AuthorInfoProps {
    username: string;
    image?: string | null;
    size?: "sm" | "md" | "lg";
}

export function AuthorInfo({ username, size = "sm" }: AuthorInfoProps) {
    const sizeClasses = {
        sm: "h-6 w-6 text-xs",
        md: "h-8 w-8 text-sm",
        lg: "h-10 w-10 text-base",
    };

    return (
        <div className="flex items-center gap-2">
            <Avatar className={sizeClasses[size]}>
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {username[0]?.toUpperCase() || "U"}
                </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium truncate">{username}</span>
        </div>
    );
}
