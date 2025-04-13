import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd())
  
  // 获取后端地址，默认为本地开发地址
  const backendUrl = env.VITE_BACKEND_URL || 'http://127.0.0.1:8000'
  
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    optimizeDeps: {
      include: ['jquery']
    },
    server: {
      proxy: {
        // 将/api开头的请求代理到后端服务
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          // rewrite: (path) => path.replace(/^\/api/, '')
        }
      }
    }
  }
})
