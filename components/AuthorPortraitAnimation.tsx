"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface AuthorPortraitAnimationProps {
  duration?: number;
  delay?: number;
}

export default function AuthorPortraitAnimation({
  duration = 1.6,
  delay = 0.3,
}: AuthorPortraitAnimationProps) {
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setShouldAnimate(false);
      setIsLoaded(true);
      return;
    }

    const hasPlayed = sessionStorage.getItem("euemoi_portrait_played");
    if (hasPlayed) {
      setShouldAnimate(false);
      setIsLoaded(true);
    } else {
      const timer = setTimeout(() => {
        setIsLoaded(true);
        sessionStorage.setItem("euemoi_portrait_played", "true");
      }, (delay + duration) * 1000);

      return () => clearTimeout(timer);
    }
  }, [delay, duration]);

  // Image motion properties
  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1] as const, // Custom cubic-bezier for a smooth editorial reveal
      },
    },
  };

  return (
    <div className="relative w-full max-w-[340px] aspect-[1/1.25] mx-auto rounded-t-full overflow-hidden border border-border bg-paper shadow-editorial">
      {/* Textured Linen Canvas Background */}
      <div className="absolute inset-0 bg-[radial-gradient(#ede3d3_1px,transparent_1px)] [background-size:16px_16px] opacity-40 z-0" />
      
      {/* Soft warm background gradients */}
      <div className="absolute inset-0 bg-gradient-to-tr from-beige-light/40 via-transparent to-beige-light/20 z-0" />

      {/* Profile cut-out image reveal */}
      <motion.div
        variants={shouldAnimate ? imageVariants : {}}
        initial={shouldAnimate ? "hidden" : "visible"}
        animate="visible"
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
