import type { Config } from 'tailwindcss'

export default {
  content: [
    "./app.vue",
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.{vue,js,ts}",
    "./pages/**/*.{vue,js,ts}",
    "./plugins/**/*.{js,ts}",
    "./composables/**/*.{js,ts}",
    "./utils/**/*.{js,ts}",
    "./App.{js,ts,vue}",
    "./app.{js,ts,vue}",
    "./Error.{js,ts,vue}",
    "./error.{js,ts,vue}",
    "./app.config.{js,ts}",
  ],
  safelist: [
    'border-emerald-500/50',
    'hover:border-emerald-400/60',
    'border-yellow-500/50',
    'hover:border-yellow-400/60',
    'border-red-500/50',
    'hover:border-red-400/60',
    'border-gray-500/50',
    'hover:border-gray-400/60',
    'via-emerald-500/5',
    'via-yellow-500/5',
    'via-red-500/5',
    'via-gray-500/5'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
      },
      borderColor: {
        DEFAULT: 'rgba(255, 255, 255, 0.1)',
      },
      boxShadow: {
        'brand': '0 4px 14px 0 rgba(14, 165, 233, 0.1)',
      },
    },
  },
  plugins: [],
} satisfies Config
