"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import type { Piece } from "@/lib/types";

interface GlobeTooltipProps {
  piece: Piece | null;
  worldPosition: THREE.Vector3 | null;
  camera: THREE.Camera | null;
  canvasSize: { width: number; height: number };
}

export default function GlobeTooltip({
  piece,
  worldPosition,
  camera,
  canvasSize,
}: GlobeTooltipProps) {
  const [screenPos, setScreenPos] = useState<{ x: number; y: number } | null>(
    null
  );
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!piece || !worldPosition || !camera) {
      setScreenPos(null);
      return;
    }

    function updatePosition() {
      if (!worldPosition || !camera) return;

      const projected = worldPosition.clone().project(camera);

      // Check if point is behind the camera
      if (projected.z > 1) {
        setScreenPos(null);
        return;
      }

      const newX = (projected.x * 0.5 + 0.5) * canvasSize.width;
      const newY = (-projected.y * 0.5 + 0.5) * canvasSize.height;

      setScreenPos((prev) => {
        if (
          prev &&
          Math.abs(prev.x - newX) < 0.5 &&
          Math.abs(prev.y - newY) < 0.5
        ) {
          return prev;
        }
        return { x: newX, y: newY };
      });
      rafRef.current = requestAnimationFrame(updatePosition);
    }

    rafRef.current = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(rafRef.current);
  }, [piece, worldPosition, camera, canvasSize]);

  return (
    <AnimatePresence>
      {piece && screenPos && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 4 }}
          transition={{ duration: 0.15 }}
          className="absolute pointer-events-none z-20"
          style={{
            left: screenPos.x,
            top: screenPos.y,
            transform: "translate(-50%, -120%)",
          }}
        >
          <div className="bg-rich-black/90 backdrop-blur-sm rounded-lg px-4 py-3 border border-bronze/20 shadow-lg min-w-[180px]">
            <p className="font-heading text-cream text-sm font-semibold leading-tight">
              {piece.name}
            </p>
            <p className="text-cream/50 text-xs mt-1">
              {piece.origin.city}, {piece.origin.country}
            </p>
            <p className="text-bronze text-xs font-medium mt-1.5">
              ${piece.price}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
