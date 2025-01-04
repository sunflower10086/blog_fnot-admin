<template>
  <div class="markdown-view">
    <div class="document-header">
      <div class="title-section">
        <input 
          v-model="documentTitle" 
          placeholder="文档标题" 
          class="document-title-input"
        />
        <span class="document-info">
          创建时间：{{ formatDate }}
        </span>
      </div>
      <div class="header-actions">
        <button 
          @click="saveDocument" 
          class="save-button"
        >
          <i>💾</i> 保存文档
        </button>
        <button 
          @click="goBack" 
          class="back-button"
        >
          <i>↩️</i> 返回列表
        </button>
      </div>
    </div>
    <MarkdownEditor 
      :content="editorContent"
      @update:content="editorContent = $event"
    />

    <DocumentMetadataSidebar 
      :is-open="isMetadataSidebarOpen"
      :document-id="documentId"
      @close="closeMetadataSidebar"
      @save="handleMetadataSave"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMarkdownStore } from '@/stores/markdown'
import MarkdownEditor from '@/components/MarkdownEditor.vue'
import DocumentMetadataSidebar from '@/components/DocumentMetadataSidebar.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const route = useRoute()
const router = useRouter()
const markdownStore = useMarkdownStore()

const documentId = ref(route.params.id ? parseInt(route.params.id) : null)
const documentTitle = ref('')
const editorContent = ref('')
const createdAt = ref(new Date())
const isMetadataSidebarOpen = ref(false)
const documentTags = ref([])
const documentCategory = ref(null)

const formatDate = computed(() => {
  return createdAt.value.toLocaleString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
})

onMounted(() => {
  if (documentId.value) {
    const doc = markdownStore.documents.find(d => d.id === documentId.value)
    if (doc) {
      documentTitle.value = doc.title
      editorContent.value = doc.content
      createdAt.value = new Date(doc.createdAt)
      documentTags.value = doc.tags || []
      documentCategory.value = doc.category
    }
  }
})

const saveDocument = () => {
  // 检查文档标题和内容是否为空
  if (!documentTitle.value.trim()) {
    ElMessageBox.alert('请输入文档标题', '提示', {
      confirmButtonText: '确定',
      type: 'warning',
      customStyle: {
        borderRadius: '12px'
      },
      roundButton: true
    })
    return
  }

  if (!editorContent.value.trim()) {
    ElMessageBox.alert('文档内容不能为空', '提示', {
      confirmButtonText: '确定',
      type: 'warning',
      customStyle: {
        borderRadius: '12px'
      },
      roundButton: true
    })
    return
  }

  // 打开元数据侧边栏
  isMetadataSidebarOpen.value = true
}

const closeMetadataSidebar = () => {
  // 仅关闭侧边栏，不跳转
  isMetadataSidebarOpen.value = false
}

const handleMetadataSave = (metadata) => {
  documentTags.value = metadata.tags
  documentCategory.value = metadata.category

  // 保存文档
  if (documentId.value) {
    markdownStore.updateDocument(
      documentId.value, 
      editorContent.value, 
      documentTags.value, 
      documentCategory.value
    )
  } else {
    const newDoc = markdownStore.addDocument({
      title: documentTitle.value || '未命名文档',
      content: editorContent.value,
      tags: documentTags.value,
      category: documentCategory.value
    })
    documentId.value = newDoc.id
  }

  // 保存成功提示
  ElMessage.success({
    message: '文档保存成功',
    customClass: 'custom-success-message'
  })

  // 关闭侧边栏并返回列表
  isMetadataSidebarOpen.value = false
  router.push({ name: 'DocumentList' })
}

const goBack = () => {
  router.push({ name: 'DocumentList' })
}
</script>

<style>
/* 全局样式，用于自定义消息提示 */
.custom-success-message {
  border-radius: 12px !important;
}

/* 完全禁止全局滚动 */
html, body {
  overflow: hidden !important;
  height: 100vh !important;
  margin: 0 !important;
  padding: 0 !important;
  max-height: 100vh !important;
  position: fixed !important;
  width: 100% !important;
}
</style>

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
}

.title-section {
  display: flex;
  flex-direction: column;
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
  transition: background-color 0.3s ease;
}

.save-button {
  background-color: #4CAF50;
  color: white;
}

.back-button {
  background-color: #e0e0e0;
  color: #333;
}

.save-button:hover {
  background-color: #45a049;
}

.back-button:hover {
  background-color: #d5d5d5;
}
</style> 