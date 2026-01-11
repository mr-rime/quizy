"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Check } from "lucide-react"

export function HeroSection() {
    return (
        <section className="container mx-auto px-4 py-20 md:py-32 relative">
            {/* Subtle grid background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a_1px,transparent_1px),linear-gradient(to_bottom,#27272a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] -z-10" />

            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">
                {/* Left: Content */}
                <div className="space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 text-sm text-zinc-400"
                    >
                        <span className="relative flex size-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full size-2 bg-emerald-500"></span>
                        </span>
                        Join 10,000+ active learners
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]"
                    >
                        Learn smarter,
                        <br />
                        not harder
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-lg text-zinc-400 max-w-lg leading-relaxed"
                    >
                        Create interactive flashcards, track your progress, and study more effectively with Quizy&apos;s intelligent learning platform.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Link
                            href="/signup"
                            className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-zinc-100 transition-colors"
                        >
                            Get started free
                            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="#features"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-zinc-800 text-white font-medium rounded-lg hover:bg-zinc-900 transition-colors"
                        >
                            See how it works
                        </Link>
                    </motion.div>

                    {/* Trust indicators */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="flex items-center gap-6 pt-4 text-sm text-zinc-500"
                    >
                        <div className="flex items-center gap-2">
                            <Check className="size-4 text-emerald-500" />
                            <span>Free forever</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check className="size-4 text-emerald-500" />
                            <span>No credit card</span>
                        </div>
                    </motion.div>
                </div>

                {/* Right: Product preview */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="relative lg:h-[600px] hidden lg:block"
                >
                    {/* Main card */}
                    <div className="absolute top-0 right-0 w-80 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="size-3 rounded-full bg-zinc-700"></div>
                                <div className="text-xs text-zinc-500 font-mono">15/30</div>
                            </div>
                            <div className="h-40 bg-zinc-800 rounded-lg flex items-center justify-center">
                                <div className="text-center px-4">
                                    <div className="text-2xl font-bold text-white mb-2">Photosynthesis</div>
                                    <div className="text-sm text-zinc-400">The process by which plants...</div>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button className="flex-1 py-2 bg-zinc-800 rounded-lg text-sm text-zinc-400 hover:bg-zinc-700 transition-colors">
                                    Hard
                                </button>
                                <button className="flex-1 py-2 bg-white text-black rounded-lg text-sm font-medium hover:bg-zinc-100 transition-colors">
                                    Got it
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats card */}
                    <div className="absolute top-32 left-0 w-64 bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-xl">
                        <div className="text-xs text-zinc-500 mb-2">This week</div>
                        <div className="text-2xl font-bold text-white mb-1">142 cards</div>
                        <div className="text-sm text-emerald-500">+23% from last week</div>
                        <div className="mt-3 h-12 flex items-end gap-1">
                            {[40, 65, 45, 80, 60, 90, 75].map((height, i) => (
                                <div
                                    key={i}
                                    className="flex-1 bg-zinc-700 rounded-sm"
                                    style={{ height: `${height}%` }}
                                ></div>
                            ))}
                        </div>
                    </div>

                    {/* Achievement badge */}
                    <div className="absolute bottom-20 right-12 w-48 bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-xl">
                        <div className="flex items-center gap-3">
                            <div className="size-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-xl">
                                🔥
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-white">7 day streak!</div>
                                <div className="text-xs text-zinc-500">Keep it going</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
