"use client";

type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-md",
        "bg-gray-300",
        className ?? "",
      ].join(" ")}
    >
      <div
        className="
          absolute inset-0
          -translate-x-full
          bg-gradient-to-r
          from-transparent
          via-white/30
          to-transparent
          animate-[skeleton-shimmer_1s_linear_infinite]
        "
      />
    </div>
  );
}
