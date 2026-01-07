"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BackgroundBubbles } from "./components/state/loading/Bubbles";

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center text-center px-4">
      <BackgroundBubbles />
      <motion.h1
        animate={{ y: [0, 12, 0] }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative z-10 text-[7rem] md:text-[10rem] font-extrabold leading-none tracking-tight text-gray-900 dark:text-white"
      >
        404
      </motion.h1>

      <div className="relative z-10 mt-8 flex flex-col gap-4 max-w-md">
        <h2 className="text-3xl font-semibold">Page not found</h2>

        <p className="text-lg text-gray-500 dark:text-gray-400">
          The page you’re looking for doesn’t exist or has been moved. Please
          check the URL or return to a safe place.
        </p>

        <div className="mt-2">
          <Link
            href="/pages/public/product"
            className="text-base font-medium hover:underline underline-offset-4 transition"
          >
            ← Back to products
          </Link>
        </div>
      </div>
    </div>
  );
}
