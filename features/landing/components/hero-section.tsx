"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
    return (
        <section className="container mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] -z-10" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm md:text-base text-zinc-300 mb-8"
            >
                <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
                The smarter way to study
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter max-w-4xl mx-auto bg-gradient-to-b from-white to-white/50 bg-clip-text text-transparent mb-8"
            >
                Master any subject with Quizy.
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed"
            >
                Create flashcards, take quizzes, and track your progress.
                Join thousands of students who use Quizy to ace their exams.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center gap-4"
            >
                <Link
                    href="/signup"
                    className="h-12 px-8 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                >
                    Start Learning Free
                    <ArrowRight className="size-4" />
                </Link>
                <Link
                    href="#features"
                    className="h-12 px-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium flex items-center gap-2 transition-all"
                >
                    Explore Features
                </Link>
            </motion.div>

            {/* Dashboard Preview / Visual */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-20 w-full max-w-5xl rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm p-4 shadow-2xl shadow-indigo-500/10"
            >
                <div className="aspect-[16/9] rounded-lg bg-zinc-900/50 flex items-center justify-center border border-white/5 overflow-hidden relative">
                    {/* Abstract UI Representation */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent"></div>
                    <div className="flex flex-col items-center gap-4 p-8">
                        <div className="text-zinc-500 text-sm uppercase tracking-widest font-semibold">Dashboard Preview</div>
                        <div className="text-2xl font-bold text-zinc-700">Interactive Quiz Interface</div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
