import { Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivatePage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center p-6">
            <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-full mb-6">
                <Lock className="h-12 w-12 text-red-600 dark:text-red-400" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-4 text-zinc-900 dark:text-white">
                Site is Private
            </h1>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-md">
                This platform is currently in private mode. Access is restricted to administrators only.
            </p>
            <div className="flex gap-4">
                <Button asChild variant="outline">
                    <Link href="/">
                        Go Home
                    </Link>
                </Button>
                <Button asChild>
                    <Link href="/login">
                        Log in as Admin
                    </Link>
                </Button>
            </div>
        </div>
    );
}
