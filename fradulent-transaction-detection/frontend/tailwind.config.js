/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        colors: {
        primary:  "#223b6d",
        secondary: "#212121",
       
      },
    },
  },
  plugins: [],
}

