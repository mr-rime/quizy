"use client"

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function LogoutButton() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    async function handleLogout() {
        startTransition(async () => {
            try {
                const response = await fetch("/api/auth/logout", { method: "POST" });

                if (response.ok) {
                    router.refresh();
                    router.push("/login");
                }
            } catch (error) {
                console.error("Logout failed:", error);
            }
        });
    }

    return (
        <DropdownMenuItem onClick={handleLogout} disabled={isPending}>
            {isPending ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
    )
}
