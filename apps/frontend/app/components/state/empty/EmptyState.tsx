"use client";

import { motion } from "framer-motion";
import { Button } from "@/app/components/ui/Button";

type Props = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({
  title = "No products found",
  description = "We couldn’t find any products that match your selection.",
  actionLabel = "Clear filters",
  onAction,
}: Props) {
  return (
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="
          relative z-10
          text-center
          max-w-md
          px-6
        "
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="mb-6"
        >
          <span className="text-7xl">🌿</span>
        </motion.div>

        <h2 className="text-2xl font-semibold mb-3">{title}</h2>

        <p className="text-text-muted mb-8 leading-relaxed">{description}</p>

        {onAction && <Button onClick={onAction}>{actionLabel}</Button>}
      </motion.div>
    </div>
  );
}
