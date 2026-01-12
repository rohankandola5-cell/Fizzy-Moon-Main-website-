/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    // Ensure images maintain color consistency
    // Next.js Image component handles color profiles automatically
    // but we ensure sRGB normalization via the normalize-images script
  },
};

export default nextConfig;

