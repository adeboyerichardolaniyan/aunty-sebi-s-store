"use client";

import { motion } from "framer-motion";
import type { Piece } from "@/lib/types";
import { EASING } from "@/lib/timing";

interface ProductSidebarProps {
  piece: Piece;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: EASING.gentle as unknown as number[],
    },
  },
};

export default function ProductSidebar({ piece }: ProductSidebarProps) {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: piece.currency,
    minimumFractionDigits: 0,
  }).format(piece.price);

  return (
    <motion.aside
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6 py-8 px-6 lg:px-8"
    >
      {/* Origin */}
      <motion.p
        variants={itemVariants}
        className="text-small uppercase tracking-widest text-bronze-dark/60 font-body"
      >
        {piece.origin.city}, {piece.origin.country}
      </motion.p>

      {/* Name */}
      <motion.h1
        variants={itemVariants}
        className="font-heading text-hero text-rich-black leading-tight"
      >
        {piece.name}
      </motion.h1>

      {/* Price */}
      <motion.p
        variants={itemVariants}
        className="font-heading text-h2 text-bronze"
      >
        {formattedPrice}
      </motion.p>

      {/* Divider */}
      <motion.div
        variants={itemVariants}
        className="w-12 h-[2px] bg-bronze/40"
      />

      {/* Description */}
      <motion.p
        variants={itemVariants}
        className="text-body text-rich-black/80 leading-relaxed"
      >
        {piece.description}
      </motion.p>

      {/* Cultural Narrative */}
      <motion.div variants={itemVariants} className="mt-2">
        <h3 className="font-heading text-lg text-rich-black mb-2">
          Cultural Heritage
        </h3>
        <p className="text-body text-rich-black/70 leading-relaxed">
          {piece.culturalNarrative}
        </p>
      </motion.div>

      {/* Materials */}
      <motion.div variants={itemVariants}>
        <h3 className="font-heading text-lg text-rich-black mb-3">
          Materials
        </h3>
        <div className="flex flex-wrap gap-2">
          {piece.dimensions.materials.map((mat) => (
            <span
              key={mat}
              className="px-3 py-1.5 bg-warm-gray/30 rounded-full text-small text-rich-black/70"
            >
              {mat}
            </span>
          ))}
        </div>
      </motion.div>

      {/* Dimensions */}
      <motion.div variants={itemVariants}>
        <h3 className="font-heading text-lg text-rich-black mb-2">Details</h3>
        <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-small">
          {piece.dimensions.weight && (
            <>
              <dt className="text-rich-black/50">Weight</dt>
              <dd className="text-rich-black/80">{piece.dimensions.weight}</dd>
            </>
          )}
          {piece.dimensions.ringSize && (
            <>
              <dt className="text-rich-black/50">Ring Size</dt>
              <dd className="text-rich-black/80">
                {piece.dimensions.ringSize}
                {piece.dimensions.adjustable && " (adjustable)"}
              </dd>
            </>
          )}
          {piece.dimensions.length && (
            <>
              <dt className="text-rich-black/50">Length</dt>
              <dd className="text-rich-black/80">{piece.dimensions.length}</dd>
            </>
          )}
          {piece.dimensions.height && (
            <>
              <dt className="text-rich-black/50">Height</dt>
              <dd className="text-rich-black/80">{piece.dimensions.height}</dd>
            </>
          )}
          {piece.dimensions.width && (
            <>
              <dt className="text-rich-black/50">Width</dt>
              <dd className="text-rich-black/80">{piece.dimensions.width}</dd>
            </>
          )}
        </dl>
      </motion.div>

      {/* Care */}
      <motion.div variants={itemVariants}>
        <h3 className="font-heading text-lg text-rich-black mb-2">Care</h3>
        <p className="text-small text-rich-black/60 leading-relaxed">
          {piece.care}
        </p>
      </motion.div>

      {/* Add to Cart (styled, non-functional) */}
      <motion.button
        variants={itemVariants}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-4 w-full py-4 bg-bronze text-cream font-body font-medium text-body rounded-lg shadow-soft hover:bg-bronze-dark transition-colors duration-300"
      >
        Add to Cart — {formattedPrice}
      </motion.button>
    </motion.aside>
  );
}
