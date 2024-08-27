/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "selector",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      }
    },
    extend: {
      colors: {
        'text': 'hsl(var(--text) / <alpha-value>)',
        "cream": "hsl(var(--cream) / <alpha-value>)",
        "muted": "hsl(var(--muted) / <alpha-value>)",
        'background': 'hsl(var(--background) / <alpha-value>)',
        'primary': 'hsl(var(--primary) / <alpha-value>)',
        'secondary': 'hsl(var(--secondary) / <alpha-value>)',
        'accent': 'hsl(var(--accent) / <alpha-value>)',
      },
      fontWeight: {
        normal: '400',
        bold: '700',
      },
    },
  }
}