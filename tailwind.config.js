/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: '#9CA3AF',
            a: {
              color: '#60A5FA',
              '&:hover': {
                color: '#3B82F6',
              },
            },
            h1: {
              color: '#F9FAFB',
            },
            h2: {
              color: '#F9FAFB',
            },
            h3: {
              color: '#F9FAFB',
            },
            h4: {
              color: '#F9FAFB',
            },
            strong: {
              color: '#F9FAFB',
            },
            blockquote: {
              color: '#9CA3AF',
              borderLeftColor: '#E50914',
            },
            code: {
              color: '#9CA3AF',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: '#1F1F1F',
              color: '#9CA3AF',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};