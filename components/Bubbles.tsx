
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const Bubbles: React.FC = () => {
  const [bubbles, setBubbles] = useState<any[]>([]);
  
  // OPTIMIZATION: Detect mobile devices (Android & iPhone) for reduced animations
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                            window.innerWidth < 768;
      setIsMobile(isMobileDevice);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    // Champagne/Beer tones: Gold, Amber, White
    const bubbleColors = [
      'bg-white/60 shadow-[0_0_4px_rgba(255,255,255,0.8)]', // Bright white sparkle
      'bg-[#fbbf24]/40 shadow-[0_0_6px_rgba(251,191,36,0.6)]', // Rich Amber
      'bg-[#fcd34d]/30 shadow-[0_0_5px_rgba(253,211,77,0.5)]', // Pale Gold
    ];

    // OPTIMIZATION: Reduced bubble count on mobile (30 -> 20) for better performance
    const bubbleCount = isMobile ? 20 : 30;
    const generatedBubbles = Array.from({ length: bubbleCount }).map((_, i) => {
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
  }, [isMobile]);

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
            willChange: 'transform, opacity', // OPTIMIZATION: Added will-change hint for better GPU acceleration
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
