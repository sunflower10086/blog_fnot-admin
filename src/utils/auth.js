/**
 * token存储的键名
 */
const TokenKey = 'token'
const UserKey = 'user'

/**
 * 获取token
 * @returns {string} token值
 */
export function getToken() {
  return localStorage.getItem(TokenKey)
}

/**
 * 设置token
 * @param {string} token - 要存储的token值
 */
export function setToken(token) {
  localStorage.setItem(TokenKey, token)
}

/**
 * 移除token
 */
export function removeToken() {
  localStorage.removeItem(TokenKey)
}

/**
 * 获取用户信息
 * @returns {Object} 用户信息对象
 */
export function getUser() {
  const userStr = localStorage.getItem(UserKey)
  return userStr ? JSON.parse(userStr) : null
}

/**
 * 设置用户信息
 * @param {Object} user - 用户信息对象
 */
export function setUser(user) {
  localStorage.setItem(UserKey, JSON.stringify(user))
}

/**
 * 移除用户信息
 */
export function removeUser() {
  localStorage.removeItem(UserKey)
}

/**
 * 清除所有身份验证相关数据
 */
export function clearAuth() {
  removeToken()
  removeUser()
}

/**
 * 检查是否已登录
 * @returns {boolean} 是否已登录
 */
export function isLoggedIn() {
  return !!getToken()
}

export default {
  getToken,
  setToken,
  removeToken,
  getUser,
  setUser,
  removeUser,
  clearAuth,
  isLoggedIn
} 