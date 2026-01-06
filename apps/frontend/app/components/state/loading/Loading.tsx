"use client";

import { motion } from "framer-motion";
import { BackgroundBubbles } from "./Bubbles";

export default function LoadingText() {
  const text = "LOADING...";

  return (
    <div className="relative flex items-center justify-center h-screen overflow-hidden">
      <BackgroundBubbles />

      <div className="flex gap-1 sm:gap-2 md:gap-3">
        {text.split("").map((letter, index) => (
          <motion.span
            key={index}
            className="
              font-extrabold
              tracking-[0.2em]
              text-[48px]
              sm:text-[64px]
              md:text-[88px]
              lg:text-[120px]
              text-[var(--color-text-inverted)]
              drop-shadow-[0_4px_0_var(--color-primary-hover)]
            "
            animate={{ y: [0, -28, 0] }}
            transition={{
              duration: 1.8,
              ease: "easeInOut",
              repeat: Infinity,
              delay: index * 0.15,
            }}
          >
            {letter}
          </motion.span>
        ))}
      </div>
    </div>
  );
}
