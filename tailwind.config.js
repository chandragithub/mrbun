/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bun: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#78350f',
          900: '#451a03',
          dark: '#351608',
          crimson: '#dc2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Montserrat', 'sans-serif']
      },
      boxShadow: {
        'warm': '0 10px 25px -5px rgba(217, 119, 6, 0.15), 0 8px 10px -6px rgba(217, 119, 6, 0.1)',
        'warm-lg': '0 20px 35px -10px rgba(180, 83, 9, 0.25)',
      }
    },
  },
  plugins: [],
}
