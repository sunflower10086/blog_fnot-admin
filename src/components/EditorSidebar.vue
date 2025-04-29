<template>
  <div :class="['editor-sidebar', { collapsed: collapsed }]">
    <button 
      class="collapse-btn" 
      @click="toggleCollapse"
      :title="collapsed ? '展开侧边栏' : '收起侧边栏'"
    >
      <span class="arrow-icon" :class="{ 'arrow-right': collapsed, 'arrow-left': !collapsed }"></span>
    </button>
    <template v-if="!collapsed">
      <div class="section">
        <h3>分类</h3>
        <select v-model="categoryIdValue" class="category-select">
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
        
        <div class="tag-add-wrapper">
          <div class="tag-input-container">
            <el-input 
              v-model="newTagValue" 
              @keyup.enter="addNewTag"
              placeholder="添加新标签"
              class="tag-input"
            />
            <button @click="addNewTag" class="add-tag-btn">添加</button>
          </div>
        </div>
      </div>
      
      <div class="section">
        <h3>封面图片</h3>
        <el-input 
          v-model="coverUrlValue" 
          placeholder="输入封面图片URL" 
          class="cover-input"
        />
        <div v-if="coverUrlValue" class="cover-preview">
          <img :src="coverUrlValue" alt="封面预览" />
        </div>
      </div>
      
      <div class="section">
        <h3>简介</h3>
        <el-input
          v-model="descriptionValue"
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 10 }"
          placeholder="文章简介（200字以内）"
          maxlength="200"
          show-word-limit
        />
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useBlogStore } from '@/stores/blog'
import { ElMessage } from 'element-plus'

const props = defineProps({
  categoryId: {
    type: Number,
    default: null
  },
  selectedTags: {
    type: Array,
    default: () => []
  },
  coverUrl: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  collapsed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'update:categoryId',
  'update:selectedTags',
  'update:coverUrl',
  'update:description',
  'update:collapsed'
])

// 侧边栏状态
const toggleCollapse = () => {
  emit('update:collapsed', !props.collapsed)
}

// 博客存储
const blogStore = useBlogStore()

// 双向绑定的值
const categoryIdValue = computed({
  get: () => props.categoryId,
  set: (value) => emit('update:categoryId', value)
})

const coverUrlValue = computed({
  get: () => props.coverUrl,
  set: (value) => emit('update:coverUrl', value)
})

const descriptionValue = computed({
  get: () => props.description,
  set: (value) => emit('update:description', value)
})

// 标签相关
const newTagValue = ref('')
const availableTags = computed(() => blogStore.getTags || [])
const categories = computed(() => blogStore.getCategories || [])

// 切换标签选择状态
const toggleTag = (tagId) => {
  const updatedTags = [...props.selectedTags]
  const index = updatedTags.indexOf(tagId)
  
  if (index === -1) {
    updatedTags.push(tagId)
  } else {
    updatedTags.splice(index, 1)
  }
  
  emit('update:selectedTags', updatedTags)
}

// 添加新标签
const addNewTag = async () => {
  if (!newTagValue.value.trim()) return
  
  try {
    await blogStore.createTags([newTagValue.value.trim()])
    newTagValue.value = ''
    ElMessage.success('标签创建成功')
  } catch (error) {
    ElMessage.error('创建标签失败')
  }
}
</script>

<style scoped>
.editor-sidebar {
  width: 17.5rem;
  min-width: 17.5rem;
  padding: 1.25rem;
  background-color: white;
  border-radius: 0.75rem;
  box-shadow: 0 0.25rem 0.375rem rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  position: relative;
  transition: all 0.3s ease;
}

.collapse-btn {
  position: absolute;
  top: 0.625rem;
  right: 0.625rem;
  z-index: 2;
  background: #f5f5f5;
  border-radius: 0.25rem;
  padding: 0;
  cursor: pointer;
  color: #333;
  transition: all 0.2s;
  border: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.75rem;
  height: 1.75rem;
}

.arrow-icon {
  width: 0.4375rem;
  height: 0.4375rem;
  border-top: 0.125rem solid #666;
  border-right: 0.125rem solid #666;
  display: block;
  transition: transform 0.3s ease;
  position: relative;
  margin: 0 auto;
}

.arrow-left {
  transform: rotate(225deg); /* 指向左侧 */
}

.arrow-right {
  transform: rotate(45deg); /* 指向右侧 */
}

.collapse-btn:hover {
  background: #e8e8e8;
  transform: translateY(-1px);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
}

.collapse-btn:hover .arrow-icon {
  border-color: #333;
  transform: rotate(225deg) scale(1.1);
}

.collapse-btn:hover .arrow-right {
  transform: rotate(45deg) scale(1.1);
}

.editor-sidebar.collapsed .collapse-btn {
  position: static;
  display: flex;
  margin: 5px auto 15px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section {
  margin-bottom: 1.5625rem;
  width: 100%;
  box-sizing: border-box;
}

.section h3 {
  margin-top: 0;
  margin-bottom: 0.75rem;
  color: #333;
  font-size: 1rem;
  font-weight: 600;
  position: relative;
  padding-left: 0.9375rem;
}

.section h3::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 0.3125rem;
  height: 0.9375rem;
  background-color: #4a90e2;
  border-radius: 0.1875rem;
}

.category-select {
  width: 100%;
  box-sizing: border-box;
  padding: 0.75rem;
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  background-color: #f9f9f9;
  font-size: 0.875rem;
  color: #333;
  transition: all 0.3s;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24'%3E%3Cpath fill='%23555' d='M7 10l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.625rem center;
}

.category-select:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 0.1875rem rgba(74, 144, 226, 0.1);
  background-color: #fff;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.tag-item {
  padding: 0.5rem 0.875rem;
  background-color: #f0f0f0;
  border-radius: 1.25rem;
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 0.0625rem 0.1875rem rgba(0, 0, 0, 0.05);
}

.tag-item:hover {
  background-color: #e0e0e0;
  transform: translateY(-0.0625rem);
  box-shadow: 0 0.125rem 0.3125rem rgba(0, 0, 0, 0.1);
}

.tag-item.selected {
  background-color: #4a90e2;
  color: white;
  box-shadow: 0 0.125rem 0.3125rem rgba(74, 144, 226, 0.3);
}

.tag-add-wrapper {
  margin-top: 1rem;
  border-top: 1px dashed #e6e6e6;
  padding-top: 1rem;
}

.tag-input-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.tag-input {
  flex: 1;
  box-sizing: border-box;
  margin-bottom: 0;
  margin-right: 0;
  width: auto;
  font-size: 0.875rem;
  transition: all 0.3s;
}

.add-tag-btn {
  height: auto;
  padding: 0.5rem 1rem;
  white-space: nowrap;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  box-shadow: 0 0.125rem 0.3125rem rgba(74, 144, 226, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-tag-btn:hover {
  background-color: #357abd;
  transform: translateY(-0.0625rem);
  box-shadow: 0 0.25rem 0.5rem rgba(74, 144, 226, 0.3);
}

.cover-input {
  width: 100%;
  height: auto;
  font-size: 0.875rem;
  transition: all 0.3s;
}

.cover-preview {
  border: 1px solid #e0e0e0;
  border-radius: 0.5rem;
  overflow: hidden;
  margin-top: 0.625rem;
  box-shadow: 0 0.125rem 0.3125rem rgba(0, 0, 0, 0.05);
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

.empty-hint {
  color: #999;
  font-size: 0.8125rem;
  text-align: center;
  padding: 0.75rem;
  background-color: #f9f9f9;
  border-radius: 0.5rem;
  margin-top: 0.625rem;
  border: 1px dashed #e0e0e0;
}
</style> 