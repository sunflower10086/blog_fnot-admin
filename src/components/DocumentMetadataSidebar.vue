<template>
  <el-drawer
    v-model="drawerVisible"
    title="文档属性"
    direction="rtl"
    size="500px"
    :modal="true"
    :close-on-click-modal="true"
    custom-class="metadata-sidebar"
    @close="handleClose"
  >
    <div class="sidebar-content">
      <div class="metadata-section">
        <h4>选择分类</h4>
        <el-select 
          v-model="selectedCategory" 
          placeholder="选择分类"
          style="width: 100%;"
          @change="updateCategory"
        >
          <el-option 
            v-for="category in categories" 
            :key="category" 
            :label="category" 
            :value="category"
          />
        </el-select>
      </div>

      <div class="metadata-section">
        <h4>选择标签</h4>
        <el-select
          v-model="selectedTags"
          multiple
          placeholder="选择标签"
          style="width: 100%;"
          @change="updateTags"
        >
          <el-option 
            v-for="tag in tags" 
            :key="tag" 
            :label="tag" 
            :value="tag"
          />
        </el-select>
      </div>

      <div class="metadata-section">
        <h4>创建新标签</h4>
        <div class="new-tag-input">
          <el-input 
            v-model="newTag" 
            placeholder="输入新标签"
            @keyup.enter="addNewTag"
          />
          <el-button type="primary" @click="addNewTag">添加</el-button>
        </div>
      </div>

      <div class="sidebar-actions">
        <el-button type="primary" @click="saveMetadata">保存</el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { ref, defineProps, defineEmits, onMounted, computed } from 'vue'
import { useMarkdownStore } from '@/stores/markdown'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  documentId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['close', 'save'])

const markdownStore = useMarkdownStore()

const categories = ref(markdownStore.categories)
const tags = ref(markdownStore.tags)

const selectedCategory = ref(null)
const selectedTags = ref([])
const newTag = ref('')

// 使用计算属性同步外部传入的 isOpen 状态
const drawerVisible = computed({
  get: () => props.isOpen,
  set: (val) => {
    if (!val) {
      emit('close')
    }
  }
})

onMounted(() => {
  const doc = markdownStore.documents.find(d => d.id === props.documentId)
  if (doc) {
    selectedCategory.value = doc.category
    selectedTags.value = doc.tags || []
  }
})

const updateCategory = (category) => {
  selectedCategory.value = category
}

const updateTags = (selectedTags) => {
  selectedTags.value = selectedTags
}

const addNewTag = () => {
  if (newTag.value.trim() && !tags.value.includes(newTag.value.trim())) {
    markdownStore.addTag(newTag.value.trim())
    tags.value = markdownStore.tags
    selectedTags.value.push(newTag.value.trim())
    newTag.value = ''
  }
}

const handleClose = () => {
  emit('close')
}

const saveMetadata = () => {
  markdownStore.updateDocument(
    props.documentId, 
    null, 
    selectedTags.value, 
    selectedCategory.value
  )
  emit('save', {
    tags: selectedTags.value,
    category: selectedCategory.value
  })
  emit('close')
}
</script>

<style>
/* 全局样式，覆盖 Element Plus 默认样式 */
.metadata-sidebar {
  top: 0 !important;
  right: 0 !important;
  height: 100vh !important;
  margin: 0 !important;
  padding: 0 !important;
  transform: translate(0, 0) !important;
  width: 500px !important;
}

.metadata-sidebar .el-drawer__header {
  margin-bottom: 20px;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.metadata-sidebar .el-drawer__body {
  padding: 0 20px;
}
</style>

<style scoped>
.sidebar-content {
  padding: 20px 0;
}

.metadata-section {
  margin-bottom: 30px;
}

.metadata-section h4 {
  margin-bottom: 15px;
  color: #333;
  font-size: 16px;
}

.new-tag-input {
  display: flex;
  gap: 15px;
}

.new-tag-input .el-input {
  flex-grow: 1;
}

.new-tag-input .el-button {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  border: none;
  border-radius: 6px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.new-tag-input .el-button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #45a049, #3d8b40);
}

.sidebar-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}

.sidebar-actions .el-button {
  min-width: 120px;
  height: 40px;
  background: linear-gradient(135deg, #409EFF, #3a8ee6);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.2);
}

.sidebar-actions .el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
  background: linear-gradient(135deg, #3a8ee6, #3080dc);
}

.sidebar-actions .el-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(64, 158, 255, 0.2);
}
</style> 