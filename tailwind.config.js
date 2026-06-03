/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'bg-green-900/50', 'text-green-400', 'border-green-700',
    'bg-red-900/50', 'text-red-400', 'border-red-700',
    'bg-gray-800', 'text-gray-400', 'border-gray-600',
    'bg-amber-900/50', 'text-amber-400', 'border-amber-700',
    'bg-yellow-900/50', 'text-yellow-400', 'border-yellow-700',
    'border-t-indigo-500/40',
    'border', 'border-green-700', 'border-red-700', 'border-gray-600', 'border-amber-700', 'border-yellow-700',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#1B2A4A',
          light: '#243560',
          dark: '#121d33',
        },
        gold: {
          DEFAULT: '#C9A84C',
          light: '#D4B96A',
          dark: '#A88A3A',
        },
      },
      fontFamily: {
        outfit: ['var(--font-outfit)', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.2em',
      },
    },
  },
  plugins: [],
}
