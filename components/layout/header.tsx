import { ProfileMenu } from "../profile-menu";

export function Header() {
    return (
        <header className="p-2 h-18 flex items-center justify-between px-20 border-b">
            <h1 className="text-black dark:text-white text-2xl">
                <span className="font-bold">Q</span>uizy
            </h1>

            <ProfileMenu />
        </header>
    )
}
