/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

/**
 * Promotional Modal Configuration
 * 
 * To edit promotional content:
 * 1. Update 'enabled' to true/false to show/hide the modal
 * 2. Change 'image' path to your new promotional graphic
 * 3. Update 'id' when creating new promotions (to reset session dismissal)
 * 4. Modify 'ctaText' and 'ctaLink' as needed
 * 5. Place new images in /public/images/promos/ folder
 * 
 * Recommended image dimensions: A4 ratio (~2100x2970px at 300dpi, or similar)
 */

export interface PromoConfig {
  /** Unique identifier for sessionStorage key */
  id: string;
  /** Toggle to show/hide modal */
  enabled: boolean;
  /** Path to promotional image (e.g., '/images/promos/valentines-2026.jpg') */
  image?: string;
  /** Optional title text overlay */
  title?: string;
  /** Optional subtitle text overlay */
  subtitle?: string;
  /** Call-to-action button text */
  ctaText?: string;
  /** URL for CTA button */
  ctaLink?: string;
  /** Delay in milliseconds before showing (default: 1500ms) */
  delay?: number;
  /** Custom background color (default: '#15222e') */
  backgroundColor?: string;
}

// Default Valentine's Day configuration
export const PROMO_CONFIG: PromoConfig = {
  id: 'valentines-2026',
  enabled: false,
  image: '/images/promos/valentines-2026.jpg',
  title: 'Valentine\'s Day Special',
  subtitle: 'Romantic Dinner & Live Music',
  ctaText: 'Book Your Table',
  ctaLink: 'https://www.sevenrooms.com/explore/fizzymoonbrewhouse/reservations/create/search/',
  delay: 1500,
};

