/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3388ff',
        secondary: '#ff0000',
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: true,
  },
} 