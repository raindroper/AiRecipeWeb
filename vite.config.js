import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import components from 'unplugin-vue-components/vite'
import autoImport from 'unplugin-auto-import/vite'
import { VarletUIResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    components({
      resolvers: [VarletUIResolver({ importStyle: false })],
    }),
    autoImport({
      resolvers: [VarletUIResolver({ autoImport: true, importStyle: false })],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    proxy: {
      // 只要请求路径以 /local-func 开头，就代理到本地云函数地址
      '/local-func': {
        target: 'http://localhost:18090', // 你的本地云函数端口
        changeOrigin: true, // 允许跨域
        rewrite: (path) => path.replace(/^\/local-func/, ''), // 去掉前缀再转发
      },
    },
  },
})
