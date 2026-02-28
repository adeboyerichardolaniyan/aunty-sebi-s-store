"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { EASING } from "@/lib/timing";
import { useReducedMotion } from "@/lib/useReducedMotion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay,
      ease: EASING.gentle.slice() as number[],
    },
  }),
};

const noMotion = {
  hidden: { opacity: 1, y: 0 },
  visible: () => ({ opacity: 1, y: 0 }),
};

export default function NotFound() {
  const prefersReduced = useReducedMotion();
  const variants = prefersReduced ? noMotion : fadeUp;

  return (
    <main
      id="main-content"
      className="min-h-screen flex flex-col items-center justify-center px-6 pt-16"
    >
      <motion.div
        className="text-center max-w-lg"
        initial={prefersReduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: prefersReduced ? 0 : 0.5 }}
      >
        <motion.p
          custom={0}
          variants={variants}
          initial="hidden"
          animate="visible"
          className="font-body text-sm uppercase tracking-widest text-bronze-dark/60 mb-4"
        >
          404
        </motion.p>

        <motion.h1
          custom={0.1}
          variants={variants}
          initial="hidden"
          animate="visible"
          className="font-heading text-hero text-rich-black mb-6"
        >
          Page Not Found
        </motion.h1>

        <motion.div
          custom={0.2}
          variants={variants}
          initial="hidden"
          animate="visible"
          className="w-12 h-[2px] bg-bronze/40 mx-auto mb-8"
        />

        <motion.p
          custom={0.3}
          variants={variants}
          initial="hidden"
          animate="visible"
          className="text-body text-rich-black/70 leading-relaxed mb-10"
        >
          The page you&rsquo;re looking for doesn&rsquo;t exist. It may have
          been moved, or the link may be incorrect.
        </motion.p>

        <motion.div
          custom={0.5}
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
