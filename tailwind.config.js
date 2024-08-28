/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App/**/*.{js,jsx,ts,tsx}", "./app/**/*.{js,jsx,ts,tsx}","./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-r': 'linear-gradient(to right, #6a1b9a, #2196f3)',
        'gradient-l': 'linear-gradient(to left, #6a1b9a, #2196f3)',
        'gradient-t': 'linear-gradient(to top, #6a1b9a, #2196f3)',
        'gradient-b': 'linear-gradient(to bottom, #6a1b9a, #2196f3)',
      },
      colors: {
        mainc: "#E8E5FA",
      },
      fontFamily: {
        outfit: ['outfit', 'sans-serif'],
        'outfit-medium': ['outfit-medium', 'sans-serif'],
        'outfit-bold': ['outfit-bold', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
