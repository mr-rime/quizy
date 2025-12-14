"use client"

import Link from "next/link"
import { Brain } from "lucide-react"

export function LandingHeader() {
    return (
        <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-xl">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                    <div className="size-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <Brain className="size-5 text-white" />
                    </div>
                    <span>Quizy</span>
                </div>
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
                    <Link href="#features" className="hover:text-white transition-colors">Features</Link>
                    <Link href="#testimonials" className="hover:text-white transition-colors">Testimonials</Link>
                    <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
                    <Link href="#faq" className="hover:text-white transition-colors">FAQ</Link>
                </nav>
                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">
                        Log in
                    </Link>
                    <Link
                        href="/signup"
                        className="text-sm font-medium bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors"
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    )
}
