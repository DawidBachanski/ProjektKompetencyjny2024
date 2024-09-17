/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'background-dark': '#121212', // Kolor tła całej strony
        'card-bg': '#1F1F1F',        // Kolor tła dla karty przesyłania zdjęć
        'app-bar': '#333333',         // Kolor tła paska aplikacji
        'button-bg': '#444444',       // Kolor tła dla przycisków
        'button-hover': '#555555',    // Kolor tła dla przycisków po najechaniu
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif']
      },
      gridTemplateColumns: {
        '70/30': '70% 28%'
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
