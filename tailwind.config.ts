import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './composables/**/*.{js,ts}',
    './plugins/**/*.{js,ts}',
    './app.vue',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Nuxt brand colors
        nuxt: {
          50: '#e6fff5',
          100: '#b3ffe0',
          200: '#80ffc9',
          300: '#4dffb3',
          400: '#1aff9c',
          500: '#00dc82', // Nuxt green
          600: '#00b36a',
          700: '#008a51',
          800: '#006038',
          900: '#003820',
        },
        // Loko.rs / Rust brand colors
        loko: {
          50: '#fff3ef',
          100: '#ffddd4',
          200: '#ffc4b0',
          300: '#ffa08a',
          400: '#f07050',
          500: '#ce4a12', // Rust/Loko orange
          600: '#a83b0e',
          700: '#822d0a',
          800: '#5c2007',
          900: '#361204',
        },
        // Dark background palette
        dark: {
          50: '#f8f8fc',
          100: '#e2e2f0',
          200: '#b8b8d0',
          300: '#8080a8',
          400: '#4a4a70',
          500: '#2a2a45',
          600: '#1e1e35',
          700: '#15152a',
          800: '#0d0d1f',
          900: '#020210', // Nuxt dark bg
        },
      },
      fontFamily: {
        mono: [
          'JetBrains Mono',
          'Fira Code',
          'Cascadia Code',
          'Consolas',
          'monospace',
        ],
      },
    },
  },
  plugins: [],
} satisfies Config
