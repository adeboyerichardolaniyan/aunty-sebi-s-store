"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { MeshGradient } from "@paper-design/shaders-react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { EASING } from "@/lib/timing";
import MobileGlobeView from "./MobileGlobeView";
import type { Piece } from "@/lib/types";

const Globe3D = dynamic(() => import("./Globe3D"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-rich-black/30 font-body text-sm">
        Loading globe...
      </div>
    </div>
  ),
});

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
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

interface GlobePageClientProps {
  pieces: Piece[];
}

export default function GlobePageClient({ pieces }: GlobePageClientProps) {
  const router = useRouter();
  const prefersReduced = useReducedMotion();
  const variants = prefersReduced ? noMotion : fadeUp;
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleNavigate = useCallback(
    (slug: string) => {
      router.push(`/pieces/${slug}?from=globe`);
    },
    [router]
  );

  return (
    <main id="main-content" className="min-h-screen relative overflow-hidden bg-cream">
      {/* Shader background */}
      <div className="absolute inset-0 z-0">
        <MeshGradient
          style={{ width: "100%", height: "100%" }}
          speed={0.15}
          colors={["#FAF8F3", "#D4CFC9", "#CD7F32", "#FAF8F3", "#8B4513"]}
          distortion={0.3}
          swirl={0.1}
          grainMixer={0.0}
          grainOverlay={0.05}
        />
      </div>

      {/* 3D Globe or Mobile Fallback */}
      <div className="absolute inset-0 z-[1]">
        {isMobile ? (
          <MobileGlobeView pieces={pieces} />
        ) : (
          <Globe3D pieces={pieces} onNavigate={handleNavigate} />
        )}
      </div>

      {/* Overlay UI */}
      {!isMobile && (
        <div className="absolute bottom-0 left-0 right-0 pb-10 pointer-events-none z-[2] flex justify-center">
          <motion.div
            custom={0.3}
            variants={variants}
            initial="hidden"
            animate="visible"
            className="text-center px-10 py-6 rounded-2xl backdrop-blur-2xl bg-rich-black/30 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.15)]"
            style={{
              WebkitBackdropFilter: "blur(40px) saturate(1.4)",
              backdropFilter: "blur(40px) saturate(1.4)",
            }}
          >
            <h1 className="font-heading text-h1 md:text-hero text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.3)]">
              Pieces from Around the World
            </h1>
            <p className="text-white/70 font-body text-sm mt-3 mx-auto max-w-md">
              Click a pin to explore its story
            </p>
          </motion.div>
        </div>
      )}
    </main>
  );
}
