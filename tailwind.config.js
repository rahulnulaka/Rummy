/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colours:{
        blue:{
          300 : "#e0e7fe",
          400 : "#8a86da",
          600 : "#5046e4",
        }
      }
    },
  },
  plugins: [],
}

