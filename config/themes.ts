/**
 * Theme Configuration System
 * 
 * Define themes for different times of year with:
 * - Color overrides for brand colors
 * - Theme-specific venue images
 * - Theme-specific text/content
 * 
 * To add a new theme:
 * 1. Add a new entry to the themes object
 * 2. Define date ranges in ThemeProvider for auto-detection
 * 3. Add theme-specific images to config/images.ts
 */

export interface ThemeColors {
  primary: string;
  primaryHover: string;
  background: string;
  backgroundDark: string;
  backgroundDarker: string;
  accent?: string;
  text?: string;
  textSecondary?: string;
}

export interface VenueImage {
  url: string;
  alt: string;
  label: string;
}

export interface Theme {
  name: string;
  colors: ThemeColors;
  venueImages: VenueImage[];
  heroText: string;
  // Optional theme-specific overrides
  marqueeText?: string;
  promoImage?: string;
}

const IMAGE_PREFIX = process.env.NEXT_PUBLIC_USE_NORMALIZED_IMAGES === 'true' ? '/images-normalized' : '/images';

export const themes: Record<string, Theme> = {
  default: {
    name: 'Default',
    colors: {
      primary: '#f78e2c', // Brand orange
      primaryHover: '#ffffff',
      background: '#0b1219', // Deep Slate Blue
      backgroundDark: '#15222e',
      backgroundDarker: '#080d11',
      accent: '#fbbf24', // Amber
      text: '#ffffff',
      textSecondary: '#e5e7eb',
    },
    venueImages: [
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
    ],
    heroText: 'Where bubbles never stop flowing',
    marqueeText: 'LIVE MUSIC ● LUXE LOUNGE ● COCKTAILS ● VIP HUT ● SUNDAY ROAST ● CRAFT BEER',
  },
  valentines: {
    name: 'Valentine\'s Day',
    colors: {
      primary: '#ff6b9d', // Pink/rose
      primaryHover: '#ffffff',
      background: '#1a0f1a', // Deep purple-pink
      backgroundDark: '#2a1a2a',
      backgroundDarker: '#0f080f',
      accent: '#ff9fbf',
      text: '#ffffff',
      textSecondary: '#f3d2e0',
    },
    venueImages: [
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
    ],
    heroText: 'Romance is in the air',
    marqueeText: 'ROMANTIC DINNERS ● LIVE MUSIC ● COCKTAILS FOR TWO ● VIP HUT ● SUNDAY ROAST ● CRAFT BEER',
    promoImage: '/images/promos/valentines-2026.jpg',
  },
  christmas: {
    name: 'Christmas',
    colors: {
      primary: '#ff4444', // Festive red
      primaryHover: '#ffffff',
      background: '#0d1a0d', // Deep green-tinted dark
      backgroundDark: '#1a2a1a',
      backgroundDarker: '#080f08',
      accent: '#ffd700', // Gold
      text: '#ffffff',
      textSecondary: '#e0e0e0',
    },
    venueImages: [
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
    ],
    heroText: 'Festive celebrations await',
    marqueeText: 'FESTIVE FUN ● LIVE MUSIC ● MULLED WINE ● VIP HUT ● SUNDAY ROAST ● CRAFT BEER',
  },
  summer: {
    name: 'Summer',
    colors: {
      primary: '#ffb84d', // Bright summer orange
      primaryHover: '#ffffff',
      background: '#0f1a1f', // Cool dark blue
      backgroundDark: '#1a2a35',
      backgroundDarker: '#080d11',
      accent: '#ffd700', // Gold/yellow
      text: '#ffffff',
      textSecondary: '#e5e7eb',
    },
    venueImages: [
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
    ],
    heroText: 'Summer vibes all year round',
    marqueeText: 'SUMMER NIGHTS ● LIVE MUSIC ● REFRESHING COCKTAILS ● VIP HUT ● SUNDAY ROAST ● CRAFT BEER',
  },
};

export type ThemeKey = keyof typeof themes;

