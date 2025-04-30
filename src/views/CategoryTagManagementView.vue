<template>
  <div class="management-container">
    <div class="page-header">
      <h1>分类与标签管理</h1>
      <div class="subtitle">管理博客文章的分类与标签</div>
    </div>
    
    <div class="management-content">
      <!-- 分类管理 -->
      <div class="section-container">
        <div class="section-header">
          <h2>分类管理</h2>
          <div class="section-desc">创建、编辑或删除博客分类</div>
        </div>
        
        <div class="card">
          <div class="add-item-row">
            <el-input
              v-model="newCategoryName"
              placeholder="输入新分类名称"
              @keyup.enter="addCategory"
            />
            <el-button type="primary" @click="addCategory" :disabled="!newCategoryName.trim()">
              添加分类
            </el-button>
          </div>
          
          <el-table 
            v-loading="blogStore.isLoading" 
            :data="categories" 
            style="width: 100%"
            border
          >
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="分类名称" min-width="200">
              <template #default="scope">
                <div v-if="editCategoryId === scope.row.id" class="edit-field">
                  <el-input v-model="editCategoryName" />
                </div>
                <span v-else>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="count" label="文章数量" width="100" />
            <el-table-column label="操作" width="200" align="center">
              <template #default="scope">
                <div v-if="editCategoryId === scope.row.id" class="action-buttons">
                  <el-button type="success" size="small" @click="saveCategory(scope.row.id)">
                    保存
                  </el-button>
                  <el-button type="info" size="small" @click="cancelEdit">
                    取消
                  </el-button>
                </div>
                <div v-else class="action-buttons">
                  <el-button type="primary" size="small" @click="editCategory(scope.row)">
                    编辑
                  </el-button>
                  <el-button 
                    type="danger" 
                    size="small" 
                    @click="confirmDeleteCategory(scope.row)"
                    :disabled="scope.row.count > 0"
                  >
                    删除
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          
          <div class="empty-data" v-if="categories.length === 0 && !blogStore.isLoading">
            暂无分类数据
          </div>
        </div>
      </div>
      
      <!-- 标签管理 -->
      <div class="section-container">
        <div class="section-header">
          <h2>标签管理</h2>
          <div class="section-desc">创建、编辑或删除博客标签</div>
        </div>
        
        <div class="card">
          <div class="add-item-row">
            <el-input
              v-model="newTagName"
              placeholder="输入新标签名称"
              @keyup.enter="addTag"
            />
            <el-button type="primary" @click="addTag" :disabled="!newTagName.trim()">
              添加标签
            </el-button>
          </div>
          
          <el-table 
            v-loading="blogStore.isLoading" 
            :data="tags" 
            style="width: 100%"
            border
          >
            <el-table-column prop="id" label="ID" width="80" />
            <el-table-column prop="name" label="标签名称" min-width="200">
              <template #default="scope">
                <div v-if="editTagId === scope.row.id" class="edit-field">
                  <el-input v-model="editTagName" />
                </div>
                <span v-else>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="count" label="引用次数" width="100">
              <template #default="scope">
                {{ getTagCount(scope.row.id) }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200" align="center">
              <template #default="scope">
                <div v-if="editTagId === scope.row.id" class="action-buttons">
                  <el-button type="success" size="small" @click="saveTag(scope.row.id)">
                    保存
                  </el-button>
                  <el-button type="info" size="small" @click="cancelEdit">
                    取消
                  </el-button>
                </div>
                <div v-else class="action-buttons">
                  <el-button type="primary" size="small" @click="editTag(scope.row)">
                    编辑
                  </el-button>
                  <el-button 
                    type="danger" 
                    size="small" 
                    @click="confirmDeleteTag(scope.row)"
                    :disabled="getTagCount(scope.row.id) > 0"
                  >
                    删除
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          
          <div class="empty-data" v-if="tags.length === 0 && !blogStore.isLoading">
            暂无标签数据
          </div>
        </div>
      </div>
    </div>
    
    <!-- 确认弹窗 -->
    <el-dialog
      v-model="confirmDialogVisible"
      title="确认删除"
      width="30%"
      :before-close="closeConfirmDialog"
    >
      <div class="confirm-content">
        <p>确定要删除 <strong>{{ deleteItemName }}</strong> 吗？</p>
        <p class="warning-text">此操作无法撤销！</p>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeConfirmDialog">取消</el-button>
          <el-button type="danger" @click="executeDelete">确认删除</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useBlogStore } from '@/stores/blog'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as categoryApi from '@/api/category'

const blogStore = useBlogStore()

// 分类相关
const newCategoryName = ref('')
const editCategoryId = ref(null)
const editCategoryName = ref('')
const categories = ref([])

// 标签相关
const newTagName = ref('')
const editTagId = ref(null)
const editTagName = ref('')
const tags = computed(() => blogStore.getTags || [])
const tagStats = computed(() => blogStore.getTagStats || [])

// 删除确认弹窗
const confirmDialogVisible = ref(false)
const deleteItemName = ref('')
const deleteItemType = ref('') // 'category' 或 'tag'
const deleteItemId = ref(null)

// 初始化数据
onMounted(async () => {
  await Promise.allSettled([
    loadCategories(),
    blogStore.fetchTags(),
    blogStore.fetchTagStats()
  ])
})

// 加载分类数据及文章计数
async function loadCategories() {
  try {
    const categoriesData = await categoryApi.getAll()
    const countData = await categoryApi.getDocumentCount()
    
    // 合并分类与计数数据
    categories.value = categoriesData.map(category => {
      const countItem = countData.find(item => item.categoryId === category.id)
      return {
        ...category,
        count: countItem ? countItem.count : 0
      }
    })
  } catch (error) {
    ElMessage.error('获取分类数据失败')
  }
}

// 获取标签引用次数
function getTagCount(tagId) {
  const statItem = tagStats.value.find(item => item.tagId === tagId)
  return statItem ? statItem.count : 0
}

// === 分类管理 ===
async function addCategory() {
  if (!newCategoryName.value.trim()) return
  
  try {
    await categoryApi.create(newCategoryName.value.trim())
    newCategoryName.value = ''
    ElMessage.success('分类创建成功')
    loadCategories()
  } catch (error) {
    ElMessage.error('创建分类失败')
  }
}

function editCategory(category) {
  editCategoryId.value = category.id
  editCategoryName.value = category.name
}

async function saveCategory(id) {
  if (!editCategoryName.value.trim()) {
    return ElMessage.warning('分类名称不能为空')
  }
  
  try {
    await categoryApi.update(id, editCategoryName.value.trim())
    ElMessage.success('分类更新成功')
    cancelEdit()
    loadCategories()
  } catch (error) {
    ElMessage.error('更新分类失败')
  }
}

function confirmDeleteCategory(category) {
  if (category.count > 0) {
    return ElMessage.warning('该分类下有文章，无法删除')
  }
  
  deleteItemType.value = 'category'
  deleteItemId.value = category.id
  deleteItemName.value = category.name
  confirmDialogVisible.value = true
}

// === 标签管理 ===
async function addTag() {
  if (!newTagName.value.trim()) return
  
  try {
    await blogStore.createTags([newTagName.value.trim()])
    newTagName.value = ''
    ElMessage.success('标签创建成功')
    await blogStore.fetchTagStats()
  } catch (error) {
    ElMessage.error('创建标签失败')
  }
}

function editTag(tag) {
  editTagId.value = tag.id
  editTagName.value = tag.name
}

async function saveTag(id) {
  // 暂不支持编辑标签，API 中没有提供相关功能
  ElMessage.warning('暂不支持编辑标签')
  cancelEdit()
}

function confirmDeleteTag(tag) {
  if (getTagCount(tag.id) > 0) {
    return ElMessage.warning('该标签已被使用，无法删除')
  }
  
  deleteItemType.value = 'tag'
  deleteItemId.value = tag.id
  deleteItemName.value = tag.name
  confirmDialogVisible.value = true
}

// 通用方法
function cancelEdit() {
  editCategoryId.value = null
  editCategoryName.value = ''
  editTagId.value = null
  editTagName.value = ''
}

function closeConfirmDialog() {
  confirmDialogVisible.value = false
}

async function executeDelete() {
  try {
    if (deleteItemType.value === 'category') {
      await categoryApi.remove(deleteItemId.value)
      ElMessage.success('分类删除成功')
      loadCategories()
    } else if (deleteItemType.value === 'tag') {
      await blogStore.deleteTag(deleteItemId.value)
      ElMessage.success('标签删除成功')
      await blogStore.fetchTagStats()
    }
    closeConfirmDialog()
  } catch (error) {
    ElMessage.error(`删除${deleteItemType.value === 'category' ? '分类' : '标签'}失败`)
  }
}
</script>

<style scoped>
.management-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.subtitle {
  color: #666;
  font-size: 1rem;
}

.management-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.section-container {
  width: 100%;
}

.section-header {
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #333;
}

.section-desc {
  color: #666;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.add-item-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.add-item-row .el-input {
  flex: 1;
}

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

.edit-field {
  margin: -0.5rem 0;
}

.empty-data {
  text-align: center;
  padding: 2rem 0;
  color: #999;
  font-size: 0.875rem;
}

.confirm-content {
  text-align: center;
}

.warning-text {
  color: #f56c6c;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
}
</style> 