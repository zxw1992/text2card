import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Fraunces Variable"', '"Noto Serif SC Variable"', 'serif'],
        sans: ['Inter', 'system-ui', 'Noto Sans SC', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        song: ['"Noto Serif SC Variable"', 'serif'],
        kai: ['"Ma Shan Zheng"', '"Noto Serif SC Variable"', 'serif'],
      },
      colors: {
        ink: {
          50: '#f8f7f4',
          100: '#eeece6',
          200: '#d9d4c7',
          300: '#b8af9c',
          400: '#8d836d',
          500: '#665d4b',
          600: '#4a4338',
          700: '#332e27',
          800: '#1f1c18',
          900: '#0f0d0b',
        },
        paper: '#f4ecd8',
        seal: '#c0392b',
      },
    },
  },
  plugins: [],
} satisfies Config
