/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './App.tsx',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#f78e2c',
          orangeHover: '#ffffff', // For hover states on orange buttons
          slate: {
            deep: '#0b1219',
            dark: '#15222e',
            darker: '#080d11',
          },
        },
      },
      fontFamily: {
        heading: ['Syncopate', 'sans-serif'],
        elegant: ['Playfair Display', 'serif'],
        sans: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

