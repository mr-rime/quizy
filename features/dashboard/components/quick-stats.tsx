"use client"

import { motion } from "framer-motion"
import { Flame, Trophy, Layers } from "lucide-react"

interface QuickStatsProps {
    streak: number
    totalXp: number
    setsCreated: number
}

export function QuickStats({ streak, totalXp, setsCreated }: QuickStatsProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <StatCard
                icon={<Flame className="size-5 text-orange-500" />}
                label="Daily Streak"
                value={`${streak} Days`}
                color="bg-orange-500/10 border-orange-500/20"
                delay={0.1}
            />
            <StatCard
                icon={<Trophy className="size-5 text-yellow-500" />}
                label="Total XP"
                value={totalXp.toLocaleString()}
                color="bg-yellow-500/10 border-yellow-500/20"
                delay={0.2}
            />
            <StatCard
                icon={<Layers className="size-5 text-indigo-500" />}
                label="Sets Created"
                value={setsCreated}
                color="bg-indigo-500/10 border-indigo-500/20"
                delay={0.3}
            />
        </div>
    )
}

function StatCard({ icon, label, value, color, delay }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay, duration: 0.3 }}
            className={`flex items-center gap-4 p-4 rounded-xl border ${color} bg-background/50 backdrop-blur-sm shadow-sm`}
        >
            <div className={`p-2 rounded-lg ${color.split(" ")[0]} bg-opacity-50`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-muted-foreground font-medium">{label}</p>
                <p className="text-xl font-bold tracking-tight">{value}</p>
            </div>
        </motion.div>
    )
}
