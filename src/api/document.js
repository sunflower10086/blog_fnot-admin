import { get, post, put, del } from '@/utils/http'

const BASE_URL = '/documents'

/**
 * 获取所有文档
 * @returns {Promise<Array>} 文档列表
 */
export const getAll = () => {
  return get(BASE_URL)
}

/**
 * 获取单个文档
 * @param {number} id - 文档ID
 * @returns {Promise<Object>} 文档详情
 */
export const getById = (id) => {
  return get(`${BASE_URL}/${id}`)
}

/**
 * 创建新文档
 * @param {Object} document - 文档数据
 * @returns {Promise<Object>} 创建的文档
 */
export const create = (document) => {
  return post(BASE_URL, document)
}

/**
 * 更新文档
 * @param {number} id - 文档ID
 * @param {Object} document - 更新的文档数据
 * @returns {Promise<Object>} 更新后的文档
 */
export const update = (id, document) => {
  return put(`${BASE_URL}/${id}`, document)
}

/**
 * 删除文档
 * @param {number} id - 文档ID
 * @returns {Promise<Object>} 删除结果
 */
export const remove = (id) => {
  return del(`${BASE_URL}/${id}`)
}

/**
 * 通过分类获取文档
 * @param {string} category - 分类名称
 * @returns {Promise<Array>} 文档列表
 */
export const getByCategory = (category) => {
  return get(`${BASE_URL}/category/${category}`)
}

/**
 * 通过标签获取文档
 * @param {string} tag - 标签名称
 * @returns {Promise<Array>} 文档列表
 */
export const getByTag = (tag) => {
  return get(`${BASE_URL}/tag/${tag}`)
}

/**
 * 搜索文档
 * @param {string} query - 搜索关键词
 * @returns {Promise<Array>} 搜索结果
 */
export const search = (query) => {
  return get(`${BASE_URL}/search`, { query })
} 