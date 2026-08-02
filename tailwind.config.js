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
        gag: {
          bg: '#0b0b0e',
          card: '#15151a',
          cardHover: '#1c1c24',
          border: '#262630',
          accent: '#00e5ff',
          pro: '#ffd700',
          proDark: '#ff9900',
          upvote: '#ff4500',
          downvote: '#7193ff',
          textMuted: '#9e9eb0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
