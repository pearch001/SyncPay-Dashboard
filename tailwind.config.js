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
        primary: {
          50: '#FDF8F3',
          100: '#FAEFE2',
          200: '#F4DBC4',
          300: '#EEC3A1',
          400: '#E2A06D',
          500: '#D4843B',
          600: '#B86F2F',
          700: '#965825',
          800: '#6E4120',
          900: '#4A2C15',
          950: '#2B1A0C',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
    },
  },
  plugins: [],
}
