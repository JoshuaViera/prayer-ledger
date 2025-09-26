import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // New Modern Dark Palette
        border: 'hsl(215 27.9% 16.9%)', // A subtle dark border
        input: 'hsl(215 27.9% 16.9%)', // Input field borders/backgrounds
        ring: 'hsl(217.2 91.2% 59.8%)', // Focus ring color (matches primary)

        background: 'hsl(222.2 84% 4.9%)', // Main dark background
        foreground: 'hsl(210 40% 98%)', // Main light text

        primary: {
          DEFAULT: 'hsl(217.2 91.2% 59.8%)', // Vibrant Blue/Purple for main accents
          foreground: 'hsl(222.2 47.4% 11.2%)', // Darker text on primary
        },
        secondary: {
          DEFAULT: 'hsl(217.2 32.6% 17.5%)', // Secondary dark background for elements
          foreground: 'hsl(210 40% 98%)', // Light text on secondary
        },
        muted: {
          DEFAULT: 'hsl(215 27.9% 16.9%)', // Muted background for less prominent elements
          foreground: 'hsl(217.2 32.6% 17.5%)', // Muted foreground text
        },
        accent: {
          DEFAULT: 'hsl(217.2 32.6% 17.5%)', // Accent color (can be subtle or vibrant depending on use)
          foreground: 'hsl(210 40% 98%)', // Light text on accent
        },
        destructive: {
          DEFAULT: 'hsl(0 62.8% 30.6%)', // Red for destructive actions
          foreground: 'hsl(210 40% 98%)', // Light text on destructive
        },
        card: {
          DEFAULT: 'hsl(217.2 32.6% 17.5%)', // Card background
          foreground: 'hsl(210 40% 98%)', // Light text on card
        },
        popover: {
          DEFAULT: 'hsl(222.2 84% 4.9%)', // Popover background
          foreground: 'hsl(210 40% 98%)', // Light text on popover
        },
        // More specific dark grays and vibrant tones
        slate: {
          950: '#020617', // Deeper than default slate-950
          900: '#0F172A', // Our standard dark card background
          800: '#1e293b',
          700: '#334155',
          50: '#f8fafc', // Lightest text
        },
        zinc: {
          800: '#27272a',
          700: '#3f3f46',
        },
        purple: {
          500: '#8b5cf6', // Example vibrant purple
        },
        blue: {
          500: '#3b82f6', // Example vibrant blue
        },
        green: {
          500: '#22c55e', // Example vibrant green
        },
        amber: {
          500: '#f59e0b', // Keep amber for answered prayers / gold accents
        },
        rose: {
          500: '#f43f5e',
        },
        teal: {
          500: '#14b8a6',
        },
        sky: {
          500: '#0ea5e9',
        },
        violet: {
          500: '#8b5cf6',
        },
      },
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
      boxShadow: {
        'card': '0 4px 10px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)', // Stronger shadow for floating effect
        'card-hover': '0 6px 15px rgba(0, 0, 0, 0.4), 0 2px 5px rgba(0, 0, 0, 0.3)', // Even stronger on hover
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config