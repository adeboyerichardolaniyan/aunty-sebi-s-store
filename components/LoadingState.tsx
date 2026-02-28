"use client";

import { motion, AnimatePresence } from "framer-motion";
import { EASING } from "@/lib/timing";

interface LoadingStateProps {
  isLoading: boolean;
  progress?: number;
}

export default function LoadingState({
  isLoading,
  progress,
}: LoadingStateProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: EASING.ui as unknown as number[] }}
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-cream"
        >
          {/* Spinning bronze ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="mb-6"
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="24"
                cy="24"
                r="20"
                stroke="#D4CFC9"
                strokeWidth="3"
              />
              <path
                d="M44 24c0-11.046-8.954-20-20-20"
                stroke="#CD7F32"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="font-heading text-lg text-bronze-dark tracking-wide"
          >
            Preparing your piece...
          </motion.p>

          {progress !== undefined && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 w-48 h-1 bg-warm-gray rounded-full overflow-hidden"
            >
              <motion.div
                className="h-full bg-bronze rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
