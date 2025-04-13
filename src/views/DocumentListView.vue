<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useBlogStore } from '@/stores/blog'
import { ElMessageBox, ElMessage } from 'element-plus'

const router = useRouter()
const blogStore = useBlogStore()

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const isLoading = computed(() => blogStore.isLoading)
const hasFetched = ref(false)


// 文章数据
const posts = computed(() => blogStore.posts)
const totalPosts = computed(() => blogStore.totalPosts)

// 获取文章列表
const fetchPosts = async () => {
  try {
    await blogStore.fetchPosts(currentPage.value, pageSize.value)
    hasFetched.value = true
  } catch (error) {
    ElMessage.error('获取文章列表失败')
  }
}

// 监听页码变化
watch(currentPage, () => {
  fetchPosts()
})

// 监听搜索关键词变化
watch(searchQuery, () => {
  currentPage.value = 1
  fetchPosts()
})

onMounted(() => {
  fetchPosts()
})

const formatDate = (timestamp) => {
  return new Date(timestamp * 1000).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const createNewDocument = () => {
  router.push({ name: 'MarkdownEditor' })
}

const editDocument = (post) => {
  router.push({ 
    name: 'EditDocument', 
    params: { id: post.id } 
  })
}

const deleteDocument = async (post) => {
  try {
    const confirmed = await ElMessageBox.confirm(
      '确定要删除这篇文章吗？此操作不可恢复。',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    if (confirmed === 'confirm') {
      await blogStore.deletePost(post.id)
      ElMessage.success('文章删除成功')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除文章失败')
    }
  }
}
</script>

<template>
  <div class="document-list-view">
    <div class="list-header">
      <h1 class="page-title">博客文章管理</h1>
      <div class="actions">
        <div class="search-wrapper">
          <i class="search-icon">🔍</i>
          <input 
            v-model="searchQuery" 
            placeholder="搜索文章..." 
            class="search-input"
          />
        </div>
        <button @click="createNewDocument" class="new-document-btn">
          + 新建文章
        </button>
      </div>
    </div>

    <div v-if="isLoading && !hasFetched" class="loading-state">
      <div class="loader"></div>
      <p>加载中...</p>
    </div>

    <div v-else-if="posts.length === 0" class="no-documents">
      <img src="/empty-state.svg" alt="No documents" class="empty-state-image" />
      <p>暂无文章，点击"新建文章"开始创作</p>
    </div>

    <div v-else class="document-grid">
      <div 
        v-for="post in posts" 
        :key="post.id" 
        class="document-card"
      >
        <div class="card-header">
          <h3>{{ post.title }}</h3>
          <span class="document-date">
            {{ formatDate(post.createdAt) }}
          </span>
        </div>
        <div class="document-meta">
          <span class="views">阅读: {{ post.views }}</span>
          <span v-if="post.category" class="category">
            分类: {{ post.category }}
          </span>
        </div>
        <div class="document-actions">
          <button @click="editDocument(post)" class="edit-btn">
            编辑
          </button>
          <button @click="deleteDocument(post)" class="delete-btn">
            删除
          </button>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="totalPosts > pageSize" class="pagination">
      <el-pagination
        layout="prev, pager, next"
        :total="totalPosts"
        :page-size="pageSize"
        :current-page="currentPage"
        @current-change="currentPage = $event"
      />
    </div>
  </div>
</template>

<style scoped>
.document-list-view {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9fc;
  min-height: 100vh;
}

.page-title {
  color: #333;
  font-weight: 600;
  margin-bottom: 30px;
  text-align: center;
}

.list-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
}

.actions {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 600px;
  gap: 20px;
  padding: 0 20px;
  box-sizing: border-box;
}

.search-wrapper {
  position: relative;
  width: 400px;
  flex: none;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.5;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 10px 10px 10px 35px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: white;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.search-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 5px rgba(74, 144, 226, 0.3);
}

.new-document-btn {
  padding: 10px 20px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  white-space: nowrap;
  width: auto;
  flex: none;
}

.new-document-btn:hover {
  background-color: #357abd;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;
}

.loader {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #4a90e2;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.document-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.document-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  transition: transform 0.3s ease;
}

.document-card:hover {
  transform: translateY(-5px);
}

.card-header {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.card-header h3 {
  margin: 0 0 10px 0;
  color: #333;
  font-weight: 500;
}

.document-date {
  color: #888;
  font-size: 0.8em;
}

.document-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.views, .category {
  font-size: 0.8em;
  color: #666;
  background-color: #f0f0f0;
  padding: 4px 8px;
  border-radius: 4px;
}

.document-actions {
  display: flex;
  justify-content: space-between;
}

.edit-btn, .delete-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-btn {
  background-color: #4a90e2;
  color: white;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.edit-btn:hover {
  background-color: #357abd;
}

.delete-btn:hover {
  background-color: #d32f2f;
}

.pagination {
  margin-top: 40px;
  display: flex;
  justify-content: center;
}

.no-documents {
  text-align: center;
  padding: 50px 20px;
  color: #666;
}

.empty-state-image {
  width: 150px;
  height: auto;
  margin-bottom: 20px;
  opacity: 0.7;
}
</style> 