"use client"

import { motion } from "framer-motion"
import { Brain, Layers, Repeat, ShieldCheck, Share2, Zap } from "lucide-react"

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
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
}

export function FeaturesSection() {
    return (
        <section id="features" className="container mx-auto px-4 py-24 md:py-32">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-3xl mx-auto mb-20 will-change-transform"
            >
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">Everything you need to excel.</h2>
                <p className="text-lg text-zinc-400">
                    Powerful tools designed to help you learn faster and retain more information.
                </p>
            </motion.div>

            <motion.div
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                className="grid md:grid-cols-3 gap-6"
            >
                <FeatureCard
                    icon={<Layers className="size-6" />}
                    title="Smart Flashcards"
                    description="Create unlimited decks with rich text editing. Organize by subject and topic easily."
                />
                <FeatureCard
                    icon={<Repeat className="size-6" />}
                    title="Spaced Repetition"
                    description="Our algorithm schedules reviews at the perfect time so you never forget what you've learned."
                />
                <FeatureCard
                    icon={<Zap className="size-6" />}
                    title="AI Generation"
                    description="Generate quizzes and flashcards instantly from your notes or any text using AI."
                />
                <FeatureCard
                    icon={<ShieldCheck className="size-6" />}
                    title="Progress Tracking"
                    description="Visualize your learning journey with detailed stats and achievement badges."
                />
                <FeatureCard
                    icon={<Share2 className="size-6" />}
                    title="Collaborative Study"
                    description="Share decks with friends or classmates and study together in real-time."
                />
                <FeatureCard
                    icon={<Brain className="size-6" />}
                    title="Focus Mode"
                    description="Distraction-free learning environment designed to keep you in the flow."
                />
            </motion.div>
        </section>
    )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <motion.div
            variants={item as never}
            className="group p-8 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-indigo-500/30 hover:bg-zinc-900 transition-colors duration-300 will-change-transform"
        >
            <div className="size-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 mb-6 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-300 ease-out transform-gpu">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{title}</h3>
            <p className="text-zinc-400 leading-relaxed">
                {description}
            </p>
        </motion.div>
    )
}
