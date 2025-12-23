"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

export function TestimonialsSection() {
    return (
        <section className="container mx-auto px-4 py-24 md:py-32">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-3xl mb-16"
            >
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                    Trusted by thousands of learners
                </h2>
                <p className="text-lg text-zinc-400">
                    See what students are saying about Quizy.
                </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30"
                >
                    <div className="flex gap-1 text-amber-500 mb-4">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="size-4 fill-amber-500" />
                        ))}
                    </div>
                    <p className="text-zinc-300 leading-relaxed mb-4">
                        "Quizy helped me ace my medical board exams. The spaced repetition feature is a game changer."
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-zinc-800 flex items-center justify-center text-white font-semibold text-sm">
                            SJ
                        </div>
                        <div>
                            <div className="font-medium text-white text-sm">Sarah Jenkins</div>
                            <div className="text-xs text-zinc-500">Med Student</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30"
                >
                    <div className="flex gap-1 text-amber-500 mb-4">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="size-4 fill-amber-500" />
                        ))}
                    </div>
                    <p className="text-zinc-300 leading-relaxed mb-4">
                        "I used to struggle with organizing my study notes. Now I just generate flashcards instantly. Amazing."
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-zinc-800 flex items-center justify-center text-white font-semibold text-sm">
                            MC
                        </div>
                        <div>
                            <div className="font-medium text-white text-sm">Michael Chen</div>
                            <div className="text-xs text-zinc-500">CS Major</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30"
                >
                    <div className="flex gap-1 text-amber-500 mb-4">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="size-4 fill-amber-500" />
                        ))}
                    </div>
                    <p className="text-zinc-300 leading-relaxed mb-4">
                        "The best study app I've used. Clean interface, no distractions, and it actually works."
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-zinc-800 flex items-center justify-center text-white font-semibold text-sm">
                            EW
                        </div>
                        <div>
                            <div className="font-medium text-white text-sm">Emma Wilson</div>
                            <div className="text-xs text-zinc-500">High School Senior</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 md:col-span-2 lg:col-span-1"
                >
                    <div className="flex gap-1 text-amber-500 mb-4">
                        {[...Array(4)].map((_, i) => (
                            <Star key={i} className="size-4 fill-amber-500" />
                        ))}
                        <Star className="size-4 text-amber-500" />
                    </div>
                    <p className="text-zinc-300 leading-relaxed mb-4">
                        "Team collaboration features made our group projects so much easier to manage."
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-zinc-800 flex items-center justify-center text-white font-semibold text-sm">
                            DR
                        </div>
                        <div>
                            <div className="font-medium text-white text-sm">David Rodriguez</div>
                            <div className="text-xs text-zinc-500">Engineering Student</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30"
                >
                    <div className="flex gap-1 text-amber-500 mb-4">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="size-4 fill-amber-500" />
                        ))}
                    </div>
                    <p className="text-zinc-300 leading-relaxed mb-4">
                        "I learned a new language in 3 months using the flashcards. Highly recommend!"
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-zinc-800 flex items-center justify-center text-white font-semibold text-sm">
                            LP
                        </div>
                        <div>
                            <div className="font-medium text-white text-sm">Lisa Park</div>
                            <div className="text-xs text-zinc-500">Language Learner</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30"
                >
                    <div className="flex gap-1 text-amber-500 mb-4">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="size-4 fill-amber-500" />
                        ))}
                    </div>
                    <p className="text-zinc-300 leading-relaxed mb-4">
                        "Worth every penny for the Pro plan. The analytics help me focus on my weak spots."
                    </p>
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-zinc-800 flex items-center justify-center text-white font-semibold text-sm">
                            JT
                        </div>
                        <div>
                            <div className="font-medium text-white text-sm">James Thompson</div>
                            <div className="text-xs text-zinc-500">Law Student</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
