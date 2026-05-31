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
      animation: {
        'fade-in-up': 'fadeInUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
        'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'reveal-line': 'revealLine 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'grid-pulse': 'gridPulse 3s ease-in-out infinite',
        'precision-draw': 'precisionDraw 0.8s ease forwards',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(30px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        revealLine: {
          from: { transform: 'scaleX(0)' },
          to: { transform: 'scaleX(1)' },
        },
        gridPulse: {
          '0%, 100%': { opacity: '0.03' },
          '50%': { opacity: '0.08' },
        },
        precisionDraw: {
          from: { strokeDashoffset: '100' },
          to: { strokeDashoffset: '0' },
        },
      },
      backgroundImage: {
        'grid-pattern': 'linear-gradient(rgba(0,82,204,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,82,204,0.05) 1px, transparent 1px)',
        'grid-pattern-dark': 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
        'dot-matrix': 'radial-gradient(circle, rgba(0,82,204,0.08) 1px, transparent 1px)',
        'gradient-radial-sapphire': 'radial-gradient(ellipse at center, rgba(0,82,204,0.15) 0%, transparent 70%)',
      },
      backgroundSize: {
        'grid-sm': '40px 40px',
        'grid-lg': '80px 80px',
        'dot-sm': '20px 20px',
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
