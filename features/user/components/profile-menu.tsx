import { LogoutButton } from "@/features/auth/components/logout-button";
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Star } from "lucide-react";


export function ProfileMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
                <Avatar >
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 relative" align="end">
                <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                        <Link href="/favorites" className="cursor-pointer w-full flex items-center">
                            <Star className="mr-2 h-4 w-4" />
                            <span>Favorites</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <LogoutButton />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
