<template>
  <div class="markdown-view">
    <div class="document-header">
      <div class="title-section">
        <input 
          v-model="postTitle" 
          placeholder="文章标题" 
          class="document-title-input"
        />
        <span v-if="postId" class="document-info">
          创建时间：{{ formatDate }}
        </span>
      </div>
      <div class="header-actions">
        <button 
          @click="savePost" 
          class="save-button"
          :disabled="saving"
        >
          <i v-if="saving">⏳</i>
          <i v-else>💾</i> 
          {{ saving ? '保存中...' : '保存文章' }}
        </button>
        <button 
          @click="goBack" 
          class="back-button"
        >
          <i>↩️</i> 返回列表
        </button>
      </div>
    </div>
    <div class="editor-container">
      <div class="editor-sidebar">
        <div class="section">
          <h3>分类</h3>
          <select v-model="categoryId" class="category-select">
            <option :value="null">-- 选择分类 --</option>
            <option 
              v-for="category in categories" 
              :key="category.id" 
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
          <div v-if="categories.length === 0" class="empty-hint">
            暂无分类数据
          </div>
        </div>
        
        <div class="section">
          <h3>标签</h3>
          <div v-if="availableTags.length === 0" class="empty-hint">
            暂无标签数据，请添加新标签
          </div>
          <div v-else class="tags-container">
            <div 
              v-for="tag in availableTags" 
              :key="tag.id"
              class="tag-item"
              :class="{ 'selected': selectedTags.includes(tag.id) }"
              @click="toggleTag(tag.id)"
            >
              {{ tag.name }}
            </div>
          </div>
          <div class="tag-input-container">
            <input 
              v-model="newTag" 
              @keyup.enter="addNewTag"
              placeholder="添加新标签"
              class="tag-input"
            />
            <button @click="addNewTag" class="add-tag-btn">添加</button>
          </div>
        </div>
        
        <div class="section">
          <h3>封面图片</h3>
          <input 
            v-model="coverUrl" 
            placeholder="输入封面图片URL" 
            class="cover-input"
          />
          <div v-if="coverUrl" class="cover-preview">
            <img :src="coverUrl" alt="封面预览" />
          </div>
        </div>
        
        <div class="section">
          <h3>简介</h3>
          <textarea 
            v-model="description" 
            placeholder="文章简介（200字以内）" 
            class="description-textarea"
            maxlength="200"
          ></textarea>
        </div>
      </div>
      
      <div class="editor-main">
        <MarkdownToolbar @insert="handleToolbarInsert" />
        
        <div class="split-view">
          <!-- 左侧编辑区 -->
          <div class="editor-pane">
            <div class="pane-header">编辑区</div>
            <div class="editor-wrapper">
              <textarea 
                ref="contentTextarea"
                v-model="content" 
                placeholder="开始编写文章内容..." 
                class="content-textarea"
              ></textarea>
            </div>
          </div>
          
          <!-- 右侧预览区 -->
          <div class="preview-pane">
            <div class="pane-header">预览区</div>
            <div class="markdown-preview">
              <div class="preview-container" v-html="renderedContent"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/blog'
import { ElMessage, ElMessageBox } from 'element-plus'
import MarkdownToolbar from '@/components/MarkdownToolbar.vue'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

const route = useRoute()
const router = useRouter()
const blogStore = useBlogStore()

const postId = ref(route.params.id ? parseInt(route.params.id) : null)
const postTitle = ref('')
const content = ref('')
const contentTextarea = ref(null)
const coverUrl = ref('')
const description = ref('')
const categoryId = ref(null)
const selectedTags = ref([])
const newTag = ref('')
const saving = ref(false)

// 设置Markdown渲染选项
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: true,
  highlight: function(code, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, code).value;
      } catch (err) {}
    }
    return code;
  }
})

// 渲染Markdown内容
const renderedContent = computed(() => {
  // 使用DOMPurify清理HTML，防止XSS攻击
  return content.value ? DOMPurify.sanitize(marked(content.value)) : ''
})

// 获取所有分类和标签
const categories = computed(() => blogStore.getCategories || [])
const availableTags = computed(() => blogStore.getTags || [])
console.log(blogStore.getTags)

// 格式化日期
const formatDate = computed(() => {
  if (blogStore.currentPost) {
    const timestamp = blogStore.currentPost.baseInfo.createdAt
    return new Date(timestamp * 1000).toLocaleString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  return ''
})

// 处理工具栏插入事件
const handleToolbarInsert = (action) => {
  if (!contentTextarea.value) return
  
  const textarea = contentTextarea.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selectedText = content.value.substring(start, end)
  
  if (action.type === 'text') {
    const { prefix, suffix = '' } = action.data
    
    // 更新文本
    content.value = 
      content.value.substring(0, start) + 
      prefix + 
      (selectedText || '') + 
      suffix + 
      content.value.substring(end)
    
    // 聚焦并设置光标位置
    setTimeout(() => {
      textarea.focus()
      const newPos = start + prefix.length + (selectedText ? selectedText.length : 0) + (selectedText ? 0 : suffix.length)
      textarea.setSelectionRange(newPos, newPos)
    }, 10)
  } else if (action.type === 'list') {
    const { prefix } = action.data
    
    if (selectedText) {
      // 对选中的文本的每一行都应用列表前缀
      const lines = selectedText.split('\n')
      const prefixedText = lines.map(line => prefix + line).join('\n')
      
      content.value = 
        content.value.substring(0, start) + 
        prefixedText + 
        content.value.substring(end)
      
      setTimeout(() => {
        textarea.focus()
        const newPos = start + prefixedText.length
        textarea.setSelectionRange(newPos, newPos)
      }, 10)
    } else {
      // 没有选中文本，就插入一个新行带前缀
      content.value = 
        content.value.substring(0, start) + 
        prefix + 
        content.value.substring(end)
      
      setTimeout(() => {
        textarea.focus()
        const newPos = start + prefix.length
        textarea.setSelectionRange(newPos, newPos)
      }, 10)
    }
  }
}

onMounted(async () => {
  // 获取分类和标签数据
  try {
    // 使用Promise.allSettled代替Promise.all来确保即使一个失败了也不会影响另一个
    const results = await Promise.allSettled([
      blogStore.fetchCategories(),
      blogStore.fetchTags()
    ])
    
    // 处理获取分类的结果
    if (results[0].status === 'rejected') {
      ElMessage.error('获取分类数据失败')
    }
    
    // 处理获取标签的结果
    if (results[1].status === 'rejected') {
      ElMessage.error('获取标签数据失败')
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  }
  
  // 如果是编辑模式，加载文章数据
  if (postId.value) {
    try {
      const post = await blogStore.fetchPostDetail(postId.value)
      if (post) {
        postTitle.value = post.baseInfo.title
        content.value = post.content
        coverUrl.value = post.baseInfo.cover
        description.value = post.baseInfo.description
        categoryId.value = post.baseInfo.categoryId
        selectedTags.value = post.baseInfo.tags || []
      }
    } catch (error) {
      ElMessage.error('获取文章详情失败')
    }
  }
})

// 切换标签选择状态
const toggleTag = (tagId) => {
  const index = selectedTags.value.indexOf(tagId)
  if (index === -1) {
    selectedTags.value.push(tagId)
  } else {
    selectedTags.value.splice(index, 1)
  }
}

// 添加新标签
const addNewTag = async () => {
  if (!newTag.value.trim()) return
  
  try {
    await blogStore.createTags([newTag.value.trim()])
    newTag.value = ''
    ElMessage.success('标签创建成功')
  } catch (error) {
    ElMessage.error('创建标签失败')
  }
}

// 保存文章
const savePost = async () => {
  // 检查必填字段
  if (!postTitle.value.trim()) {
    ElMessageBox.alert('请输入文章标题', '提示', {
      confirmButtonText: '确定',
      type: 'warning'
    })
    return
  }

  if (!content.value.trim()) {
    ElMessageBox.alert('文章内容不能为空', '提示', {
      confirmButtonText: '确定',
      type: 'warning'
    })
    return
  }
  
  saving.value = true
  
  try {
    const postData = {
      title: postTitle.value,
      content: content.value,
      cover: coverUrl.value,
      description: description.value,
      categoryId: categoryId.value,
      tags: selectedTags.value
    }
    
    if (postId.value) {
      // 更新文章
      const updatedPost = {
        baseInfo: {
          id: postId.value,
          ...postData
        },
        content: content.value
      }
      await blogStore.updatePost(updatedPost)
      ElMessage.success('文章更新成功')
    } else {
      // 创建新文章
      const newPost = await blogStore.createPost(postData)
      postId.value = newPost.baseInfo.id
      ElMessage.success('文章创建成功')
    }
    
    // 返回文章列表
    router.push({ name: 'DocumentList' })
  } catch (error) {
    ElMessage.error(postId.value ? '更新文章失败' : '创建文章失败')
  } finally {
    saving.value = false
  }
}

// 返回列表
const goBack = () => {
  router.push({ name: 'DocumentList' })
}
</script>

<style scoped>
.markdown-view {
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 1400px;
  margin: 0 auto;
  background-color: #f9f9fc;
  overflow: hidden;
  position: relative;
  padding: 0 20px;
}

.document-header {
  flex-shrink: 0;
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  margin-top: 20px;
}

.title-section {
  display: flex;
  flex-direction: column;
  max-width: 70%;
}

.document-title-input {
  font-size: 1.5em;
  font-weight: 600;
  color: #333;
  border: none;
  border-bottom: 2px solid #e0e0e0;
  padding: 10px 0;
  margin-bottom: 10px;
  transition: border-color 0.3s ease;
  width: 100%;
}

.document-title-input:focus {
  outline: none;
  border-bottom-color: #4a90e2;
}

.document-info {
  color: #888;
  font-size: 0.9em;
}

.header-actions {
  display: flex;
  gap: 15px;
}

.save-button, 
.back-button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.save-button {
  background-color: #4CAF50;
  color: white;
  box-shadow: 0 2px 5px rgba(76, 175, 80, 0.2);
}

.save-button:hover {
  background-color: #43a047;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.3);
}

.save-button:disabled {
  background-color: #a5d6a7;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.back-button {
  background-color: #f5f5f5;
  color: #333;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.back-button:hover {
  background-color: #e0e0e0;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.editor-container {
  display: flex;
  flex: 1;
  overflow: hidden;
  gap: 20px;
  margin-bottom: 20px;
}

.editor-sidebar {
  width: 280px;
  min-width: 280px;
  padding: 20px;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.editor-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background-color: white;
}

/* 分屏视图 */
.split-view {
  display: flex;
  flex: 1;
  overflow: hidden;
  padding: 0;
  gap: 20px;
}

.editor-pane, .preview-pane {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.editor-pane {
  border-right: none;
  margin-right: 0;
  padding-right: 0;
}

.preview-pane {
  margin-left: 0;
}

.editor-wrapper {
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
  padding: 10px;
}

.content-textarea {
  width: 100%;
  height: 100%;
  padding: 15px;
  margin: 0;
  border: 1px solid #eaeaea;
  font-size: 16px;
  line-height: 1.6;
  resize: none;
  font-family: 'Roboto Mono', 'Courier New', monospace;
  color: #2c3e50;
  background-color: #fcfcfc;
  transition: all 0.3s;
  box-sizing: border-box;
  overflow-wrap: break-word;
  word-wrap: break-word;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.content-textarea:focus {
  outline: none;
  background-color: #ffffff;
}

/* Markdown预览样式 */
.markdown-preview {
  flex: 1;
  overflow-y: auto;
  background-color: white;
  padding: 10px;
}

.preview-container {
  padding: 15px;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 1.6;
  color: #2c3e50;
  overflow-wrap: break-word;
  word-wrap: break-word;
  background-color: #fcfcfc;
  border-radius: 4px;
  border: 1px solid #eaeaea;
  min-height: 300px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* Markdown 预览样式 */
.preview-container h1,
.preview-container h2,
.preview-container h3,
.preview-container h4,
.preview-container h5,
.preview-container h6 {
  margin-top: 1.5em;
  margin-bottom: 0.75em;
  font-weight: 600;
  line-height: 1.25;
  color: #1a1a1a;
}

.preview-container h1 {
  font-size: 2em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.preview-container h2 {
  font-size: 1.5em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.preview-container p {
  margin: 1em 0;
}

.preview-container a {
  color: #4a90e2;
  text-decoration: none;
}

.preview-container a:hover {
  text-decoration: underline;
}

.preview-container blockquote {
  margin: 1em 0;
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
}

.preview-container code {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27, 31, 35, 0.05);
  border-radius: 3px;
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
}

.preview-container pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 3px;
}

.preview-container pre code {
  padding: 0;
  background-color: transparent;
}

.preview-container img {
  max-width: 100%;
  height: auto;
  display: block;
  margin: 1em auto;
  border-radius: 4px;
}

.preview-container table {
  border-collapse: collapse;
  width: 100%;
  margin: 1em 0;
}

.preview-container table th,
.preview-container table td {
  padding: 8px 12px;
  border: 1px solid #dfe2e5;
}

.preview-container table th {
  background-color: #f6f8fa;
  font-weight: 600;
}

.preview-container ul,
.preview-container ol {
  padding-left: 2em;
  margin: 1em 0;
}

.section {
  margin-bottom: 25px;
}

.section h3 {
  margin-top: 0;
  margin-bottom: 12px;
  color: #333;
  font-size: 16px;
  font-weight: 600;
  position: relative;
  padding-left: 15px;
}

.section h3::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 5px;
  height: 15px;
  background-color: #4a90e2;
  border-radius: 3px;
}

.category-select {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
  font-size: 14px;
  color: #333;
  transition: all 0.3s;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'%3E%3Cpath fill='%23555' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
}

.category-select:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
  background-color: #fff;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.tag-item {
  padding: 8px 14px;
  background-color: #f0f0f0;
  border-radius: 20px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.tag-item:hover {
  background-color: #e0e0e0;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.tag-item.selected {
  background-color: #4a90e2;
  color: white;
  box-shadow: 0 2px 5px rgba(74, 144, 226, 0.3);
}

.tag-input-container {
  display: flex;
  gap: 10px;
}

.tag-input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s;
}

.tag-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.add-tag-btn {
  padding: 10px 16px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  box-shadow: 0 2px 5px rgba(74, 144, 226, 0.2);
}

.add-tag-btn:hover {
  background-color: #357abd;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(74, 144, 226, 0.3);
}

.cover-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  margin-bottom: 10px;
  font-size: 14px;
  transition: all 0.3s;
}

.cover-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.cover-preview {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.cover-preview img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s;
}

.cover-preview:hover img {
  transform: scale(1.02);
}

.description-textarea {
  width: 100%;
  height: 120px;
  padding: 12px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  resize: vertical;
  font-size: 14px;
  line-height: 1.5;
  transition: all 0.3s;
}

.description-textarea:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

.empty-hint {
  color: #999;
  font-size: 13px;
  text-align: center;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 8px;
  margin-top: 10px;
  border: 1px dashed #e0e0e0;
}

@media (max-width: 1200px) {
  .editor-container {
    flex-direction: column;
  }
  
  .editor-sidebar {
    width: 100%;
    margin-bottom: 20px;
    min-width: auto;
  }
  
  .title-section {
    max-width: 60%;
  }
  
  .split-view {
    flex-direction: column;
  }
  
  .editor-pane {
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }
}

@media (max-width: 768px) {
  .document-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .title-section {
    max-width: 100%;
    width: 100%;
  }
  
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
}

.pane-header {
  padding: 10px 15px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
  font-weight: 500;
  color: #666;
  text-align: center;
}
</style> 