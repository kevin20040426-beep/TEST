/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0f172a',
        accent: '#3b82f6',
        bull: '#10b981',
        bear: '#ef4444',
      }
    },
  },
  plugins: [],
}