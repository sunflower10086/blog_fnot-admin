import axios from 'axios'
import { ElMessage } from 'element-plus'
import config from '@/config/config'
import { getToken, clearAuth } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: config.baseApi, // 从配置文件获取API的基础URL
  timeout: config.apiTimeout // 从配置文件获取超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 使用auth.js中的getToken函数获取token
    const token = getToken()
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
      console.log('请求URL:', config.url, '添加token成功')
    } else {
      console.warn('请求URL:', config.url, '无token')
    }
    return config
  },
  error => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
      if (res.code === 200) {
          return res.data
      } else {
          console.error('响应错误:', response.config.url, res.msg)

          // 处理401未授权错误
          if (res.code === 401) {
              console.warn('认证失败(401)，正在清除认证信息')
              // 使用auth.js中的clearAuth函数清除认证信息
              clearAuth()

              ElMessage({
                  message: '登录已过期，请重新登录',
                  type: 'error',
                  duration: 5 * 1000
              })

              // 重定向到登录页面
              setTimeout(() => {
                  window.location.href = '/login'
              }, 1500)
          } else {
              // 其他错误显示错误消息
              ElMessage({
                  message: res.msg || '请求失败',
                  type: 'error',
                  duration: 5 * 1000
              })
          }
          console.log('响应错误:', res.msg)
          return Promise.reject(res.msg)
      }

  }
)

export default service 