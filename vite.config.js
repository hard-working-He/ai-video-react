import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'AI Video React App',
        short_name: 'AI Video',
        description: 'AI Video Processing Application',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
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
