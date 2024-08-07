import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    screens: {
      m: '415px',
      wm: '640px',
      t: '768px',
      a4: '858px',
      d: '1024px',
      wd: '1440px'
    },
    extend: {},
  },
  plugins: [],
} satisfies Config

