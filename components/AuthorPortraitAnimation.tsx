"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface AuthorPortraitAnimationProps {
  duration?: number;
  delay?: number;
}

export default function AuthorPortraitAnimation({
  duration = 1.2,
  delay = 0.3,
}: AuthorPortraitAnimationProps) {
  const [shouldAnimate, setShouldAnimate] = useState(true);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setShouldAnimate(false);
      return;
    }

    const hasPlayed = sessionStorage.getItem("euemoi_portrait_played");
    if (hasPlayed) {
      setShouldAnimate(false);
    } else {
      sessionStorage.setItem("euemoi_portrait_played", "true");
    }
  }, []);

  return (
    <div className="relative w-full max-w-[340px] aspect-[1/1.25] mx-auto rounded-t-full overflow-hidden border border-border bg-paper shadow-editorial">
      {/* Textured Linen Canvas Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#ede3d3_1px,transparent_1px)] [background-size:16px_16px] opacity-40 z-0" />
      
      {/* Soft warm background gradients */}
      <div className="absolute inset-0 bg-gradient-to-tr from-beige-light/40 via-transparent to-beige-light/20 z-0" />

      {/* Profile cut-out image reveal */}
      <motion.div
        initial={shouldAnimate ? { opacity: 0, scale: 0.96, y: 12 } : { opacity: 1, scale: 1, y: 0 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={shouldAnimate ? { duration, delay, ease: [0.16, 1, 0.3, 1] } : { duration: 0 }}
        className="absolute inset-0 w-full h-full z-10"
      >
        <Image
          src="/natalia.png"
          alt="Natália Mello"
          fill
          className="object-cover transition duration-700 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 340px"
          priority
        />
      </motion.div>

      {/* Inner frame margins mimicking high-end frame overlay */}
      <div className="absolute inset-0 border-[8px] border-paper rounded-t-full pointer-events-none z-30" />
    </div>
  );
}
