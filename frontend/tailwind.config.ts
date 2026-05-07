import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#07111F',
        panel: '#0D1728',
        accent: '#7C3AED',
        mint: '#34D399',
        sky: '#38BDF8',
        rose: '#FB7185',
      },
      boxShadow: {
        glow: '0 20px 60px rgba(124, 58, 237, 0.22)',
      },
      backgroundImage: {
        grid: 'radial-gradient(circle at 1px 1px, rgba(148,163,184,0.18) 1px, transparent 0)',
      },
    },
  },
  plugins: [],
} satisfies Config;
