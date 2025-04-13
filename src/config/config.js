/**
 * 全局配置文件
 */

// 是否为开发环境
const isDev = import.meta.env.MODE === 'development'

// 环境变量中的API地址，如果不存在则使用默认值
const envBaseApi = import.meta.env.VITE_API_BASE_URL || ''

// 环境变量中的后端服务地址
const envBackendUrl = import.meta.env.VITE_BACKEND_URL || ''

// 从localStorage中获取用户自定义的API地址
const userBaseApi = typeof window !== 'undefined' ? localStorage.getItem('apiBaseUrl') : null

// 从localStorage中获取用户自定义的后端地址
const userBackendUrl = typeof window !== 'undefined' ? localStorage.getItem('backendUrl') : null

const config = {
  // 后端API基础URL (优先级: 用户自定义 > 环境变量 > 默认值)
  baseApi: userBaseApi || envBaseApi || (isDev ? '/api/v1' : '/api/v1'),
  
  // 后端服务地址 (优先级: 用户自定义 > 环境变量 > 默认值)
  backendUrl: userBackendUrl || envBackendUrl || (isDev ? 'http://127.0.0.1:8000' : 'https://api.production.com'),
  
  // API请求超时时间（毫秒）
  apiTimeout: 10000,
  
  // 是否开启调试模式
  debug: isDev,
  
  // 默认分页大小
  defaultPageSize: 10
}

export default config