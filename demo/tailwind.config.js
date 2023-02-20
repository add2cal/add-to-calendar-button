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
      center: true,
      padding: '2rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '976px',
        xl: '1200px',
        '2xl': '1200px',
      },
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
        angular: '#C3002F',
        astro: '#0F172A',
        react: '#00d8ff',
        svelte: '#FF3E19',
        vue: '#42b883',
        wordpress: '#21759b',
        javascript: '#f7df1e',
      },
      dropShadow: {
        'light-sm': '0 1px 1px rgb(255 255 255 / 0.05)',
        light: ['0 1px 2px rgb(255 255 255 / 0.1)', '0 1px 1px rgb(255 255 255 / 0.06)'],
        'light-md': ['0 3px 3px rgb(255 255 255 / 0.07)', '0 1px 5px rgb(255 255 255 / 0.06)'],
        'light-lg': ['0 8px 8px rgb(255 255 255 / 0.04)', '0 3px 3px rgb(255 255 255 / 0.1)'],
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
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  plugins: [require('@headlessui/tailwindcss')({ prefix: 'ui' })],
};
