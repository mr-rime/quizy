"use client"
import { House, Library, Folder, Plus, Star, Trophy, Bookmark, Compass } from "lucide-react";
import Link from "next/link";
import { JSX, use, useState } from "react";
import { usePathname } from "next/navigation";
import { FolderDialog } from "@/features/folders/components/create-folder-button";
import { Folder as FolderType } from "@/types";
import { Button } from "../ui/button";

type LinkComponentProps = Parameters<typeof Link>[0];

type LinkType = {
    name: string;
    href: LinkComponentProps["href"];
    icon: JSX.Element;
};

const links: LinkType[] = [
    { name: "Home", href: "/latest", icon: <House size={20} /> },
    { name: "Discover", href: "/discover", icon: <Compass size={20} /> },
    { name: "Your Library", href: "/library", icon: <Library size={20} /> },
    { name: "Saved Sets", href: "/saved", icon: <Bookmark size={20} /> },
    { name: "Favorites", href: "/favorites", icon: <Star size={20} /> },
    { name: "Achievements", href: "/achievements", icon: <Trophy size={20} /> },
];

interface SidebarProps {
    foldersPromise: Promise<FolderType[]>;
    isMobileMenuOpen: boolean;
    onCloseMobileMenu: () => void;
}

export function Sidebar({ foldersPromise, isMobileMenuOpen, onCloseMobileMenu }: SidebarProps) {
    const folders = use(foldersPromise);
    const pathname = usePathname();
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);

    const handleLinkClick = () => {
        onCloseMobileMenu();
    };

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                onClick={onCloseMobileMenu}
            />

            <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r bg-white dark:bg-card p-5 shadow-md flex flex-col overflow-y-auto z-50 transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}>

                <nav>
                    <ul className="flex flex-col gap-4">
                        {links.map((link) => {
                            const isActive =
                                link.href === "/" ? pathname === "/" || pathname === "/latest" : pathname.startsWith(link.href.toString());
                            return (
                                <li key={link.name}>
                                    <Link
                                        href={link.href}
                                        onClick={handleLinkClick}
                                        className={`flex items-center gap-3 p-3 rounded-lg text-zinc-700 dark:text-zinc-300 transition-all duration-200
                                            ${isActive ? "bg-zinc-200 dark:bg-zinc-700 font-semibold" : "hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white"}
                                        `}
                                    >
                                        {link.icon} <span className="text-sm sm:text-base">{link.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="mt-8">
                    <div className="flex items-center justify-between px-3 mb-2">
                        <h3 className="text-xs sm:text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                            Your folders
                        </h3>
                    </div>
                    <ul className="flex flex-col gap-1">
                        {folders.map((folder) => {
                            const isActive = pathname === `/folders/${folder.id}`;
                            return (
                                <li key={folder.id}>
                                    <Link
                                        href={`/folders/${folder.id}`}
                                        onClick={handleLinkClick}
                                        className={`flex items-center gap-3 p-3 rounded-lg text-zinc-700 dark:text-zinc-300 transition-all duration-200
                                            ${isActive ? "bg-zinc-200 dark:bg-zinc-700 font-semibold" : "hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white"}
                                        `}
                                        prefetch
                                    >
                                        <Folder size={20} />
                                        <span className="truncate text-sm sm:text-base">{folder.title}</span>
                                    </Link>
                                </li>
                            );
                        })}
                        <li>
                            <Button
                                onClick={() => setIsCreateFolderOpen(true)}
                                variant={"ghost"}
                                className="flex items-center gap-3 p-3 w-full rounded-lg text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"
                            >
                                <Plus size={20} />
                                <span className="text-sm sm:text-base">Create folder</span>
                            </Button>
                        </li>
                    </ul>
                </div>

                <FolderDialog open={isCreateFolderOpen} onOpenChange={setIsCreateFolderOpen} />
            </aside>
        </>
    );
}
