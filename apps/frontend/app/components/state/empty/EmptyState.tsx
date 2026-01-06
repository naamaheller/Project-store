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
    <div
      className="
        col-span-full
        flex
        items-center
        justify-center
        min-h-[65vh]
        w-full
      "
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="
          text-center
          max-w-2xl
          px-10
        "
      >

        <h2 className="text-5xl font-semibold mb-6">{title}</h2>

        <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
          {description}
        </p>

        {onAction && <Button onClick={onAction}>{actionLabel}</Button>}
      </motion.div>
    </div>
  );
}
