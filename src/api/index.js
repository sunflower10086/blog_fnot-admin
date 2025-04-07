import * as authApi from './auth'
import * as documentApi from './document'
import * as categoryApi from './category'
import * as tagApi from './tag'

// 统一导出所有 API
export default {
  auth: authApi,
  document: documentApi,
  category: categoryApi,
  tag: tagApi
} 