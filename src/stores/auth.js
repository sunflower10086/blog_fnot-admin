import { defineStore } from 'pinia'
import { login as apiLogin, logout as apiLogout, getUserInfo } from '@/api/user'
import { post } from '@/utils/http'
import { getToken, setToken, getUser, setUser, removeToken, removeUser, clearAuth } from '@/utils/auth'

// 判断是否为开发环境
const isDev = import.meta.env.MODE === 'development'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: getToken() || '',
    user: getUser(),
    isAuthenticated: !!getToken()
  }),
  
  getters: {
    getToken: (state) => state.token,
    getUser: (state) => state.user,
    isUserAuthenticated: (state) => state.isAuthenticated
  },
  
  actions: {
    async login(username, password) {
      try {
        // 使用实际API登录
        const response = await apiLogin({ 
          account: username, 
          password: password 
        })
  
        // 验证API响应
        if (!response || !response.token) {
          throw new Error('登录失败：服务器未返回有效的登录凭证')
        }
  
        // 保存令牌
        this.token = response.token
        this.isAuthenticated = true
        
        // 保存到本地存储
        setToken(response.token)
        
        // 获取用户信息
        await this.fetchUserInfo()
  
        return this.user
      } catch (error) {
        // 清除可能部分设置的认证状态
        this.token = ''
        this.isAuthenticated = false
        clearAuth()
        
        // 根据错误类型提供更具体的错误信息
        if (error.status === 401) {
          throw new Error('用户名或密码错误')
        } else if (error.status === 403) {
          throw new Error('账户已被禁用，请联系管理员')
        } else if (error.status >= 500) {
          throw new Error('服务器错误，请稍后再试')
        } else {
          throw new Error(error.message || '登录失败，请检查网络连接')
        }
      }
    },
    
    async fetchUserInfo() {
      try {
        const userData = await getUserInfo()
        this.user = userData
        setUser(userData)
        return userData
      } catch (error) {
        console.error('获取用户信息失败:', error)
        throw error
      }
    },
    
    async logout() {
      try {
        // 调用登出API
        await apiLogout()
      } catch (error) {
        console.error('登出API调用失败:', error)
      } finally {
        // 无论API是否成功，都清除本地状态
        this.token = ''
        this.user = null
        this.isAuthenticated = false
        
        // 清除本地存储
        clearAuth()
      }
    },
    
    updateUserInfo(userData) {
      // 更新用户信息（不包含令牌）
      this.user = userData
      
      // 更新本地存储
      setUser(userData)
    },
    
    async updateProfile(profileData) {
      try {
        // 在开发环境使用模拟 API，生产环境使用真实 API
        let response;
        if (isDev) {
          response = await mockUpdateProfile(profileData)
        } else {
          response = await post('/auth/profile', profileData)
        }
        
        // 更新用户信息
        this.updateUserInfo(response)
        
        return response
      } catch (error) {
        throw new Error(error.message || '更新个人信息失败')
      }
    },
    
    async changePassword(passwordData) {
      try {
        // 在开发环境使用模拟 API，生产环境使用真实 API
        if (isDev) {
          await mockChangePassword(passwordData)
        } else {
          await post('/auth/change-password', passwordData)
        }
        
        return { success: true }
      } catch (error) {
        throw new Error(error.message || '修改密码失败')
      }
    },
    
    checkAuth() {
      return this.isAuthenticated
    }
  }
}) 