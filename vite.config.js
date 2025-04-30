import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://aigc-files.bigmodel.cn',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // 添加必要的请求头
            proxyReq.setHeader('Origin', 'https://aigc-files.bigmodel.cn');
            proxyReq.setHeader('Referer', 'https://aigc-files.bigmodel.cn');
          });
        }
      }
    }
  }
})
