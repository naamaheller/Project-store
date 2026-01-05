"use client";

import { BUBBLES } from "@/app/config/ui.config";

export function BackgroundBubbles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {BUBBLES.map((bubble, i) => (
        <span
          key={i}
          className={`
            absolute rounded-full
            bg-[rgba(111,174,62,0.35)]
            ${
              bubble.from === "top"
                ? "top-[-120px] animate-[fallDown_linear_infinite]"
                : "bottom-[-120px] animate-[riseUp_linear_infinite]"
            }
          `}
          style={{
            left: bubble.left,
            width: `${bubble.size}px`,
            height: `${bubble.size}px`,
            animationDuration: `${bubble.duration}s`,
            animationDelay: `${bubble.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
