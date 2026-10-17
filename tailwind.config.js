/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        finora: {
          deepNavy: '#0C1830',
          royalNavy: '#172A47',
          gold: '#E8C66D',
          softGold: '#F5D98E',
          lightBg: '#F5F7FB',
          mainText: '#182338',
          mutedText: '#778197',
          positive: '#16A085',
          warning: '#E9A23B',
          negative: '#DC5A63',
          darkBg: '#0B1220',
          darkSurface: '#111C30',
          darkElevated: '#172A47',
          darkText: '#F3F6FC',
          darkMuted: '#A8B4C8',
        }
      }
    },
  },
  plugins: [],
}
