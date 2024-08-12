/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      margin: {
      '7': '7%',
  },right:{
    '90':'90%'
  }},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}