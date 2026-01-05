"use client";

import { motion } from "framer-motion";
import styles from "./Loading.module.css";
import { BackgroundBubbles } from "./Bubbles";

export default function LoadingText() {
  const text = "LOADING...";

 return (
   <div className={styles.loadingWrapper} style={{ position: "relative" }}>
     <BackgroundBubbles />

     <div className={styles.loadingText}>
       {text.split("").map((letter, index) => (
         <motion.span
           key={index}
           className={styles.letter}
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
