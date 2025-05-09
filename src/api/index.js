import * as categoryApi from './category'
import * as tagApi from './tag'
import * as blogApi from './blog'
// 统一导出所有 API
export default {
  category: categoryApi,
  tag: tagApi,
  blog: blogApi
} 