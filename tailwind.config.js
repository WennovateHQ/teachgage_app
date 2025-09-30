/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'teachgage-blue': '#06325C',
        'teachgage-dark-blue': '#021F3A',
        'teachgage-medium-blue': '#073867',
        'teachgage-navy': '#1A2434',
        'teachgage-green': '#41543C',
        'teachgage-orange': '#F48C06',
        'teachgage-cream': '#FFF2E1',
        'darken': '#2F327D',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      animation: {
        'floating': 'floating 3s ease-in-out infinite',
        'floating-4': 'floating-4 4s ease-in-out infinite',
      },
      keyframes: {
        floating: {
          '0%': { transform: 'translate(0, 0px)' },
          '50%': { transform: 'translate(0, 8px)' },
          '100%': { transform: 'translate(0, -0px)' }
        },
        'floating-4': {
          '0%': { transform: 'translate(0, 0px)' },
          '50%': { transform: 'translate(0, 8px)' },
          '100%': { transform: 'translate(0, -0px)' }
        }
      }
    },
  },
  plugins: [],
}
