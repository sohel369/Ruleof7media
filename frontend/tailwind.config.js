/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#040409',
        darkSecondary: '#080814',
        neonCyan: '#00f0ff',
        neonPurple: '#b55fe6',
        neonGreen: '#05f0a0',
        neonPink: '#ff3399',
        neonAmber: '#ffaa00',
        neonRed: '#ff3d3d',
        neonBlue: '#3a8dff',
        glassBorder: 'rgba(255, 255, 255, 0.06)',
        rose: '#e11d48',
        roseHover: '#be123c',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
