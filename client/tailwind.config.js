/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",       // Nếu bạn dùng Next.js
    "./components/**/*.{js,ts,jsx,tsx}",  // Thư mục components
    "./app/**/*.{js,ts,jsx,tsx}",         // Nếu bạn dùng folder app mới
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
