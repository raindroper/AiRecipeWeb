/** @type {import('tailwindcss').Config} */
export default {
  // 这里配置要扫描的文件路径
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // 咱们的品牌色
      colors: {
        // 主色：活力暖橙 (用于按钮、选中状态)
        primary: '#f97316',
        // 辅色：奶油米白 (用于背景、浅色卡片)
        secondary: '#fff7ed',
        // 强调色：焦糖色 (用于重要文字)
        accent: '#9a3412',
      },
    },
  },
  plugins: [],
}
