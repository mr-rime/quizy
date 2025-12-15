"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, X } from "lucide-react"

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
}

const item = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 50 } }
}

export function PricingSection() {
    const [isYearly, setIsYearly] = useState(false)

    return (
        <section id="pricing" className="container mx-auto px-4 py-24 md:py-32 relative">

            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -z-10 transform-gpu will-change-transform" />

            <div className="text-center max-w-3xl mx-auto mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-5xl font-black tracking-tight mb-6 bg-gradient-to-br from-white to-zinc-500 bg-clip-text text-transparent will-change-transform"
                >
                    Simple, transparent pricing.
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-lg text-zinc-400 mb-8 will-change-transform"
                >
                    Choose the plan that fits your learning needs.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center p-1 rounded-full bg-zinc-900 border border-white/10 mb-8 relative will-change-transform"
                >
                    <button
                        onClick={() => setIsYearly(false)}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all relative z-10 ${!isYearly ? "text-white" : "text-zinc-400 hover:text-white"}`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setIsYearly(true)}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all relative z-10 ${isYearly ? "text-white" : "text-zinc-400 hover:text-white"}`}
                    >
                        Yearly <span className="text-xs text-green-400 ml-1">(-20%)</span>
                    </button>

                    {/* Sliding background for toggle */}
                    <motion.div
                        animate={{ x: isYearly ? "100%" : "0%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="absolute left-1 top-1 w-[calc(50%-4px)] h-[calc(100%-8px)] bg-zinc-800 rounded-full shadow-md will-change-transform"
                    />
                </motion.div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"
            >
                <PricingCard
                    tier="Free"
                    price="$0"
                    period="forever"
                    description="Essential tools for casual learners."
                    features={[
                        "Unlimited Flashcards",
                        "Basic Quizzes",
                        "Public Decks Access",
                        "Mobile App Access"
                    ]}
                    notFeatures={[
                        "AI Generation",
                        "Progress Analytics",
                        "Offline Mode"
                    ]}
                />
                <PricingCard
                    tier="Pro"
                    price={isYearly ? "$8" : "$10"}
                    period={isYearly ? "per month, billed yearly" : "per month"}
                    description="Everything you need to master any subject."
                    features={[
                        "Everything in Free",
                        "Unlimited AI Generation",
                        "Advanced Analytics",
                        "Spaced Repetition Mode",
                        "Priority Support"
                    ]}
                    popular
                />
                <PricingCard
                    tier="Team"
                    price={isYearly ? "$16" : "$20"}
                    period={isYearly ? "per user/mo, billed yearly" : "per user/mo"}
                    description="Collaborate and learn together."
                    features={[
                        "Everything in Pro",
                        "Shared Workspaces",
                        "Admin Controls",
                        "Collaborative Editing",
                        "Team Analytics"
                    ]}
                />
            </motion.div>
        </section>
    )
}

function PricingCard({ tier, price, period, description, features, notFeatures = [], popular = false }: { tier: string, price: string, period: string, description: string, features: string[], notFeatures?: string[], popular?: boolean }) {
    return (
        <motion.div
            variants={item as never}
            whileHover={{ y: -10 }}
            className={`relative p-8 rounded-3xl border flex flex-col transition-shadow duration-300 will-change-transform ${popular
                ? "bg-zinc-900/80 border-indigo-500/50 shadow-2xl shadow-indigo-500/10 z-10"
                : "bg-zinc-900/40 border-white/5 hover:border-white/10 hover:shadow-xl"
                }`}
        >
            {popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold uppercase tracking-wider shadow-lg">
                    Most Popular
                </div>
            )}

            <div className="mb-8">
                <h3 className="text-lg font-medium text-zinc-400 mb-2">{tier}</h3>
                <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">{price}</span>
                    <span className="text-sm text-zinc-500">{period}</span>
                </div>
                <p className="text-sm text-zinc-400 mt-4">{description}</p>
            </div>

            <div className="flex-1 space-y-4 mb-8">
                {features.map((feature: string) => (
                    <div key={feature} className="flex items-center gap-3 text-sm">
                        <div className="size-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                            <Check className="size-3 text-green-500" />
                        </div>
                        <span className="text-zinc-300">{feature}</span>
                    </div>
                ))}
                {notFeatures.map((feature: string) => (
                    <div key={feature} className="flex items-center gap-3 text-sm opacity-50">
                        <div className="size-5 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                            <X className="size-3 text-zinc-500" />
                        </div>
                        <span className="text-zinc-500">{feature}</span>
                    </div>
                ))}
            </div>

            <button
                className={`w-full py-3 rounded-xl font-medium transition-all ${popular
                    ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 active:scale-95 transform"
                    : "bg-white/10 hover:bg-white/20 text-white active:scale-95 transform"
                    }`}
            >
                Get Started
            </button>
        </motion.div>
    )
}
