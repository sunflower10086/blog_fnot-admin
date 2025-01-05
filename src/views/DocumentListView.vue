<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useMarkdownStore } from '@/stores/markdown'

const router = useRouter()
const markdownStore = useMarkdownStore()

const searchQuery = ref('')
const searchInput = ref(null)

const filteredDocuments = computed(() => {
  return markdownStore.documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  ).sort((a, b) => b.createdAt - a.createdAt)
})

const handleKeydown = (e) => {
  // 检查是否是 Mac 的 Command+K 或 Windows 的 Ctrl+K
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault() // 阻止默认行为
    searchInput.value?.focus()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const createNewDocument = () => {
  router.push({ name: 'MarkdownEditor' })
}

const editDocument = (doc) => {
  router.push({ 
    name: 'EditDocument', 
    params: { id: doc.id } 
  })
}

const deleteDocument = (doc) => {
  markdownStore.deleteDocument(doc.id)
}
</script>

<template>
  <div class="document-list-view">
    <div class="list-header">
      <h1 class="page-title">我的文档</h1>
      <div class="actions">
        <div class="search-wrapper">
          <i class="search-icon">🔍</i>
          <input 
            ref="searchInput"
            v-model="searchQuery" 
            placeholder="搜索文档... (⌘K / Ctrl+K)" 
            class="search-input"
          />
        </div>
        <button @click="createNewDocument" class="new-document-btn">
          + 新建文档
        </button>
      </div>
    </div>

    <div v-if="filteredDocuments.length === 0" class="no-documents">
      <img src="/empty-state.svg" alt="No documents" class="empty-state-image" />
      <p>暂无文档，点击"新建文档"开始创作</p>
    </div>

    <div v-else class="document-grid">
      <div 
        v-for="doc in filteredDocuments" 
        :key="doc.id" 
        class="document-card"
      >
        <div class="card-header">
          <h3>{{ doc.title }}</h3>
          <span class="document-date">
            {{ formatDate(doc.createdAt) }}
          </span>
        </div>
        <div class="document-actions">
          <button @click="editDocument(doc)" class="edit-btn">
            编辑
          </button>
          <button @click="deleteDocument(doc)" class="delete-btn">
            删除
          </button>
        </div>
      </div>
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

/* 响应式调整 */
@media (max-width: 768px) {
  .actions {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }

  .search-wrapper {
    width: 100%;
    max-width: 400px;
  }

  .new-document-btn {
    width: auto;
    min-width: 120px;
  }
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
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.card-header h3 {
  margin: 0;
  color: #333;
  font-weight: 500;
}

.document-date {
  color: #888;
  font-size: 0.8em;
}

.document-actions {
  display: flex;
  justify-content: space-between;
}

.edit-btn, .delete-btn {
  padding: 8px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.edit-btn {
  background-color: #4CAF50;
  color: white;
}

.delete-btn {
  background-color: #f44336;
  color: white;
}

.no-documents {
  text-align: center;
  color: #888;
  margin-top: 50px;
}

.empty-state-image {
  max-width: 300px;
  margin-bottom: 20px;
}
</style> 