/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'deep-black': '#0a0a0a',
        'dark-gray': '#1a1a1a',
        'parchment': '#e8e4d9',
        'ancient-gold': '#c9a84c',
        'end-purple': '#8b5cf6',
        'blood-red': '#991b1b',
        'stone-gray': '#6b7280',
      },
      fontFamily: {
        'title': ['Cinzel', 'serif'],
        'body': ['Inter', 'sans-serif'],
        'narrative': ['Crimson Text', 'serif'],
        'prophecy': ['Caveat', 'cursive'],
      },
    },
  },
  plugins: [],
};
