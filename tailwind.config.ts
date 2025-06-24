import type { Config } from 'tailwindcss'

export default {
  content: [
    "index.html",
    "./app/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
     colors:{
      orange:{
        light: "#FCFAF7",
        DEFAULT: "#FA7314"
      }
     },
     fontSize: {
        xs: [
          '0.625rem',
          { lineHeight: '0.75rem', letterSpacing: '0.00625rem' },
        ],
        sm: ['0.625rem', { lineHeight: '1.0625rem' }],
        base: ['0.75rem', { lineHeight: '1.125rem', letterSpacing: '0.01rem' }],
        lg: ['0.875rem', { lineHeight: '1.125rem' }],
        xl: [
          '1.125rem',
          { lineHeight: '1.375rem', letterSpacing: '-0.015rem' },
        ],
        '2xl': ['1.375rem', { lineHeight: '1.625rem' }],
        '3xl': ['3rem', { lineHeight: '3.6rem', letterSpacing: '-0.03rem' }],
        '4xl': ['3.5rem', { lineHeight: '7rem', letterSpacing: '-0.09375rem' }],
      },
      screens: {
        sm: '600px',
        md: '960px',
        lg: '1280px',
        xl: '1920px',
      },
    },
  },
plugins: [],
} satisfies Config