# API 服务层使用指南

本文档提供了如何在项目中使用 API 服务层的指导。

## 基本用法

API 服务层封装了与后端的所有交互，提供了简洁且一致的调用方式。

```js
// 导入整个 API 服务
import api from '@/api'

// 使用文档 API
api.document.getAll().then(documents => {
  console.log(documents)
})

// 使用认证 API
api.auth.login({ username: 'admin', password: '123456' }).then(result => {
  console.log('登录成功:', result)
})
```

## 按需导入

你也可以只导入需要的 API 模块：

```js
// 只导入文档相关 API
import { getAll, getById, create } from '@/api/document'

// 直接使用
getAll().then(documents => {
  console.log(documents)
})
```

## 错误处理

所有 API 调用都会返回 Promise，可以使用 try/catch 或 then/catch 处理错误：

```js
try {
  const documents = await api.document.getAll()
  console.log(documents)
} catch (error) {
  console.error('获取文档失败:', error.message)
}
```

## 使用工具函数

API 服务层提供了一些实用的工具函数：

```js
import { retry, cacheResponse } from '@/api/utils'
import { getAll } from '@/api/document'

// 自动重试 3 次
const getDocumentsWithRetry = () => retry(() => getAll())

// 添加缓存，结果会被缓存 5 分钟
const getDocumentsWithCache = cacheResponse(getAll)

// 使用
getDocumentsWithCache().then(documents => {
  console.log('已缓存的文档列表:', documents)
})
```

## 模拟 API

在开发过程中，可以使用模拟 API：

```js
import { mockLogin } from '@/api/auth'

// 使用模拟登录
mockLogin({ username: 'admin', password: 'admin123' }).then(result => {
  console.log('模拟登录成功:', result)
})
```

## 完整示例

```js
import api from '@/api'
import { parseApiError } from '@/api/utils'

async function loadDocuments() {
  try {
    // 获取所有文档
    const documents = await api.document.getAll()
    
    // 获取分类
    const categories = await api.category.getAll()
    
    // 获取标签
    const tags = await api.tag.getAll()
    
    return { documents, categories, tags }
  } catch (error) {
    // 处理错误
    const parsedError = parseApiError(error)
    console.error(`请求失败: ${parsedError.message}`, parsedError)
    throw parsedError
  }
} 