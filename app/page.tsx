"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { EASING } from "@/lib/timing";

const HeroPreview3D = dynamic(() => import("@/components/HeroPreview3D"), {
  ssr: false,
  loading: () => (
    <div className="w-[300px] h-[300px] md:w-[400px] md:h-[400px]" />
  ),
});

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay,
      ease: EASING.gentle as unknown as number[],
    },
  }),
};

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="flex flex-col items-center text-center max-w-3xl"
      >
        {/* 3D Preview */}
        <motion.div
          custom={0.3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <HeroPreview3D />
        </motion.div>

        {/* Headline */}
        <motion.h1
          custom={0.7}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="font-heading text-hero text-rich-black mb-6"
        >
          Handcrafted Stories from Around the World
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          custom={0.9}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-body text-rich-black/70 leading-relaxed max-w-xl mb-10"
        >
          Each piece carries the heritage of multiple cultures, united by
          artisan hands into singular works of wearable art.
        </motion.p>

        {/* CTA */}
        <motion.div
          custom={1.4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
        >
          <Link
            href="/pieces/akan-heritage-ring"
            className="inline-block px-8 py-4 bg-bronze text-cream font-body font-medium text-body rounded-lg shadow-soft hover:bg-bronze-dark transition-colors duration-300 hover:shadow-glow"
          >
            Explore the Collection
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}
