/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("UNCORKING");

  // Define the new color palette
  const THEME = {
    background: "#15222e", // Dark Slate Blue
    accent: "#f78e2c",     // Vibrant Orange
    accentLight: "#ffb066",
    accentDark: "#c25e00",
    liquidDark: "#3f1906"
  };

  useEffect(() => {
    // Lock body scroll
    document.body.style.overflow = 'hidden';

    const duration = 3000; // 3 seconds for a smooth pour
    const start = performance.now();

    const frame = (now: number) => {
      const elapsed = now - start;
      const rawProgress = Math.min((elapsed / duration) * 100, 100);
      const easedProgress = (1 - Math.cos((rawProgress / 100) * Math.PI)) / 2 * 100;
      
      setProgress(easedProgress);

      if (rawProgress < 20) setStatusText("UNCORKING");
      else if (rawProgress < 45) setStatusText("POURING");
      else if (rawProgress < 70) setStatusText("FIZZING");
      else if (rawProgress < 90) setStatusText("SPARKLING");
      else setStatusText("CHEERS");

      if (rawProgress < 100) {
        requestAnimationFrame(frame);
      } else {
        // Trigger completion after animation finishes
        setTimeout(() => {
            onComplete();
        }, 500);
      }
    };

    requestAnimationFrame(frame);

    return () => {
        document.body.style.overflow = 'unset';
    };
  }, [onComplete]);

  // Bubbles inside the liquid with enhanced natural physics
  const liquidBubbles = useMemo(() => {
    return Array.from({ length: 160 }).map((_, i) => {
      const type = Math.random();
      let left, size, duration, delay, opacity;
      let xKeyframes: number[] = []; 
      let scaleKeyframes: number[] = [];
      let opacityKeyframes: number[] = [];

      if (type < 0.3) { 
        // STREAM: Fast, vertical, tight groups
        const stream = [20, 35, 65, 80][Math.floor(Math.random() * 4)];
        left = stream + (Math.random() * 8 - 4); 
        size = Math.random() * 1.5 + 0.5;
        duration = Math.random() * 1.5 + 1.0; // Slightly slower
        delay = Math.random() * 4;
        opacity = 0.7 + Math.random() * 0.3;
        
        // Gentle snake-like wiggle
        xKeyframes = [0, Math.random() * 4 - 2, Math.random() * 4 - 2, 0]; 
        scaleKeyframes = [0.8, 1.1, 0.9, 1.0];
        opacityKeyframes = [0, opacity, opacity * 0.8, 0];

      } else if (type < 0.7) { 
        // MICRO: Slow, chaotic, ambient fizz
        left = Math.random() * 100;
        size = Math.random() * 1.5 + 0.5; 
        duration = Math.random() * 3.0 + 2.0; // Slower rise
        delay = Math.random() * 4;
        opacity = 0.4 + Math.random() * 0.4;
        
        // Drifting significantly
        const d1 = (Math.random() - 0.5) * 15;
        const d2 = d1 + (Math.random() - 0.5) * 15;
        xKeyframes = [0, d1, d2, d2 + (Math.random() - 0.5) * 10]; 
        
        scaleKeyframes = [0.6, 0.9, 0.7, 1.0]; 
        opacityKeyframes = [0, opacity, opacity * 0.4, opacity, 0]; 

      } else { 
        // MACRO: Big bubbles, buoyant, wobbling
        left = Math.random() * 100;
        size = Math.random() * 4 + 2;
        duration = Math.random() * 2.5 + 2.0;
        delay = Math.random() * 4;
        opacity = 0.5 + Math.random() * 0.3;
        
        // Large wobble
        const w = (Math.random() - 0.5) * 12;
        xKeyframes = [0, w, -w * 0.6, w * 0.3, 0];
        scaleKeyframes = [0.9, 1.15, 0.95, 1.05]; 
        opacityKeyframes = [0, opacity, opacity * 1.2, opacity * 0.8, 0]; 
      }

      return { 
        id: i, 
        left: `${left}%`, 
        size, 
        duration, 
        delay, 
        xKeyframes,
        scaleKeyframes,
        opacityKeyframes
      };
    });
  }, []);

  // Bubbles in the background - Matched to main page Bubbles style (Gold/Amber/White)
  const ambientBubbles = useMemo(() => {
    // Adjusted to match the new Orange (#f78e2c) and lighter tones
    const bubbleColors = [
      'bg-white/60 shadow-[0_0_4px_rgba(255,255,255,0.8)]', // Bright white sparkle
      'bg-[#f78e2c]/40 shadow-[0_0_6px_rgba(247,142,44,0.6)]', // Vibrant Orange
      'bg-[#ffb066]/30 shadow-[0_0_5px_rgba(255,176,102,0.5)]', // Lighter Orange
    ];

    return Array.from({ length: 150 }).map((_, i) => {
      const isSmall = Math.random() > 0.2; // Mostly small bubbles
      const size = isSmall ? Math.random() * 3 + 1 : Math.random() * 6 + 4;
      
      return {
        id: i,
        left: Math.random() * 100,
        size: size,
        duration: Math.random() * 10 + 5,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.6 + 0.2,
        sway: Math.random() * 20 - 10,
        colorClass: bubbleColors[Math.floor(Math.random() * bubbleColors.length)],
        blur: Math.random() < 0.3 ? 0 : Math.random() * 2 // Mix of sharp and blurry for depth
      };
    });
  }, []);

  const LOGO_URL = "https://static.wixstatic.com/media/b6f2c5_80f0668f46994301aa5a8bbf075ccbca~mv2.png/v1/fill/w_232,h_306,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/FIZZY%20MOON%20WHITE.png";

  return (
    <motion.div
       className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden font-sans"
       style={{ backgroundColor: THEME.background }}
       initial={{ opacity: 1 }}
       exit={{ opacity: 0, scale: 1.05, filter: "blur(15px)", transition: { duration: 0.8 } }}
    >
      {/* Background Bubbles (Amber/Gold/White Theme) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden mix-blend-screen z-0">
         {ambientBubbles.map((b) => (
            <motion.div
              key={b.id}
              className={`absolute rounded-full ${b.colorClass}`}
              style={{ 
                  left: `${b.left}%`, 
                  width: b.size, 
                  height: b.size, 
                  opacity: b.opacity, 
                  bottom: -20,
                  filter: `blur(${b.blur}px)`
              }}
              animate={{ bottom: '110vh', x: [0, b.sway, 0] }}
              transition={{
                bottom: { duration: b.duration, repeat: Infinity, delay: b.delay, ease: "linear" },
                x: { duration: b.duration * 0.8, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }
              }}
            />
         ))}
      </div>

      <div className="relative w-[300px] h-[380px] md:w-[360px] md:h-[460px] flex items-center justify-center z-10">
        <div className="absolute inset-0"
             style={{
               maskImage: `url(${LOGO_URL})`,
               WebkitMaskImage: `url(${LOGO_URL})`,
               maskSize: 'contain',
               WebkitMaskSize: 'contain',
               maskRepeat: 'no-repeat',
               WebkitMaskRepeat: 'no-repeat',
               maskPosition: 'center',
               WebkitMaskPosition: 'center',
             }}>
            {/* Dark background inside the logo mask - Deepened based on new theme */}
            <div className="absolute inset-0 bg-[#0a1117] opacity-60" />
            
            <div className="absolute bottom-0 left-0 w-full flex flex-col justify-end overflow-visible"
                 style={{ height: `${progress}%` }}>
                <div className="absolute top-0 w-full -translate-y-[95%] z-20 h-8 overflow-visible">
                   <motion.div 
                     className="absolute bottom-[-2px] left-[-50%] w-[200%] h-full opacity-100"
                     style={{ 
                         // SVG Fill: New Accent Orange (#f78e2c)
                         backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z' fill='%23f78e2c'/%3E%3C/svg%3E")`,
                         backgroundSize: '50% 100%',
                         backgroundRepeat: 'repeat-x',
                         filter: 'drop-shadow(0 0 8px rgba(247, 142, 44, 0.6))'
                     }}
                     animate={{ x: ['0%', '-50%'] }}
                     transition={{ repeat: Infinity, ease: "linear", duration: 3 }}
                   />
                </div>
                {/* Liquid Gradient: Dark Brown -> Accent Dark -> Accent Main */}
                <div className="w-full h-full relative overflow-hidden"
                     style={{
                       background: `linear-gradient(to top, ${THEME.liquidDark}, ${THEME.accentDark}, ${THEME.accent})`
                     }}
                >
                    {liquidBubbles.map((b) => (
                      <motion.div
                        key={b.id}
                        className="absolute rounded-full"
                        style={{ 
                            backgroundColor: '#ffedd5', // Keep bubbles light cream
                            left: b.left, width: b.size, height: b.size, bottom: '-10%', 
                            boxShadow: '0 0 2px rgba(255, 255, 255, 0.8)' 
                        }}
                        animate={{ 
                            bottom: ['-10%', '120%'], // Rise slightly higher to ensure clearing
                            opacity: b.opacityKeyframes,
                            x: b.xKeyframes,
                            scale: b.scaleKeyframes
                        }}
                        transition={{
                          bottom: { duration: b.duration, repeat: Infinity, delay: b.delay, ease: "easeIn" },
                          opacity: { duration: b.duration, repeat: Infinity, delay: b.delay, ease: "easeInOut" },
                          scale: { duration: b.duration, repeat: Infinity, delay: b.delay, ease: "easeInOut" },
                          x: { duration: b.duration, repeat: Infinity, delay: b.delay, ease: "easeInOut" }
                        }}
                      />
                    ))}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#fff]/10 to-transparent pointer-events-none" />
                </div>
            </div>
        </div>
        <div className="absolute inset-0 pointer-events-none z-30 opacity-40 mix-blend-screen"
             style={{
               background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.9) 45%, rgba(255,255,255,0.0) 50%, transparent 100%)',
               maskImage: `url(${LOGO_URL})`, WebkitMaskImage: `url(${LOGO_URL})`,
               maskSize: 'contain', WebkitMaskSize: 'contain', maskRepeat: 'no-repeat', WebkitMaskRepeat: 'no-repeat', maskPosition: 'center', WebkitMaskPosition: 'center',
             }}
        />
      </div>

      <div className="mt-14 flex flex-col items-center h-20 justify-center z-40">
         <AnimatePresence mode="wait">
            <motion.div
              key={statusText}
              initial={{ opacity: 0, y: 15, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(5px)' }}
              className="flex items-center gap-4"
            >
               <motion.div 
                 className="w-1.5 h-1.5 rounded-full" 
                 style={{ backgroundColor: THEME.accent, boxShadow: `0 0 10px ${THEME.accent}` }}
                 animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }} 
                 transition={{ duration: 1.5, repeat: Infinity }} 
               />
               <span 
                 className="text-xl md:text-2xl font-bold tracking-[0.3em]"
                 style={{ 
                     fontFamily: "'Syncopate', sans-serif",
                     textShadow: `0 0 25px ${THEME.accent}99`, // Hex opacity
                     background: `linear-gradient(to bottom, #fff, ${THEME.accent})`,
                     WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                     color: THEME.accent // Fallback
                 }}
               >
                 {statusText}
               </span>
               <motion.div 
                 className="w-1.5 h-1.5 rounded-full" 
                 style={{ backgroundColor: THEME.accent, boxShadow: `0 0 10px ${THEME.accent}` }}
                 animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }} 
                 transition={{ duration: 1.5, repeat: Infinity, delay: 0.75 }} 
               />
            </motion.div>
         </AnimatePresence>
         
         <div className="mt-4 w-24 h-[1px] bg-white/10 rounded-full overflow-hidden">
             <motion.div 
                className="h-full" 
                style={{ backgroundColor: THEME.accent, width: `${progress}%`, boxShadow: `0 0 10px ${THEME.accent}` }}
             />
         </div>
      </div>
    </motion.div>
  );
};

export default Preloader;