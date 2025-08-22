/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,html}'],
  theme: {
    extend: {
      fontSize: {
        // Dynamic text sizing
        'xs-responsive': ['clamp(0.65rem, 1.5vw, 0.75rem)', { lineHeight: '1.4' }],
        'sm-responsive': ['clamp(0.75rem, 2vw, 0.875rem)', { lineHeight: '1.5' }],
        'base-responsive': ['clamp(0.875rem, 2.5vw, 1rem)', { lineHeight: '1.6' }],
        'lg-responsive': ['clamp(1rem, 3vw, 1.125rem)', { lineHeight: '1.6' }],
        'xl-responsive': ['clamp(1.125rem, 3.5vw, 1.25rem)', { lineHeight: '1.5' }],
        '2xl-responsive': ['clamp(1.25rem, 4vw, 1.5rem)', { lineHeight: '1.4' }],
        '3xl-responsive': ['clamp(1.5rem, 5vw, 1.875rem)', { lineHeight: '1.3' }],
        '4xl-responsive': ['clamp(1.875rem, 6vw, 2.25rem)', { lineHeight: '1.2' }],
        '5xl-responsive': ['clamp(2.25rem, 7vw, 3rem)', { lineHeight: '1.1' }],
      },
      spacing: {
        // Dynamic spacing
        'responsive-xs': 'clamp(0.25rem, 1vw, 0.5rem)',
        'responsive-sm': 'clamp(0.5rem, 2vw, 1rem)',
        'responsive-md': 'clamp(1rem, 3vw, 1.5rem)',
        'responsive-lg': 'clamp(1.5rem, 4vw, 2rem)',
        'responsive-xl': 'clamp(2rem, 5vw, 3rem)',
        'responsive-2xl': 'clamp(3rem, 6vw, 4rem)',
        'responsive-3xl': 'clamp(4rem, 8vw, 6rem)',
      },
      maxWidth: {
        'responsive-sm': 'clamp(20rem, 50vw, 24rem)',
        'responsive-md': 'clamp(28rem, 60vw, 32rem)',
        'responsive-lg': 'clamp(32rem, 70vw, 42rem)',
        'responsive-xl': 'clamp(42rem, 75vw, 48rem)',
        'responsive-2xl': 'clamp(48rem, 80vw, 56rem)',
        'responsive-3xl': 'clamp(56rem, 85vw, 64rem)',
        'responsive-4xl': 'clamp(64rem, 90vw, 72rem)',
        'responsive-6xl': 'clamp(72rem, 95vw, 80rem)',
      }
    },
  },
  plugins: [],
}