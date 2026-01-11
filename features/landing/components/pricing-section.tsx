"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

export function PricingSection() {
    return (
        <section id="pricing" className="container mx-auto px-4 py-24 md:py-32">
            <div className="max-w-3xl mb-12 mx-auto text-center">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4"
                >
                    Simple, transparent pricing
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-zinc-400"
                >
                    Choose the plan that works for you.
                </motion.p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 text-center flex flex-col items-center h-full"
                >
                    <div className="mb-8 w-full">
                        <h3 className="text-lg font-semibold text-zinc-400 mb-2">Free</h3>
                        <div className="flex items-baseline justify-center gap-1 mb-1">
                            <span className="text-5xl font-bold text-white">$0</span>
                        </div>
                        <p className="text-sm text-zinc-500">Forever free</p>
                    </div>

                    <ul className="space-y-3 mb-8 w-full flex-1">
                        <li className="flex items-start gap-3 text-sm text-zinc-300 justify-center text-left">
                            <Check className="size-5 text-zinc-500 shrink-0 mt-0.5" strokeWidth={2} />
                            <span className="w-full text-left max-w-[140px]">Unlimited flashcards</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-zinc-300 justify-center text-left">
                            <Check className="size-5 text-zinc-500 shrink-0 mt-0.5" strokeWidth={2} />
                            <span className="w-full text-left max-w-[140px]">Basic quizzes</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-zinc-300 justify-center text-left">
                            <Check className="size-5 text-zinc-500 shrink-0 mt-0.5" strokeWidth={2} />
                            <span className="w-full text-left max-w-[140px]">Public decks access</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-zinc-300 justify-center text-left">
                            <Check className="size-5 text-zinc-500 shrink-0 mt-0.5" strokeWidth={2} />
                            <span className="w-full text-left max-w-[140px]">Mobile app</span>
                        </li>
                    </ul>

                    <button className="w-full py-3 rounded-lg border border-zinc-800 text-white font-medium hover:bg-zinc-900 transition-colors">
                        Get started
                    </button>
                </motion.div>

                {/* Pro plan - featured */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 relative text-center flex flex-col items-center h-full"
                >
                    <div className="absolute top-0 right-0 px-4 py-1.5 bg-gradient-to-bl from-emerald-500 to-emerald-600 text-white text-[10px] font-bold tracking-widest uppercase rounded-bl-xl rounded-tr-2xl">
                        MOST POPULAR
                    </div>

                    <div className="mb-8 w-full">
                        <h3 className="text-lg font-semibold text-white mb-2">Pro</h3>
                        <div className="flex items-baseline justify-center gap-1 mb-1">
                            <span className="text-5xl font-bold text-white">$10</span>
                            <span className="text-zinc-400">/month</span>
                        </div>
                        <p className="text-sm text-zinc-500">
                            Billed monthly
                        </p>
                    </div>

                    <ul className="space-y-3 mb-8 w-full flex-1">
                        <li className="flex items-start gap-3 text-sm text-zinc-300 justify-center text-left">
                            <Check className="size-5 text-emerald-500 shrink-0 mt-0.5" strokeWidth={2} />
                            <span className="w-full text-left max-w-[140px]">Everything in Free</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-zinc-300 justify-center text-left">
                            <Check className="size-5 text-emerald-500 shrink-0 mt-0.5" strokeWidth={2} />
                            <span className="w-full text-left max-w-[140px]">Unlimited AI generation</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-zinc-300 justify-center text-left">
                            <Check className="size-5 text-emerald-500 shrink-0 mt-0.5" strokeWidth={2} />
                            <span className="w-full text-left max-w-[140px]">Advanced analytics</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-zinc-300 justify-center text-left">
                            <Check className="size-5 text-emerald-500 shrink-0 mt-0.5" strokeWidth={2} />
                            <span className="w-full text-left max-w-[140px]">Spaced repetition</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-zinc-300 justify-center text-left">
                            <Check className="size-5 text-emerald-500 shrink-0 mt-0.5" strokeWidth={2} />
                            <span className="w-full text-left max-w-[140px]">Priority support</span>
                        </li>
                    </ul>

                    <button className="w-full py-3 rounded-lg border border-zinc-800 text-white font-medium hover:bg-zinc-900 transition-colors">
                        Get started
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30 text-center flex flex-col items-center h-full"
                >
                    <div className="mb-8 w-full">
                        <h3 className="text-lg font-semibold text-zinc-400 mb-2">Team</h3>
                        <div className="flex items-baseline justify-center gap-1 mb-1">
                            <span className="text-5xl font-bold text-white">$20</span>
                        </div>
                        <p className="text-sm text-zinc-500">Per user/month</p>
                    </div>

                    <ul className="space-y-3 mb-8 w-full flex-1">
                        <li className="flex items-start gap-3 text-sm text-zinc-300 justify-center text-left">
                            <Check className="size-5 text-zinc-500 shrink-0 mt-0.5" strokeWidth={2} />
                            <span className="w-full text-left max-w-[140px]">Everything in Pro</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-zinc-300 justify-center text-left">
                            <Check className="size-5 text-zinc-500 shrink-0 mt-0.5" strokeWidth={2} />
                            <span className="w-full text-left max-w-[140px]">Shared workspaces</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-zinc-300 justify-center text-left">
                            <Check className="size-5 text-zinc-500 shrink-0 mt-0.5" strokeWidth={2} />
                            <span className="w-full text-left max-w-[140px]">Admin controls</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-zinc-300 justify-center text-left">
                            <Check className="size-5 text-zinc-500 shrink-0 mt-0.5" strokeWidth={2} />
                            <span className="w-full text-left max-w-[140px]">Collaborative editing</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-zinc-300 justify-center text-left">
                            <Check className="size-5 text-zinc-500 shrink-0 mt-0.5" strokeWidth={2} />
                            <span className="w-full text-left max-w-[140px]">Team analytics</span>
                        </li>
                    </ul>

                    <button className="w-full py-3 rounded-lg border border-zinc-800 text-white font-medium hover:bg-zinc-900 transition-colors">
                        Get started
                    </button>
                </motion.div>
            </div>
        </section>
    )
}
