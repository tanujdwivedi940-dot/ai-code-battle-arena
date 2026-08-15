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
        arena: {
          bg: '#0a0d14',
          card: '#111827',
          border: '#1f2937',
          neonCyan: '#00f2fe',
          neonPurple: '#9d4edd',
          neonRed: '#ff0055',
          neonGreen: '#00ff66',
        },
      },
    },
  },
  plugins: [],
};
export default config;