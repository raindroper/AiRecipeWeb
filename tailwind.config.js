/** @type {import('tailwindcss').Config} */
export default {
  // 这里配置要扫描的文件路径
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 咱们的品牌色
      colors: {
        primary: '#2979ff', // Varlet 默认蓝
        secondary: '#888888',
      }
    },
  },
  plugins: [],
}