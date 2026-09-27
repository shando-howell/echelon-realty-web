"use client";

import { motion } from "framer-motion";
import Link from "next/link";

// The Container Controller
const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: 0.3,
            staggerChildren: 0.2
        },
    },
};

// The Item Animation
const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
    },
    transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1]
    },
};

export default function HeroText() {
    return (
        <motion.div
            className="relative z-10 flex flex-col items-center text-center text-white px-4 w-full max-w-4xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            <motion.h1
                variants={itemVariants}
                className="text-5xl md:text-7xl font-bold tracking-tight mb-2 drop-shadow-lg"
            >
                Discover Luxury
            </motion.h1>

            <motion.h2
                variants={itemVariants}
                className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 text-blue-600 drop-shadow-md"
            >
                in Jamaica
            </motion.h2>

            <motion.p
                variants={itemVariants}
                className="text-lg md:text-2xl font-light mb-10 max-w-2xl drop-shadow-sm text-gray-200"
            >
                Exclusive villas and modern estates, curated for the uncompromising buyer.
            </motion.p>

            <motion.div variants={itemVariants} className="w-full">
                <Link href="/smart-map" className="bg-blue-600 hover:bg-blue-400 border border-white/20 p-6 rounded-md text-white">
                    AI Powered Map Search
                </Link>
            </motion.div>
        </motion.div>
    )
}