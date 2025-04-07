import { get, post, put, del } from '@/utils/http'

const BASE_URL = '/categories'

/**
 * 获取所有分类
 * @returns {Promise<Array>} 分类列表
 */
export const getAll = () => {
  return get(BASE_URL)
}

/**
 * 获取单个分类
 * @param {number} id - 分类ID
 * @returns {Promise<Object>} 分类详情
 */
export const getById = (id) => {
  return get(`${BASE_URL}/${id}`)
}

/**
 * 创建新分类
 * @param {Object} category - 分类数据
 * @returns {Promise<Object>} 创建的分类
 */
export const create = (category) => {
  return post(BASE_URL, { name: category })
}

/**
 * 更新分类
 * @param {number} id - 分类ID
 * @param {Object} category - 更新的分类数据
 * @returns {Promise<Object>} 更新后的分类
 */
export const update = (id, category) => {
  return put(`${BASE_URL}/${id}`, { name: category })
}

/**
 * 删除分类
 * @param {number} id - 分类ID
 * @returns {Promise<Object>} 删除结果
 */
export const remove = (id) => {
  return del(`${BASE_URL}/${id}`)
}

/**
 * 获取分类下的文档数量
 * @returns {Promise<Array>} 分类及其文档数量
 */
export const getDocumentCount = () => {
  return get(`${BASE_URL}/document-count`)
} 