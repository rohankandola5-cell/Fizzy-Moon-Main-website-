/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Bubbles: React.FC = () => {
  const [bubbles, setBubbles] = useState<any[]>([]);

  useEffect(() => {
    // Champagne/Beer tones: Gold, Amber, White
    // Prioritize small, sharp, bright highlights for that "fizzy" look
    const bubbleColors = [
      'bg-white/60 shadow-[0_0_4px_rgba(255,255,255,0.8)]', // Bright white sparkle
      'bg-[#fbbf24]/40 shadow-[0_0_6px_rgba(251,191,36,0.6)]', // Rich Amber
      'bg-[#fcd34d]/30 shadow-[0_0_5px_rgba(253,211,77,0.5)]', // Pale Gold
    ];

    const generatedBubbles = Array.from({ length: 120 }).map((_, i) => {
      // Carbonation physics: 
      // Champagne/Beer bubbles are typically small and uniform, with some variance.
      const isSmall = Math.random() > 0.15;
      const size = isSmall ? Math.random() * 3 + 1 : Math.random() * 6 + 4; // Mostly 1-4px
      
      // Speed: Fast rising
      const duration = Math.random() * 4 + 2; // 2s to 6s
      
      return {
        id: i,
        left: Math.random() * 100,
        size,
        duration,
        delay: Math.random() * 8,
        // Rapid, tight oscillation
        swayDuration: Math.random() * 1 + 0.5,
        swayAmount: Math.random() * 4 - 2, 
        colorClass: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
      };
    });
    setBubbles(generatedBubbles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none mix-blend-screen">
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className={`absolute rounded-full ${bubble.colorClass}`}
          style={{
            left: `${bubble.left}%`,
            width: bubble.size,
            height: bubble.size,
            bottom: -20,
          }}
          animate={{
            y: '-120vh', // Rise well above the viewport
            x: [0, bubble.swayAmount, -bubble.swayAmount, 0],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            y: {
              duration: bubble.duration,
              repeat: Infinity,
              delay: bubble.delay,
              ease: "linear", // Constant rise velocity for fizz
            },
            x: {
              duration: bubble.swayDuration,
              repeat: Infinity,
              ease: "easeInOut",
            },
            opacity: {
              duration: bubble.duration,
              repeat: Infinity,
              delay: bubble.delay,
              times: [0, 0.05, 0.9, 1] // Quick fade in, stay visible, fade out at very top
            }
          }}
        />
      ))}
      
      {/* Subtle bottom glow to suggest liquid source */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#f59e0b]/10 to-transparent pointer-events-none" />
    </div>
  );
};

export default Bubbles;