/**
 * 将对象转换为 URL 查询字符串
 * @param {Object} params - 要转换的参数对象
 * @returns {string} 查询字符串
 */
export const objectToQueryString = (params) => {
  if (!params || Object.keys(params).length === 0) return ''
  
  const query = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map(item => `${encodeURIComponent(key)}[]=${encodeURIComponent(item)}`).join('&')
      } else {
        return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
      }
    })
    .join('&')
  
  return query ? `?${query}` : ''
}

/**
 * 解析 API 错误
 * @param {Error} error - 错误对象
 * @returns {Object} 标准化的错误对象
 */
export const parseApiError = (error) => {
  return {
    message: error.message || '发生未知错误',
    status: error.status || 500,
    data: error.data || null,
    isApiError: true
  }
}

/**
 * 重试函数
 * @param {Function} fn - 要重试的函数
 * @param {Object} options - 重试选项
 * @param {number} options.times - 重试次数，默认 3
 * @param {number} options.delay - 重试间隔 (ms)，默认 1000
 * @returns {Promise} 执行结果
 */
export const retry = async (fn, options = {}) => {
  const { times = 3, delay = 1000 } = options
  
  let lastError = null
  
  for (let attempt = 0; attempt < times; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error
      
      if (attempt < times - 1) {
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
  }
  
  throw lastError
}

/**
 * 缓存 API 响应
 * @param {Function} fn - API 调用函数
 * @param {number} ttl - 缓存时间 (ms)，默认 5 分钟
 * @returns {Function} 包装后的函数
 */
export const cacheResponse = (fn, ttl = 5 * 60 * 1000) => {
  const cache = new Map()
  
  return async (...args) => {
    const key = JSON.stringify(args)
    
    const cachedItem = cache.get(key)
    if (cachedItem && Date.now() - cachedItem.timestamp < ttl) {
      return cachedItem.data
    }
    
    const result = await fn(...args)
    cache.set(key, {
      data: result,
      timestamp: Date.now()
    })
    
    return result
  }
} 