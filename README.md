<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Fizzy Moon Brewhouse Website

The official website for Fizzy Moon Brewhouse & Grill in Leamington Spa.

Built with Next.js and React, featuring server-side rendering for optimal performance and SEO.

## Run Locally

**Prerequisites:** Node.js 18+


1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Build for Production

```bash
npm run build
npm start
```

## Features

- 🎨 Beautiful, modern UI with smooth animations
- 📱 Fully responsive design
- ⚡ Server-side rendering for fast initial loads
- 🎵 Live music schedule
- 📅 Booking integration
- 🍺 Menu and event information

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion

## Color Consistency

To ensure brand colors render consistently across all devices and browsers, we've implemented several measures:

### Problem
Colors (especially the brand orange `#f78e2c`) can appear different on different devices due to:
- **ICC color profile mismatches**: Images with Display-P3 or other wide-gamut profiles render inconsistently
- **Image format variations**: AVIF format has inconsistent ICC profile handling on Android devices
- **Opacity/blend modes**: Transparent overlays blend differently depending on display capabilities

### Solutions Implemented

1. **Disabled AVIF format**: Using WebP only for better consistency (`next.config.mjs`)
2. **Opaque brand colors**: All primary brand UI elements (buttons, badges, headers) use solid hex colors with no opacity modifiers
3. **sRGB normalization script**: Optional script to convert images to sRGB color space
4. **Consolidated colors**: All brand colors defined in `tailwind.config.js` for consistency

### Testing Colors

Visit `/color-test` to see solid hex color blocks and verify rendering consistency across devices.

### Image Normalization

To normalize images to sRGB (recommended for production):

```bash
npm run normalize:images
```

This will:
- Process all images in `/public/images`
- Convert to sRGB color space
- Strip problematic ICC profiles
- Output to `/public/images-normalized/`

To use normalized images, set the environment variable:
```bash
NEXT_PUBLIC_USE_NORMALIZED_IMAGES=true npm run dev
```

**Note**: Normalized images are larger in file size but ensure consistent color rendering across all devices.
