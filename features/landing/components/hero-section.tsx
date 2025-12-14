"use client"

import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 500], [0, 200]);
    const y2 = useTransform(scrollY, [0, 500], [0, -150]);

    return (
        <section className="container mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center relative overflow-hidden min-h-[90vh] justify-center perspective-1000">
            {/* Ambient Backgrounds */}
            <motion.div
                style={{ y: y1, opacity: useTransform(scrollY, [0, 300], [1, 0]) }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/20 rounded-full blur-[120px] -z-10"
            />
            <motion.div
                style={{ y: y2 }}
                className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] -z-10"
            />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px] -z-10" />

            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 200, damping: 20 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm md:text-base text-zinc-300 mb-8 backdrop-blur-md shadow-lg shadow-indigo-500/20"
            >
                <Sparkles className="size-4 text-indigo-400 fill-indigo-400" />
                <span className="font-medium bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                    The smarter way to study
                </span>
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 50, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
                className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter max-w-5xl mx-auto mb-8 relative z-10"
            >
                <span className="bg-gradient-to-b from-white via-white to-zinc-400 bg-clip-text text-transparent block">
                    Master any subject
                </span>
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent block mt-2">
                    with Quizy
                </span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
            >
                Create flashcards, take quizzes, and track your progress.
                Join thousands of students who use Quizy to ace their exams.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4, type: "spring" }}
                className="flex flex-col sm:flex-row items-center gap-4 z-10"
            >
                <Link
                    href="/signup"
                    className="group h-14 px-8 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold flex items-center gap-2 transition-all shadow-xl shadow-indigo-500/25 relative overflow-hidden"
                >
                    <span className="relative z-10 flex items-center gap-2">
                        Start Learning Free
                        <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                </Link>
                <Link
                    href="#features"
                    className="h-14 px-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium flex items-center gap-2 transition-all backdrop-blur-sm hover:scale-105"
                >
                    Explore Features
                </Link>
            </motion.div>

            {/* Floating UI Elements / Decor */}
            <motion.div
                initial={{ x: -100, opacity: 0, rotate: -20 }}
                animate={{ x: 0, opacity: 1, rotate: -6 }}
                transition={{ duration: 1, delay: 0.5, type: "spring" }}
                className="absolute top-1/2 left-10 hidden lg:block -translate-y-1/2 w-64 h-80 bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl"
                style={{ y: y2 }}
            >
                <div className="w-full h-full bg-zinc-800/50 rounded-lg flex flex-col gap-3 p-3">
                    <div className="w-full h-32 bg-indigo-500/20 rounded-md animate-pulse"></div>
                    <div className="w-3/4 h-4 bg-white/10 rounded-full"></div>
                    <div className="w-1/2 h-4 bg-white/10 rounded-full"></div>
                    <div className="mt-auto w-full h-8 bg-indigo-500/20 rounded-md"></div>
                </div>
            </motion.div>

            <motion.div
                initial={{ x: 100, opacity: 0, rotate: 20 }}
                animate={{ x: 0, opacity: 1, rotate: 6 }}
                transition={{ duration: 1, delay: 0.6, type: "spring" }}
                className="absolute top-1/2 right-10 hidden lg:block -translate-y-1/2 w-64 h-80 bg-zinc-900/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl"
                style={{ y: y1 }}
            >
                <div className="w-full h-full bg-zinc-800/50 rounded-lg flex flex-col gap-3 p-3">
                    <div className="w-full h-32 bg-purple-500/20 rounded-md animate-pulse"></div>
                    <div className="w-3/4 h-4 bg-white/10 rounded-full"></div>
                    <div className="w-1/2 h-4 bg-white/10 rounded-full"></div>
                    <div className="mt-auto grid grid-cols-2 gap-2">
                        <div className="h-8 bg-purple-500/20 rounded-md"></div>
                        <div className="h-8 bg-purple-500/20 rounded-md"></div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
