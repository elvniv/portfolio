/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Helvetica Neue',
          'Helvetica', // Fallback to Helvetica
          'Arial', // Fallback to Arial
          'sans-serif', // Fallback to system default sans-serif font
        ],
      },
      backgroundColor: {
        'bg-black': '#e5e5e5',
      },
      textColor: {
        primary: '#000000',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
