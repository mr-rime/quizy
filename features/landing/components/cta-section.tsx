"use client"

import Link from "next/link"

export function CTASection() {
    return (
        <section className="container mx-auto px-4 py-24">
            <div className="relative rounded-3xl bg-indigo-600 overflow-hidden px-6 py-20 text-center">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-indigo-900/50 rounded-full blur-3xl"></div>

                <div className="relative z-10 max-w-2xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-white">Ready to start learning?</h2>
                    <p className="text-indigo-100 text-lg mb-10">
                        Join Quizy today and unlock your full potential. usage is free for students.
                    </p>
                    <Link
                        href="/signup"
                        className="inline-flex h-14 px-8 items-center justify-center rounded-full bg-white text-indigo-600 font-bold text-lg hover:bg-zinc-100 transition-colors"
                    >
                        Get Started for Free
                    </Link>
                </div>
            </div>
        </section>
    )
}
