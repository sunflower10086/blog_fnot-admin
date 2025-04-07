import { post } from '@/utils/http'

/**
 * 用户登录
 * @param {Object} credentials - 登录凭据
 * @param {string} credentials.username - 用户名
 * @param {string} credentials.password - 密码
 * @returns {Promise<Object>} 包含令牌和用户信息的响应
 */
export const login = (credentials) => {
  return post('/auth/login', credentials)
}

/**
 * 刷新令牌
 * @returns {Promise<Object>} 包含新令牌的响应
 */
export const refreshToken = () => {
  return post('/auth/refresh')
}

/**
 * 注销用户
 * @returns {Promise<Object>} 注销结果
 */
export const logout = () => {
  return post('/auth/logout')
}

/**
 * 更新用户个人信息
 * @param {Object} profileData - 个人信息
 * @returns {Promise<Object>} 更新后的用户信息
 */
export const updateProfile = (profileData) => {
  return post('/auth/profile', profileData)
}

/**
 * 修改密码
 * @param {Object} passwordData - 密码数据
 * @param {string} passwordData.currentPassword - 当前密码
 * @param {string} passwordData.newPassword - 新密码
 * @returns {Promise<Object>} 操作结果
 */
export const changePassword = (passwordData) => {
  return post('/auth/change-password', passwordData)
}

/**
 * 模拟登录 API (开发测试用)
 * 后端 API 完成前使用此函数
 * @param {Object} credentials - 登录凭据
 * @returns {Promise<Object>} 包含令牌和用户信息的模拟响应
 */
export const mockLogin = (credentials) => {
  return new Promise((resolve, reject) => {
    // 模拟网络延迟
    setTimeout(() => {
      // 模拟验证
      if (credentials.username === 'admin' && credentials.password === 'admin123') {
        resolve({
          token: 'mock-jwt-token-123456789',
          user: {
            id: 1,
            username: 'admin',
            name: '管理员',
            role: 'admin',
            email: 'admin@example.com',
            description: '系统管理员账号'
          }
        })
      } else {
        reject({
          message: '用户名或密码错误'
        })
      }
    }, 800) // 模拟 800ms 网络延迟
  })
}

/**
 * 模拟更新个人信息 API (开发测试用)
 * @param {Object} profileData - 个人信息
 * @returns {Promise<Object>} 更新后的用户信息
 */
export const mockUpdateProfile = (profileData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 1,
        username: profileData.username,
        name: profileData.name,
        email: profileData.email,
        description: profileData.description,
        role: 'admin'
      })
    }, 800)
  })
}

/**
 * 模拟修改密码 API (开发测试用)
 * @param {Object} passwordData - 密码数据
 * @returns {Promise<Object>} 成功响应
 */
export const mockChangePassword = (passwordData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (passwordData.currentPassword === 'admin123') {
        resolve({ success: true })
      } else {
        reject({ message: '当前密码不正确' })
      }
    }, 800)
  })
} 