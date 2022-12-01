/* eslint-disable no-undef */
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
        twitter: '#1da1f2',
        npm: '#cb3837',
      },
      animation: {
        marquee: 'marquee 60s linear infinite',
        marquee2: 'marquee2 60s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        marquee2: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0%)' },
        },
      },
    },
  },
  plugins: [require('@headlessui/tailwindcss')({ prefix: 'ui' })],
};
