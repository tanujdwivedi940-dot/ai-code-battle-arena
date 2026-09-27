import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cp: {
          bg: '#0F1115',
          nav: '#0B0D10',
          card: '#171A21',
          border: '#2A2F38',
          blue: '#3B82F6',
          blueHover: '#60A5FA',
          heading: '#F1F5F9',
          text: '#CBD5E1',
          muted: '#94A3B8',
          success: '#22C55E',
          accent: '#F59E0B',
          error: '#EF4444',
        },
      },
    },
  },
  plugins: [],
};

export default config;