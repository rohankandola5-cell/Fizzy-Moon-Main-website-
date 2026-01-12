
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const StarField = () => {
  // Reduced star count for performance
  const stars = useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      opacity: Math.random() * 0.7 + 0.3
    }));
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white will-change-[opacity]"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
          }}
          initial={{ opacity: star.opacity }}
          animate={{
            opacity: [star.opacity, 1, star.opacity],
          }}
          transition={{
            duration: star.duration * 2, // Slower animation
            repeat: Infinity,
            ease: "easeInOut",
            delay: star.delay,
          }}
        />
      ))}
    </div>
  );
};

const FluidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0b1219]">
      <StarField />
      
      {/* 
         PERFORMANCE OPTIMIZATION: 
         Replaced animated Framer Motion blobs (CPU heavy) with a static CSS Radial Gradient mesh (GPU optimized).
         This creates the same "Glow" effect but without constant re-rendering.
      */}
      <div 
        className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 10% 20%, rgba(247, 142, 44, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 90% 10%, rgba(180, 83, 9, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 50% 90%, rgba(124, 45, 18, 0.4) 0%, transparent 60%)
          `,
          filter: 'blur(40px)', // Static blur is much cheaper than animated blur
        }}
      />

      {/* Static Grain Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none"></div>
      
      {/* Heavy Vignette for "Dark Mode" feel */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0b1219]/40 to-[#0b1219]/90 pointer-events-none" />
    </div>
  );
};

export default FluidBackground;
