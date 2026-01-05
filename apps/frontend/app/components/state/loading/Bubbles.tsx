"use client";

import styles from "./Loading.module.css";
import { BUBBLES } from "@/app/config/ui.config";


export function BackgroundBubbles() {
  return (
    <div className={styles.bubbles}>
      {BUBBLES.map((bubble, i) => (
        <span
          key={i}
          className={`${styles.bubble} ${
            bubble.from === "top" ? styles.fromTop : styles.fromBottom
          }`}
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
