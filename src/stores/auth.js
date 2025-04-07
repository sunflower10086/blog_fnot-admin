import { defineStore } from 'pinia'
import { mockLogin, mockUpdateProfile, mockChangePassword } from '@/api/auth'
import { post } from '@/utils/http'

// 判断是否为开发环境
const isDev = import.meta.env.MODE === 'development'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    isAuthenticated: !!(localStorage.getItem('token') || '')
  }),
  
  getters: {
    getToken: (state) => state.token,
    getUser: (state) => state.user,
    isUserAuthenticated: (state) => state.isAuthenticated
  },
  
  actions: {
    async login(username, password) {
      try {
        // 在开发环境使用模拟登录，生产环境使用真实 API
        let response;
        if (isDev) {
          response = await mockLogin({ username, password })
        } else {
          response = await post('/auth/login', { username, password })
        }
  
        // 保存令牌和用户信息
        const { token: newToken, user: userData } = response
        this.token = newToken
        this.user = userData
        this.isAuthenticated = true
  
        // 保存到本地存储
        localStorage.setItem('token', newToken)
        localStorage.setItem('user', JSON.stringify(userData))
  
        return userData
      } catch (error) {
        throw new Error(error.message || '登录失败')
      }
    },
    
    logout() {
      // 清除令牌和用户信息
      this.token = ''
      this.user = null
      this.isAuthenticated = false
      
      // 清除本地存储
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    
    updateUserInfo(userData) {
      // 更新用户信息（不包含令牌）
      this.user = userData
      
      // 更新本地存储
      localStorage.setItem('user', JSON.stringify(userData))
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