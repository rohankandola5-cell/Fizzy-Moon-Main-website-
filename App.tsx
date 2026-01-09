
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

'use client';

import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Ticket, Globe, Zap, Music, MapPin, Menu, X, Calendar, Play, ChevronLeft, ChevronRight, Utensils, Beer, PartyPopper, Trophy, Users, Crown, Wine, Armchair, Briefcase, Star, Flame, ArrowUpRight, Mic2, Clock, ArrowLeft, Coffee } from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import CustomCursor from './components/CustomCursor';
import ArtistCard from './components/ArtistCard';
import Bubbles from './components/Bubbles';
import FAQAccordion from './components/FAQAccordion';
import FizzyLogo from './components/FizzyLogo';
import PromoModal from './components/PromoModal';
import { FeatureItem } from './types';
import { PROMO_CONFIG } from './promoConfig';
import MUSIC_SCHEDULE from './data/music-schedule.json';

const BOOKING_URL = "https://www.sevenrooms.com/explore/fizzymoonbrewhouse/reservations/create/search/";

// Image normalization: Set to 'normalized' to use sRGB-normalized images from /images-normalized/
// Run 'npm run normalize:images' first to generate normalized versions
const IMAGE_PREFIX = process.env.NEXT_PUBLIC_USE_NORMALIZED_IMAGES === 'true' ? '/images-normalized' : '/images';

// Local venue images - place images in /public/images/venue/ folder
// After running normalize:images, set NEXT_PUBLIC_USE_NORMALIZED_IMAGES=true to use normalized versions
const VENUE_IMAGES = [
  {
    url: `${IMAGE_PREFIX}/venue/IMG_4315.jpg`,
    alt: "Fizzy Moon Interior",
    label: "Main Bar"
  },
  {
    url: `${IMAGE_PREFIX}/venue/IMG_4314.jpg`,
    alt: "Warm Interior Lounge",
    label: "Warm & Welcoming"
  },
  {
    url: `${IMAGE_PREFIX}/venue/IMG_4316.jpg`,
    alt: "Dining Area",
    label: "Brewhouse & Grill"
  },
  {
    url: `${IMAGE_PREFIX}/venue/IMG_4317.jpg`,
    alt: "Garden Lounge",
    label: "Garden Atmosphere"
  },
  {
    url: `${IMAGE_PREFIX}/venue/IMG_7636_(1).jpg`,
    alt: "Fizzy Moon Event",
    label: "Live Events"
  }
];

// Live music schedule data is now loaded from data/music-schedule.json
// Edit that file to update events, artists, and descriptions

// DATA SEPARATION
const EVENTS: FeatureItem[] = [
  { 
    id: 'e1', 
    name: 'Live Music Calendar', 
    category: '2026 Lineup', 
    tag: 'MUSIC', 
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop',
    description: 'The best local bands and DJs spinning tracks until late. Check out our 2026 schedule below.'
  },
  { 
    id: 'e2', 
    name: 'Sunday Roast', 
    category: 'Weekly Tradition', 
    tag: 'FOOD EVENT', 
    image: '/images/events/IMG_9614.jpg',
    description: 'A proper Sunday Feast. Slow-roasted meats, giant yorkshire puddings, roast potatoes and seasonal veg. Served all day Sunday until sold out.'
  },
  { 
    id: 'e3', 
    name: 'Fizzy Quizzy', 
    category: 'Thursday Nights', 
    tag: 'TRIVIA', 
    image: 'https://images.unsplash.com/photo-1632211910609-02ae6a746532?q=80&w=1000&auto=format&fit=crop',
    description: 'Test your knowledge and win big prizes. Our weekly quiz night is the perfect excuse for a midweek pint.'
  }
];

const FOOD_DRINK: FeatureItem[] = [
  { 
    id: 'f1', 
    name: 'Fizzy Burger', 
    category: 'Signature Grill', 
    tag: 'FOOD', 
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
    description: 'Our legendary house burger. Double smashed beef patty, smoked bacon, american cheese, and our secret Fizzy sauce. Served with rosemary fries.'
  },
  { 
    id: 'f2', 
    name: 'Home Brews', 
    category: 'Craft Ales', 
    tag: 'DRINK', 
    image: 'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?q=80&w=1000&auto=format&fit=crop',
    description: 'Taste our exclusive home brews. From hoppy IPAs to smooth Stouts, our rotation changes weekly. Brewed right here.'
  },
  { 
    id: 'f3', 
    name: 'Steak Night', 
    category: 'Butchers Block', 
    tag: 'GRILL', 
    image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1000&auto=format&fit=crop',
    description: 'Locally sourced cuts, cooked over open flame. Served with all the trimmings. Perfect for date night.'
  }
];

const ALL_FEATURES = [...EVENTS, ...FOOD_DRINK];

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  // Gentler parallax - reduced from -100 to -30 for smoother feel
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -30]);
  // Slower fade - extends over 35% of scroll instead of 20%
  const opacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Modal States
  const [selectedFeature, setSelectedFeature] = useState<FeatureItem | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null); // For Drill-down view
  
  const modalScrollRef = useRef<HTMLDivElement>(null);
  const [activeMonth, setActiveMonth] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  
  const [scrolled, setScrolled] = useState(false);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [isPageReady, setIsPageReady] = useState(false);

  // Handle page readiness and smooth initial load
  useEffect(() => {
    // Disable automatic scroll restoration
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Scroll to top immediately on mount (before any content shows)
    window.scrollTo({ top: 0, behavior: 'auto' });

    let isReadySet = false;
    const setReady = () => {
      if (isReadySet) return;
      isReadySet = true;
      // Ensure we're at top, then show content after layout settles
      window.scrollTo({ top: 0, behavior: 'auto' });
      // Wait for scroll to complete and layout to settle
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'auto' });
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setIsPageReady(true);
          });
        });
      }, 50);
    };

    // Wait for page to be ready before showing content and scrolling
    const checkPageReady = () => {
      // Wait for next frame to ensure DOM is painted
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          // Check if critical images are loaded (handles cached images too)
          const logoImg = new Image();
          const heroImg = new Image();
          
          let logoLoaded = false;
          let heroLoaded = false;

          const checkReady = () => {
            if (logoLoaded && heroLoaded) {
              setReady();
            }
          };

          // Handle logo image
          logoImg.onload = () => {
            logoLoaded = true;
            checkReady();
          };
          logoImg.onerror = () => {
            logoLoaded = true; // Continue even if image fails
            checkReady();
          };
          logoImg.src = '/images/logo/fizzy_moon_white_final.png';
          // If already cached, onload won't fire, so check complete property
          if (logoImg.complete) {
            logoLoaded = true;
            checkReady();
          }

          // Handle hero image
          heroImg.onload = () => {
            heroLoaded = true;
            checkReady();
          };
          heroImg.onerror = () => {
            heroLoaded = true; // Continue even if image fails
            checkReady();
          };
          heroImg.src = VENUE_IMAGES[0].url;
          // If already cached, onload won't fire, so check complete property
          if (heroImg.complete) {
            heroLoaded = true;
            checkReady();
          }

          // Fallback: if images take too long, show page anyway after 500ms
          setTimeout(() => {
            setReady();
          }, 500);
        });
      });
    };

    // If page is already loaded, check immediately
    if (document.readyState === 'complete') {
      checkPageReady();
    } else {
      window.addEventListener('load', checkPageReady);
      return () => window.removeEventListener('load', checkPageReady);
    }
  }, []);

  // Preload critical images for better performance
  useEffect(() => {
    // Preload first hero image (most important)
    const preloadHero = document.createElement('link');
    preloadHero.rel = 'preload';
    preloadHero.as = 'image';
    preloadHero.href = VENUE_IMAGES[0].url;
    preloadHero.fetchPriority = 'high';
    document.head.appendChild(preloadHero);

    // Preload logo
    const preloadLogo = document.createElement('link');
    preloadLogo.rel = 'preload';
    preloadLogo.as = 'image';
    preloadLogo.href = '/images/logo/fizzy_moon_white_final.png';
    document.head.appendChild(preloadLogo);

    // Preload next hero image in background
    const preloadNext = document.createElement('link');
    preloadNext.rel = 'prefetch';
    preloadNext.as = 'image';
    preloadNext.href = VENUE_IMAGES[1].url;
    document.head.appendChild(preloadNext);

    return () => {
      document.head.removeChild(preloadHero);
      document.head.removeChild(preloadLogo);
      document.head.removeChild(preloadNext);
    };
  }, []);

  // Hero Carousel Interval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % VENUE_IMAGES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedFeature) return;
      if (e.key === 'ArrowLeft' && !selectedEvent) navigateFeature('prev');
      if (e.key === 'ArrowRight' && !selectedEvent) navigateFeature('next');
      if (e.key === 'Escape') {
        if (selectedEvent) setSelectedEvent(null);
        else setSelectedFeature(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFeature, selectedEvent]);

  // Reset drill-down when feature changes
  useEffect(() => {
    setSelectedEvent(null);
  }, [selectedFeature]);

  const handleBooking = () => {
    window.open(BOOKING_URL, "_blank");
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      // Changed offset to 0 to minimize gap between header and content
      const headerOffset = 0; 
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToMonth = (index: number) => {
    if (modalScrollRef.current) {
      setIsAutoScrolling(true);
      const element = document.getElementById(`month-section-${index}`);
      if (element) {
        const headerOffset = 90; 
        const top = element.offsetTop - headerOffset;
        modalScrollRef.current.scrollTo({
          top: Math.max(0, top),
          behavior: 'smooth'
        });
        setActiveMonth(index);
        
        setTimeout(() => {
           setIsAutoScrolling(false);
        }, 800);
      }
    }
  };

  const handleModalScroll = () => {
    if (isAutoScrolling) return;

    if (modalScrollRef.current) {
       const sections = MUSIC_SCHEDULE.map((_, i) => document.getElementById(`month-section-${i}`));
       const scrollPosition = modalScrollRef.current.scrollTop;
       const triggerPoint = scrollPosition + 120;
  
       let currentIndex = 0;
       sections.forEach((section, index) => {
          if (section && section.offsetTop <= triggerPoint) {
             currentIndex = index;
          }
       });
       setActiveMonth(currentIndex);
    }
  };

  const navigateFeature = (direction: 'next' | 'prev') => {
    if (!selectedFeature) return;
    const currentIndex = ALL_FEATURES.findIndex(a => a.id === selectedFeature.id);
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % ALL_FEATURES.length;
    } else {
      nextIndex = (currentIndex - 1 + ALL_FEATURES.length) % ALL_FEATURES.length;
    }
    setSelectedFeature(ALL_FEATURES[nextIndex]);
  };
  
  const navItems = ['What\'s On', 'Contact Us', 'FAQs', 'Menus & Gift Cards'];
  const getSectionId = (item: string) => {
    switch (item) {
      case 'What\'s On': return 'whats-on';
      case 'Contact Us': return 'contact';
      case 'FAQs': return 'faq';
      case 'Menus & Gift Cards': return 'eat-drink';
      default: return 'hero';
    }
  };

  return (
    <div className="relative min-h-screen text-white selection:bg-brand-orange selection:text-black cursor-auto md:cursor-none overflow-x-hidden font-sans">
      <CustomCursor />
      
      {/* Promotional Modal */}
      <PromoModal config={PROMO_CONFIG} />
      
      {/* Optimized Background */}
      <FluidBackground />
      
      {/* Navigation - Z-50 (Highest) */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'py-4 bg-brand-slate-deep backdrop-blur-md border-b border-white/5 shadow-lg pointer-events-auto' 
            : 'py-6 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-8 max-w-[1920px] mx-auto w-full">
          {/* Logo - Left */}
          <motion.div 
            className="pointer-events-auto z-50 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.4, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <FizzyLogo 
              className={`w-auto object-contain cursor-pointer transition-all duration-300 text-white ${scrolled ? 'h-10 md:h-12' : 'h-12 md:h-16'}`}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
          </motion.div>
          
          {/* Desktop Menu - Center */}
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="hidden md:flex flex-1 justify-center pointer-events-auto"
          >
            <div className="flex bg-brand-slate-deep backdrop-blur-xl border border-white/20 p-1.5 rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.5)] gap-1 ring-1 ring-white/5">
              {navItems.map((item, index) => (
                <motion.button 
                  key={item} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1.2, delay: 0.45 + (index * 0.1), ease: "easeOut" }}
                  onClick={() => scrollToSection(getSectionId(item))}
                  className="px-5 py-2.5 rounded-full text-white/90 font-medium text-xs font-heading uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all duration-300 border border-transparent hover:border-white/10 active:scale-95"
                  data-hover="true"
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Book Now - Right */}
          <motion.div 
            className="flex items-center gap-3 pointer-events-auto flex-shrink-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.4, delay: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Desktop Book Now */}
            <button
              onClick={handleBooking}
              className="hidden md:flex items-center gap-2 bg-brand-orange text-black px-6 py-3 rounded-full font-bold font-heading text-xs tracking-widest hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(247,142,44,0.4)] border border-brand-orange"
              data-hover="true"
            >
              <Calendar className="w-4 h-4" />
              <span>BOOK NOW</span>
            </button>

            {/* Mobile Book Button */}
            <button
              onClick={handleBooking}
              className="md:hidden flex items-center gap-2 bg-brand-orange text-black px-4 py-2.5 rounded-full font-bold font-heading text-[10px] tracking-widest hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(247,142,44,0.4)] border border-brand-orange"
              data-hover="true"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>BOOK</span>
            </button>
          </motion.div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative h-[100svh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden">
        {/* HERO IMAGE CAROUSEL BACKGROUND - High Quality Venue Photos */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence>
            <motion.img 
              key={currentHeroImage}
              src={VENUE_IMAGES[currentHeroImage].url}
              alt={VENUE_IMAGES[currentHeroImage].alt}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover"
              loading={currentHeroImage === 0 ? "eager" : "lazy"}
              decoding="async"
              fetchPriority={currentHeroImage === 0 ? "high" : "auto"}
            />
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
             <motion.img 
               src="/images/logo/fizzy_moon_white_final.png"
               alt="Fizzy Moon"
               className="w-[55%] md:w-[35%] max-w-4xl h-auto object-contain drop-shadow-2xl mb-2"
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: isPageReady ? 1 : 0, scale: isPageReady ? 1 : 0.98 }}
               transition={{ duration: 1.4, delay: 0.2, ease: "easeInOut" }}
             />
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

      {/* BOOKINGS SECTION */}
      <section id="bookings" className="relative z-10 py-20 md:py-32 px-4 md:px-6 bg-gradient-to-b from-brand-slate-deep to-brand-slate-dark border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
             <h2 className="text-5xl md:text-9xl font-heading font-bold opacity-10 text-white leading-none">
               RESERVE
             </h2>
             <div className="relative -mt-6 md:-mt-16 z-10">
               <p className="text-3xl md:text-5xl font-elegant italic text-white mb-2">Secure your spot</p>
               <p className="text-brand-orange font-mono uppercase tracking-widest text-sm md:text-base">
                 Choose your experience
               </p>
             </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 md:gap-8">
            {[
              { 
                name: 'Standard Booking', 
                subtitle: 'Main Bar & Garden',
                price: 'Book Free', 
                color: 'cyan', 
                accent: 'bg-cyan-500/5 border-cyan-500/30 hover:border-cyan-500', 
                desc: 'Soak up the vibe in our main bar or heated garden marquee. Casual, lively, and perfect for getting together.',
                features: [
                  { icon: Users, text: 'Groups of 2 - Large Parties' },
                  { icon: Utensils, text: 'Full Menu Available' },
                ]
              },
              {
                name: 'Group Buffet',
                subtitle: 'Large Group Sharing',
                price: 'From £25pp',
                color: 'purple',
                accent: 'bg-purple-500/5 border-purple-500/30 hover:border-purple-500',
                desc: 'Designed for groups of 15+. A curated selection of dishes placed on tables for your group to enjoy. Pre-order required.',
                features: [
                  { icon: Users, text: 'Groups 15+' },
                  { icon: Utensils, text: 'Buffet Platter Service' },
                  { icon: Clock, text: 'Pre-order Required' }
                ]
              },
              { 
                name: 'The VIP Hut', 
                subtitle: 'Celebration Central',
                price: 'Book Now', 
                color: 'gold', 
                accent: 'bg-gradient-to-br from-brand-orange to-black border-brand-orange hover:border-brand-orange shadow-[0_0_30px_rgba(247,142,44,0.1)]', 
                desc: 'The best seat in the house. Located centrally in our heated marquee. Perfect for birthdays and those who want to be seen.',
                features: [
                  { icon: Crown, text: 'Center of Action' },
                  { icon: Flame, text: 'Heated & Covered' },
                  { icon: PartyPopper, text: 'Perfect for Birthdays' }
                ]
              },
              { 
                name: 'The Luxe Lounge', 
                subtitle: 'Ultra Exclusive',
                price: 'Private Hire', 
                color: 'pink', 
                accent: 'bg-red-500/5 border-red-500/30 hover:border-red-500', 
                desc: 'Your private sanctuary. Host up to 25 guests in our most exclusive hidden area. Perfect for private parties.',
                features: [
                  { icon: Users, text: 'Up to 25 Guests' },
                  { icon: Star, text: 'Private Area' },
                  { icon: Wine, text: 'Bottle Service Avail.' }
                ]
              },
            ].map((ticket, i) => {
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -15 }}
                  className={`relative p-8 md:p-10 border backdrop-blur-md flex flex-col min-h-[500px] transition-all duration-300 ${ticket.accent} rounded-2xl group`}
                >
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-3">
                       <h3 className="text-2xl md:text-3xl font-semibold text-white leading-tight tracking-tight">{ticket.name}</h3>
                       {ticket.color === 'gold' && <Crown className="text-brand-orange w-6 h-6 animate-pulse" />}
                    </div>
                    <p className={`text-sm font-elegant italic mb-6 ${ticket.color === 'gold' ? 'text-brand-orange' : ticket.color === 'pink' ? 'text-red-500' : ticket.color === 'purple' ? 'text-purple-500' : 'text-cyan-500'}`}>
                      {ticket.subtitle}
                    </p>
                    
                    <p className="text-gray-200 mb-8 leading-relaxed font-light text-base">{ticket.desc}</p>
                    
                    <div className="h-px w-full bg-white/10 mb-8" />

                    <ul className="space-y-4 text-sm text-gray-200 font-light">
                      {ticket.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-3">
                          <div className={`p-2 rounded-full bg-white/5`}>
                             <feature.icon className={`w-4 h-4 ${ticket.color === 'gold' ? 'text-brand-orange' : ticket.color === 'pink' ? 'text-red-500' : ticket.color === 'purple' ? 'text-purple-500' : 'text-cyan-500'}`} /> 
                          </div>
                          <span className="font-normal">{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button 
                    onClick={handleBooking}
                    className={`w-full py-4 text-sm font-semibold tracking-wide border transition-all duration-300 mt-8 rounded-xl
                      ${ticket.color === 'gold' ? 'bg-brand-orange text-black border-brand-orange hover:bg-white hover:border-white' : 'border-white/20 text-white hover:bg-white hover:text-black'}
                    `}
                  >
                    {ticket.price}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHAT'S ON SECTION */}
      <section id="whats-on" className="relative z-10 py-20 md:py-32 bg-brand-slate-dark border-t border-white/5">
         <div className="max-w-[1600px] mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center mb-16">
              <span className="text-brand-orange font-mono text-sm tracking-[0.3em] uppercase mb-4">Live & Loud</span>
              <h2 className="text-5xl md:text-8xl font-heading font-bold uppercase text-center">
                What's <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-500">On</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-white/10 bg-black/20 backdrop-blur-sm">
              {EVENTS.map((feature) => (
                <ArtistCard key={feature.id} artist={feature} onClick={() => setSelectedFeature(feature)} />
              ))}
            </div>
         </div>
      </section>

      {/* MERGED SECTION */}
      <section id="eat-drink" className="relative z-10 py-20 md:py-32 bg-brand-slate-deep border-t border-white/10">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-16 px-4">
             <div>
               <div className="flex items-center gap-4 mb-6">
                  <span className="text-brand-orange font-mono text-sm tracking-[0.3em] uppercase">Taste Makers</span>
                  <div className="h-px w-12 bg-brand-orange" />
               </div>
               <h2 className="text-5xl md:text-7xl font-heading font-bold uppercase leading-none mb-6">
                 More Than <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-500">A Pub</span>
               </h2>
               <p className="text-lg text-gray-200 font-light leading-relaxed max-w-xl mb-8">
                 Fizzy Moon is an extension of your night out. A place where the drinks are crafted in-house, the food is fire-kissed, and the music never stops.
               </p>
               <div className="flex flex-wrap gap-8 border-t border-white/10 pt-6">
                  {[
                    { icon: Beer, label: "Home Brews" },
                    { icon: Flame, label: "Fire Grill" },
                    { icon: Music, label: "Live Music" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-white/80 group">
                      <div className="p-2 rounded-full bg-white/5 group-hover:bg-brand-orange transition-colors duration-300">
                        <item.icon className="w-4 h-4 text-brand-orange group-hover:text-black transition-colors duration-300" />
                      </div>
                      <span className="font-bold uppercase text-xs tracking-widest">{item.label}</span>
                    </div>
                  ))}
               </div>
             </div>

             <div className="flex justify-start lg:justify-end pb-2">
                <button 
                  onClick={handleBooking}
                  className="group relative px-8 py-4 bg-white/5 border border-white/20 text-white font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-brand-orange hover:border-brand-orange hover:text-black overflow-hidden rounded-full"
                  data-hover="true"
                >
                   <span className="relative z-10 flex items-center gap-2">
                     Book Now <ArrowUpRight className="w-4 h-4" />
                   </span>
                </button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-white/10 bg-white/5 backdrop-blur-sm">
            {FOOD_DRINK.map((feature) => (
              <ArtistCard key={feature.id} artist={feature} onClick={() => setSelectedFeature(feature)} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="relative z-10 py-20 md:py-32 bg-brand-slate-darker border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase mb-4">
                      Common <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-500">Questions</span>
                  </h2>
                  <p className="text-gray-300">Everything you need to know before you go.</p>
              </div>
              <FAQAccordion />
          </div>
      </section>

      <footer id="contact" className="relative z-10 border-t border-white/10 py-12 md:py-16 bg-brand-slate-deep backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
             <div className="mb-6">
               <img 
                 src="/images/logo/fizzy_moon_white_final.png" 
                 alt="Fizzy Moon" 
                 className="h-12 md:h-14 w-auto object-contain"
               />
             </div>
             <div className="flex gap-2 text-xs font-mono text-gray-300">
               <span>35 Regent St, Leamington Spa CV32 5EE</span>
             </div>
          </div>
          
          <div className="flex gap-6 md:gap-8 flex-wrap">
            <a href="#" className="text-gray-300 hover:text-white font-bold uppercase text-xs tracking-widest transition-colors cursor-pointer" data-hover="true">
              Instagram
            </a>
            <a href="#" className="text-gray-300 hover:text-white font-bold uppercase text-xs tracking-widest transition-colors cursor-pointer" data-hover="true">
              Facebook
            </a>
          </div>
        </div>
      </footer>

      {/* Feature Detail Modal */}
      <AnimatePresence>
        {selectedFeature && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedFeature(null)}
            className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-6 bg-black/90 backdrop-blur-xl cursor-auto"
          >
          <motion.div
            initial={{ y: '100%', opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-brand-slate-dark border-t md:border border-white/10 overflow-hidden flex flex-col shadow-2xl group/modal h-[90dvh] md:h-[85vh] rounded-t-3xl md:rounded-3xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedFeature(null)}
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors border border-white/10 backdrop-blur-md"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Top Image Section - Shows only if no specific event selected */}
              <AnimatePresence mode="popLayout">
                {!selectedEvent && (
                    <motion.div 
                        key="main-header"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-[220px] md:h-[280px] relative shrink-0 group/image"
                    >
                        <img 
                          src={selectedFeature.image} 
                          alt={selectedFeature.name} 
                          className="absolute inset-0 w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Image failed to load:', selectedFeature.image);
                            console.error('Error event:', e);
                          }}
                          onLoad={() => {
                            console.log('Image loaded successfully:', selectedFeature.image);
                          }}
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-slate-dark via-brand-slate-dark/40 to-transparent" />

                        {/* Navigation Buttons for Main Features */}
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full flex justify-between px-4 pointer-events-none">
                            <button
                              onClick={(e) => { e.stopPropagation(); navigateFeature('prev'); }}
                              className="p-3 rounded-full bg-black/30 text-white hover:bg-white hover:text-black transition-colors border border-white/10 backdrop-blur-md pointer-events-auto opacity-0 group-hover/image:opacity-100 duration-300 hidden md:block"
                            >
                              <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); navigateFeature('next'); }}
                              className="p-3 rounded-full bg-black/30 text-white hover:bg-white hover:text-black transition-colors border border-white/10 backdrop-blur-md pointer-events-auto opacity-0 group-hover/image:opacity-100 duration-300 hidden md:block"
                            >
                              <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                        
                        {/* Mobile Nav */}
                        <div className="absolute bottom-4 right-4 flex gap-2 md:hidden z-20">
                           <button onClick={(e) => { e.stopPropagation(); navigateFeature('prev'); }} className="p-2 rounded-full bg-black/50 border border-white/10 text-white"><ChevronLeft className="w-5 h-5" /></button>
                           <button onClick={(e) => { e.stopPropagation(); navigateFeature('next'); }} className="p-2 rounded-full bg-black/50 border border-white/10 text-white"><ChevronRight className="w-5 h-5" /></button>
                        </div>

                        <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end items-start z-10">
                           <div className="flex items-center gap-3 text-brand-orange mb-2">
                             <Calendar className="w-4 h-4" />
                             <span className="font-mono text-xs md:text-sm tracking-widest uppercase">{selectedFeature.tag}</span>
                           </div>
                           <h3 className="text-3xl md:text-5xl font-heading font-black uppercase leading-none text-white mb-1 tracking-tighter shadow-black drop-shadow-lg">
                              {selectedFeature.name}
                           </h3>
                           <p className="text-base md:text-xl text-amber-500 font-medium tracking-widest uppercase">
                              {selectedFeature.category}
                           </p>
                        </div>
                    </motion.div>
                )}
              </AnimatePresence>

              {/* Main Scrollable Content Area */}
              <div 
                 ref={modalScrollRef}
                 onScroll={handleModalScroll} 
                 className="flex-1 overflow-y-auto bg-brand-slate-dark relative"
                 style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.2) transparent' }}
              >
                 {/* Detail View for Artist */}
                 <AnimatePresence mode="wait">
                     {selectedEvent ? (
                        <motion.div 
                            key="event-detail"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 50 }}
                            className="h-full flex flex-col"
                        >
                            {/* Sticky Back Button Header */}
                            <div className="sticky top-0 z-40 bg-brand-slate-dark/95 backdrop-blur-xl border-b border-white/10 p-4">
                                <button 
                                    onClick={() => setSelectedEvent(null)}
                                    className="flex items-center gap-2 text-white/70 hover:text-brand-orange transition-colors font-mono uppercase text-xs tracking-widest"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back to Calendar
                                </button>
                            </div>

                            {/* Artist Hero Image */}
                            <div className="relative w-full aspect-video md:aspect-[21/9] shrink-0 overflow-hidden">
                                <img src={selectedEvent.image} alt={selectedEvent.act} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-brand-slate-dark to-transparent" />
                                <div className="absolute bottom-0 left-0 p-6 md:p-8">
                                    <div className="inline-block px-3 py-1 bg-brand-orange text-black font-bold text-[10px] tracking-widest uppercase mb-2 rounded">
                                        {selectedEvent.genre}
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase text-white leading-none mb-1">
                                        {selectedEvent.act}
                                    </h2>
                                    <p className="text-xl text-gray-200 font-medium">
                                        {selectedEvent.date} @ {selectedEvent.time}
                                    </p>
                                </div>
                            </div>

                            {/* Artist Info */}
                            <div className="p-6 md:p-8 max-w-3xl">
                                <h4 className="text-brand-orange font-mono text-sm uppercase tracking-widest mb-4">About The Artist</h4>
                                <p className="text-gray-200 text-lg leading-relaxed font-light mb-8">
                                    {selectedEvent.description || "Join us for an unforgettable night of live music, great drinks, and amazing atmosphere."}
                                </p>
                                
                                <div className="mb-8">
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 inline-block">
                                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Time</div>
                                        <div className="text-white font-bold">{selectedEvent.time}</div>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleBooking}
                                    className="w-full py-5 rounded-xl bg-brand-orange text-black font-bold font-heading uppercase tracking-widest hover:bg-white hover:scale-[1.01] transition-all shadow-lg shadow-orange-500/20"
                                >
                                    Book Your Table
                                </button>
                            </div>
                        </motion.div>
                     ) : (
                        // CALENDAR LIST VIEW
                        <motion.div 
                            key="calendar-list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="max-w-4xl mx-auto p-5 md:p-8"
                        >
                            {selectedFeature.id !== 'e2' && (
                              <p className="text-gray-200 leading-relaxed text-sm md:text-base font-light mb-8 max-w-2xl">
                                 {selectedFeature.description}
                              </p>
                            )}

                            {selectedFeature.id === 'e1' ? (
                               <>
                                 {/* Month Navigation */}
                                 <div className="sticky top-0 z-30 py-2 mb-6 -mx-5 px-5 md:-mx-8 md:px-8 bg-brand-slate-dark/95 backdrop-blur-sm border-b border-white/5 flex justify-start overflow-x-auto no-scrollbar">
                                     <div className="relative flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-1 shadow-2xl">
                                         {MUSIC_SCHEDULE.map((month, idx) => {
                                             const isActive = activeMonth === idx;
                                             return (
                                                 <button
                                                     key={idx}
                                                     onClick={() => scrollToMonth(idx)}
                                                     className={`relative px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors duration-300 z-10 shrink-0 ${isActive ? 'text-black' : 'text-gray-300 hover:text-white'}`}
                                                 >
                                                     {isActive && (
                                                         <motion.div
                                                             layoutId="activePill"
                                                             className="absolute inset-0 bg-brand-orange rounded-full -z-10"
                                                             transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                         />
                                                     )}
                                                     {month.month}
                                                 </button>
                                             );
                                         })}
                                     </div>
                                 </div>

                                 {/* Calendar Events List */}
                                 <div className="space-y-8 pb-24">
                                  {MUSIC_SCHEDULE.map((month, idx) => (
                                     <div key={idx} id={`month-section-${idx}`} className="relative scroll-mt-32">
                                       <div className="flex items-center gap-4 mb-6">
                                         <h5 className="text-4xl md:text-5xl font-heading font-black uppercase text-white/5 tracking-tighter">
                                           {month.month}
                                         </h5>
                                         <div className="h-px flex-1 bg-gradient-to-r from-brand-orange/30 to-transparent" />
                                       </div>

                                       <div className="grid gap-3">
                                         {month.events.map((event, i) => (
                                           <div 
                                              key={i} 
                                              onClick={() => setSelectedEvent(event)} // Open Detail View
                                              className={`cursor-pointer relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 group/item overflow-hidden ${event.special ? 'bg-gradient-to-r from-brand-orange/10 to-transparent border-brand-orange/40' : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'}`}
                                           >
                                              {/* Date Box */}
                                              <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-black/40 border border-white/10 shrink-0 backdrop-blur-sm group-hover/item:border-brand-orange/50 transition-colors">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-white/60">{event.date.split(' ')[0]}</span>
                                                <span className="text-xl font-bold font-mono text-white">{event.date.split(' ')[1].replace(/(st|nd|rd|th)/, '')}</span>
                                              </div>
                                              
                                              {/* Thumbnail Image */}
                                              <div className="w-16 h-16 md:w-20 md:h-20 shrink-0 rounded-full md:rounded-lg overflow-hidden border border-white/10 relative shadow-lg">
                                                <img 
                                                  src={event.image} 
                                                  alt={event.act} 
                                                  className="w-full h-full object-cover transform group-hover/item:scale-110 transition-transform duration-500"
                                                />
                                                <div className="absolute inset-0 bg-black/20 group-hover/item:bg-transparent transition-colors" />
                                              </div>
                                              
                                              {/* Info */}
                                              <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                <div className="flex items-center gap-2 mb-1">
                                                     {event.special && <span className="text-[10px] bg-brand-orange text-black px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Special</span>}
                                                     {event.note && <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{event.note}</span>}
                                                </div>
                                                <h4 className={`text-lg md:text-xl font-heading font-bold uppercase truncate pr-4 ${event.special ? 'text-brand-orange' : 'text-white'}`}>
                                                  {event.act}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-xs text-gray-300 group-hover/item:text-brand-orange transition-colors uppercase tracking-wider font-medium">
                                                      {event.genre || 'Live Music'}
                                                    </span>
                                                </div>
                                              </div>
                                              
                                              {/* Arrow */}
                                              <div className="px-2 opacity-50 group-hover/item:opacity-100 transition-all -translate-x-2 group-hover/item:translate-x-0 duration-300 text-brand-orange">
                                                <div className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                                                    <span>View Info</span> <ChevronRight className="w-5 h-5" />
                                                </div>
                                                <ChevronRight className="w-6 h-6 md:hidden" />
                                              </div>
                                           </div>
                                         ))}
                                       </div>
                                     </div>
                                  ))}
                                 </div>
                               </>
                            ) : selectedFeature.id === 'e2' ? (
                              // Sunday Roast Menu
                              <div className="pb-24">
                                {/* Menu Header */}
                                <div className="mb-8 pb-6 border-b border-white/10">
                                  <p className="text-gray-200 leading-relaxed text-sm md:text-base max-w-3xl">
                                    <span className="font-bold text-white uppercase tracking-wide">Sunday Roast.</span> A proper Sunday Feast. Slow-roasted meats, giant yorkshire puddings, roast potatoes and seasonal veg. Served all day Sunday until sold out. All of our roasts are served with roast potatoes, bowl of seasonal vegetables, honey roasted parsnips, pigs in blankets, Yorkshire pudding and traditional gravy.
                                  </p>
                                </div>

                                {/* Book Button */}
                                <button 
                                  onClick={handleBooking} 
                                  className="w-full py-5 md:py-6 rounded-2xl bg-brand-orange text-black font-bold uppercase tracking-widest hover:bg-white transition-all hover:scale-[1.01] shadow-lg shadow-orange-500/20 text-base md:text-lg mb-8"
                                >
                                  Book Experience Now
                                </button>

                                {/* Menu Items */}
                                <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-8">
                                  {/* Classic Rump Roast */}
                                  <div className="bg-white/5 border border-white/10 rounded-xl p-5 md:p-6 hover:border-brand-orange/40 hover:bg-white/10 transition-all duration-300 group">
                                    <div className="flex items-start justify-between mb-2">
                                      <h4 className="text-lg md:text-xl font-heading font-bold uppercase text-white group-hover:text-brand-orange transition-colors">
                                        Classic Rump Roast
                                      </h4>
                                      <span className="text-xl md:text-2xl font-bold text-brand-orange ml-4 shrink-0">£21.00</span>
                                    </div>
                                    <p className="text-gray-400 text-sm md:text-base">With sage and onion stuffing</p>
                                  </div>

                                  {/* Roast Pork Belly */}
                                  <div className="bg-white/5 border border-white/10 rounded-xl p-5 md:p-6 hover:border-brand-orange/40 hover:bg-white/10 transition-all duration-300 group">
                                    <div className="flex items-start justify-between mb-2">
                                      <h4 className="text-lg md:text-xl font-heading font-bold uppercase text-white group-hover:text-brand-orange transition-colors">
                                        Roast Pork Belly
                                      </h4>
                                      <span className="text-xl md:text-2xl font-bold text-brand-orange ml-4 shrink-0">£19.00</span>
                                    </div>
                                    <p className="text-gray-400 text-sm md:text-base">With sage and onion stuffing and crackling</p>
                                  </div>

                                  {/* Succulent Half Roast Chicken */}
                                  <div className="bg-white/5 border border-white/10 rounded-xl p-5 md:p-6 hover:border-brand-orange/40 hover:bg-white/10 transition-all duration-300 group">
                                    <div className="flex items-start justify-between mb-2">
                                      <h4 className="text-lg md:text-xl font-heading font-bold uppercase text-white group-hover:text-brand-orange transition-colors">
                                        Succulent Half Roast Chicken
                                      </h4>
                                      <span className="text-xl md:text-2xl font-bold text-brand-orange ml-4 shrink-0">£19.00</span>
                                    </div>
                                    <p className="text-gray-400 text-sm md:text-base">With sage and onion stuffing</p>
                                  </div>

                                  {/* Nut Roast */}
                                  <div className="bg-white/5 border border-white/10 rounded-xl p-5 md:p-6 hover:border-brand-orange/40 hover:bg-white/10 transition-all duration-300 group">
                                    <div className="flex items-start justify-between mb-2">
                                      <div className="flex items-center gap-2">
                                        <h4 className="text-lg md:text-xl font-heading font-bold uppercase text-white group-hover:text-brand-orange transition-colors">
                                          Nut Roast
                                        </h4>
                                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded font-bold uppercase tracking-wider border border-green-500/30">V</span>
                                      </div>
                                      <span className="text-xl md:text-2xl font-bold text-brand-orange ml-4 shrink-0">£18.00</span>
                                    </div>
                                    <p className="text-gray-400 text-sm md:text-base">With traditional vegetarian gravy</p>
                                  </div>

                                  {/* Sharing Trio - Full Width */}
                                  <div className="md:col-span-2 bg-gradient-to-r from-brand-orange/10 to-transparent border border-brand-orange/40 rounded-xl p-5 md:p-6 hover:border-brand-orange/60 hover:from-brand-orange/20 transition-all duration-300 group">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                                      <h4 className="text-lg md:text-xl font-heading font-bold uppercase text-brand-orange mb-2 md:mb-0">
                                        Sharing Trio
                                      </h4>
                                      <span className="text-xl md:text-2xl font-bold text-brand-orange md:ml-4 shrink-0">£35.00</span>
                                    </div>
                                    <p className="text-gray-300 text-sm md:text-base">All three meats with sage & onion stuffing and crackling to share for two</p>
                                  </div>
                                </div>

                                {/* Additional Offer */}
                                <div className="bg-brand-orange/10 border border-brand-orange/30 rounded-xl p-5 md:p-6 mb-8">
                                  <p className="text-white font-bold uppercase text-sm md:text-base tracking-wider text-center md:text-left">
                                    Add an additional bowl of pigs in blankets for an extra £5 to any roast
                                  </p>
                                </div>

                                {/* Availability Note */}
                                <div className="text-center md:text-left">
                                  <p className="text-gray-400 text-xs md:text-sm italic">
                                    *Available every Sunday from 12pm. Subject to availability.
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="pb-24">
                                {/* Default View for other features (Food/Quiz) */}
                                <button onClick={handleBooking} className="w-full py-6 rounded-2xl bg-brand-orange text-black font-bold uppercase tracking-widest hover:bg-white transition-colors">Book Experience Now</button>
                              </div>
                            )}
                         </motion.div>
                     )}
                 </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
