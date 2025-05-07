import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx',
  },
  server: {
    historyApiFallback: true, // 👈 保证前端路由刷新不会报错
    proxy: {
      '/zhipu': {
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
      },
      '/api': {
        //target: 'http://localhost:8080',
        target: 'http://81.68.224.194:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
      }
    } 
  }
})
