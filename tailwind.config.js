/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        academic: {
          maroonDark: '#380312',
          maroon: '#4c0519',
          maroonLight: '#881337',
          rose: '#be123c',
          cream: '#fffdfa',
          parchment: '#fef2f2',
          border: '#fecdd3'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', '"Cinzel"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace']
      }
    },
  },
  plugins: [],
}
