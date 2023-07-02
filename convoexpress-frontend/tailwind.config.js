/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg': '#16213E',
        'contactBG': '#3a3a6b8f',
        'primary': '#1A1A2E',
        'primary-fade': '#1a1a2ea1',
        'secondary': '#0F3460',
        'text-fade': '#BFBFBF',
        'accent': '#E94560',
        'accent-fade': '#D9415A',
      },
      fontFamily: {
        'lobster': 'Lobster, cursive'
      }
    },
  },
  plugins: [],
}

