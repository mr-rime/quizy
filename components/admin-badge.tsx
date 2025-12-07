import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminBadgeProps {
    className?: string;
    size?: "sm" | "md";
}

export function AdminBadge({ className, size = "md" }: AdminBadgeProps) {
    const sizeClasses = {
        sm: "text-xs px-1.5 py-0.5",
        md: "text-sm px-2 py-1"
    };

    return (
        <span className={cn(
            "inline-flex items-center gap-1 bg-red-500/10 text-red-600 dark:text-red-400 rounded-md font-medium border border-red-500/20",
            sizeClasses[size],
            className
        )}>
            <Shield className={size === "sm" ? "h-3 w-3" : "h-4 w-4"} />
            Admin
        </span>
    );
}
