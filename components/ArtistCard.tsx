/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';
import { motion } from 'framer-motion';
import { FeatureItem } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface FeatureCardProps {
  artist: FeatureItem;
  onClick: () => void;
}

const ArtistCard: React.FC<FeatureCardProps> = ({ artist, onClick }) => {
  return (
    <motion.div
      className="group relative h-[400px] md:h-[500px] w-full overflow-hidden border-b md:border-r border-white/10 bg-[#15222e] cursor-pointer hover:z-10"
      initial="rest"
      whileHover="hover"
      whileTap="hover"
      animate="rest"
      data-hover="true"
      onClick={onClick}
      variants={{
        rest: { 
          scale: 1,
          borderColor: "rgba(255, 255, 255, 0.1)"
        },
        hover: { 
          scale: 1.02,
          borderColor: "rgba(247, 142, 44, 0.5)", // #f78e2c
          transition: { duration: 0.3, ease: "easeOut" }
        }
      }}
    >
      {/* Image Background with Zoom */}
      <div className="absolute inset-0 overflow-hidden bg-black">
        <motion.img 
          src={artist.image} 
          alt={artist.name} 
          className="h-full w-full object-cover opacity-60 grayscale transition-all duration-700 ease-out will-change-transform"
          variants={{
            rest: { scale: 1, opacity: 0.6, filter: 'grayscale(100%)' },
            hover: { scale: 1.1, opacity: 0.9, filter: 'grayscale(0%)' }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#15222e] via-[#15222e]/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
        <div className="absolute inset-0 bg-[#f78e2c]/0 group-hover:bg-[#f78e2c]/10 transition-colors duration-500 mix-blend-overlay" />
      </div>

      {/* Overlay Info */}
      <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-between items-start">
           <span className="text-xs font-mono border border-white/30 px-2 py-1 rounded-full backdrop-blur-md bg-black/30">
             {artist.tag}
           </span>
           <motion.div
             variants={{
               rest: { opacity: 0, x: 20, y: -20, rotate: 0 },
               hover: { opacity: 1, x: 0, y: 0, rotate: 45 }
             }}
             transition={{ duration: 0.4, ease: "backOut" }}
             className="bg-[#f78e2c] text-black rounded-full p-2 shadow-[0_0_15px_rgba(247,142,44,0.5)]"
           >
             <ArrowUpRight className="w-6 h-6" />
           </motion.div>
        </div>

        <div className="relative z-10">
          <div className="overflow-hidden">
            <motion.h3 
              className="font-heading text-3xl md:text-4xl font-bold uppercase text-white drop-shadow-lg"
              variants={{
                rest: { y: 0 },
                hover: { y: -5, color: "#ffffff" }
              }}
              transition={{ duration: 0.3 }}
            >
              {artist.name}
            </motion.h3>
          </div>
          <motion.p 
            className="text-sm font-medium uppercase tracking-widest text-gray-400 mt-2"
            variants={{
              rest: { opacity: 0.7, x: 0, color: "#9ca3af" },
              hover: { opacity: 1, x: 5, color: "#f78e2c" }
            }}
            transition={{ duration: 0.3 }}
          >
            {artist.category}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
};

export default ArtistCard;