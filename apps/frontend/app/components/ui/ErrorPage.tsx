"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BackgroundBubbles } from "../state/loading/Bubbles";

type ErrorPageProps = {
  code?: number | string;
  title?: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
};

export default function ErrorPage({
  code = "Error",
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again later or return to a safe place.",
  backHref = "/",
  backLabel = "← Back to home",
}: ErrorPageProps) {
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
        className="relative z-10 text-[6rem] md:text-[9rem] font-extrabold leading-none tracking-tight text-gray-900 dark:text-white"
      >
        {code}
      </motion.h1>

      <div className="relative z-10 mt-8 flex flex-col gap-4 max-w-md">
        <h2 className="text-3xl font-semibold">{title}</h2>

        <p className="text-lg text-gray-500 dark:text-gray-400">
          {description}
        </p>

        <div className="mt-2">
          <Link
            href={backHref}
            className="text-base font-medium hover:underline underline-offset-4 transition"
          >
            {backLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
