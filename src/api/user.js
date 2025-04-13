import request from '@/utils/request'

/**
 * 用户登录
 * @param {Object} data - 登录信息
 * @param {string} data.account - 账号
 * @param {string} data.password - 密码
 * @returns {Promise<Object>} 包含token的响应
 */
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

/**
 * 用户登出
 * @returns {Promise<Object>} 登出响应
 */
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

/**
 * 获取用户信息
 * @returns {Promise<Object>} 用户信息
 */
export function getUserInfo() {
  return request({
    url: '/user',
    method: 'get'
  })
}

/**
 * 获取root用户信息
 * @returns {Promise<Object>} root用户信息
 */
export function getRootUserInfo() {
  return request({
    url: '/user/root',
    method: 'get'
  })
} 