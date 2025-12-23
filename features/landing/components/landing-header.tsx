"use client"

import Link from "next/link"
import { Brain } from "lucide-react"

export function LandingHeader() {
    return (
        <header className="fixed top-0 w-full z-50 border-b border-zinc-800 bg-black/80 backdrop-blur-xl">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <div className="size-8 rounded-lg bg-white flex items-center justify-center">
                        <Brain className="size-5 text-black" />
                    </div>
                    <span>Quizy</span>
                </Link>
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
                    <Link href="#features" className="hover:text-white transition-colors">Features</Link>
                    <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
                    <Link href="#faq" className="hover:text-white transition-colors">FAQ</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">
                        Log in
                    </Link>
                    <Link
                        href="/signup"
                        className="text-sm font-semibold bg-white text-black px-4 py-2 rounded-lg hover:bg-zinc-100 transition-colors"
                    >
                        Sign up
                    </Link>
                </div>
            </div>
        </header>
    )
}
