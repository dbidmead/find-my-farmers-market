/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#b45309', // Amber-700
          light: '#d97706',   // Amber-600
          dark: '#78350f',    // Amber-900
        },
        earth: {
          soil: '#78350f',   // Rich brown
          bark: '#4e342e',   // Warm brown
          leaf: '#3d613d',   // Forest green
          stone: '#d6d3d1',  // Stone-300
          sand: '#fef3c7',   // Amber-100
        },
        accent: {
          carrot: '#ea580c', // Orange-600
          tomato: '#dc2626', // Red-600
          apple: '#b91c1c',  // Red-800
          greens: '#166534', // Green-800
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        montserrat: ['var(--font-montserrat)'],
      },
      backgroundImage: {
        'market-pattern': "url('/market-pattern.svg')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography')
  ],
} 