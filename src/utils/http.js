import axios from 'axios'

// 创建 axios 实例
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
http.interceptors.request.use(
  config => {
    // 从本地存储获取 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 响应拦截器
http.interceptors.response.use(
  response => {
    // 如果响应成功并且有数据，则直接返回数据部分
    return response.data
  },
  error => {
    // 处理 401 错误
    if (error.response && error.response.status === 401) {
      // 清除本地存储中的认证信息
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      // 重定向到登录页
      window.location.href = '/login'
    }
    
    // 创建统一的错误信息
    const errorMessage = error.response?.data?.message || '服务器错误，请稍后再试'
    
    return Promise.reject({
      message: errorMessage,
      status: error.response?.status,
      data: error.response?.data
    })
  }
)

// 封装 GET 请求
export const get = (url, params = {}) => {
  return http.get(url, { params })
}

// 封装 POST 请求
export const post = (url, data = {}) => {
  return http.post(url, data)
}

// 封装 PUT 请求
export const put = (url, data = {}) => {
  return http.put(url, data)
}

// 封装 DELETE 请求
export const del = (url, params = {}) => {
  return http.delete(url, { params })
}

// 封装上传文件
export const upload = (url, file, onProgress) => {
  const formData = new FormData()
  formData.append('file', file)
  
  return http.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: progressEvent => {
      if (onProgress && progressEvent.total) {
        const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(percentage)
      }
    }
  })
}

export default {
  get,
  post,
  put,
  del,
  upload,
  // 导出原始 axios 实例，以便需要时直接使用
  instance: http
} 