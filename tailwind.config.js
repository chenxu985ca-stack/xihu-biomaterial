/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Precision Metallurgical Palette
        graphite: {
          DEFAULT: '#1A1D20',
          50: '#F0F1F2',
          100: '#E1E3E5',
          200: '#C4C7CB',
          300: '#A6ABB1',
          400: '#898F97',
          500: '#6B737D',
          600: '#4E5763',
          700: '#303B49',
          800: '#1A1D20',
          900: '#0F1114',
        },
        sapphire: {
          DEFAULT: '#0052CC',
          50: '#E6EEFA',
          100: '#CCDDF5',
          200: '#99BBEB',
          300: '#6699E0',
          400: '#3377D6',
          500: '#0052CC',
          600: '#0042A3',
          700: '#00317A',
          800: '#002152',
          900: '#001029',
          glow: '#0066FF',
        },
        warm: {
          bronze: '#A67C52',   // Heritage accent
          copper: '#C4956A',   // Hover states, subtle warmth
          gold: '#D4AF37',     // 30-year milestones, awards
        },
      },
      fontFamily: {
        // Geometric precision for headings, clean sans for body
        heading: ['"DM Sans"', '"Noto Sans SC"', 'sans-serif'],
        body: ['"Noto Sans SC"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial-sapphire': 'radial-gradient(ellipse at center, rgba(0,82,204,0.15) 0%, transparent 70%)',
      },
      letterSpacing: {
        precision: '0.02em',
        technical: '0.04em',
        hero: '-0.02em',
      },
    },
  },
  plugins: [],
};
