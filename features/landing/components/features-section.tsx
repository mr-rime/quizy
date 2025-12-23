"use client"

import { motion } from "framer-motion"
import { Brain, Layers, Repeat, ShieldCheck, Share2, Zap } from "lucide-react"

export function FeaturesSection() {
    return (
        <section id="features" className="container mx-auto px-4 py-24 md:py-32">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="max-w-3xl mb-16 mx-auto text-center"
            >
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                    Everything you need to succeed
                </h2>
                <p className="text-lg text-zinc-400">
                    Powerful study tools built for modern learners.
                </p>
            </motion.div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto">
                {/* Large card - Smart Flashcards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="md:col-span-2 md:row-span-2 group p-8 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors text-center"
                >
                    <div className="h-full flex flex-col items-center">
                        <Layers className="size-8 text-white mb-4" strokeWidth={1.5} />
                        <h3 className="text-2xl font-bold text-white mb-3">Smart Flashcards</h3>
                        <p className="text-zinc-400 leading-relaxed mb-6">
                            Create unlimited decks with rich text editing, images, and audio. Organize by subject and topic with our intuitive folder system.
                        </p>
                        <div className="mt-auto bg-zinc-800/50 rounded-xl p-4 border border-zinc-700/50 w-full max-w-md mx-auto">
                            <div className="flex items-center justify-center gap-3 mb-3">
                                <div className="size-2 rounded-full bg-emerald-500"></div>
                                <div className="text-sm text-zinc-500">Biology • 24 cards</div>
                            </div>
                            <div className="space-y-2 flex flex-col items-center">
                                <div className="h-2 bg-zinc-700 rounded-full w-3/4"></div>
                                <div className="h-2 bg-zinc-700 rounded-full w-1/2"></div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* AI Generation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors text-center flex flex-col items-center"
                >
                    <Zap className="size-7 text-white mb-4" strokeWidth={1.5} />
                    <h3 className="text-xl font-bold text-white mb-2">AI Generation</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        Generate quizzes and flashcards instantly from your notes using AI.
                    </p>
                </motion.div>

                {/* Progress Tracking */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors text-center flex flex-col items-center"
                >
                    <ShieldCheck className="size-7 text-white mb-4" strokeWidth={1.5} />
                    <h3 className="text-xl font-bold text-white mb-2">Progress Tracking</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        Visualize your learning journey with detailed statistics.
                    </p>
                </motion.div>

                {/* Spaced Repetition */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors text-center flex flex-col items-center"
                >
                    <Repeat className="size-7 text-white mb-4" strokeWidth={1.5} />
                    <h3 className="text-xl font-bold text-white mb-2">Spaced Repetition</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        Our algorithm schedules reviews at optimal intervals for retention.
                    </p>
                </motion.div>

                {/* Collaborative Study */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.25 }}
                    className="md:col-span-2 group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors text-center flex flex-col items-center"
                >
                    <Share2 className="size-7 text-white mb-4" strokeWidth={1.5} />
                    <h3 className="text-xl font-bold text-white mb-2">Collaborative Study</h3>
                    <p className="text-zinc-400 leading-relaxed px-4">
                        Share decks with friends or classmates. Study together in real-time and track group progress.
                    </p>
                </motion.div>

                {/* Focus Mode */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="group p-6 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-colors text-center flex flex-col items-center"
                >
                    <Brain className="size-7 text-white mb-4" strokeWidth={1.5} />
                    <h3 className="text-xl font-bold text-white mb-2">Focus Mode</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                        Distraction-free environment designed to keep you in flow.
                    </p>
                </motion.div>
            </div>
        </section>
    )
}
