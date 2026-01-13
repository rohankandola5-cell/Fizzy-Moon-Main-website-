
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

// Local venue images - place images in /public/images/venue/ folder
const VENUE_IMAGES = [
  {
    url: "/images/venue/IMG_4315.jpg",
    alt: "Fizzy Moon Interior",
    label: "Main Bar"
  },
  {
    url: "/images/venue/IMG_4314.jpg",
    alt: "Warm Interior Lounge",
    label: "Warm & Welcoming"
  },
  {
    url: "/images/venue/IMG_4316.jpg",
    alt: "Dining Area",
    label: "Brewhouse & Grill"
  },
  {
    url: "/images/venue/IMG_4317.jpg",
    alt: "Garden Lounge",
    label: "Garden Atmosphere"
  },
  {
    url: "/images/venue/IMG_7636_(1).jpg",
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
    image: '/images/events/IMG_9614.PNG',
    description: 'A proper Sunday Feast. Slow-roasted meats, giant yorkshire puddings, roast potatoes and seasonal veg. Served all day Sunday until sold out.'
  },
  { 
    id: 'e3', 
    name: 'Marquee Private Hire', 
    category: 'private', 
    tag: 'CORPORATE', 
    image: '/images/events/IMG_8872.JPG',
    description: 'Test your knowledge and win big prizes. Our weekly quiz night is the perfect excuse for a midweek pint.'
  }
];

const FOOD_DRINK: FeatureItem[] = [
  { 
    id: 'f1', 
    name: 'Fizzy Burger', 
    category: 'Fire Grill', 
    tag: 'Food Menu', 
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
    description: 'Our legendary house burger. Double smashed beef patty, smoked bacon, american cheese, and our secret Fizzy sauce. Served with rosemary fries.'
  },
  { 
    id: 'f2', 
    name: 'King Sadhu Session IPA', 
    category: 'Craft Ales', 
    tag: 'DRINK', 
    image: '/images/venue/IMG_7116.jpg',
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

/**
 * Checks if an event date/time has passed based on UK London timezone
 * @param monthName - Full month name (e.g., "January", "February")
 * @param dateStr - Date string (e.g., "Fri 2nd", "Sat 3rd")
 * @param timeStr - Time string (e.g., "9:00 PM", "8:00 PM - Late")
 * @returns true if event is in the future, false if it has passed
 */
const isEventInFuture = (monthName: string, dateStr: string, timeStr: string): boolean => {
  try {
    // Get current date/time in UK London timezone
    const now = new Date();
    const londonFormatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false
    });
    
    const londonParts = londonFormatter.formatToParts(now);
    const londonDate: { [key: string]: number } = {};
    londonParts.forEach(part => {
      if (part.type !== 'literal') {
        londonDate[part.type] = parseInt(part.value, 10);
      }
    });
    
    // Extract day number from date string (e.g., "Fri 2nd" -> 2)
    const dayMatch = dateStr.match(/(\d+)(st|nd|rd|th)/);
    if (!dayMatch) return true; // If we can't parse, show it to be safe
    
    const day = parseInt(dayMatch[1], 10);
    
    // Map month name to month number (1-indexed for comparison)
    const monthMap: { [key: string]: number } = {
      'January': 1, 'February': 2, 'March': 3, 'April': 4,
      'May': 5, 'June': 6, 'July': 7, 'August': 8,
      'September': 9, 'October': 10, 'November': 11, 'December': 12
    };
    
    const eventMonth = monthMap[monthName];
    if (eventMonth === undefined) return true; // If month not found, show it to be safe
    
    const currentYear = londonDate.year || now.getFullYear();
    const currentMonth = londonDate.month || (now.getMonth() + 1);
    const currentDay = londonDate.day || now.getDate();
    const currentHours = londonDate.hour || now.getHours();
    const currentMinutes = londonDate.minute || now.getMinutes();
    
    // Determine year - assume current year, or next year if month/day has passed
    let year = currentYear;
    
    // If event month is before current month, it's next year
    if (eventMonth < currentMonth) {
      year = currentYear + 1;
    } 
    // If event month is same but day is before current day, it's PAST (not next year)
    else if (eventMonth === currentMonth && day < currentDay) {
      return false; // Event is in the past, filter it out
    } 
    // If event month is same, day is same, check time
    else if (eventMonth === currentMonth && day === currentDay) {
      // Parse time string (e.g., "9:00 PM" or "8:00 PM - Late")
      const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (!timeMatch) {
        // If no time found, assume event is at end of day (23:59)
        // If it's the same day and we're past 23:59, it's past
        if (currentHours >= 23 && currentMinutes >= 59) {
          return false;
        }
        return true;
      }
      
      let eventHours = parseInt(timeMatch[1], 10);
      const eventMinutes = parseInt(timeMatch[2], 10);
      const ampm = timeMatch[3].toUpperCase();
      
      // Convert to 24-hour format
      if (ampm === 'PM' && eventHours !== 12) {
        eventHours += 12;
      } else if (ampm === 'AM' && eventHours === 12) {
        eventHours = 0;
      }
      
      // Compare times on the same day
      if (eventHours < currentHours || (eventHours === currentHours && eventMinutes <= currentMinutes)) {
        return false; // Event time has passed
      }
      return true; // Event time is in the future today
    }
    
    // Parse time string (e.g., "9:00 PM" or "8:00 PM - Late")
    const timeMatch = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
    if (!timeMatch) {
      // If no time found, assume event is at end of day (23:59)
      // Compare date components directly
      if (year > currentYear) return true;
      if (year < currentYear) return false;
      if (eventMonth > currentMonth) return true;
      if (eventMonth < currentMonth) return false;
      if (day > currentDay) return true;
      if (day < currentDay) return false;
      // Same day - if current time is past 23:59, event has passed
      return !(currentHours >= 23 && currentMinutes >= 59);
    }
    
    let eventHours = parseInt(timeMatch[1], 10);
    const eventMinutes = parseInt(timeMatch[2], 10);
    const ampm = timeMatch[3].toUpperCase();
    
    // Convert to 24-hour format
    if (ampm === 'PM' && eventHours !== 12) {
      eventHours += 12;
    } else if (ampm === 'AM' && eventHours === 12) {
      eventHours = 0;
    }
    
    // Compare date/time components directly (all in London timezone)
    if (year > currentYear) return true;
    if (year < currentYear) return false;
    if (eventMonth > currentMonth) return true;
    if (eventMonth < currentMonth) return false;
    if (day > currentDay) return true;
    if (day < currentDay) return false;
    // Same day - compare time
    if (eventHours > currentHours) return true;
    if (eventHours < currentHours) return false;
    // Same hour - compare minutes
    return eventMinutes > currentMinutes;
  } catch (error) {
    // If parsing fails, show the event to be safe
    console.error('Error parsing event date:', error);
    return true;
  }
};

/**
 * Filters out past events from the music schedule
 */
const getFilteredMusicSchedule = () => {
  return MUSIC_SCHEDULE.map(month => ({
    ...month,
    events: month.events.filter(event => 
      isEventInFuture(month.month, event.date, event.time)
    )
  })).filter(month => month.events.length > 0); // Remove months with no events
};

// Helper function to get featured/upcoming event from MUSIC_SCHEDULE for promotional modal
const getFeaturedEventFromSchedule = () => {
  const filteredSchedule = getFilteredMusicSchedule();
  // Try to find a featured/highlighted event first
  for (const month of filteredSchedule) {
    const featuredEvent = month.events.find(event => event.highlight || event.special);
    if (featuredEvent) {
      return featuredEvent;
    }
  }
  // Fallback to first event in first month
  if (filteredSchedule.length > 0 && filteredSchedule[0].events.length > 0) {
    return filteredSchedule[0].events[0];
  }
  return null;
};

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
  const [showSundayRoastModal, setShowSundayRoastModal] = useState(false);
  const [showLiveMusicModal, setShowLiveMusicModal] = useState(false);
  const [showFoodMenuModal, setShowFoodMenuModal] = useState(false);
  
  const modalScrollRef = useRef<HTMLDivElement>(null);
  const promoModalScrollRef = useRef<HTMLDivElement>(null);
  const [activeMonth, setActiveMonth] = useState(0);
  const [promoActiveMonth, setPromoActiveMonth] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [isPromoAutoScrolling, setIsPromoAutoScrolling] = useState(false);
  
  const [scrolled, setScrolled] = useState(false);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [isPageReady, setIsPageReady] = useState(false);
  
  // OPTIMIZATION: Detect mobile devices (Android & iPhone) for performance optimizations
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
                            window.innerWidth < 768 ||
                            ('ontouchstart' in window);
      setIsMobile(isMobileDevice);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Get filtered music schedule (past events removed)
  const filteredMusicSchedule = getFilteredMusicSchedule();
  
  // Get featured event for promotional modal
  const featuredEvent = getFeaturedEventFromSchedule();

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
      // OPTIMIZATION: Single RAF instead of nested double RAF for faster page ready
      requestAnimationFrame(() => {
        setIsPageReady(true);
      });
    };

    // Wait for page to be ready before showing content and scrolling
    const checkPageReady = () => {
      // OPTIMIZATION: Single RAF instead of nested double RAF for faster page ready
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

  // OPTIMIZATION: Throttled scroll handler for better performance on mobile
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedFeature && !showSundayRoastModal && !showLiveMusicModal && !showFoodMenuModal) return;
      if (e.key === 'ArrowLeft' && !selectedEvent && !showSundayRoastModal && !showLiveMusicModal && !showFoodMenuModal) navigateFeature('prev');
      if (e.key === 'ArrowRight' && !selectedEvent && !showSundayRoastModal && !showLiveMusicModal && !showFoodMenuModal) navigateFeature('next');
      if (e.key === 'Escape') {
        if (selectedEvent) setSelectedEvent(null);
        else if (selectedFeature) setSelectedFeature(null);
        else if (showSundayRoastModal) setShowSundayRoastModal(false);
        else if (showLiveMusicModal) setShowLiveMusicModal(false);
        else if (showFoodMenuModal) setShowFoodMenuModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFeature, selectedEvent, showSundayRoastModal, showLiveMusicModal, showFoodMenuModal]);

  // Reset promo modal active month when it opens
  useEffect(() => {
    if (showLiveMusicModal) {
      setPromoActiveMonth(0);
      if (promoModalScrollRef.current) {
        promoModalScrollRef.current.scrollTo({ top: 0, behavior: 'auto' });
      }
    }
  }, [showLiveMusicModal]);

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

  const scrollToMonthPromo = (index: number) => {
    if (promoModalScrollRef.current) {
      setIsPromoAutoScrolling(true);
      const element = document.getElementById(`promo-month-section-${index}`);
      if (element) {
        const headerOffset = 90; 
        const top = element.offsetTop - headerOffset;
        promoModalScrollRef.current.scrollTo({
          top: Math.max(0, top),
          behavior: 'smooth'
        });
        setPromoActiveMonth(index);
        
        setTimeout(() => {
           setIsPromoAutoScrolling(false);
        }, 800);
      }
    }
  };

  const handleModalScroll = () => {
    if (isAutoScrolling) return;

    if (modalScrollRef.current) {
       const sections = filteredMusicSchedule.map((_, i) => document.getElementById(`month-section-${i}`));
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

  const handlePromoModalScroll = () => {
    if (isPromoAutoScrolling) return;

    if (promoModalScrollRef.current) {
       const sections = filteredMusicSchedule.map((_, i) => document.getElementById(`promo-month-section-${i}`));
       const scrollPosition = promoModalScrollRef.current.scrollTop;
       const triggerPoint = scrollPosition + 120;
  
       let currentIndex = 0;
       sections.forEach((section, index) => {
          if (section && section.offsetTop <= triggerPoint) {
             currentIndex = index;
          }
       });
       setPromoActiveMonth(currentIndex);
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
    <div className="relative min-h-screen text-white selection:bg-[#f78e2c] selection:text-black cursor-auto md:cursor-none overflow-x-hidden font-sans">
      <CustomCursor />
      
      {/* Promotional Modal */}
      <PromoModal config={PROMO_CONFIG} />
      
      {/* Optimized Background */}
      <FluidBackground />
      
      {/* Navigation - Z-50 (Highest) - OPTIMIZATION: Reduced backdrop-blur on mobile */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? `py-4 bg-[#0b1219]/90 ${isMobile ? 'backdrop-blur-md' : 'backdrop-blur-xl'} border-b border-white/10 shadow-lg pointer-events-auto` 
            : 'py-6 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-8 max-w-[1920px] mx-auto w-full">
          {/* Logo - Left */}
          <div className="pointer-events-auto z-50 flex-shrink-0 max-w-[200px] md:max-w-[240px]">
            <FizzyLogo 
              className={`w-auto max-w-full object-contain cursor-pointer transition-all duration-300 text-white ${scrolled ? 'h-10 md:h-12' : 'h-12 md:h-16'}`}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
          </div>
          
          {/* Desktop Menu - Center - OPTIMIZATION: Reduced backdrop-blur on mobile */}
          <div className="hidden md:flex flex-1 justify-center pointer-events-auto">
            <div className={`flex bg-[#15222e]/50 ${isMobile ? 'backdrop-blur-md' : 'backdrop-blur-xl'} border border-white/10 p-1.5 rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] gap-1 ring-1 ring-white/5`}>
              {navItems.map((item) => (
                <button 
                  key={item} 
                  onClick={() => scrollToSection(getSectionId(item))}
                  className="px-5 py-2.5 rounded-full text-white/90 font-medium text-xs font-heading uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all duration-300 border border-transparent hover:border-white/10 active:scale-95"
                  data-hover="true"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* Book Now - Right */}
          <div className="flex items-center gap-3 pointer-events-auto flex-shrink-0">
            {/* Desktop Book Now */}
            <button
              onClick={handleBooking}
              className="hidden md:flex items-center gap-2 bg-[#f78e2c] text-black px-6 py-3 rounded-full font-bold font-heading text-xs tracking-widest hover:bg-white hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(247,142,44,0.4)] border border-[#f78e2c]"
              data-hover="true"
            >
              <Calendar className="w-4 h-4" />
              <span>BOOK NOW</span>
            </button>

            {/* Mobile Book Button */}
            <button
              onClick={handleBooking}
              className="md:hidden flex items-center gap-2 bg-[#f78e2c] text-black px-4 py-2.5 rounded-full font-bold font-heading text-[10px] tracking-widest hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(247,142,44,0.4)] border border-[#f78e2c]"
              data-hover="true"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>BOOK</span>
            </button>
          </div>
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
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#0b1219]" />
          <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
        </div>
        
        {/* Bubbles - Restored to Background */}
        <div className="absolute inset-0 z-0 pointer-events-none mix-blend-screen opacity-60">
           <Bubbles />
        </div>

        {/* Hero Content */}
        <motion.div 
          style={{ y, opacity }}
          className="z-10 text-center flex flex-col items-center w-full max-w-6xl pb-32 md:pb-24 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: isPageReady ? 1 : 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Welcome Tag */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: isPageReady ? 1 : 0, y: isPageReady ? 0 : 8 }}
            transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
            className="absolute top-20 md:top-24 flex items-center gap-2 md:gap-3 text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase bg-black/60 px-4 md:px-6 py-1.5 md:py-2 rounded-full backdrop-blur-md border border-white/10 shadow-lg whitespace-nowrap"
          >
            <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 shrink-0" />
            <span className="text-[#f78e2c]">Leamington Spa</span>
          </motion.div>

          {/* Main Title Block */}
          <div className="relative w-full flex justify-center items-center flex-col mb-4">
             {/* FIZZY MOON - Keep branding but make it cleaner */}
             <motion.img 
               src="/images/logo/fizzy_moon_white_final.png"
               alt="Fizzy Moon"
               className="w-[65%] md:w-[45%] max-w-4xl min-w-[280px] h-auto object-contain drop-shadow-2xl mb-2"
               initial={{ opacity: 0, scale: 0.98 }}
               animate={{ opacity: isPageReady ? 1 : 0, scale: isPageReady ? 1 : 0.98 }}
               transition={{ duration: 1.4, delay: 0.3, ease: "easeInOut" }}
               style={{ display: isPageReady ? 'block' : 'none', visibility: isPageReady ? 'visible' : 'hidden' }}
             />
             {/* Descriptive Subtitle - Crucial for context */}
             <motion.h2 
               initial={{ opacity: 0 }}
               animate={{ opacity: isPageReady ? 1 : 0 }}
               transition={{ duration: 1, delay: 0.7, ease: "easeInOut" }}
               className="text-2xl md:text-4xl font-elegant italic text-[#f78e2c] mt-2 tracking-wide text-center"
             >
               Where bubbles never stop flowing
             </motion.h2>
          </div>
          
          <motion.div
             initial={{ scaleX: 0, opacity: 0 }}
             animate={{ scaleX: isPageReady ? 1 : 0, opacity: isPageReady ? 1 : 0 }}
             transition={{ duration: 1.5, delay: 0.9, ease: "easeInOut" }}
             className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-[#f78e2c]/80 to-transparent mb-8"
          />

          {/* PRIMARY CALLS TO ACTION - Immediate Visibility */}
          <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl px-4 isolate">
             <motion.button
               onClick={handleBooking}
               initial={{ opacity: 0, y: 8 }}
               animate={{ opacity: isPageReady ? 1 : 0, y: isPageReady ? 0 : 8 }}
               transition={{ duration: 1, delay: 1.1, ease: "easeInOut" }}
               className="flex-1 py-4 rounded-xl bg-[#f78e2c] text-black font-bold text-sm md:text-base tracking-widest uppercase hover:bg-white transition-all duration-300 shadow-[0_0_30px_rgba(247,142,44,0.3)] flex items-center justify-center gap-2"
               style={{ backgroundColor: '#f78e2c' }}
             >
               <Calendar className="w-4 h-4 md:w-5 md:h-5" /> Book A Table
             </motion.button>
             
             <div className="flex gap-4 flex-1">
                <motion.button
                  onClick={() => setShowSundayRoastModal(true)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: isPageReady ? 1 : 0, y: isPageReady ? 0 : 8 }}
                  transition={{ duration: 1, delay: 1.25, ease: "easeInOut" }}
                  className="flex-1 py-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white font-bold text-xs md:text-sm tracking-widest uppercase hover:bg-white/10 hover:border-[#f78e2c] transition-all flex flex-row items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 ml-1">
                    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/>
                    <path d="M7 2v20"/>
                    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
                  </svg>
                  <span>Sunday Roast</span>
                </motion.button>
                <motion.button
                  onClick={() => setShowLiveMusicModal(true)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: isPageReady ? 1 : 0, y: isPageReady ? 0 : 8 }}
                  transition={{ duration: 1, delay: 1.4, ease: "easeInOut" }}
                  className="flex-1 py-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white font-bold text-xs md:text-sm tracking-widest uppercase hover:bg-white/10 hover:border-[#f78e2c] transition-all flex items-center justify-center gap-2"
                >
                  <Music className="w-4 h-4" /> Live Music
                </motion.button>
             </div>
          </div>
        </motion.div>

        {/* MARQUEE - Shifted to bottom */}
        <div className="absolute bottom-0 left-0 w-full py-3 bg-[#f78e2c] text-black z-20 overflow-hidden border-t-4 border-black shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
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
      <section id="bookings" className="relative z-10 py-20 md:py-32 px-4 md:px-6 bg-gradient-to-b from-[#0b1219] to-[#15222e] border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 md:mb-20">
             <h2 className="text-5xl md:text-9xl font-heading font-bold opacity-10 text-white leading-none">
               RESERVE
             </h2>
             <div className="relative -mt-6 md:-mt-16 z-10">
               <p className="text-3xl md:text-5xl font-elegant italic text-white mb-2">Secure your spot</p>
               <p className="text-[#f78e2c] font-mono uppercase tracking-widest text-sm md:text-base">
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
                accent: 'bg-gradient-to-br from-[#f78e2c]/20 to-black border-[#f78e2c]/60 hover:border-[#f78e2c] shadow-[0_0_30px_rgba(247,142,44,0.1)]', 
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
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="text-2xl md:text-3xl font-booking-header font-bold text-white leading-none uppercase">{ticket.name}</h3>
                       {ticket.color === 'gold' && <Crown className="text-[#f78e2c] w-6 h-6 animate-pulse" />}
                    </div>
                    <p className={`text-sm font-bold uppercase tracking-widest mb-6 ${ticket.color === 'gold' ? 'text-[#f78e2c]' : ticket.color === 'pink' ? 'text-red-500' : ticket.color === 'purple' ? 'text-purple-500' : 'text-cyan-500'}`}>
                      {ticket.subtitle}
                    </p>
                    
                    <p className="text-gray-300 mb-8 leading-relaxed font-light text-lg">{ticket.desc}</p>
                    
                    <div className="h-px w-full bg-white/10 mb-8" />

                    <ul className="space-y-5 text-sm text-gray-200">
                      {ticket.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-4">
                          <div className={`p-2 rounded-full bg-white/5`}>
                             <feature.icon className={`w-4 h-4 ${ticket.color === 'gold' ? 'text-[#f78e2c]' : ticket.color === 'pink' ? 'text-red-500' : ticket.color === 'purple' ? 'text-purple-500' : 'text-cyan-500'}`} /> 
                          </div>
                          {feature.text}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <button 
                    onClick={handleBooking}
                    className={`w-full py-4 text-sm font-bold uppercase tracking-[0.2em] border transition-all duration-300 mt-8 rounded-xl
                      ${ticket.color === 'gold' ? 'bg-[#f78e2c] text-black border-[#f78e2c] hover:bg-white hover:border-white' : 'border-white/20 text-white hover:bg-white hover:text-black'}
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
      <section id="whats-on" className="relative z-10 py-20 md:py-32 bg-[#15222e] border-t border-white/5">
         <div className="max-w-[1600px] mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center mb-16">
              <span className="text-[#f78e2c] font-mono text-sm tracking-[0.3em] uppercase mb-4">Live & Loud</span>
              <h2 className="text-5xl md:text-8xl font-heading font-bold uppercase text-center">
                What's <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f78e2c] to-[#fbbf24]">On</span>
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-white/10 bg-black/20 backdrop-blur-sm">
              {EVENTS.map((feature) => (
                <ArtistCard key={feature.id} artist={feature} onClick={() => feature.id === 'e2' ? setShowSundayRoastModal(true) : setSelectedFeature(feature)} />
              ))}
            </div>
         </div>
      </section>

      {/* MERGED SECTION */}
      <section id="eat-drink" className="relative z-10 py-24 md:py-32 bg-[#0b1219] border-t border-white/10">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-16 px-4">
             <div>
               <div className="flex items-center gap-4 mb-6">
                  <span className="text-[#f78e2c] font-mono text-sm tracking-[0.3em] uppercase">Taste Makers</span>
                  <div className="h-px w-12 bg-[#f78e2c]/50" />
               </div>
               <h2 className="text-5xl md:text-7xl font-heading font-bold uppercase leading-none mb-6">
                 More Than <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f78e2c] to-[#fbbf24]">A Pub</span>
               </h2>
               <p className="text-lg text-gray-300 font-light leading-relaxed max-w-xl mb-8">
                 Fizzy Moon is an extension of your night out. A place where the drinks are crafted in-house, the food is fire-kissed, and the music never stops.
               </p>
               <div className="flex flex-wrap gap-8 border-t border-white/10 pt-6">
                  {[
                    { icon: Beer, label: "Home Brews" },
                    { icon: Flame, label: "Fire Grill" },
                    { icon: Music, label: "Live Music" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-white/80 group">
                      <div className="p-2 rounded-full bg-white/5 group-hover:bg-[#f78e2c] transition-colors duration-300">
                        <item.icon className="w-4 h-4 text-[#f78e2c] group-hover:text-black transition-colors duration-300" />
                      </div>
                      <span className="font-bold uppercase text-xs tracking-widest">{item.label}</span>
                    </div>
                  ))}
               </div>
             </div>

             <div className="flex justify-start lg:justify-end pb-2">
                <button 
                  onClick={handleBooking}
                  className="group relative px-8 py-4 bg-white/5 border border-white/20 text-white font-bold tracking-[0.2em] uppercase transition-all duration-300 hover:bg-[#f78e2c] hover:border-[#f78e2c] hover:text-black overflow-hidden rounded-full"
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
              <ArtistCard key={feature.id} artist={feature} onClick={() => feature.id === 'f1' ? setShowFoodMenuModal(true) : setSelectedFeature(feature)} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="relative z-10 py-24 bg-[#080d11] border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase mb-4">
                      Common <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f78e2c] to-[#fbbf24]">Questions</span>
                  </h2>
                  <p className="text-gray-400">Everything you need to know before you go.</p>
              </div>
              <FAQAccordion />
          </div>
      </section>

      <footer id="contact" className={`relative z-10 border-t border-white/10 py-12 md:py-16 bg-[#0b1219]/80 ${isMobile ? 'backdrop-blur-md' : 'backdrop-blur-xl'}`}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
             <div className="mb-6">
               <img 
                 src="/images/logo/fizzy_moon_white_final.png" 
                 alt="Fizzy Moon" 
                 className="h-12 md:h-14 w-auto object-contain"
               />
             </div>
             <div className="flex gap-2 text-xs font-mono text-gray-400">
               <span>35 Regent St, Leamington Spa CV32 5EE</span>
             </div>
          </div>
          
          <div className="flex gap-6 md:gap-8 flex-wrap">
            <a href="#" className="text-gray-400 hover:text-white font-bold uppercase text-xs tracking-widest transition-colors cursor-pointer" data-hover="true">
              Instagram
            </a>
            <a href="#" className="text-gray-400 hover:text-white font-bold uppercase text-xs tracking-widest transition-colors cursor-pointer" data-hover="true">
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
            className={`fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-6 bg-black/90 ${isMobile ? 'backdrop-blur-md' : 'backdrop-blur-xl'} cursor-auto`}
          >
          <motion.div
            initial={{ y: '100%', opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl bg-[#15222e] border-t md:border border-white/10 overflow-hidden flex flex-col shadow-2xl shadow-[#f78e2c]/10 group/modal h-[90dvh] md:h-[85vh] rounded-t-3xl md:rounded-3xl"
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
                        className="w-full h-[180px] md:h-[220px] relative shrink-0 group/image"
                    >
                        <img 
                          src={selectedFeature.image} 
                          alt={selectedFeature.name} 
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-[#15222e]/95 via-[#15222e]/20 to-transparent" />

                        {/* MUSIC Tag - Top Left */}
                        <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20 flex items-center gap-2 text-[#f78e2c]">
                          <Calendar className="w-5 h-5 md:w-6 md:h-6" />
                          <span className="font-mono text-sm md:text-base tracking-widest uppercase font-bold">{selectedFeature.tag}</span>
                        </div>

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

                        <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end items-start z-10 pb-4 md:pb-6">
                           <h3 className="text-3xl md:text-5xl font-heading font-black uppercase leading-none text-white mb-1 tracking-tighter shadow-black drop-shadow-lg">
                              {selectedFeature.name}
                           </h3>
                           <p className="text-base md:text-xl text-[#fbbf24] font-medium tracking-widest uppercase">
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
                 className="flex-1 overflow-y-auto bg-[#15222e] relative"
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
                            <div className={`sticky top-0 z-40 bg-[#15222e]/95 ${isMobile ? 'backdrop-blur-md' : 'backdrop-blur-xl'} border-b border-white/10 p-4`}>
                                <button 
                                    onClick={() => setSelectedEvent(null)}
                                    className="flex items-center gap-2 text-white/70 hover:text-[#f78e2c] transition-colors font-mono uppercase text-xs tracking-widest"
                                >
                                    <ArrowLeft className="w-4 h-4" /> Back to Calendar
                                </button>
                            </div>

                            {/* Artist Hero Image */}
                            <div className="relative w-full aspect-video md:aspect-[21/9] shrink-0 overflow-hidden">
                                <img src={selectedEvent.image} alt={selectedEvent.act} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#15222e] to-transparent" />
                                <div className="absolute bottom-0 left-0 p-6 md:p-8">
                                    <div className="inline-block px-3 py-1 bg-[#f78e2c] text-black font-bold text-[10px] tracking-widest uppercase mb-2 rounded">
                                        {selectedEvent.genre}
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase text-white leading-none mb-1">
                                        {selectedEvent.act}
                                    </h2>
                                    <p className="text-xl text-gray-300 font-medium">
                                        {selectedEvent.date} @ {selectedEvent.time}
                                    </p>
                                </div>
                            </div>

                            {/* Artist Info */}
                            <div className="p-6 md:p-8 max-w-3xl">
                                <h4 className="text-[#f78e2c] font-mono text-sm uppercase tracking-widest mb-4">About The Artist</h4>
                                <p className="text-gray-300 text-lg leading-relaxed font-light mb-8">
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
                                    className="w-full py-5 rounded-xl bg-[#f78e2c] text-black font-bold font-heading uppercase tracking-widest hover:bg-white hover:scale-[1.01] transition-all shadow-lg shadow-[#f78e2c]/20"
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
                            className="max-w-4xl mx-auto p-5 md:p-8 pt-3 md:pt-4"
                        >
                            {selectedFeature.id === 'e1' ? (
                               <>
                                 {/* Month Navigation */}
                                 <div className="sticky top-0 z-30 py-2 mb-4 -mx-5 px-5 md:-mx-8 md:px-8 bg-[#15222e]/95 backdrop-blur-sm border-b border-white/5 flex justify-start overflow-x-auto no-scrollbar">
                                     <div className={`relative flex items-center bg-white/5 ${isMobile ? 'backdrop-blur-md' : 'backdrop-blur-xl'} border border-white/10 rounded-full p-1 shadow-2xl`}>
                                         {MUSIC_SCHEDULE.map((month, idx) => {
                                             const isActive = activeMonth === idx;
                                             return (
                                                 <button
                                                     key={idx}
                                                     onClick={() => scrollToMonth(idx)}
                                                     className={`relative px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors duration-300 z-10 shrink-0 ${isActive ? 'text-black' : 'text-gray-400 hover:text-white'}`}
                                                 >
                                                     {isActive && (
                                                         <motion.div
                                                             layoutId="activePill"
                                                             className="absolute inset-0 bg-[#f78e2c] rounded-full -z-10"
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
                                  {filteredMusicSchedule.map((month, idx) => (
                                     <div key={idx} id={`month-section-${idx}`} className="relative scroll-mt-32">
                                       <div className="flex items-center gap-4 mb-6">
                                         <h5 className="text-4xl md:text-5xl font-heading font-black uppercase text-white/5 tracking-tighter">
                                           {month.month}
                                         </h5>
                                         <div className="h-px flex-1 bg-gradient-to-r from-[#f78e2c]/30 to-transparent" />
                                       </div>

                                       <div className="grid gap-3">
                                         {month.events.map((event, i) => (
                                           <div 
                                              key={i} 
                                              onClick={() => setSelectedEvent(event)} // Open Detail View
                                              className={`cursor-pointer relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 group/item overflow-hidden ${event.special ? 'bg-gradient-to-r from-[#f78e2c]/10 to-transparent border-[#f78e2c]/40' : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'}`}
                                           >
                                              {/* Date Box */}
                                              <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-black/40 border border-white/10 shrink-0 backdrop-blur-sm group-hover/item:border-[#f78e2c]/50 transition-colors">
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
                                                     {event.special && <span className="text-[10px] bg-[#f78e2c] text-black px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Special</span>}
                                                     {event.note && <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{event.note}</span>}
                                                </div>
                                                <h4 className={`text-lg md:text-xl font-heading font-bold uppercase truncate pr-4 ${event.special ? 'text-[#f78e2c]' : 'text-white'}`}>
                                                  {event.act}
                                                </h4>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <span className="text-xs text-gray-400 group-hover/item:text-[#f78e2c] transition-colors uppercase tracking-wider font-medium">
                                                      {event.genre || 'Live Music'}
                                                    </span>
                                                </div>
                                              </div>
                                              
                                              {/* Arrow */}
                                              <div className="px-2 opacity-50 group-hover/item:opacity-100 transition-all -translate-x-2 group-hover/item:translate-x-0 duration-300 text-[#f78e2c]">
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
                            ) : (
                              // Default View for other features (Food/Quiz)
                              <div className="pb-24">
                                <button onClick={handleBooking} className="w-full py-6 rounded-2xl bg-[#f78e2c] text-black font-bold uppercase tracking-widest hover:bg-white transition-colors">Book Now</button>
                                
                                {/* King Sadhu Story Section */}
                                {selectedFeature.id === 'f2' && (
                                  <div className="mt-8 md:mt-12">
                                    <div className="max-w-3xl mx-auto space-y-4 md:space-y-6 text-gray-300 leading-relaxed">
                                      <h3 className="text-xl md:text-3xl font-heading font-bold text-white mb-3 md:mb-2 uppercase tracking-tight">
                                        The Story Behind Sadhu Singh & King Sadhu
                                      </h3>
                                      
                                      <p className="text-sm md:text-lg leading-relaxed">
                                        If you've spent time at Fizzy Moon Brewhouse, you may have noticed our Session IPA, Sadhu Singh.
                                      </p>
                                      
                                      <p className="text-sm md:text-lg leading-relaxed">
                                        What many guests don't know is that the name and artwork are a tribute to the owner's late father, who sadly passed away. Without him, Fizzy Moon would not exist.
                                      </p>
                                      
                                      <p className="text-sm md:text-lg leading-relaxed">
                                        The best way to honour his name and keep his legacy alive felt simple — by creating something lasting, shared, and enjoyed by others.
                                        That's how Sadhu Singh IPA was born this year.
                                      </p>
                                      
                                      <p className="text-sm md:text-lg leading-relaxed">
                                        Building on that tribute, over the past year we've also introduced King Sadhu — a hazy, citrus-forward Session IPA, created as a direct evolution of the original and a further nod to his name.
                                      </p>
                                      
                                      <p className="text-sm md:text-lg leading-relaxed">
                                        King Sadhu is light, refreshing, and highly drinkable, with a soft haze and bright citrus character. It's often compared to beers like Neck Oil, offering that same easygoing session style while still delivering flavour.
                                      </p>
                                      
                                      <p className="text-sm md:text-lg font-medium text-white leading-relaxed">
                                        Both Sadhu Singh and King Sadhu Session IPA are exclusive to Fizzy Moon and available only here.
                                      </p>
                                      
                                      <p className="text-sm md:text-lg leading-relaxed">
                                        Next time you visit, try one — or both — and enjoy a beer that carries real meaning behind every pour.
                                      </p>
                                    </div>
                                  </div>
                                )}
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

      {/* Sunday Roast Promotional Modal */}
      <AnimatePresence>
        {showSundayRoastModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSundayRoastModal(false)}
              className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Content - Better mobile positioning */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-0 z-[71] flex items-end md:items-center justify-center p-0 md:p-8 pointer-events-none"
            >
              <div 
                className="relative max-w-5xl w-full h-[95vh] md:h-[90vh] max-h-[95vh] md:max-h-[90vh] pointer-events-auto rounded-t-3xl md:rounded-3xl overflow-hidden border-t-4 md:border-4 border-[#1e3a5f] shadow-2xl group"
                style={{ 
                  backgroundColor: '#f78e2c'
                }}
              >
                {/* Close Button - Better mobile positioning */}
                <button
                  onClick={() => setShowSundayRoastModal(false)}
                  className="absolute top-2 right-2 md:top-3 md:right-3 z-50 p-2.5 md:p-2 rounded-full bg-black/80 text-white hover:bg-white hover:text-black transition-colors border border-white/20 backdrop-blur-md touch-manipulation"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 md:w-5 md:h-5" />
                </button>

                {/* 25% Off Gift Badge - Top Right Corner - Smaller on mobile */}
                <div className="absolute top-0 right-0 z-40 transform rotate-12 origin-top-right scale-75 md:scale-100">
                  <div className="bg-gradient-to-br from-yellow-300 to-yellow-500 border-2 border-black shadow-2xl rounded-lg p-1.5 md:p-3 relative">
                    <div className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-black rounded-full"></div>
                    <div className="text-center">
                      <div className="text-base md:text-2xl font-black text-black leading-none">25%</div>
                      <div className="text-[7px] md:text-[10px] font-bold text-black uppercase tracking-tight">OFF</div>
                      <div className="text-[6px] md:text-[9px] text-black/90 font-semibold mt-0.5">Online Only</div>
                    </div>
                  </div>
                </div>

                {/* Navigation Arrows */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSundayRoastModal(false);
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-50 p-2 md:p-3 rounded-full bg-black/70 text-white hover:bg-white hover:text-black transition-colors border border-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100 md:opacity-100"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSundayRoastModal(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-50 p-2 md:p-3 rounded-full bg-black/70 text-white hover:bg-white hover:text-black transition-colors border border-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100 md:opacity-100"
                  aria-label="Next"
                >
                  <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
                </button>

                {/* Content Container */}
                <div className="relative w-full h-full overflow-y-auto overscroll-contain">
                  <div className="p-4 md:p-8 lg:p-10 pt-6 md:pt-8">
                    {/* Title Section - Better mobile spacing */}
                    <div className="mb-4 md:mb-6 mt-2 md:mt-0">
                      <div className="bg-black px-4 py-2.5 md:px-8 md:py-4 inline-block">
                        <h2 className="text-2xl md:text-5xl lg:text-6xl font-heading font-bold uppercase text-white leading-tight">
                          SUNDAY ROAST
                        </h2>
                      </div>
                    </div>

                    {/* Description - Better mobile text */}
                    <p className="text-black text-xs md:text-base font-medium mb-5 md:mb-8 leading-relaxed max-w-3xl">
                      All of our roasts are served with roast potatoes, bowl of seasonal vegetables, honey roasted parsnips, pigs in blankets Yorkshire pudding and traditional gravy
                    </p>

                    {/* Menu Items Grid - Better mobile spacing */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 mb-5 md:mb-8">
                      {/* Classic Rump Roast */}
                      <div className="bg-white rounded-lg p-3.5 md:p-5 border-2 border-black/30 shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                          <h3 className="text-base md:text-xl font-bold text-black uppercase leading-tight sm:pr-3 flex-1">
                            CLASSIC RUMP ROAST
                          </h3>
                          <span className="text-lg md:text-2xl font-black text-black whitespace-nowrap self-start sm:self-auto">£21.00</span>
                        </div>
                        <p className="text-xs md:text-base text-black/70">With sage and onion stuffing</p>
                      </div>

                      {/* Roast Pork Belly */}
                      <div className="bg-white rounded-lg p-3.5 md:p-5 border-2 border-black/30 shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                          <h3 className="text-base md:text-xl font-bold text-black uppercase leading-tight sm:pr-3 flex-1">
                            ROAST PORK BELLY
                          </h3>
                          <span className="text-lg md:text-2xl font-black text-black whitespace-nowrap self-start sm:self-auto">£19.00</span>
                        </div>
                        <p className="text-xs md:text-base text-black/70">With sage and onion stuffing and crackling</p>
                      </div>

                      {/* Succulent Half Roast Chicken */}
                      <div className="bg-white rounded-lg p-3.5 md:p-5 border-2 border-black/30 shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                          <h3 className="text-base md:text-xl font-bold text-black uppercase leading-tight sm:pr-3 flex-1">
                            SUCCULENT HALF ROAST CHICKEN
                          </h3>
                          <span className="text-lg md:text-2xl font-black text-black whitespace-nowrap self-start sm:self-auto">£19.00</span>
                        </div>
                        <p className="text-xs md:text-base text-black/70">With sage and onion stuffing</p>
                      </div>

                      {/* Nut Roast */}
                      <div className="bg-white rounded-lg p-3.5 md:p-5 border-2 border-black/30 shadow-md hover:shadow-lg transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                          <h3 className="text-base md:text-xl font-bold text-black uppercase leading-tight sm:pr-3 flex-1">
                            NUT ROAST <span className="text-xs md:text-sm font-normal">(V)</span>
                          </h3>
                          <span className="text-lg md:text-2xl font-black text-black whitespace-nowrap self-start sm:self-auto">£18.00</span>
                        </div>
                        <p className="text-xs md:text-base text-black/70">With traditional vegetarian gravy</p>
                      </div>

                      {/* Sharing Trio - Full Width */}
                      <div className="bg-white rounded-lg p-3.5 md:p-5 border-2 border-black/30 shadow-md hover:shadow-lg transition-shadow md:col-span-2">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                          <h3 className="text-base md:text-xl font-bold text-black uppercase leading-tight sm:pr-3 flex-1">
                            SHARING TRIO
                          </h3>
                          <span className="text-lg md:text-2xl font-black text-black whitespace-nowrap self-start sm:self-auto">£35.00</span>
                        </div>
                        <p className="text-xs md:text-base text-black/70">All three meats with sage & onion stuffing and crackling to share for two</p>
                      </div>
                    </div>

                    {/* Extra Option - Subtle */}
                    <div className="mb-5 md:mb-8 text-center">
                      <p className="text-[10px] md:text-sm text-black/80 font-medium italic">
                        Add an additional bowl of pigs in blankets for an extra £5 to any roast
                      </p>
                    </div>

                    {/* Book Now Button - Better mobile touch target */}
                    <div className="mb-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBooking();
                        }}
                        className="w-full px-6 md:px-8 py-3.5 md:py-5 bg-black text-white font-bold font-heading uppercase tracking-widest text-sm md:text-lg rounded-lg hover:bg-white hover:text-black active:scale-[0.98] transition-all duration-300 shadow-xl hover:shadow-2xl touch-manipulation"
                      >
                        BOOK NOW
                      </button>
                    </div>

                    {/* Disclaimer */}
                    <p className="text-[10px] md:text-sm text-black/60 text-center font-medium pb-2 md:pb-0">
                      *Available every Sunday from 12pm. Subject to availability.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Live Music Calendar Promotional Modal */}
      <AnimatePresence>
        {showLiveMusicModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLiveMusicModal(false)}
              className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-0 z-[71] flex items-center justify-center p-4 md:p-8 pointer-events-none"
            >
              <div 
                className="relative w-full max-w-4xl bg-[#15222e] border-t md:border border-white/10 overflow-hidden flex flex-col shadow-2xl shadow-[#f78e2c]/10 group/modal h-[90dvh] md:h-[85vh] rounded-t-3xl md:rounded-3xl pointer-events-auto"
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowLiveMusicModal(false)}
                  className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors border border-white/10 backdrop-blur-md"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>

                {/* Top Image Section - Hero */}
                <div className="w-full h-[180px] md:h-[220px] relative shrink-0 group/image">
                  <img 
                    src={EVENTS[0].image} 
                    alt="Live Music Calendar" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#15222e]/95 via-[#15222e]/20 to-transparent" />

                  {/* MUSIC Tag - Top Left */}
                  <div className="absolute top-4 left-4 md:top-6 md:left-6 z-20 flex items-center gap-2 text-[#f78e2c]">
                    <Calendar className="w-5 h-5 md:w-6 md:h-6" />
                    <span className="font-mono text-sm md:text-base tracking-widest uppercase font-bold">{EVENTS[0].tag}</span>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col justify-end items-start z-10 pb-4 md:pb-6">
                    <h3 className="text-3xl md:text-5xl font-heading font-black uppercase leading-none text-white mb-1 tracking-tighter shadow-black drop-shadow-lg">
                      {EVENTS[0].name.toUpperCase()}
                    </h3>
                    <p className="text-base md:text-xl text-[#fbbf24] font-medium tracking-widest uppercase">
                      {EVENTS[0].category}
                    </p>
                  </div>
                </div>

                {/* Main Scrollable Content Area */}
                <div 
                  ref={promoModalScrollRef}
                  onScroll={handlePromoModalScroll}
                  className="flex-1 overflow-y-auto bg-[#15222e] relative"
                  style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.2) transparent' }}
                >
                  <div className="max-w-4xl mx-auto p-5 md:p-8 pt-3 md:pt-4">
                    {/* Month Navigation */}
                    <div className="sticky top-0 z-30 py-2 mb-4 -mx-5 px-5 md:-mx-8 md:px-8 bg-[#15222e]/95 backdrop-blur-sm border-b border-white/5 flex justify-start overflow-x-auto no-scrollbar">
                      <div className={`relative flex items-center bg-white/5 ${isMobile ? 'backdrop-blur-md' : 'backdrop-blur-xl'} border border-white/10 rounded-full p-1 shadow-2xl`}>
                        {filteredMusicSchedule.map((month, idx) => {
                          const isActive = promoActiveMonth === idx;
                          return (
                            <button
                              key={idx}
                              onClick={() => scrollToMonthPromo(idx)}
                              className={`relative px-3 py-1.5 md:px-4 md:py-2 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-widest transition-colors duration-300 z-10 shrink-0 ${isActive ? 'text-black' : 'text-gray-400 hover:text-white'}`}
                            >
                              {isActive && (
                                <motion.div
                                  layoutId="activePillPromo"
                                  className="absolute inset-0 bg-[#f78e2c] rounded-full -z-10"
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
                      {filteredMusicSchedule.map((month, idx) => (
                        <div key={idx} id={`promo-month-section-${idx}`} className="relative scroll-mt-32">
                          <div className="flex items-center gap-4 mb-6">
                            <h5 className="text-4xl md:text-5xl font-heading font-black uppercase text-white/5 tracking-tighter">
                              {month.month}
                            </h5>
                            <div className="h-px flex-1 bg-gradient-to-r from-[#f78e2c]/30 to-transparent" />
                          </div>

                          <div className="grid gap-3">
                            {month.events.map((event, i) => (
                              <div 
                                key={i} 
                                onClick={() => {
                                  // Close promo modal and open main feature modal with event selected
                                  setShowLiveMusicModal(false);
                                  // Use setTimeout to ensure modal state updates properly
                                  setTimeout(() => {
                                    setSelectedFeature(EVENTS[0]);
                                    setTimeout(() => {
                                      setSelectedEvent(event);
                                    }, 100);
                                  }, 100);
                                }}
                                className={`cursor-pointer relative flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 group/item overflow-hidden ${event.special ? 'bg-gradient-to-r from-[#f78e2c]/10 to-transparent border-[#f78e2c]/40' : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'}`}
                              >
                                {/* Date Box */}
                                <div className="flex flex-col items-center justify-center w-16 h-16 rounded-lg bg-black/40 border border-white/10 shrink-0 backdrop-blur-sm group-hover/item:border-[#f78e2c]/50 transition-colors">
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
                                    {event.special && <span className="text-[10px] bg-[#f78e2c] text-black px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Special</span>}
                                    {event.note && <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{event.note}</span>}
                                  </div>
                                  <h4 className={`text-lg md:text-xl font-heading font-bold uppercase truncate pr-4 ${event.special ? 'text-[#f78e2c]' : 'text-white'}`}>
                                    {event.act}
                                  </h4>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-gray-400 group-hover/item:text-[#f78e2c] transition-colors uppercase tracking-wider font-medium">
                                      {event.genre || 'Live Music'}
                                    </span>
                                  </div>
                                </div>
                                
                                {/* Arrow */}
                                <div className="px-2 opacity-50 group-hover/item:opacity-100 transition-all -translate-x-2 group-hover/item:translate-x-0 duration-300 text-[#f78e2c]">
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
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Food Menu Modal */}
      <AnimatePresence>
        {showFoodMenuModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFoodMenuModal(false)}
              className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-md cursor-pointer"
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed inset-0 z-[71] flex items-end md:items-center justify-center p-0 md:p-8 pointer-events-none"
            >
              <div 
                className="relative max-w-6xl w-full h-[95vh] md:h-[90vh] max-h-[95vh] md:max-h-[90vh] pointer-events-auto rounded-t-3xl md:rounded-3xl overflow-hidden border-t-4 md:border-4 border-[#1e3a5f] shadow-2xl group"
                style={{ 
                  backgroundColor: '#f78e2c'
                }}
              >
                {/* Close Button */}
                <button
                  onClick={() => setShowFoodMenuModal(false)}
                  className="absolute top-2 right-2 md:top-3 md:right-3 z-50 p-2.5 md:p-2 rounded-full bg-black/80 text-white hover:bg-white hover:text-black transition-colors border border-white/20 backdrop-blur-md touch-manipulation"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 md:w-5 md:h-5" />
                </button>

                {/* Content Container */}
                <div className="relative w-full h-full overflow-y-auto overscroll-contain">
                  <div className="p-4 md:p-8 lg:p-10 pt-6 md:pt-8">
                    {/* Title Section */}
                    <div className="mb-4 md:mb-6 mt-2 md:mt-0">
                      <div className="bg-black px-4 py-2.5 md:px-8 md:py-4 inline-block">
                        <h2 className="text-2xl md:text-5xl lg:text-6xl font-heading font-bold uppercase text-white leading-tight">
                          FOOD MENU
                        </h2>
                      </div>
                    </div>

                    {/* Small Plates Section */}
                    <div className="mb-6 md:mb-8">
                      <div className="bg-black px-4 py-2 md:px-6 md:py-3 inline-block mb-3 md:mb-4">
                        <h3 className="text-xl md:text-3xl font-heading font-bold uppercase text-white">Small Plates</h3>
                      </div>
                      <p className="text-black text-xs md:text-sm font-medium mb-3 md:mb-4">£9.00 Each or 3 for £25</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        {[
                          { name: 'CORN RIBS', description: 'Served with smoked chipotle lime mayo', price: '', badges: ['GF', 'NEW'] },
                          { name: 'GARLIC CHILLI PRAWNS', description: 'Pan-fried prawns in garlic tomato-chilli served sauce with flatbread', price: '', badges: [] },
                          { name: 'HALLOUMI MELTS', description: 'Served with lime and hot honey mayo', price: '', badges: ['GF', 'V'] },
                          { name: 'BAKED MINI CAMEMBERT', description: 'Served with flatbread & chilli jam', price: '', badges: ['V', 'NEW'] },
                          { name: 'TORTILLA CHIPS', description: 'Served with cheese sauce, sour cream, guacamole and tomato salsa', price: '', badges: ['GF', 'V'] },
                          { name: 'MAC & CHEESE', description: 'Crispy bacon & cheese, layered with smoky bacon and sweet onion crunch', price: '', badges: ['NEW'], note: 'Upgrade to a large with grilled chicken +£5' },
                          { name: 'CHICKEN TENDERS', description: 'Battered chicken strips served with smoked chipotle mayo', price: '', badges: [] },
                          { name: 'FISH GOUJONS', description: 'Battered mini fish goujons served with Lemon & Dill mayo', price: '', badges: ['GF'] },
                          { name: 'CRISPY CALAMARI', description: 'Served with tartare sauce', price: '', badges: ['GF'] },
                          { name: 'CRISPY POTATO BITES', description: 'Served with smoked paprika & saffron mayo', price: '', badges: ['GF', 'V'] },
                        ].map((item, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-3.5 md:p-5 border-2 border-black/30 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h4 className="text-base md:text-lg font-bold text-black uppercase leading-tight flex-1">{item.name}</h4>
                              {item.badges.map((badge, i) => (
                                <span key={i} className="text-xs md:text-sm font-bold bg-[#f78e2c] text-black px-2 py-0.5 rounded">{badge}</span>
                              ))}
                            </div>
                            <p className="text-xs md:text-sm text-black/70 mb-1">{item.description}</p>
                            {item.note && <p className="text-xs text-black/60 italic">{item.note}</p>}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Light Bites Section */}
                    <div className="mb-6 md:mb-8">
                      <div className="bg-black px-4 py-2 md:px-6 md:py-3 inline-block mb-3 md:mb-4">
                        <h3 className="text-xl md:text-3xl font-heading font-bold uppercase text-white">Light Bites</h3>
                      </div>
                      <p className="text-black text-xs md:text-sm font-medium mb-3 md:mb-4">Available Monday to Saturday 12-5pm</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        {[
                          { name: 'FIZZY CLUB SANDWICH', description: 'Chicken, smoked bacon, cheddar cheese, lettuce, tomato, mayo & toasted ciabatta & homemade chips', price: '£12', badges: ['NEW'] },
                          { name: 'STEAK SANDWICH', description: 'Served in ciabatta bread with fried onions, dijon tarragon mayo & homemade chips', price: '£14', badges: [] },
                          { name: 'SOUTHERN CHICK', description: 'Southern chicken, rocket and smoked chipotle mayo in ciabatta & homemade chips', price: '£11', badges: [] },
                          { name: 'FISH FINGER SANDWICH', description: 'Battered fish fingers, rocket and tartare sauce in ciabatta & homemade chips', price: '£11', badges: [] },
                        ].map((item, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-3.5 md:p-5 border-2 border-black/30 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                              <div className="flex flex-wrap items-center gap-2 flex-1">
                                <h4 className="text-base md:text-lg font-bold text-black uppercase leading-tight">{item.name}</h4>
                                {item.badges.map((badge, i) => (
                                  <span key={i} className="text-xs md:text-sm font-bold bg-[#f78e2c] text-black px-2 py-0.5 rounded">{badge}</span>
                                ))}
                              </div>
                              <span className="text-lg md:text-xl font-black text-black whitespace-nowrap self-start sm:self-auto">{item.price}</span>
                            </div>
                            <p className="text-xs md:text-sm text-black/70">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Favourites Section */}
                    <div className="mb-6 md:mb-8">
                      <div className="bg-black px-4 py-2 md:px-6 md:py-3 inline-block mb-3 md:mb-4">
                        <h3 className="text-xl md:text-3xl font-heading font-bold uppercase text-white">Favourites</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        {[
                          { name: 'GIANT COUS COUS & RATATOUILLE', description: 'Served with garlic flatbread', price: '£14', badges: ['NEW', 'VG'], note: 'Add chicken + £2' },
                          { name: 'CHICKEN CAESAR SALAD', description: 'With garlic croutons, caesar dressing and parmesan cheese', price: '£14', badges: [] },
                          { name: 'BRITISH ALE PIE', description: 'Steak ale pie served with mashed potato, mixed vegetables & classic gravy', price: '£17', badges: [] },
                          { name: 'CLASSIC FISH AND CHIPS', description: 'Served with mushy peas and tartare sauce', price: '£16', badges: ['GF'] },
                          { name: 'BEEF BOURGUIGNON', description: 'Slow-braised beef in red wine jus with mash, crispy onions & smoked bacon crumbs', price: '£17', badges: ['NEW'] },
                          { name: 'THE BALTI', description: 'Authentic Balt served with rice, naan bread, mango chutney & mint yoghurt', price: '£17', badges: [], note: 'Choose from Chicken, Vegetable or Prawn' },
                          { name: 'WING BUCKET', description: 'Chicken wings covered in', price: '£15', badges: ['NEW'], note: 'Choose from: Fizzy\'s Hot Glaze, Smoked BBQ, Lemon pepper served with Chipotle Mayo & homemade chips' },
                        ].map((item, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-3.5 md:p-5 border-2 border-black/30 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                              <div className="flex flex-wrap items-center gap-2 flex-1">
                                <h4 className="text-base md:text-lg font-bold text-black uppercase leading-tight">{item.name}</h4>
                                {item.badges.map((badge, i) => (
                                  <span key={i} className="text-xs md:text-sm font-bold bg-[#f78e2c] text-black px-2 py-0.5 rounded">{badge}</span>
                                ))}
                              </div>
                              <span className="text-lg md:text-xl font-black text-black whitespace-nowrap self-start sm:self-auto">{item.price}</span>
                            </div>
                            <p className="text-xs md:text-sm text-black/70 mb-1">{item.description}</p>
                            {item.note && <p className="text-xs text-black/60 italic">{item.note}</p>}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pizzas Section */}
                    <div className="mb-6 md:mb-8">
                      <div className="bg-black px-4 py-2 md:px-6 md:py-3 inline-block mb-3 md:mb-4">
                        <h3 className="text-xl md:text-3xl font-heading font-bold uppercase text-white">Pizzas</h3>
                      </div>
                      <p className="text-black text-xs md:text-sm font-medium mb-3 md:mb-4">Available gluten free bases</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        {[
                          { name: 'CLASSIC MARGHERITA', description: 'Tomato sauce, mozzarella cheese', price: '£12 (S) / £15 (L)', badges: [] },
                          { name: 'SUPREMELY VEGGIE', description: 'Tomato sauce, mozzarella cheese, roasted peppers, red onions, sweetcorn, mushrooms, fresh rocket', price: '£13 (S) / £17 (L)', badges: ['V'] },
                          { name: 'SWEET CHICKS', description: 'BBQ sauce, mozzarella cheese, roasted chicken, red onions, sweetcorn', price: '£15 (S) / £19 (L)', badges: [] },
                          { name: 'SPICY AMERICAN', description: 'Tomato sauce, mozzarella cheese, pepperoni, spicy nduja, green jalapeños', price: '£15 (S) / £19 (L)', badges: ['SPICY', 'SPICY'] },
                          { name: 'MOM CAPRI', description: 'Tomato sauce, mozzarella cheese, ham, mushrooms', price: '£15 (S) / £19 (L)', badges: ['NEW'] },
                          { name: 'MEATADOR', description: 'Tomato sauce, mozzarella cheese, pepperoni, roasted chicken, spicy nduja, red onions', price: '£16 (S) / £20 (L)', badges: ['SPICY'] },
                        ].map((item, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-3.5 md:p-5 border-2 border-black/30 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                              <div className="flex flex-wrap items-center gap-2 flex-1">
                                <h4 className="text-base md:text-lg font-bold text-black uppercase leading-tight">{item.name}</h4>
                                {item.badges.map((badge, i) => (
                                  <span key={i} className="text-xs md:text-sm font-bold bg-[#f78e2c] text-black px-2 py-0.5 rounded">{badge}</span>
                                ))}
                              </div>
                              <span className="text-sm md:text-base font-black text-black whitespace-nowrap self-start sm:self-auto">{item.price}</span>
                            </div>
                            <p className="text-xs md:text-sm text-black/70">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Burgers Section */}
                    <div className="mb-6 md:mb-8">
                      <div className="bg-black px-4 py-2 md:px-6 md:py-3 inline-block mb-3 md:mb-4">
                        <h3 className="text-xl md:text-3xl font-heading font-bold uppercase text-white">Burgers</h3>
                      </div>
                      <p className="text-black text-xs md:text-sm font-medium mb-3 md:mb-4">Gluten Free buns available</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        {[
                          { name: 'FIZZY\'S ULTIMATE BURGER', description: 'Double stack beef patties, smoked bacon, cheese, mushrooms, fried onions, bacon ketchup sauce & gherkin', price: '£18', badges: ['NEW'], note: 'Add an extra patty +£2' },
                          { name: 'EASY CHEESY', description: 'Beef patty, double stack of smoked cheese, fried onions, bacon ketchup sauce', price: '£16', badges: [] },
                          { name: 'SOUTHERN CHICK', description: 'Double stack of Southern fried chicken breasts, roast red pepper, gherkins, smoked chipotle mayo', price: '£16', badges: [] },
                          { name: 'THE HALLOUMI', description: 'Crispy Halloumi, roast red pepper, red houmous', price: '£15', badges: ['V'] },
                          { name: 'THE VEGAN BURGER', description: 'Smoked tofu, roast red pepper, red houmous', price: '£14', badges: ['VG'] },
                          { name: 'DOUBLE STACK CLASSIC BURGER', description: 'Double Stack of Beef Patties, fresh lettuce, tomato, bacon ketchup & gherkin', price: '£15', badges: [] },
                        ].map((item, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-3.5 md:p-5 border-2 border-black/30 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                              <div className="flex flex-wrap items-center gap-2 flex-1">
                                <h4 className="text-base md:text-lg font-bold text-black uppercase leading-tight">{item.name}</h4>
                                {item.badges.map((badge, i) => (
                                  <span key={i} className="text-xs md:text-sm font-bold bg-[#f78e2c] text-black px-2 py-0.5 rounded">{badge}</span>
                                ))}
                              </div>
                              <span className="text-lg md:text-xl font-black text-black whitespace-nowrap self-start sm:self-auto">{item.price}</span>
                            </div>
                            <p className="text-xs md:text-sm text-black/70 mb-1">{item.description}</p>
                            {item.note && <p className="text-xs text-black/60 italic">{item.note}</p>}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Desserts Section */}
                    <div className="mb-6 md:mb-8">
                      <div className="bg-black px-4 py-2 md:px-6 md:py-3 inline-block mb-3 md:mb-4">
                        <h3 className="text-xl md:text-3xl font-heading font-bold uppercase text-white">Desserts</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                        {[
                          { name: 'DOUBLE CHOCOLATE BROWNIE', description: 'Served with vanilla ice cream', price: '£7', badges: ['V'] },
                          { name: 'STICKY TOFFEE PUDDING', description: 'Served with vanilla ice cream or custard', price: '£7', badges: ['V'] },
                          { name: 'SPICED PEACH CRUMBLE', description: 'Served with ice cream or custard', price: '£7', badges: ['V'] },
                        ].map((item, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-3.5 md:p-5 border-2 border-black/30 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                              <div className="flex flex-wrap items-center gap-2 flex-1">
                                <h4 className="text-base md:text-lg font-bold text-black uppercase leading-tight">{item.name}</h4>
                                {item.badges.map((badge, i) => (
                                  <span key={i} className="text-xs md:text-sm font-bold bg-[#f78e2c] text-black px-2 py-0.5 rounded">{badge}</span>
                                ))}
                              </div>
                              <span className="text-lg md:text-xl font-black text-black whitespace-nowrap self-start sm:self-auto">{item.price}</span>
                            </div>
                            <p className="text-xs md:text-sm text-black/70">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Kids Section */}
                    <div className="mb-6 md:mb-8">
                      <div className="bg-black px-4 py-2 md:px-6 md:py-3 inline-block mb-3 md:mb-4">
                        <h3 className="text-xl md:text-3xl font-heading font-bold uppercase text-white">Kids</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                        {[
                          { name: 'FISH FINGERS', description: 'Served with chips and beans', price: '£7', badges: [] },
                          { name: 'CHICKEN TENDERS', description: 'Served with chips and beans', price: '£7', badges: [] },
                          { name: 'MAC & CHEESE', description: 'Cheesy pasta topped with a golden crunchy onion layer', price: '£8', badges: ['V'] },
                        ].map((item, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-3.5 md:p-5 border-2 border-black/30 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                              <div className="flex flex-wrap items-center gap-2 flex-1">
                                <h4 className="text-base md:text-lg font-bold text-black uppercase leading-tight">{item.name}</h4>
                                {item.badges.map((badge, i) => (
                                  <span key={i} className="text-xs md:text-sm font-bold bg-[#f78e2c] text-black px-2 py-0.5 rounded">{badge}</span>
                                ))}
                              </div>
                              <span className="text-lg md:text-xl font-black text-black whitespace-nowrap self-start sm:self-auto">{item.price}</span>
                            </div>
                            <p className="text-xs md:text-sm text-black/70">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Sides Section */}
                    <div className="mb-6 md:mb-8">
                      <div className="bg-black px-4 py-2 md:px-6 md:py-3 inline-block mb-3 md:mb-4">
                        <h3 className="text-xl md:text-3xl font-heading font-bold uppercase text-white">Sides</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                        {[
                          { name: 'HOMEMADE CHIPS', price: '£6', badges: ['GF'] },
                          { name: 'SKINNY FRIES', price: '£6', badges: ['GF'] },
                          { name: 'SWEET POTATO FRIES', price: '£7', badges: ['GF'] },
                          { name: 'CHILLI FRIES', price: '£8', badges: [] },
                          { name: 'ONION RINGS', price: '£6', badges: [] },
                          { name: 'GARLIC PIZZA', price: '£7', badges: [], note: 'Add cheese for £2' },
                        ].map((item, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-3.5 md:p-5 border-2 border-black/30 shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-1 sm:gap-0">
                              <div className="flex flex-wrap items-center gap-2 flex-1">
                                <h4 className="text-base md:text-lg font-bold text-black uppercase leading-tight">{item.name}</h4>
                                {item.badges.map((badge, i) => (
                                  <span key={i} className="text-xs md:text-sm font-bold bg-[#f78e2c] text-black px-2 py-0.5 rounded">{badge}</span>
                                ))}
                              </div>
                              <span className="text-lg md:text-xl font-black text-black whitespace-nowrap self-start sm:self-auto">{item.price}</span>
                            </div>
                            {item.note && <p className="text-xs text-black/60 italic">{item.note}</p>}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Book Now Button */}
                    <div className="mb-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBooking();
                        }}
                        className="w-full px-6 md:px-8 py-3.5 md:py-5 bg-black text-white font-bold font-heading uppercase tracking-widest text-sm md:text-lg rounded-lg hover:bg-white hover:text-black active:scale-[0.98] transition-all duration-300 shadow-xl hover:shadow-2xl touch-manipulation"
                      >
                        BOOK NOW
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
