/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
    './public/**/*.svg',
  ],
  theme: {
    extend: {
      colors: {
        background: 'oklch(0 0 0)', // Black
        foreground: 'oklch(1 0 0)', // White
        card: 'oklch(0.1 0 0)', // Very dark gray
        'card-foreground': 'oklch(1 0 0)',
        popover: 'oklch(0.12 0 0)',
        'popover-foreground': 'oklch(1 0 0)',
        primary: 'oklch(0.7 0.18 264)', // Bright blue
        'primary-foreground': 'oklch(1 0 0)',
        secondary: 'oklch(0.85 0.13 300)', // Lilac
        'secondary-foreground': 'oklch(1 0 0)',
        muted: 'oklch(0.2 0 0)',
        'muted-foreground': 'oklch(0.8 0 0)',
        accent: 'oklch(0.85 0.18 200)', // Vibrant cyan
        'accent-foreground': 'oklch(1 0 0)',
        destructive: 'oklch(0.7 0.25 27)', // Bright red
        border: 'oklch(0.85 0 0 / 20%)',
        input: 'oklch(0.85 0 0 / 10%)',
        ring: 'oklch(0.7 0.18 264 / 60%)',
        sidebar: 'oklch(0.12 0 0)',
        'sidebar-foreground': 'oklch(1 0 0)',
        'sidebar-primary': 'oklch(0.7 0.18 264)',
        'sidebar-primary-foreground': 'oklch(1 0 0)',
        'sidebar-accent': 'oklch(0.85 0.13 300)', // Lilac
        'sidebar-accent-foreground': 'oklch(1 0 0)',
        'sidebar-border': 'oklch(0.85 0 0 / 20%)',
        'sidebar-ring': 'oklch(0.7 0.18 264 / 60%)',
        // Chart colors
        'chart-1': 'oklch(0.7 0.18 264)',
        'chart-2': 'oklch(0.85 0.13 300)',
        'chart-3': 'oklch(0.85 0.18 200)',
        'chart-4': 'oklch(0.7 0.25 27)',
        'chart-5': 'oklch(0.95 0.15 100)',
        secondary: '#784890',
      },
      borderRadius: {
        sm: 'calc(0.625rem - 4px)',
        md: 'calc(0.625rem - 2px)',
        lg: '0.625rem',
        xl: 'calc(0.625rem + 4px)',
      },
    },
  },
  plugins: [],
}; 