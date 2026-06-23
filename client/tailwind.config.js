/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        onyx: '#0f1115', // deep background — night riding
        slate: {
          card: '#1C1F26', // card / elevation surface
        },
        amber: {
          glow: '#F5A623', // golden hour accent
        },
        cloud: '#F8F9FA', // headings
        mist: '#A0AEC0', // body text
      },
      fontFamily: {
        heading: ['Oswald', 'Montserrat', 'sans-serif'],
        body: ['Inter', 'Open Sans', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 25px -2px rgba(245, 166, 35, 0.45)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(245,166,35,0.4)' },
          '50%': { boxShadow: '0 0 25px 4px rgba(245,166,35,0.25)' },
        },
      },
      animation: {
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
