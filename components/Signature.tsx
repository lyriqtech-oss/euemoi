"use client";

import { motion } from "framer-motion";

interface SignatureProps {
  className?: string;
  color?: string;
  delay?: number;
}

export default function Signature({
  className = "",
  delay = 0.2,
}: SignatureProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`font-serif text-3xl md:text-4xl font-semibold tracking-wider text-brand-dark select-none flex justify-center md:justify-start items-center ${className}`}
    >
      <span>Eu e Moi</span>
    </motion.div>
  );
}
