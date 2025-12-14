"use client"

import { motion } from "framer-motion"

import { Sparkles } from "lucide-react"

export function WelcomeHeader({ userName }: { userName?: string }) {
    const timeOfDay = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening"

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
        >
            <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center justify-center p-1 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                    <Sparkles className="size-4" />
                </span>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Dashboard</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {timeOfDay}, <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">{userName || "Student"}</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-lg">
                Ready to continue your learning journey?
            </p>
        </motion.div>
    )
}
