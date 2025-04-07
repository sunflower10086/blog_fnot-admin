import { get, post, put, del } from '@/utils/http'

const BASE_URL = '/tags'

/**
 * 获取所有标签
 * @returns {Promise<Array>} 标签列表
 */
export const getAll = () => {
  return get(BASE_URL)
}

/**
 * 获取单个标签
 * @param {number} id - 标签ID
 * @returns {Promise<Object>} 标签详情
 */
export const getById = (id) => {
  return get(`${BASE_URL}/${id}`)
}

/**
 * 创建新标签
 * @param {string} tag - 标签名称
 * @returns {Promise<Object>} 创建的标签
 */
export const create = (tag) => {
  return post(BASE_URL, { name: tag })
}

/**
 * 批量创建标签
 * @param {Array<string>} tags - 标签名称数组
 * @returns {Promise<Array>} 创建的标签列表
 */
export const createBatch = (tags) => {
  return post(`${BASE_URL}/batch`, { tags })
}

/**
 * 更新标签
 * @param {number} id - 标签ID
 * @param {string} tag - 更新的标签名称
 * @returns {Promise<Object>} 更新后的标签
 */
export const update = (id, tag) => {
  return put(`${BASE_URL}/${id}`, { name: tag })
}

/**
 * 删除标签
 * @param {number} id - 标签ID
 * @returns {Promise<Object>} 删除结果
 */
export const remove = (id) => {
  return del(`${BASE_URL}/${id}`)
}

/**
 * 获取热门标签
 * @param {number} limit - 返回数量限制
 * @returns {Promise<Array>} 热门标签列表
 */
export const getPopular = (limit = 10) => {
  return get(`${BASE_URL}/popular`, { limit })
}

/**
 * 获取标签下的文档数量
 * @returns {Promise<Array>} 标签及其文档数量
 */
export const getDocumentCount = () => {
  return get(`${BASE_URL}/document-count`)
} 