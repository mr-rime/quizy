"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function CTASection() {
    return (
        <section className="container mx-auto px-4 py-24">
            <div className="relative rounded-2xl border border-zinc-800 bg-zinc-900/30 px-6 py-20 text-center">
                <div className="relative z-10 max-w-2xl mx-auto">
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-white">
                        Ready to start learning?
                    </h2>
                    <p className="text-zinc-400 text-lg mb-10">
                        Join thousands of students using Quizy to achieve their goals. Start for free, no credit card required.
                    </p>
                    <Link
                        href="/signup"
                        className="inline-flex items-center gap-2 h-12 px-8 bg-white text-black font-semibold rounded-lg hover:bg-zinc-100 transition-colors"
                    >
                        Get started free
                        <ArrowRight className="size-4" />
                    </Link>
                </div>
            </div>
        </section>
    )
}
