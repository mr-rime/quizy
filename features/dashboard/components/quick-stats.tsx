"use client"

import { motion } from "framer-motion"
import { Flame, Trophy, Layers } from "lucide-react"
import { JSX } from "react"

interface QuickStatsProps {
    streak: number
    totalXp: number
    setsCreated: number
}

export function QuickStats({ streak, totalXp, setsCreated }: QuickStatsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
            <StatCard
                icon={<Flame className="size-5" />}
                label="Daily Streak"
                value={`${streak} Days`}
                delay={0.1}
            />
            <StatCard
                icon={<Trophy className="size-5" />}
                label="Total XP"
                value={totalXp.toLocaleString()}
                delay={0.2}
            />
            <StatCard
                icon={<Layers className="size-5" />}
                label="Sets Created"
                value={setsCreated.toString()}
                delay={0.3}
            />
        </div>
    )
}

function StatCard({ icon, label, value, delay }: { icon: JSX.Element, label: string, value: string, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
            className="flex items-center gap-5 p-5 rounded-2xl border border-zinc-900 bg-zinc-950 hover:bg-zinc-900 hover:border-zinc-800 transition-all duration-300 group ring-1 ring-white/5"
        >
            <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                {icon}
            </div>
            <div>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] mb-1.5">{label}</p>
                <p className="text-2xl font-bold tracking-tight text-white">{value}</p>
            </div>
        </motion.div>
    )
}
