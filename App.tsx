
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Ticket, Globe, Zap, Music, MapPin, Menu, X, Calendar, Play, ChevronLeft, ChevronRight, Utensils, Beer, PartyPopper, Trophy, Users, Crown, Wine, Armchair, Briefcase, Star, Flame, ArrowUpRight, Mic2, Clock, ArrowLeft, Coffee } from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import CustomCursor from './components/CustomCursor';
import ArtistCard from './components/ArtistCard';
import Bubbles from './components/Bubbles';
import FAQAccordion from './components/FAQAccordion';
import Preloader from './components/Preloader';
import { FeatureItem } from './types';

const BOOKING_URL = "https://www.sevenrooms.com/explore/fizzymoonbrewhouse/reservations/create/search/";

// ------------------------------------------------------------------
// HOW TO LINK YOUR GITHUB IMAGES (CHEAT SHEET)
// ------------------------------------------------------------------
// 1. DO NOT use the full "https://github.com..." link.
// 2. DO NOT use the "https://raw.githubusercontent.com..." link.
//
// Because you put them in the 'public' folder, you just reference the filename.
//
// EXAMPLE:
// If you uploaded "burger.jpg" to your "public" folder:
// CHANGE: url: "https://images.unsplash..."
// TO:     url: "/burger.jpg"
// ------------------------------------------------------------------

const VENUE_IMAGES = [
  {
    // REPLACE THE LINK BELOW WITH YOUR FILENAME (e.g., "/lounge.jpg")
    url: "/IMG_4314.jpg", 
    alt: "Warm Interior Lounge",
    label: "Warm & Welcoming"
  },
  {
    // REPLACE THE LINK BELOW WITH YOUR FILENAME (e.g., "/roast.jpg")
    url: "https://images.unsplash.com/photo-1606850780554-b55eaefa84cb?q=80&w=1974&auto=format&fit=crop",
    alt: "Sunday Roast",
    label: "Sunday Roast"
  },
  {
    // REPLACE THE LINK BELOW WITH YOUR FILENAME (e.g., "/bar.jpg")
    url: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=1974&auto=format&fit=crop",
    alt: "Dining Atmosphere",
    label: "Brewhouse & Grill"
  }
];

// BAND IMAGES PLACEHOLDERS
const BAND_IMAGES = {
  // If you uploaded "jack-price.jpg", change the link below to "/jack-price.jpg"
  jackPrice: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&w=800&q=80",
  innerCity: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=800&q=80",
  kingKandola: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?auto=format&fit=crop&w=800&q=80",
  tovey: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
  tiago: "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?auto=format&fit=crop&w=800&q=80",
  mockingJays: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?auto=format&fit=crop&w=800&q=80",
  djRoss: "https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&w=800&q=80",
  carl: "https://images.unsplash.com/photo-1514525253440-b393452e8d26?auto=format&fit=crop&w=800&q=80",
  coverBuoys: "https://images.unsplash.com/photo-1459749411177-d4a414c9ff5f?auto=format&fit=crop&w=800&q=80",
  quest: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=800&q=80",
  backCat: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80",
  chasingDeer: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80",
  cole: "https://images.unsplash.com/photo-1485579149621-3123dd979885?auto=format&fit=crop&w=800&q=80",
  viva: "https://images.unsplash.com/photo-1604093882750-3ed498f3178b?auto=format&fit=crop&w=800&q=80",
  izzy: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
  thom: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=800&q=80",
  andy: "https://images.unsplash.com/photo-1525994886773-080587e161c2?auto=format&fit=crop&w=800&q=80",
};

// MUSIC SCHEDULE DATA 2026 WITH DESCRIPTIONS
const MUSIC_SCHEDULE = [
  {
    month: 'January',
    events: [
      { 
        date: 'Fri 2nd', 
        act: 'Jack Price', 
        image: BAND_IMAGES.jackPrice,
        genre: 'Acoustic / Indie',
        time: '9:00 PM',
        description: 'Jack Price brings a soulful energy to the stage, blending classic indie anthems with a modern acoustic twist. A local favorite known for his raw vocals and captivating stage presence that gets the whole room singing along.'
      },
      { 
        date: 'Sat 3rd', 
        act: 'Inner City 3', 
        highlight: true, 
        image: BAND_IMAGES.innerCity,
        genre: 'House / Dance Classics',
        time: '9:30 PM',
        description: 'Get ready for a high-octane journey through the history of dance music. Inner City 3 delivers punchy covers of the biggest house and electronic tracks from the 90s to today. Bring your dancing shoes.'
      },
      { 
        date: 'Fri 9th', 
        act: 'King Kandola', 
        highlight: true, 
        image: BAND_IMAGES.kingKandola,
        genre: 'Rock / Pop',
        time: '9:00 PM',
        description: 'A powerhouse front-man with a voice that commands attention. King Kandola fuses rock swagger with pop sensibilities, delivering a setlist that ranges from Queen to The Killers.'
      },
      { 
        date: 'Sat 10th', 
        act: 'Tovey Brothers', 
        highlight: true, 
        image: BAND_IMAGES.tovey,
        genre: 'Classic Rock & Soul',
        time: '9:30 PM',
        description: 'The Tovey Brothers are a musical institution. Expect tight harmonies, virtuoso guitar work, and a setlist packed with timeless classics from the 60s, 70s, and 80s.'
      },
      { 
        date: 'Fri 16th', 
        act: 'Jack Price', 
        image: BAND_IMAGES.jackPrice,
        genre: 'Acoustic / Indie',
        time: '9:00 PM',
        description: 'Jack Price returns for another intimate yet energetic Friday night session. Perfect for starting your weekend with great vibes and cold drinks.'
      },
      { 
        date: 'Sat 17th', 
        act: "Tiago & The Amigo's", 
        highlight: true, 
        image: BAND_IMAGES.tiago,
        genre: 'Latin / Funk / Pop',
        time: '9:30 PM',
        description: 'A fusion of infectious Latin rhythms, funk grooves, and pop hits. Tiago & The Amigos bring a carnival atmosphere to Fizzy Moon that is impossible to resist.'
      },
      { 
        date: 'Fri 23rd', 
        act: 'Jack Price', 
        image: BAND_IMAGES.jackPrice,
        genre: 'Acoustic / Indie',
        time: '9:00 PM',
        description: 'Our resident Friday night maestro. Jack digs deep into his repertoire to bring you B-sides and fan favorites alongside the hits.'
      },
      { 
        date: 'Sat 24th', 
        act: "The MockingJay's", 
        highlight: true, 
        image: BAND_IMAGES.mockingJays,
        genre: 'Modern Rock / Alt-Pop',
        time: '9:30 PM',
        description: 'Sharp, stylish, and incredibly tight. The MockingJays tear through modern rock and alt-pop bangers with an energy that fills the floor.'
      },
      { 
        date: 'Fri 30th', 
        act: 'DJ ROSS', 
        special: true, 
        image: BAND_IMAGES.djRoss,
        genre: 'Open Format DJ',
        time: '8:00 PM - Late',
        description: 'Leamington’s finest selector takes over the decks. From disco edits to R&B throwbacks and house anthems, DJ Ross knows exactly how to read the room.'
      },
      { 
        date: 'Sat 31st', 
        act: 'CARL SINCLAIR', 
        special: true, 
        image: BAND_IMAGES.carl,
        genre: 'Piano / Vocals',
        time: '9:00 PM',
        description: 'The Piano Man himself. Carl Sinclair brings his legendary boogie-woogie piano style and soulful voice for a night of rock n roll and rhythm & blues.'
      },
    ]
  },
  {
    month: 'February',
    events: [
      { 
        date: 'Fri 6th', 
        act: 'Jack Price', 
        image: BAND_IMAGES.jackPrice,
        genre: 'Acoustic / Indie',
        time: '9:00 PM',
        description: 'Warm up your February Friday with Jack Price. The perfect soundtrack to our craft ales and signature cocktails.'
      },
      { 
        date: 'Sat 7th', 
        act: 'Cover Buoys', 
        highlight: true, 
        image: BAND_IMAGES.coverBuoys,
        genre: 'Party Band',
        time: '9:30 PM',
        description: 'Fun, frantic, and fantastic. The Cover Buoys don’t take themselves too seriously, but they take the music very seriously. Expect surprise mashups and singalongs.'
      },
      { 
        date: 'Fri 13th', 
        act: 'King Kandola', 
        highlight: true, 
        image: BAND_IMAGES.kingKandola,
        genre: 'Rock / Pop',
        time: '9:00 PM',
        description: 'King Kandola is back to rock the house. A high-energy performance guaranteed to shake off the winter blues.'
      },
      { 
        date: 'Sat 14th', 
        act: 'QUEST TRIO', 
        special: true, 
        image: BAND_IMAGES.quest,
        genre: 'Jazz / Soul / Pop',
        time: '9:30 PM',
        description: 'A special Valentine’s performance. Smooth jazz standards, soulful ballads, and romantic pop arrangements from this talented trio.'
      },
      { 
        date: 'Fri 20th', 
        act: 'DJ ROSS', 
        special: true, 
        image: BAND_IMAGES.djRoss,
        genre: 'Open Format DJ',
        time: '8:00 PM - Late',
        description: 'Friday Night Fever with DJ Ross. Spinning the tracks that make you move, from old school classics to fresh cuts.'
      },
      { 
        date: 'Sat 21st', 
        act: 'Back Catalogue', 
        highlight: true, 
        image: BAND_IMAGES.backCat,
        genre: 'Decades / Pop',
        time: '9:30 PM',
        description: 'A musical journey through the decades. Back Catalogue picks the very best tracks from the 70s, 80s, 90s, and 00s for a nostalgia-filled party.'
      },
    ]
  },
  {
    month: 'March',
    events: [
      { date: 'Fri 6th', act: 'Jack Price', image: BAND_IMAGES.jackPrice, genre: 'Acoustic', time: '9:00 PM', description: 'Acoustic vibes in the main bar.' },
      { date: 'Sat 7th', act: 'Chasing Deer', highlight: true, image: BAND_IMAGES.chasingDeer, genre: 'Indie Pop', time: '9:30 PM', description: 'Energetic indie pop band hailing from London. Catchy choruses and great vibes.' },
      { date: 'Fri 13th', act: 'King Kandola', highlight: true, image: BAND_IMAGES.kingKandola, genre: 'Rock', time: '9:00 PM', description: 'The King returns to rock the main stage.' },
      { date: 'Sat 14th', act: "Tiago & The Amigo's", highlight: true, image: BAND_IMAGES.tiago, genre: 'Latin', time: '9:30 PM', description: 'Latin fever takes over Fizzy Moon.' },
      { date: 'Sun 15th', act: 'COLE', note: 'MOTHERS DAY !!!', special: true, image: BAND_IMAGES.cole, genre: 'Soul / Swing', time: '2:00 PM', description: 'A relaxed afternoon set for Mother’s Day, featuring smooth soul and swing classics.' },
      { date: 'Fri 20th', act: 'DJ ROSS', special: true, image: BAND_IMAGES.djRoss, genre: 'DJ Set', time: '8:00 PM', description: 'Friday beats until late.' },
      { date: 'Sat 21st', act: 'Viva La Diva (Josie)', highlight: true, image: BAND_IMAGES.viva, genre: 'Pop Divas', time: '9:30 PM', description: 'A tribute to the greatest divas of pop, from Whitney to Beyoncé.' },
    ]
  },
  {
    month: 'April',
    events: [
      { date: 'Fri 3rd', act: 'Jack Price', note: 'GOOD FRIDAY', special: true, image: BAND_IMAGES.jackPrice, genre: 'Acoustic', time: '9:00 PM', description: 'Good Friday special.' },
      { date: 'Sat 4th', act: 'IZZY OWEN TRIO', special: true, image: BAND_IMAGES.izzy, genre: 'Contemporary Pop', time: '9:30 PM', description: 'Fresh arrangements of contemporary hits featuring stunning vocals.' },
      { date: 'Sun 5th', act: 'Thom Kirkpatrick', note: 'EASTER SUNDAY', special: true, image: BAND_IMAGES.thom, genre: 'One Man Band', time: '8:00 PM', description: 'An incredible one-man-band loop pedal experience. You have to see it to believe it.' },
      { date: 'Fri 10th', act: 'King Kandola', special: true, image: BAND_IMAGES.kingKandola, genre: 'Rock', time: '9:00 PM', description: 'Rock n Roll Friday.' },
      { date: 'Sat 11th', act: 'Andy Flynn Trio', highlight: true, image: BAND_IMAGES.andy, genre: 'Irish / Folk', time: '9:30 PM', description: 'Foot-stomping folk and Irish classics to get the party started.' },
    ]
  }
];

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
    image: 'https://images.unsplash.com/photo-1606850780554-b55eaefa84cb?q=80&w=1000&auto=format&fit=crop',
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
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Modal States
  const [selectedFeature, setSelectedFeature] = useState<FeatureItem | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null); // For Drill-down view
  
  const modalScrollRef = useRef<HTMLDivElement>(null);
  const [activeMonth, setActiveMonth] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  
  const [scrolled, setScrolled] = useState(false);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);

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
    <div className="relative min-h-screen text-white selection:bg-[#f78e2c] selection:text-black cursor-auto md:cursor-none overflow-x-hidden font-sans">
      <AnimatePresence>
        {loading && <Preloader onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      <CustomCursor />
      {/* Remove FluidBackground from global scope to put it under hero content properly if needed, 
          or keep it but we will overlay the hero image on top. 
          Keeping it for other sections. */}
      <FluidBackground />
      
      {/* Navigation - Z-50 (Highest) */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'py-4 bg-[#0b1219]/90 backdrop-blur-xl border-b border-white/10 shadow-lg pointer-events-auto' 
            : 'py-6 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-8 max-w-[1920px] mx-auto w-full">
          {/* Logo */}
          <div className="pointer-events-auto z-50">
            <img 
              src="https://static.wixstatic.com/media/b6f2c5_80f0668f46994301aa5a8bbf075ccbca~mv2.png/v1/fill/w_232,h_306,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/FIZZY%20MOON%20WHITE.png" 
              alt="Fizzy Moon" 
              className={`w-auto object-contain cursor-pointer transition-all duration-300 ${scrolled ? 'h-10 md:h-12' : 'h-12 md:h-16'}`}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            />
          </div>
          
          {/* Desktop Menu - Centered */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto bg-[#15222e]/30 backdrop-blur-xl border border-white/10 p-1.5 rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] gap-1 z-50 ring-1 ring-white/5">
            {navItems.map((item) => (
              <button 
                key={item} 
                onClick={() => scrollToSection(getSectionId(item))}
                className="px-6 py-2.5 rounded-full text-white/90 font-medium text-xs font-heading uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all duration-300 border border-transparent hover:border-white/10 active:scale-95 relative overflow-hidden group"
                data-hover="true"
              >
                <span className="relative z-10">{item}</span>
              </button>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 z-50 pointer-events-auto">
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

            {/* Mobile Menu Toggle - Enhanced Interaction */}
            <button 
              className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border transition-all duration-300 shadow-lg cursor-pointer ${scrolled ? 'bg-white/10 border-white/20' : 'bg-white/10 backdrop-blur-md border-white/20'} pointer-events-auto active:scale-90`}
              onClick={(e) => {
                e.stopPropagation();
                setMobileMenuOpen(prev => !prev);
              }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 pointer-events-none" />
              ) : (
                <Menu className="w-5 h-5 pointer-events-none" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <header className="relative h-[100svh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden">
        {/* HERO IMAGE CAROUSEL BACKGROUND - High Quality Venue Photos */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="popLayout">
            <motion.img 
              key={currentHeroImage}
              src={VENUE_IMAGES[currentHeroImage].url}
              alt={VENUE_IMAGES[currentHeroImage].alt}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full object-cover"
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
        >
          {/* Welcome Tag */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center gap-3 md:gap-4 text-[10px] md:text-sm font-bold tracking-[0.2em] uppercase mb-6 bg-black/60 px-6 py-2 rounded-full backdrop-blur-md border border-white/10 shadow-lg"
          >
            <span className="text-[#f78e2c]"><MapPin className="inline w-3 h-3 mr-1 mb-0.5" />Leamington Spa</span>
          </motion.div>

          {/* Main Title Block */}
          <div className="relative w-full flex justify-center items-center flex-col mb-4">
             {/* FIZZY MOON - Keep branding but make it cleaner */}
             <h1 className="text-[12vw] md:text-[10vw] leading-[0.8] font-black tracking-tighter text-center text-white drop-shadow-2xl font-heading">
               FIZZY MOON
             </h1>
             {/* Descriptive Subtitle - Crucial for context */}
             <h2 className="text-2xl md:text-4xl font-elegant italic text-[#f78e2c] mt-2 md:mt-4 tracking-wide">
               Where bubbles never stop flowing
             </h2>
          </div>
          
          <motion.p
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ delay: 0.5 }}
             className="text-gray-200 text-sm md:text-lg max-w-xl mb-8 font-light drop-shadow-md hidden md:block"
          >
             Home brewed ales, signature burgers, and the best Sunday Roast in Leamington. 
             A place for family, friends, and good times.
          </motion.p>

          <motion.div
             initial={{ scaleX: 0 }}
             animate={{ scaleX: 1 }}
             transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
             className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-[#f78e2c]/80 to-transparent mb-8"
          />

          {/* PRIMARY CALLS TO ACTION - Immediate Visibility */}
          <div className="flex flex-col md:flex-row gap-4 w-full max-w-2xl px-4">
             <motion.button
               onClick={handleBooking}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.7 }}
               className="flex-1 py-4 rounded-xl bg-[#f78e2c] text-black font-bold text-sm md:text-base tracking-widest uppercase hover:bg-white transition-all duration-300 shadow-[0_0_30px_rgba(247,142,44,0.3)] flex items-center justify-center gap-2"
             >
               <Calendar className="w-4 h-4 md:w-5 md:h-5" /> Book A Table
             </motion.button>
             
             <div className="flex gap-4 flex-1">
                <motion.button
                  onClick={() => scrollToSection('eat-drink')}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="flex-1 py-4 rounded-xl bg-black/60 backdrop-blur-md border border-white/20 text-white font-bold text-xs md:text-sm tracking-widest uppercase hover:bg-white/10 hover:border-[#f78e2c] transition-all flex items-center justify-center gap-2"
                >
                  <Utensils className="w-4 h-4" /> Sunday Roast
                </motion.button>
                <motion.button
                  onClick={() => scrollToSection('whats-on')}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
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
                       <h3 className="text-2xl md:text-3xl font-heading font-bold text-white leading-none">{ticket.name}</h3>
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
                What's <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f78e2c] to-amber-500">On</span>
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
      <section id="eat-drink" className="relative z-10 py-24 md:py-32 bg-[#0b1219] border-t border-white/10">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-16 px-4">
             <div>
               <div className="flex items-center gap-4 mb-6">
                  <span className="text-[#f78e2c] font-mono text-sm tracking-[0.3em] uppercase">Taste Makers</span>
                  <div className="h-px w-12 bg-[#f78e2c]/50" />
               </div>
               <h2 className="text-5xl md:text-7xl font-heading font-bold uppercase leading-none mb-6">
                 More Than <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f78e2c] to-amber-500">A Pub</span>
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
              <ArtistCard key={feature.id} artist={feature} onClick={() => setSelectedFeature(feature)} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section id="faq" className="relative z-10 py-24 bg-[#080d11] border-t border-white/10">
          <div className="max-w-4xl mx-auto px-6">
              <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-6xl font-heading font-bold uppercase mb-4">
                      Common <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f78e2c] to-amber-500">Questions</span>
                  </h2>
                  <p className="text-gray-400">Everything you need to know before you go.</p>
              </div>
              <FAQAccordion />
          </div>
      </section>

      <footer id="contact" className="relative z-10 border-t border-white/10 py-12 md:py-16 bg-[#0b1219]/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
             <div className="font-heading text-3xl md:text-4xl font-bold tracking-tighter mb-4 text-white">FIZZY MOON</div>
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
            className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-6 bg-black/90 backdrop-blur-xl cursor-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
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
                        className="w-full h-[220px] md:h-[280px] relative shrink-0 group/image"
                    >
                        <img 
                          src={selectedFeature.image} 
                          alt={selectedFeature.name} 
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-[#15222e] via-[#15222e]/40 to-transparent" />

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
                           <div className="flex items-center gap-3 text-[#f78e2c] mb-2">
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
                 className="flex-1 overflow-y-auto bg-[#15222e] relative scroll-smooth"
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
                            <div className="sticky top-0 z-40 bg-[#15222e]/95 backdrop-blur-xl border-b border-white/10 p-4">
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
                                
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Time</div>
                                        <div className="text-white font-bold">{selectedEvent.time}</div>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                                        <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">Entry</div>
                                        <div className="text-white font-bold">Free Entry</div>
                                    </div>
                                </div>

                                <button 
                                    onClick={handleBooking}
                                    className="w-full py-5 rounded-xl bg-[#f78e2c] text-black font-bold font-heading uppercase tracking-widest hover:bg-white hover:scale-[1.01] transition-all shadow-lg shadow-orange-500/20"
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
                            <p className="text-gray-300 leading-relaxed text-sm md:text-base font-light mb-8 max-w-2xl">
                               {selectedFeature.description}
                            </p>

                            {selectedFeature.id === 'e1' ? (
                               <>
                                 {/* Month Navigation */}
                                 <div className="sticky top-0 z-30 py-2 mb-6 -mx-5 px-5 md:-mx-8 md:px-8 bg-[#15222e]/95 backdrop-blur-sm border-b border-white/5 flex justify-start overflow-x-auto no-scrollbar">
                                     <div className="relative flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-full p-1 shadow-2xl">
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
                                  {MUSIC_SCHEDULE.map((month, idx) => (
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
                                <button onClick={handleBooking} className="w-full py-6 rounded-2xl bg-[#f78e2c] text-black font-bold uppercase tracking-widest hover:bg-white transition-colors">Book Experience Now</button>
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
