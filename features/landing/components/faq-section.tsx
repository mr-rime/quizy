"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

export function FAQSection() {
    return (
        <section id="faq" className="container mx-auto px-4 py-24 md:py-32">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
                        Frequently Asked Questions
                    </h2>
                </motion.div>

                <div className="space-y-4">
                    <FAQItem
                        question="Is Quizy really free?"
                        answer="Yes! Our Free plan gives you unlimited flashcards and access to all basic study modes. We believe education should be accessible to everyone."
                    />
                    <FAQItem
                        question="How does the AI generation work?"
                        answer="Simply paste your notes or text into our generator, and our AI analyzes the key concepts to create comprehensive flashcards and quizzes instantly."
                    />
                    <FAQItem
                        question="Can I study offline?"
                        answer="Offline mode is available on our Pro plan. You can download your decks and study anywhere, even without an internet connection."
                    />
                    <FAQItem
                        question="Is there a mobile app?"
                        answer="Yes, Quizy is fully responsive and runs great on any mobile browser. A dedicated native app is coming soon to iOS and Android."
                    />
                    <FAQItem
                        question="Can I share my decks with friends?"
                        answer="Absolutely. You can make any deck public or share it privately via a link. Collaborative editing is available on the Team plan."
                    />
                </div>
            </div>
        </section>
    )
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border border-white/5 rounded-2xl bg-zinc-900/30 overflow-hidden"
        >
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
            >
                <span className="text-lg font-medium">{question}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronDown className="size-5 text-zinc-500" />
                </motion.div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                        <div className="px-6 pb-6 text-zinc-400 leading-relaxed border-t border-white/5 pt-4">
                            {answer}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
