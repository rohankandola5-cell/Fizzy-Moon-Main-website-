/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  
  // Initialize off-screen to prevent flash
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  
  // Smooth spring animation
  const springConfig = { damping: 20, stiffness: 350, mass: 0.1 }; 
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement;
      const clickable = target.closest('button') || 
                        target.closest('a') || 
                        target.closest('[data-hover="true"]');
      setIsHovering(!!clickable);
    };

    window.addEventListener('mousemove', updateMousePosition, { passive: true });
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference flex items-center justify-center hidden md:flex will-change-transform"
      style={{ x, y, translateX: '-50%', translateY: '-50%' }}
    >
      {/* This div is the actual cursor "body" */}
      {/* Base size reduced to 12px (dot) */}
      <motion.div
        className="relative rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)] flex items-center justify-center overflow-hidden"
        initial={false}
        animate={{
          // Expand to 80px when hovering, back to 12px when idle
          width: isHovering ? 80 : 12,
          height: isHovering ? 80 : 12,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        {/* Text directly inside the scalable cursor body */}
        <motion.span 
          className="z-10 text-black font-black uppercase tracking-widest text-xs whitespace-nowrap"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: isHovering ? 1 : 0,
            scale: isHovering ? 1 : 0.5
          }}
          transition={{ duration: 0.2 }}
        >
          View
        </motion.span>
      </motion.div>
    </motion.div>
  );
};

export default CustomCursor;