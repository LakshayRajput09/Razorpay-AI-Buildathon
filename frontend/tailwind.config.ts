import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Institutional Private Banking Palette
        canvas: '#0B0B0A',
        surface: '#121211',
        card: '#151514',
        'surface-elevated': '#1A1917',
        'card-elevated': '#1A1917',
        'fin-border': 'rgba(242, 238, 229, 0.10)',
        'fin-border-subtle': 'rgba(242, 238, 229, 0.05)',
        'text-primary': '#F2EEE5',
        'text-secondary': '#A5A198',
        'text-muted': '#706E68',

        // Royal Gold Accents
        gold: {
          DEFAULT: '#B69A5A',
          light: '#D1B56A',
          muted: 'rgba(182, 154, 90, 0.15)',
          border: 'rgba(182, 154, 90, 0.30)',
        },

        // Restrained Financial Semantics
        fin: {
          success: '#66745D',
          'success-bg': 'rgba(102, 116, 93, 0.15)',
          'success-border': 'rgba(102, 116, 93, 0.30)',
          warning: '#9A7940',
          'warning-bg': 'rgba(154, 121, 64, 0.15)',
          'warning-border': 'rgba(154, 121, 64, 0.30)',
          danger: '#713B3B',
          'danger-bg': 'rgba(113, 59, 59, 0.15)',
          'danger-border': 'rgba(113, 59, 59, 0.30)',
          burgundy: '#5A1F28',
        },

        // Backwards compatibility mappings
        money: {
          DEFAULT: '#66745D',
          glow: 'rgba(102, 116, 93, 0.20)',
          muted: '#3D4736',
        },
        risk: {
          critical: '#713B3B',
          high: '#9A7940',
          medium: '#9A7940',
          low: '#66745D',
          glow: 'rgba(113, 59, 59, 0.20)',
        },
        intel: {
          DEFAULT: '#B69A5A',
          glow: 'rgba(182, 154, 90, 0.20)',
          muted: '#6E5C32',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'SF Mono', 'Menlo', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Playfair Display', 'Instrument Serif', 'Georgia', 'serif'],
      },
      borderRadius: {
        DEFAULT: '8px',
        sm: '6px',
        md: '8px',
        lg: '10px',
        xl: '12px',
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fade-in 0.2s ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
