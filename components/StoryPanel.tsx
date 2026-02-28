"use client";

import { useEffect, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import type { Hotspot } from "@/lib/types";
import { EASING } from "@/lib/timing";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface StoryPanelProps {
  hotspot: Hotspot | null;
  onClose: () => void;
}

const panelVariants = {
  hidden: { x: "100%", opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: EASING.ui.slice() as number[],
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
  exit: {
    x: "100%",
    opacity: 0,
    transition: { duration: 0.4, ease: EASING.ui.slice() as number[] },
  },
};

const instantPanelVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

const mobilePanelVariants = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: EASING.ui.slice() as number[],
      staggerChildren: 0.2,
      delayChildren: 0.2,
    },
  },
  exit: {
    y: "100%",
    opacity: 0,
    transition: { duration: 0.4, ease: EASING.ui.slice() as number[] },
  },
};

const instantMobilePanelVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.1 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

const childVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASING.gentle.slice() as number[] },
  },
};

const instantChildVariants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

export default function StoryPanel({ hotspot, onClose }: StoryPanelProps) {
  const prefersReduced = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Focus close button when panel opens
  useEffect(() => {
    if (hotspot) {
      // Small delay to let the panel animate in
      const timer = setTimeout(() => {
        closeButtonRef.current?.focus();
      }, prefersReduced ? 50 : 500);
      return () => clearTimeout(timer);
    }
  }, [hotspot, prefersReduced]);

  const desktopVariants = prefersReduced ? instantPanelVariants : panelVariants;
  const mobileVariants = prefersReduced ? instantMobilePanelVariants : mobilePanelVariants;
  const child = prefersReduced ? instantChildVariants : childVariants;

  return (
    <AnimatePresence>
      {hotspot && (
        <>
          {/* Desktop: slide from right */}
          <motion.div
            key={`desktop-${hotspot.id}`}
            variants={desktopVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-label={`Story: ${hotspot.title}`}
            className="hidden md:flex fixed right-0 top-0 h-full w-[380px] z-40 flex-col"
          >
            <div className="h-full bg-cream/85 backdrop-blur-[20px] border-l border-warm-gray/30 p-8 overflow-y-auto flex flex-col">
              <PanelContent hotspot={hotspot} onClose={onClose} childVariants={child} closeButtonRef={closeButtonRef} />
            </div>
          </motion.div>

          {/* Mobile: slide from bottom */}
          <motion.div
            key={`mobile-${hotspot.id}`}
            variants={mobileVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-label={`Story: ${hotspot.title}`}
            className="md:hidden fixed bottom-0 left-0 right-0 z-40 max-h-[60vh]"
          >
            <div className="bg-cream/90 backdrop-blur-[20px] border-t border-warm-gray/30 p-6 overflow-y-auto rounded-t-2xl">
              <PanelContent hotspot={hotspot} onClose={onClose} childVariants={child} closeButtonRef={closeButtonRef} />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function PanelContent({
  hotspot,
  onClose,
  childVariants: cv,
  closeButtonRef,
}: {
  hotspot: Hotspot;
  onClose: () => void;
  childVariants: Variants;
  closeButtonRef: React.RefObject<HTMLButtonElement>;
}) {
  return (
    <>
      {/* Close button */}
      <motion.button
        ref={closeButtonRef}
        variants={cv}
        onClick={onClose}
        className="self-end mb-4 p-2 rounded-full hover:bg-warm-gray/30 transition-colors duration-200"
        aria-label="Close story panel"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path d="M5 5l10 10M15 5L5 15" />
        </svg>
      </motion.button>

      {/* Title */}
      <motion.h2
        variants={cv}
        className="font-heading text-h2 text-rich-black mb-3"
      >
        {hotspot.title}
      </motion.h2>

      {/* Bronze divider */}
      <motion.div
        variants={cv}
        className="w-12 h-[2px] bg-bronze mb-6"
      />

      {/* Story text */}
      <motion.p
        variants={cv}
        className="text-body text-rich-black/80 leading-relaxed mb-8"
      >
        {hotspot.story}
      </motion.p>

      {/* Material tags */}
      <motion.div variants={cv} className="flex flex-wrap gap-2 mb-6">
        {hotspot.materials.map((material) => (
          <span
            key={material}
            className="px-3 py-1.5 bg-warm-gray/40 rounded-full text-small text-rich-black/70 font-body"
          >
            {material}
          </span>
        ))}
      </motion.div>

      {/* Component label */}
      <motion.p
        variants={cv}
        className="text-small text-bronze-dark/60 font-body uppercase tracking-wider"
      >
        {hotspot.component.replace(/-/g, " ")}
      </motion.p>
    </>
  );
}
