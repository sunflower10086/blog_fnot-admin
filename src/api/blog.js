import request from '@/utils/request'

/**
 * 获取博客列表
 * @param {{page: number, page_size: number}} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.page_size - 每页数量
 * @returns {Promise<Object>} 博客列表响应
 */
export function getPostList(params) {
  return request({
    url: '/posts',
    method: 'get',
    params
  })
}

/**
 * 获取博客详情
 * @param {number} postId - 博客ID
 * @returns {Promise<Object>} 博客详情
 */
export function getPostDetail(postId) {
  return request({
    url: `/post/${postId}`,
    method: 'get'
  })
}

/**
 * 创建博客
 * @param {Object} data - 博客数据
 * @param {string} data.title - 标题
 * @param {string} data.cover - 封面
 * @param {Array<number>} data.tags - 标签ID数组
 * @param {string} data.description - 描述
 * @param {number} data.category_id - 分类ID
 * @param {string} data.content - 内容
 * @returns {Promise<Object>} 创建的博客
 */
export function createPost(data) {
  return request({
    url: '/post',
    method: 'post',
    data
  })
}

/**
 * 更新博客
 * @param {Object} data - 博客数据
 * @param {Object} data.post - 博客对象
 * @returns {Promise<Object>} 更新后的博客
 */
export function updatePost(data) {
  return request({
    url: '/post',
    method: 'put',
    data
  })
}

/**
 * 删除博客
 * @param {number} postId - 博客ID
 * @returns {Promise<Object>} 删除响应
 */
export function deletePost(postId) {
  return request({
    url: `/post/${postId}`,
    method: 'delete'
  })
}

/**
 * 获取分类列表
 * @returns {Promise<Object>} 分类列表响应
 */
export function getCategoryList() {
  return request({
    url: '/categories',
    method: 'get'
  })
}

/**
 * 获取标签列表
 * @returns {Promise<Object>} 标签列表响应
 */
export function getTagList() {
  return request({
    url: '/tags',
    method: 'get'
  })
}

/**
 * 创建标签
 * @param {Object} data - 标签数据
 * @param {Array<string>} data.names - 标签名称数组
 * @returns {Promise<Object>} 创建响应
 */
export function createTags(data) {
  return request({
    url: '/tags',
    method: 'post',
    data
  })
}

/**
 * 删除标签
 * @param {number} id - 标签ID
 * @returns {Promise<Object>} 删除响应
 */
export function deleteTag(id) {
  return request({
    url: `/tags/${id}`,
    method: 'delete'
  })
}

/**
 * 获取标签统计
 * @returns {Promise<Object>} 标签统计响应
 */
export function getTagStats() {
  return request({
    url: '/tags/stat',
    method: 'get'
  })
} 