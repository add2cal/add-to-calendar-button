/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: ['class', '.atcb-dark'],
  theme: {
    screens: {
      xs: '430px',
      sm: '576px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
      '2xl': '1600px',
    },
    container: {
      xl: '1024px',
      '2xl': '1024px',
      center: true,
      padding: '2rem',
    },
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        white: '#fff',
        black: '#111',
        primary: '#9755ff',
        'primary-light': '#cbaaff',
        'primary-dark': '#7644c6',
        secondary: '#ffa255',
        'secondary-light': '#ffd0aa',
        background: '#f1eff8',
        'background-dark': '#1b1d21',
        text: '#333',
        'text-dark': '#e6e2ed',
      },
    },
  },
  plugins: [],
}
