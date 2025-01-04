<template>
  <div class="markdown-toolbar">
    <div class="toolbar-section">
      <div class="toolbar-group">
        <el-tooltip 
          effect="dark" 
          content="插入表格 (快速创建Markdown表格)" 
          placement="bottom"
        >
          <button 
            @click="openTableDialog" 
            class="toolbar-button" 
            title="插入表格"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="3" y1="15" x2="21" y2="15"></line>
              <line x1="9" y1="3" x2="9" y2="21"></line>
              <line x1="15" y1="3" x2="15" y2="21"></line>
            </svg>
          </button>
        </el-tooltip>

        <el-tooltip 
          effect="dark" 
          content="上传图片 (支持本地图片)" 
          placement="bottom"
        >
          <button 
            @click="openImageUpload" 
            class="toolbar-button" 
            title="上传图片"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </button>
        </el-tooltip>

        <el-tooltip 
          effect="dark" 
          content="插入代码片段 (支持多种语言)" 
          placement="bottom"
        >
          <button 
            @click="openCodeSnippetDialog" 
            class="toolbar-button" 
            title="插入代码片段"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
              <line x1="12" y1="2" x2="12" y2="22"></line>
            </svg>
          </button>
        </el-tooltip>

        <el-tooltip 
          effect="dark" 
          content="插入代码块 (带语法高亮)" 
          placement="bottom"
        >
          <button 
            @click="openCodeBlockDialog" 
            class="toolbar-button" 
            title="插入代码块"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M10 9.5 8 12l2 2.5"></path>
              <path d="M14 9.5 16 12l-2 2.5"></path>
              <rect x="3" y="4" width="18" height="16" rx="2"></rect>
              <line x1="7" y1="20" x2="17" y2="20"></line>
            </svg>
          </button>
        </el-tooltip>
      </div>
    </div>

    <!-- 表格插入对话框 -->
    <el-dialog 
      v-model="tableDialogVisible" 
      title="插入表格" 
      width="400px"
      :custom-class="'custom-dialog'"
    >
      <div class="table-size-selector">
        <el-input-number 
          v-model="tableRows" 
          :min="1" 
          :max="10" 
          label="行数" 
          size="small"
        />
        <el-input-number 
          v-model="tableColumns" 
          :min="1" 
          :max="10" 
          label="列数" 
          size="small"
        />
      </div>
      <template #footer>
        <el-button @click="tableDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="insertTable">确定</el-button>
      </template>
    </el-dialog>

    <!-- 代码片段对话框 -->
    <el-dialog 
      v-model="codeSnippetDialogVisible" 
      title="插入代码片段" 
      width="500px"
      :custom-class="'custom-dialog'"
    >
      <el-select 
        v-model="selectedLanguage" 
        placeholder="选择编程语言" 
        style="width: 100%;"
      >
        <el-option 
          v-for="lang in programmingLanguages" 
          :key="lang" 
          :label="lang" 
          :value="lang"
        />
      </el-select>
      <el-input 
        v-model="codeSnippet" 
        type="textarea" 
        :rows="5" 
        placeholder="输入代码片段" 
        style="margin-top: 10px;"
      />
      <template #footer>
        <el-button @click="codeSnippetDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="insertCodeSnippet">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElTooltip } from 'element-plus'

const emit = defineEmits(['insert-markdown'])

// 表格相关
const tableDialogVisible = ref(false)
const tableRows = ref(3)
const tableColumns = ref(3)

const openTableDialog = () => {
  tableDialogVisible.value = true
}

const insertTable = () => {
  let tableMarkdown = '| '
  
  // 创建表头
  for (let i = 0; i < tableColumns.value; i++) {
    tableMarkdown += `标题${i + 1} | `
  }
  tableMarkdown += '\n| '
  
  // 创建分隔线
  for (let i = 0; i < tableColumns.value; i++) {
    tableMarkdown += '--- | '
  }
  tableMarkdown += '\n'
  
  // 创建数据行
  for (let i = 0; i < tableRows.value; i++) {
    tableMarkdown += '| '
    for (let j = 0; j < tableColumns.value; j++) {
      tableMarkdown += `内容${i + 1}-${j + 1} | `
    }
    tableMarkdown += '\n'
  }
  
  emit('insert-markdown', tableMarkdown)
  tableDialogVisible.value = false
}

// 图片上传相关
const openImageUpload = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageMarkdown = `\n![${file.name}](${e.target.result})\n`
        emit('insert-markdown', imageMarkdown)
      }
      reader.readAsDataURL(file)
    }
  }
  input.click()
}

// 代码片段相关
const codeSnippetDialogVisible = ref(false)
const selectedLanguage = ref('')
const codeSnippet = ref('')
const programmingLanguages = [
  'javascript', 'python', 'java', 'cpp', 'typescript', 
  'rust', 'go', 'swift', 'kotlin', 'php', 
  'ruby', 'scala', 'shell', 'sql', 'html', 'css'
]

const openCodeSnippetDialog = () => {
  codeSnippetDialogVisible.value = true
}

const insertCodeSnippet = () => {
  if (!selectedLanguage.value) {
    ElMessage.warning('请选择编程语言')
    return
  }
  
  if (!codeSnippet.value.trim()) {
    ElMessage.warning('请输入代码片段')
    return
  }
  
  const codeMarkdown = `\`\`\`${selectedLanguage.value}\n${codeSnippet.value}\n\`\`\`\n`
  emit('insert-markdown', codeMarkdown)
  
  codeSnippetDialogVisible.value = false
  selectedLanguage.value = ''
  codeSnippet.value = ''
}
</script>

<style scoped>
.markdown-toolbar {
  background-color: #f9f9fc;
  border-bottom: 1px solid #e0e0e0;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.toolbar-section {
  display: flex;
  align-items: center;
}

.toolbar-group {
  display: flex;
  gap: 10px;
}

.toolbar-button {
  background-color: transparent;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toolbar-button:hover {
  background-color: rgba(0, 0, 0, 0.05);
  color: #4a90e2;
  transform: scale(1.1);
}

.toolbar-button svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
}

.table-size-selector {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

:deep(.custom-dialog) {
  border-radius: 12px !important;
}
</style> 