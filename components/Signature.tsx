"use client";

import { motion } from "framer-motion";

interface SignatureProps {
  className?: string;
  color?: string;
  delay?: number;
}

export default function Signature({
  className = "",
  color = "currentColor",
  delay = 0.2,
}: SignatureProps) {
  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: {
          delay,
          type: "tween" as const,
          duration: 2.0,
          ease: "easeInOut" as const,
        },
        opacity: {
          delay,
          duration: 0.1,
        },
      },
    },
  };

  return (
    <svg
      viewBox="0 0 260 70"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${className}`}
      aria-label="Logo Eu e Moi"
      role="img"
    >
      {/* Continuous cursive text stroke spelling "euemoi" */}
      <motion.path
        d="M 30,46 C 32,36, 38,26, 43,26 C 48,26, 46,37, 44,41 C 42,46, 38,49, 43,49 C 48,49, 53,39, 58,32 C 63,25, 68,32, 68,37 C 68,42, 65,48, 70,48 C 75,48, 80,38, 83,32 Q 88,26, 93,26 C 98,26, 96,37, 94,40 C 92,45, 88,46, 92,46 C 96,46, 103,38, 108,32 C 111,26, 116,26, 120,26 C 125,26, 123,37, 121,40 C 119,45, 115,46, 119,46 C 123,46, 130,38, 135,32 C 135,32, 138,42, 141,46 C 145,38, 150,30, 155,30 C 160,30, 160,39, 160,44 C 160,36, 166,30, 171,30 C 176,30, 176,39, 176,44 C 176,36, 182,30, 187,30 C 192,30, 193,40, 193,44 C 193,48, 189,49, 194,49 C 199,49, 206,39, 210,33 C 214,27, 219,27, 219,33 C 219,39, 214,48, 220,48 C 226,48, 232,38, 237,30"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        variants={pathVariants}
        initial="hidden"
        animate="visible"
      />

      {/* "i" dot dropping down after the pen stroke is completed */}
      <motion.circle
        cx="210"
        cy="18"
        r="2.0"
        fill={color}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: delay + 1.8, duration: 0.2 }}
      />
    </svg>
  );
}
