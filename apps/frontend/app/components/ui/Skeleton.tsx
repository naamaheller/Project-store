"use client";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-md",
        "bg-slate-200",
        "before:absolute before:inset-0",
        "before:-translate-x-full",
        "before:w-[200%]",
        "before:animate-shimmer",
        "before:bg-gradient-to-r",
        "before:from-transparent before:via-white/20 before:to-transparent",
        className ?? "",
      ].join(" ")}
    />
  );
}
