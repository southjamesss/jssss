/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Adding Poppins as a custom font
        sans: ['Poppins', 'Arial', 'sans-serif'],
      },
      colors: {
        // You can extend colors as well
        'primary': '#4A90E2', // Custom primary color
        'secondary': '#FF6347', // Custom secondary color
      },
      spacing: {
        // Custom spacing (example)
        '128': '32rem', // You can use this as a custom spacing value (for margins, paddings, etc.)
      },
      fontSize: {
        // Example of custom font sizes
        'xxs': '0.625rem', // 10px
      }
    },
  },
  plugins: [],
}