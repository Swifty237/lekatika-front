/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        'eb-garamond': ['EB Garamond', 'serif'],
        'suse': ['SUSE', 'sans-serif'],
      },
    },
  },
  plugins: [],
};