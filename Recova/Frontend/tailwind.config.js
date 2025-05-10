// /** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      animation: {
        'spin-delay': 'spin 2s ease-in-out 1s infinite',
      },
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },

    
      colors: {
        primary:  "#223b6d",
        secondary: "#212121",
       
      },

      fontFamily: {
        cabin:[
          'Cabin',
          'sans-serif'
        ],
        opensans:[
          'Open Sans',
          'sans-serif'
        ],

        poppinsBold: ['poppins-bold', 'sans-serif'],
        poppinsExtraLight: ['poppins-extralight', 'sans-serif'],
        poppinsLight: ['poppins-light', 'sans-serif'],
        poppinsMedium: ['poppins-medium', 'sans-serif'],
        poppinsRegular: ['poppins-regular', 'sans-serif'],
        poppinsSemiBold: ['poppins-semibold', 'sans-serif'],
        poppinsThin: ['poppins-thin', 'sans-serif'],
        robotoBold: ['roboto-bold', 'sans-serif'],
        robotoLight: ['roboto-light', 'sans-serif'],
        robotoMedium: ['roboto-medium', 'sans-serif'],
        robotoRegular: ['roboto-regular', 'sans-serif'],
        robotoThin: ['roboto-thin', 'sans-serif']
      },
    },
  },
  plugins: [],
}

