module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00B6F0', // LiteracyPlanet blue/cyan
        secondary: '#FFB800', // LiteracyPlanet yellow/orange
        accent: '#FF5A5F', // coral red
        green: '#00D084', // vivid green
        background: '#F5F7FA', // light background
        text: '#222B45', // dark blue/gray
      },
      gradientColorStops: theme => ({
        ...theme('colors'),
        'primary-accent': '#00B6F0',
        'secondary-accent': '#FFB800',
        'coral': '#FF5A5F',
        'vivid-green': '#00D084',
      }),
    },
  },
  plugins: [],
};