/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';

const AudioPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Relaxing Lofi background track
  const AUDIO_URL = "https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3"; 

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.4; // Set initial volume to 40%
      audioRef.current.loop = true;
    }
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // Handle autoplay policies
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.error("Audio playback failed:", error);
          });
        }
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-50 pointer-events-auto">
      <audio ref={audioRef} src={AUDIO_URL} preload="auto" />
      
      <motion.button
        onClick={togglePlay}
        whileHover={{ scale: 1.05, width: 'auto', paddingRight: '1.5rem' }}
        whileTap={{ scale: 0.95 }}
        initial={{ width: '3rem', paddingRight: 0 }}
        className={`h-12 md:h-14 min-w-[3rem] md:min-w-[3.5rem] bg-[#15222e]/40 backdrop-blur-md border border-white/10 rounded-full shadow-lg flex items-center justify-center overflow-hidden group transition-all duration-300 ${isPlaying ? 'border-[#f78e2c]/50 shadow-[#f78e2c]/20' : 'hover:border-white/30'}`}
      >
        <div className="flex items-center">
           <div className={`w-12 md:w-14 h-12 md:h-14 flex items-center justify-center shrink-0 relative z-10`}>
             {isPlaying ? (
               <Volume2 className="w-5 h-5 md:w-6 md:h-6 text-[#f78e2c] animate-pulse" />
             ) : (
               <VolumeX className="w-5 h-5 md:w-6 md:h-6 text-white/70" />
             )}
           </div>
           
           <motion.span 
             className="whitespace-nowrap text-xs font-bold uppercase tracking-widest text-white/90 hidden group-hover:block pl-1"
           >
             {isPlaying ? 'Lounge Vibes' : 'Enable Sound'}
           </motion.span>
        </div>
        
        {/* Sound wave visualizer simulation when playing */}
        {isPlaying && (
           <div className="absolute inset-0 pointer-events-none flex items-center justify-center gap-1 opacity-20 z-0">
              {[1,2,3,4,5].map(i => (
                 <motion.div
                   key={i}
                   className="w-1 bg-[#f78e2c] rounded-full"
                   animate={{ height: [8, 24, 12, 32, 8] }}
                   transition={{ 
                     duration: 0.6 + Math.random() * 0.4, 
                     repeat: Infinity,
                     ease: "easeInOut",
                     delay: Math.random() * 0.5
                   }}
                 />
              ))}
           </div>
        )}
      </motion.button>
    </div>
  );
};

export default AudioPlayer;