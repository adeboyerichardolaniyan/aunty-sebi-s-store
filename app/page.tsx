"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { EASING } from "@/lib/timing";
import { useReducedMotion } from "@/lib/useReducedMotion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay,
      ease: EASING.gentle.slice() as number[],
    },
  }),
};

const noMotion = {
  hidden: { opacity: 1, y: 0 },
  visible: () => ({ opacity: 1, y: 0 }),
};

export default function Home() {
  const prefersReduced = useReducedMotion();
  const variants = prefersReduced ? noMotion : fadeUp;

  return (
    <main
      id="main-content"
      className="min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-16"
    >
      <motion.div
        initial={prefersReduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: prefersReduced ? 0 : 1 }}
        className="flex flex-col items-center text-center max-w-3xl"
      >
        {/* Overline */}
        <motion.p
          custom={0.2}
          variants={variants}
          initial="hidden"
          animate="visible"
          className="font-body text-sm uppercase tracking-[0.2em] text-bronze-dark/60 mb-8"
        >
          Handcrafted Jewelry
        </motion.p>

        {/* Headline */}
        <motion.h1
          custom={0.4}
          variants={variants}
          initial="hidden"
          animate="visible"
          className="font-heading text-hero md:text-[4.5rem] md:leading-[1.05] text-rich-black mb-8"
        >
          Stories from Around the World
        </motion.h1>

        {/* Bronze accent rule */}
        <motion.div
          custom={0.6}
          variants={variants}
          initial="hidden"
          animate="visible"
          className="w-16 h-[2px] bg-bronze/50 mb-8"
        />

        {/* Subtitle */}
        <motion.p
          custom={0.8}
          variants={variants}
          initial="hidden"
          animate="visible"
          className="text-body text-rich-black/60 leading-relaxed max-w-xl mb-12"
        >
          Each piece carries the heritage of multiple cultures, united by
          artisan hands into singular works of wearable art.
        </motion.p>

        {/* CTA */}
        <motion.div
          custom={1.1}
          variants={variants}
          initial="hidden"
          animate="visible"
        >
          <Link
            href="/globe"
            className="inline-block px-8 py-4 bg-bronze text-cream font-body font-medium text-body rounded-lg shadow-soft hover:bg-bronze-dark transition-colors duration-300 hover:shadow-glow"
          >
            Explore the Collection
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
