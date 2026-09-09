/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#5B321E', light: '#7A4430', dark: '#3D2010' },
        secondary: { DEFAULT: '#D97706', light: '#F59E0B', dark: '#B45309' },
        accent: '#F59E0B',
        cafe: { bg: '#FFF8F0', card: '#FFFAF5', border: '#F3E8D8' },
        success: '#16A34A',
        error: '#DC2626',
        warning: '#D97706',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'bounce-in': 'bounceIn 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        slideInRight: { from: { transform: 'translateX(100%)', opacity: 0 }, to: { transform: 'translateX(0)', opacity: 1 } },
        slideUp: { from: { transform: 'translateY(20px)', opacity: 0 }, to: { transform: 'translateY(0)', opacity: 1 } },
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        bounceIn: { '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' }, '40%': { transform: 'translateY(-12px)' }, '60%': { transform: 'translateY(-6px)' } },
      },
      boxShadow: {
        card: '0 4px 24px rgba(91, 50, 30, 0.08)',
        'card-hover': '0 8px 40px rgba(91, 50, 30, 0.16)',
        glow: '0 0 20px rgba(217, 119, 6, 0.3)',
      },
    },
  },
  plugins: [],
};
