/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#0D0D0D',
        dark1: '#111111',
        dark2: '#181818',
        dark3: '#202020',
        dark4: '#2A2A2A',
        gold: '#C9A84C',
        'gold-light': '#E8C96D',
        'gold-pale': '#F5E4B3',
      },
      fontFamily: {
        cormorant: ['Cormorant Garamond', 'serif'],
        josefin: ['Josefin Sans', 'sans-serif'],
        dm: ['DM Sans', 'sans-serif'],
      },
      borderRadius: { none: '0px' },
      animation: {
        marquee: 'marqueeScroll 28s linear infinite',
        float: 'floatY 6s ease-in-out infinite',
        'float-slow': 'floatY 8s ease-in-out infinite',
        'fade-up': 'fadeUp 0.7s cubic-bezier(0.76,0,0.24,1) forwards',
        'gold-reveal': 'goldReveal 0.9s cubic-bezier(0.76,0,0.24,1) forwards',
        'line-draw': 'lineDraw 1.2s ease forwards',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        marqueeScroll: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
        floatY: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(32px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        goldReveal: {
          from: { clipPath: 'inset(0 100% 0 0)' },
          to: { clipPath: 'inset(0 0% 0 0)' },
        },
        lineDraw: {
          from: { strokeDashoffset: '200' },
          to: { strokeDashoffset: '0' },
        },
        pulseGold: {
          '0%,100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
    },
  },
  plugins: [],
}

