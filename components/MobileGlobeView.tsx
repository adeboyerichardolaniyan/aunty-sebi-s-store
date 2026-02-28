"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { EASING, STAGGER } from "@/lib/timing";
import type { Piece } from "@/lib/types";

interface MobileGlobeViewProps {
  pieces: Piece[];
}

export default function MobileGlobeView({ pieces }: MobileGlobeViewProps) {
  const prefersReduced = useReducedMotion();

  return (
    <div className="min-h-screen bg-rich-black px-5 py-12 overflow-y-auto">
      <motion.h1
        initial={prefersReduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          ease: EASING.gentle.slice() as number[],
        }}
        className="font-heading text-h1 text-cream mb-3"
      >
        Pieces from Around the World
      </motion.h1>
      <motion.p
        initial={prefersReduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          delay: 0.15,
          ease: EASING.gentle.slice() as number[],
        }}
        className="text-cream/50 font-body text-sm mb-10"
      >
        Tap a piece to explore its story
      </motion.p>

      <div className="space-y-4">
        {pieces.map((piece, i) => (
          <motion.div
            key={piece.id}
            initial={prefersReduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: prefersReduced
                ? 0
                : 0.3 + i * (STAGGER.items / 1000),
              ease: EASING.gentle.slice() as number[],
            }}
          >
            <Link
              href={`/pieces/${piece.slug}`}
              className="block bg-rich-black border border-cream/10 rounded-xl p-5 hover:border-bronze/40 transition-colors duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h2 className="font-heading text-lg text-cream font-semibold">
                    {piece.name}
                  </h2>
                  <p className="text-cream/40 text-xs mt-1 font-body">
                    {piece.origin.city}, {piece.origin.country}
                  </p>
                  <p className="text-cream/60 text-sm mt-3 font-body leading-relaxed line-clamp-2">
                    {piece.description}
                  </p>
                </div>
                <span className="text-bronze font-body font-medium text-sm whitespace-nowrap pt-0.5">
                  ${piece.price}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
