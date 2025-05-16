/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F7F0EA',
        primary: {
          dark: '#4D3C2A',
          light: '#AC8F6F',
        },
        text: {
          dark: '#212121',
          light: '#F3F3F3',
        }
      },
    },
  },
  plugins: [],
}