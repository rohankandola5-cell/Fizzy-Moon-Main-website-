'use client';

import React from 'react';
import { motion, AnimatePresence, MotionValue } from 'framer-motion';
import Image from 'next/image';
import { MapPin, Calendar, Music } from 'lucide-react';
import Bubbles from '../../components/Bubbles';

interface HeroSectionProps {
  y: MotionValue<number>;
  opacity: MotionValue<number>;
  isPageReady: boolean;
  currentHeroImage: number;
  venueImages: Array<{ url: string; alt: string; label: string }>;
  handleBooking: () => void;
  scrollToSection: (id: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  y,
  opacity,
  isPageReady,
  currentHeroImage,
  venueImages,
  handleBooking,
  scrollToSection,
}) => {
  return (
    <header className="relative h-[100svh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden">
      {/* HERO IMAGE CAROUSEL BACKGROUND - High Quality Venue Photos */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence>
          <motion.div
            key={currentHeroImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
            style={{ 
              filter: 'saturate(0.85) brightness(1.05)',
            }}
          >
            <Image
              src={venueImages[currentHeroImage].url}
              alt={venueImages[currentHeroImage].alt}
              fill
              sizes="100vw"
              className="object-cover"
              priority={currentHeroImage === 0}
            />
          </motion.div>
        </AnimatePresence>
        {/* Dark Overlay for Text Readability - Balanced to show the venue warmth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-brand-slate-deep" />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      
      {/* Bubbles - Restored to Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
         <Bubbles />
      </div>

      {/* Hero Content */}
      <motion.div 
        style={{ y, opacity }}
        className="z-10 text-center flex flex-col items-center w-full max-w-6xl pt-24 md:pt-28 pb-32 md:pb-24 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: isPageReady ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        {/* Welcome Tag */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: isPageReady ? 1 : 0, y: isPageReady ? 0 : 8 }}
          transition={{ duration: 1.2, delay: 0.3, ease: "easeInOut" }}
          className="flex items-center gap-3 md:gap-4 text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase mb-6 bg-brand-slate-deep px-6 py-2 rounded-full backdrop-blur-md border border-white/10 shadow-lg"
        >
          <span className="text-brand-orange"><MapPin className="inline w-3 h-3 mr-1 mb-0.5" />Leamington Spa</span>
        </motion.div>

        {/* Main Title Block */}
        <div className="relative w-full flex justify-center items-center flex-col mb-4">
           {/* FIZZY MOON - Keep branding but make it cleaner */}
           <motion.div
             className="relative w-[55%] md:w-[35%] max-w-4xl h-auto mb-2"
             initial={{ opacity: 0, scale: 0.98 }}
             animate={{ opacity: isPageReady ? 1 : 0, scale: isPageReady ? 1 : 0.98 }}
             transition={{ duration: 1.4, delay: 0.2, ease: "easeInOut" }}
           >
             <Image
               src="/images/logo/fizzy_moon_white_final.png"
               alt="Fizzy Moon"
               width={800}
               height={200}
               className="w-full h-auto object-contain drop-shadow-2xl"
               priority
             />
           </motion.div>
           {/* Descriptive Subtitle - Crucial for context */}
           <motion.h2 
             initial={{ opacity: 0 }}
             animate={{ opacity: isPageReady ? 1 : 0 }}
             transition={{ duration: 1, delay: 0.4, ease: "easeInOut" }}
             className="text-3xl md:text-5xl font-elegant italic text-brand-orange mt-4 md:mt-6 tracking-wide text-center"
           >
             Where bubbles never stop flowing
           </motion.h2>
        </div>
        
        <motion.div
           initial={{ scaleX: 0, opacity: 0 }}
           animate={{ scaleX: isPageReady ? 1 : 0, opacity: isPageReady ? 1 : 0 }}
           transition={{ duration: 1.5, delay: 0.5, ease: "easeInOut" }}
           className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-brand-orange to-transparent mb-8"
        />

        {/* PRIMARY CALLS TO ACTION - Immediate Visibility */}
        <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl px-4">
           <motion.button
             onClick={handleBooking}
             initial={{ opacity: 0, y: 8 }}
             animate={{ opacity: isPageReady ? 1 : 0, y: isPageReady ? 0 : 8 }}
             transition={{ duration: 1, delay: 0.55, ease: "easeInOut" }}
             className="flex-1 py-5 md:py-6 rounded-xl bg-brand-orange text-black font-bold text-base md:text-lg tracking-widest uppercase hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(247,142,44,0.5)] flex items-center justify-center gap-2"
           >
             <Calendar className="w-4 h-4 md:w-5 md:h-5" /> Book A Table
           </motion.button>
           
           <div className="flex gap-6 flex-1">
              <motion.button
                onClick={() => scrollToSection('eat-drink')}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: isPageReady ? 1 : 0, y: isPageReady ? 0 : 8 }}
                transition={{ duration: 1, delay: 0.625, ease: "easeInOut" }}
                className="flex-1 py-4 rounded-xl bg-brand-slate-deep backdrop-blur-md border border-white/20 text-white font-bold text-xs md:text-sm tracking-widest uppercase hover:bg-white/10 hover:border-brand-orange transition-all flex flex-row items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 ml-1">
                  <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
                  <path d="M7 2v20"/>
                  <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
                </svg>
                <span>Sunday Roast</span>
              </motion.button>
              <motion.button
                onClick={() => scrollToSection('whats-on')}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: isPageReady ? 1 : 0, y: isPageReady ? 0 : 8 }}
                transition={{ duration: 1, delay: 0.7, ease: "easeInOut" }}
                className="flex-1 py-4 rounded-xl bg-brand-slate-deep backdrop-blur-md border border-white/20 text-white font-bold text-xs md:text-sm tracking-widest uppercase hover:bg-white/10 hover:border-brand-orange transition-all flex items-center justify-center gap-2"
              >
                <Music className="w-4 h-4" /> Live Music
              </motion.button>
           </div>
        </div>
      </motion.div>

      {/* MARQUEE - Shifted to bottom */}
      <div className="absolute bottom-0 left-0 w-full py-3 bg-brand-orange text-black z-20 overflow-hidden border-t-2 border-black shadow-[0_-8px_30px_rgba(0,0,0,0.4)]">
        <motion.div 
          className="flex w-fit will-change-transform"
          animate={{ x: "-50%" }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          {[0, 1].map((key) => (
            <div key={key} className="flex whitespace-nowrap shrink-0">
              {[...Array(4)].map((_, i) => (
                <span key={i} className="text-xl md:text-3xl font-heading font-black px-8 flex items-center gap-4">
                  LIVE MUSIC <span className="text-white text-lg md:text-2xl">●</span> 
                  LUXE LOUNGE <span className="text-white text-lg md:text-2xl">●</span> 
                  COCKTAILS <span className="text-white text-lg md:text-2xl">●</span> 
                  VIP HUT <span className="text-white text-lg md:text-2xl">●</span> 
                  SUNDAY ROAST <span className="text-white text-lg md:text-2xl">●</span> 
                  CRAFT BEER <span className="text-white text-lg md:text-2xl">●</span> 
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </header>
  );
};

export default HeroSection;

