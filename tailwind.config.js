/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        'primary': '#1B5E20', // deep forest green
        'primary-50': '#E8F5E8', // light green tint
        'primary-100': '#C8E6C9', // green-100
        'primary-200': '#A5D6A7', // green-200
        'primary-300': '#81C784', // green-300
        'primary-400': '#66BB6A', // green-400
        'primary-500': '#4CAF50', // green-500
        'primary-600': '#43A047', // green-600
        'primary-700': '#388E3C', // green-700
        'primary-800': '#2E7D32', // green-800
        'primary-900': '#1B5E20', // green-900
        'primary-foreground': '#FFFFFF', // white

        // Secondary Colors
        'secondary': '#4CAF50', // green-500
        'secondary-50': '#E8F5E8', // light green tint
        'secondary-100': '#C8E6C9', // green-100
        'secondary-200': '#A5D6A7', // green-200
        'secondary-300': '#81C784', // green-300
        'secondary-400': '#66BB6A', // green-400
        'secondary-500': '#4CAF50', // green-500
        'secondary-600': '#43A047', // green-600
        'secondary-700': '#388E3C', // green-700
        'secondary-800': '#2E7D32', // green-800
        'secondary-900': '#1B5E20', // green-900
        'secondary-foreground': '#FFFFFF', // white

        // Accent Colors
        'accent': '#FF9800', // orange-500
        'accent-50': '#FFF3E0', // orange-50
        'accent-100': '#FFE0B2', // orange-100
        'accent-200': '#FFCC80', // orange-200
        'accent-300': '#FFB74D', // orange-300
        'accent-400': '#FFA726', // orange-400
        'accent-500': '#FF9800', // orange-500
        'accent-600': '#FB8C00', // orange-600
        'accent-700': '#F57C00', // orange-700
        'accent-800': '#EF6C00', // orange-800
        'accent-900': '#E65100', // orange-900
        'accent-foreground': '#FFFFFF', // white

        // Background Colors
        'background': '#FAFAFA', // gray-50
        'background-secondary': '#F5F5F5', // gray-100
        'surface': '#FFFFFF', // white
        'surface-secondary': '#F9F9F9', // gray-25

        // Text Colors
        'text-primary': '#212121', // gray-800
        'text-secondary': '#757575', // gray-500
        'text-tertiary': '#9E9E9E', // gray-400
        'text-disabled': '#BDBDBD', // gray-300

        // Status Colors
        'success': '#2E7D32', // green-800
        'success-50': '#E8F5E8', // light green tint
        'success-100': '#C8E6C9', // green-100
        'success-500': '#4CAF50', // green-500
        'success-foreground': '#FFFFFF', // white

        'warning': '#F57C00', // orange-700
        'warning-50': '#FFF8E1', // amber-50
        'warning-100': '#FFECB3', // amber-100
        'warning-500': '#FFC107', // amber-500
        'warning-foreground': '#FFFFFF', // white

        'error': '#C62828', // red-700
        'error-50': '#FFEBEE', // red-50
        'error-100': '#FFCDD2', // red-100
        'error-500': '#F44336', // red-500
        'error-foreground': '#FFFFFF', // white

        'info': '#1976D2', // blue-700
        'info-50': '#E3F2FD', // blue-50
        'info-100': '#BBDEFB', // blue-100
        'info-500': '#2196F3', // blue-500
        'info-foreground': '#FFFFFF', // white

        // Border Colors
        'border': 'rgba(0, 0, 0, 0.12)', // subtle border
        'border-secondary': 'rgba(0, 0, 0, 0.08)', // lighter border
        'border-focus': '#4CAF50', // green-500
      },
      fontFamily: {
        'sans': ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'sans-serif'],
        'data': ['JetBrains Mono', 'Courier New', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '240': '60rem',
      },
      boxShadow: {
        'sm': '0 1px 2px rgba(0, 0, 0, 0.05)',
        'md': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)',
        'lg': '0 4px 8px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.08)',
        'xl': '0 8px 16px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 0 1px var(--color-primary-200)',
      },
      animation: {
        'fade-in': 'fadeIn 200ms ease-out',
        'slide-in-left': 'slideInLeft 300ms ease-out',
        'slide-in-right': 'slideInRight 300ms ease-out',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.5' },
        },
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
      },
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      },
      scale: {
        '102': '1.02',
      },
      zIndex: {
        '1000': '1000',
        '1100': '1100',
        '1200': '1200',
      },
      minHeight: {
        '44': '44px',
      },
      minWidth: {
        '44': '44px',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')({
      strategy: 'class',
    }),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
}