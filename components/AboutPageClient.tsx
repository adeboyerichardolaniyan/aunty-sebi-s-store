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

export default function AboutPageClient() {
  const prefersReduced = useReducedMotion();
  const variants = prefersReduced ? noMotion : fadeUp;

  return (
    <main id="main-content" className="pt-24 pb-20 px-6 md:px-12">
      <div className="max-w-2xl mx-auto">
        {/* Hero heading */}
        <motion.h1
          custom={0}
          variants={variants}
          initial="hidden"
          animate="visible"
          className="font-heading text-hero text-rich-black"
        >
          The Story Behind Every Piece
        </motion.h1>

        {/* Divider */}
        <motion.div
          custom={0.15}
          variants={variants}
          initial="hidden"
          animate="visible"
          className="w-12 h-[2px] bg-bronze/40 mb-10"
        />

        {/* Aunty Sebi's Story */}
        <motion.section
          custom={0.3}
          variants={variants}
          initial="hidden"
          animate="visible"
          className="mb-14"
        >
          <p className="text-body text-rich-black/80 leading-relaxed mb-6">
            For decades, Aunty Sebi has traveled the world&rsquo;s quieter
            roads, visiting artisan workshops far from tourist circuits. She
            doesn&rsquo;t simply buy jewelry &mdash; she chooses pieces that
            carry stories, ones shaped by hands that have inherited centuries of
            tradition. Every item in this collection was personally selected
            because it spoke to something true about the place and the people who
            made it.
          </p>
          <p className="text-body text-rich-black/80 leading-relaxed">
            From the bronze casters of Kumasi to the goldsmiths of Persepolis,
            from the mask carvers of Benin City to the silversmiths of
            Lalibela &mdash; these are not relics of the past. They are living
            continuations of ancient craft, practiced by artisans who carry
            forward techniques handed down through generations.
          </p>
        </motion.section>

        {/* Artisan Philosophy */}
        <motion.section
          custom={0.5}
          variants={variants}
          initial="hidden"
          animate="visible"
          className="mb-14"
        >
          <h2 className="font-heading text-h1 text-rich-black mb-5">
            Artisan Philosophy
          </h2>
          <p className="text-body text-rich-black/80 leading-relaxed mb-6">
            We believe jewelry should mean something. Each piece is a bridge
            between maker and wearer &mdash; a quiet conversation across
            distance and time. When you wear one of these works, you carry with
            you the skill, the patience, and the cultural memory of the artisan
            who shaped it.
          </p>
          <p className="text-body text-rich-black/80 leading-relaxed">
            Every piece is sourced directly from the artisans who create them,
            ensuring fair compensation for their extraordinary skill. Many are
            made using the lost-wax casting process, a technique thousands of
            years old. Because each piece is shaped by hand, no two are ever
            identical &mdash; and that is precisely the point.
          </p>
        </motion.section>

        {/* Cultural Respect */}
        <motion.section
          custom={0.7}
          variants={variants}
          initial="hidden"
          animate="visible"
          className="mb-14"
        >
          <h2 className="font-heading text-h1 text-rich-black mb-5">
            Cultural Respect
          </h2>
          <p className="text-body text-rich-black/80 leading-relaxed">
            Cultures are not aesthetic resources to be mined &mdash; they are
            living traditions deserving of honor and reciprocity. We work
            directly with artisan communities, learning the significance of each
            craft before sharing it with the world. A portion of every sale
            returns to the workshops and communities where these pieces
            originate, supporting the continuation of traditions that might
            otherwise fade.
          </p>
        </motion.section>

        {/* CTA */}
        <motion.div
          custom={0.9}
          variants={variants}
          initial="hidden"
          animate="visible"
          className="pt-6 border-t border-warm-gray/30"
        >
          <p className="text-body text-rich-black/80 leading-relaxed mb-6">
            Ready to discover a piece that speaks to you?
          </p>
          <Link
            href="/globe"
            className="inline-block px-8 py-4 bg-bronze text-cream font-body font-medium text-body rounded-lg shadow-soft hover:bg-bronze-dark transition-colors duration-300 hover:shadow-glow"
          >
            Explore the Collection
          </Link>
        </motion.div>
      </div>
    </main>
  );
}
