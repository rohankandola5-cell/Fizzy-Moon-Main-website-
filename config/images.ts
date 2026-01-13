/**
 * Centralized Image Management System
 * 
 * Organize all image paths by category for easy management.
 * Supports theme-specific image arrays.
 * 
 * To add new images:
 * 1. Place images in appropriate /public/images/ subfolder
 * 2. Add path to the relevant category below
 * 3. Use getThemeImages() helper to get theme-specific images
 */

const IMAGE_PREFIX = process.env.NEXT_PUBLIC_USE_NORMALIZED_IMAGES === 'true' ? '/images-normalized' : '/images';

export interface ImageConfig {
  url: string;
  alt: string;
  label?: string;
}

/**
 * Venue images - can be overridden per theme
 */
export const venueImages: ImageConfig[] = [
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

/**
 * Logo images
 */
export const logoImages = {
  main: '/images/logo/fizzy_moon_white_final.png',
};

/**
 * Promotional images
 */
export const promoImages = {
  valentines: '/images/promos/valentines-2026.jpg',
  // Add more promo images as needed
  // christmas: '/images/promos/christmas-2026.jpg',
  // summer: '/images/promos/summer-2026.jpg',
};

/**
 * Event images (for events section)
 */
export const eventImages = {
  liveMusic: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop',
  sundayRoast: '/images/events/IMG_9614.PNG',
  quiz: 'https://images.unsplash.com/photo-1632211910609-02ae6a746532?q=80&w=1000&auto=format&fit=crop',
};

/**
 * Food & Drink images
 */
export const foodDrinkImages = {
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000&auto=format&fit=crop',
  beer: 'https://images.unsplash.com/photo-1584225064785-c62a8b43d148?q=80&w=1000&auto=format&fit=crop',
  steak: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=1000&auto=format&fit=crop',
};

/**
 * Helper function to get theme-specific images
 * Falls back to default images if theme doesn't override
 */
export function getThemeImages(themeKey: string): {
  venue: ImageConfig[];
  logo: typeof logoImages;
  promo?: string;
} {
  // For now, all themes use the same images
  // In the future, you can add theme-specific image arrays here
  return {
    venue: venueImages,
    logo: logoImages,
    promo: promoImages[themeKey as keyof typeof promoImages],
  };
}

/**
 * Get image URL with proper prefix handling
 */
export function getImageUrl(path: string): string {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path; // External URLs
  }
  if (path.startsWith('/')) {
    return path; // Absolute paths
  }
  return `${IMAGE_PREFIX}/${path}`;
}

