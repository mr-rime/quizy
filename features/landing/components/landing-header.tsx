"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { User } from "@/types/auth"

export function LandingHeader() {
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch("/api/auth/me")
                if (response.ok) {
                    const userData = await response.json()
                    setUser(userData.user)
                }
            } catch (error) {
                console.error("Error checking auth:", error)
            }
        }

        checkAuth()
    }, [])

    return (
        <header className="fixed top-0 w-full z-50 border-b border-zinc-800 bg-black/80 backdrop-blur-xl">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
                    <Image
                        src="/autism-logo.png"
                        alt="Quizy Logo"
                        width={32}
                        height={32}
                        className="size-8 rounded-lg"
                    />
                    <span>Quizy</span>
                </Link>
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
                    <Link href="#features" className="hover:text-white transition-colors">Features</Link>
                    <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
                    <Link href="#faq" className="hover:text-white transition-colors">FAQ</Link>
                </nav>
                <div className="flex items-center gap-4">
                    {user ? (
                        <Link
                            href="/latest"
                            className="text-sm font-semibold bg-white text-black px-4 py-2 rounded-lg hover:bg-zinc-100 transition-colors"
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium text-zinc-400 hover:text-white transition-colors hidden sm:block">
                                Log in
                            </Link>
                            <Link
                                href="/signup"
                                className="text-sm font-semibold bg-white text-black px-4 py-2 rounded-lg hover:bg-zinc-100 transition-colors"
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}
