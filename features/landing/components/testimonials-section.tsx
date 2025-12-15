"use client"

import { motion } from "framer-motion"
import { Star } from "lucide-react"

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
}

const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 50 } }
}

export function TestimonialsSection() {
    return (
        <section className="container mx-auto px-4 py-24 md:py-32 relative overflow-hidden">

            <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] -z-10 transform-gpu will-change-transform" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center max-w-3xl mx-auto mb-20 will-change-transform"
            >
                <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-6">
                    Loved by students worldwide.
                </h2>
                <p className="text-lg text-zinc-400">
                    See what others are achieving with Quizy.
                </p>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid md:grid-cols-3 gap-6"
            >
                <TestimonialCard
                    quote="Quizy helped me ace my medical board exams. The spaced repetition feature is a game changer."
                    author="Sarah Jenkins"
                    role="Med Student"
                    rating={5}
                />
                <TestimonialCard
                    quote="I used to struggle with organizing my study notes. Now I just generate flashcards instantly. Amazing."
                    author="Michael Chen"
                    role="Computer Science Major"
                    rating={5}
                />
                <TestimonialCard
                    quote="The best study app I've used. Clean interface, no distractions, and it actually works."
                    author="Emma Wilson"
                    role="High School Senior"
                    rating={5}
                />
                <TestimonialCard
                    quote="Team collaboration features made our group projects so much easier to manage."
                    author="David Rodriguez"
                    role="Engineering Student"
                    rating={4}
                />
                <TestimonialCard
                    quote="I learned a new language in 3 months using the flashcards. Highly recommend!"
                    author="Lisa Park"
                    role="Language Learner"
                    rating={5}
                />
                <TestimonialCard
                    quote="Worth every penny for the Pro plan. The analytics help me focus on my weak spots."
                    author="James Thompson"
                    role="Law Student"
                    rating={5}
                />
            </motion.div>
        </section>
    )
}

function TestimonialCard({ quote, author, role, rating }: { quote: string, author: string, role: string, rating: number }) {
    return (
        <motion.div
            variants={item as never}
            whileHover={{ y: -5 }}
            className="p-8 rounded-2xl bg-zinc-900/30 border border-white/5 hover:bg-zinc-900 hover:border-white/20 transition-colors duration-300 will-change-transform"
        >
            <div className="flex gap-1 text-yellow-500 mb-4">
                {[...Array(rating)].map((_, i) => (
                    <Star key={i} className="size-4 fill-yellow-500" />
                ))}
            </div>
            <p className="text-zinc-300 text-lg mb-6 leading-relaxed">&quot;{quote}&quot;</p>
            <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    {author[0]}
                </div>
                <div>
                    <div className="font-semibold">{author}</div>
                    <div className="text-sm text-zinc-500">{role}</div>
                </div>
            </div>
        </motion.div>
    )
}
