"use client"

import { motion } from "framer-motion"

export function DashboardShell({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-7xl mx-auto space-y-8"
        >
            {children}
        </motion.div>
    )
}

export function DashboardSection({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4 }}
        >
            {children}
        </motion.div>
    )
}
