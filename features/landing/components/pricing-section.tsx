"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check } from "lucide-react"

export function PricingSection() {
    const [isYearly, setIsYearly] = useState(false)

    return (
        <section id="pricing" className="container mx-auto px-4 py-24 md:py-32">
            <div className="max-w-3xl mb-12">
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

            {/* Simple toggle */}
            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-12"
            >
                <button
                    onClick={() => setIsYearly(false)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${!isYearly ? "bg-white text-black" : "text-zinc-400 hover:text-white"
                        }`}
                >
                    Monthly
                </button>
                <button
                    onClick={() => setIsYearly(true)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isYearly ? "bg-white text-black" : "text-zinc-400 hover:text-white"
                        }`}
                >
                    Yearly
                </button>
                {isYearly && (
                    <span className="text-sm text-emerald-500 font-medium">Save 20%</span>
                )}
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30"
                >
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-zinc-400 mb-2">Free</h3>
                        <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-5xl font-bold text-white">$0</span>
                        </div>
                        <p className="text-sm text-zinc-500">Forever free</p>
                    </div>

                    <ul className="space-y-3 mb-8">
                        <li className="flex items-start gap-3 text-sm text-zinc-300">
                            <Check className="size-5 text-zinc-500 shrink-0 mt-0.5" strokeWidth={2} />
                            <span>Unlimited flashcards</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-zinc-300">
                            <Check className="size-5 text-zinc-500 shrink-0 mt-0.5" strokeWidth={2} />
                            <span>Basic quizzes</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-zinc-300">
                            <Check className="size-5 text-zinc-500 shrink-0 mt-0.5" strokeWidth={2} />
                            <span>Public decks access</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-zinc-300">
                            <Check className="size-5 text-zinc-500 shrink-0 mt-0.5" strokeWidth={2} />
                            <span>Mobile app</span>
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
                    className="p-8 rounded-2xl border-2 border-white bg-white text-black relative"
                >
                    <div className="absolute -top-3 left-8 px-3 py-1 bg-black text-white text-xs font-semibold rounded-full">
                        MOST POPULAR
                    </div>

                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-zinc-600 mb-2">Pro</h3>
                        <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-5xl font-bold">{isYearly ? "$8" : "$10"}</span>
                            <span className="text-zinc-600">/month</span>
                        </div>
                        <p className="text-sm text-zinc-500">
                            {isYearly ? "Billed annually" : "Billed monthly"}
                        </p>
                    </div>

                    <ul className="space-y-3 mb-8">
                        <li className="flex items-start gap-3 text-sm">
                            <Check className="size-5 shrink-0 mt-0.5" strokeWidth={2} />
                            <span>Everything in Free</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm">
                            <Check className="size-5 shrink-0 mt-0.5" strokeWidth={2} />
                            <span>Unlimited AI generation</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm">
                            <Check className="size-5 shrink-0 mt-0.5" strokeWidth={2} />
                            <span>Advanced analytics</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm">
                            <Check className="size-5 shrink-0 mt-0.5" strokeWidth={2} />
                            <span>Spaced repetition</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm">
                            <Check className="size-5 shrink-0 mt-0.5" strokeWidth={2} />
                            <span>Priority support</span>
                        </li>
                    </ul>

                    <button className="w-full py-3 rounded-lg bg-black text-white font-semibold hover:bg-zinc-800 transition-colors">
                        Get started
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="p-8 rounded-2xl border border-zinc-800 bg-zinc-900/30"
                >
                    <div className="mb-8">
                        <h3 className="text-lg font-semibold text-zinc-400 mb-2">Team</h3>
                        <div className="flex items-baseline gap-1 mb-1">
                            <span className="text-5xl font-bold text-white">{isYearly ? "$16" : "$20"}</span>
                        </div>
                        <p className="text-sm text-zinc-500">Per user/month</p>
                    </div>

                    <ul className="space-y-3 mb-8">
                        <li className="flex items-start gap-3 text-sm text-zinc-300">
                            <Check className="size-5 text-zinc-500 shrink-0 mt-0.5" strokeWidth={2} />
                            <span>Everything in Pro</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-zinc-300">
                            <Check className="size-5 text-zinc-500 shrink-0 mt-0.5" strokeWidth={2} />
                            <span>Shared workspaces</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-zinc-300">
                            <Check className="size-5 text-zinc-500 shrink-0 mt-0.5" strokeWidth={2} />
                            <span>Admin controls</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-zinc-300">
                            <Check className="size-5 text-zinc-500 shrink-0 mt-0.5" strokeWidth={2} />
                            <span>Collaborative editing</span>
                        </li>
                        <li className="flex items-start gap-3 text-sm text-zinc-300">
                            <Check className="size-5 text-zinc-500 shrink-0 mt-0.5" strokeWidth={2} />
                            <span>Team analytics</span>
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
