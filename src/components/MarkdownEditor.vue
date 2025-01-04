<template>
  <div class="markdown-editor">
    <div class="editor-container">
      <MarkdownToolbar @insert-markdown="insertMarkdownContent" />
      <div class="editor-content">
        <div class="markdown-input-wrapper">
          <textarea 
            ref="markdownInput"
            v-model="localContent" 
            placeholder="输入您的 Markdown 内容..."
            class="markdown-input"
            @input="updatePreviewScroll"
          ></textarea>
          <div class="markdown-input-overlay">
            <span>Markdown 编辑区</span>
          </div>
        </div>
        <div class="markdown-preview-wrapper">
          <div 
            ref="markdownPreview"
            class="markdown-preview" 
            v-html="renderedContent"
            @scroll="updateInputScroll"
          ></div>
          <div class="markdown-preview-overlay">
            <span>预览区</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { markdownRenderer } from '@/utils/markdown-config'
import MarkdownToolbar from './MarkdownToolbar.vue'

const md = markdownRenderer

const props = defineProps({
  content: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:content'])

const localContent = computed({
  get: () => props.content,
  set: (value) => emit('update:content', value)
})

const markdownInput = ref(null)
const markdownPreview = ref(null)

const updatePreviewScroll = () => {
  nextTick(() => {
    if (markdownInput.value && markdownPreview.value) {
      const inputScrollPercentage = markdownInput.value.scrollTop / (markdownInput.value.scrollHeight - markdownInput.value.clientHeight)
      markdownPreview.value.scrollTop = (markdownPreview.value.scrollHeight - markdownPreview.value.clientHeight) * inputScrollPercentage
    }
  })
}

const updateInputScroll = () => {
  nextTick(() => {
    if (markdownInput.value && markdownPreview.value) {
      const previewScrollPercentage = markdownPreview.value.scrollTop / (markdownPreview.value.scrollHeight - markdownPreview.value.clientHeight)
      markdownInput.value.scrollTop = (markdownInput.value.scrollHeight - markdownInput.value.clientHeight) * previewScrollPercentage
    }
  })
}

const uploadedImages = ref([])

const handleFileUpload = (event) => {
  const files = event.target.files
  for (let file of files) {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        uploadedImages.value.push({
          name: file.name,
          url: e.target.result
        })
        localContent.value += `\n![${file.name}](${e.target.result})\n`
      }
      reader.readAsDataURL(file)
    }
  }
}

const insertMarkdownContent = (content) => {
  const currentPosition = markdownInput.value.selectionStart
  const beforeContent = localContent.value.slice(0, currentPosition)
  const afterContent = localContent.value.slice(currentPosition)
  localContent.value = `${beforeContent}${content}${afterContent}`
}

const renderedContent = computed(() => {
  return md.render(localContent.value)
})
</script>

<style scoped>
.markdown-editor {
  display: flex;
  flex-grow: 1;
  max-width: 100%;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.editor-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.editor-content {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
}

.markdown-input-wrapper,
.markdown-preview-wrapper {
  position: relative;
  width: 50%;
  height: 100%;
}

.markdown-input,
.markdown-preview {
  width: 100%;
  height: 100%;
  border: none;
  padding: 20px;
  resize: none;
  overflow-y: auto;
  font-size: 16px;
  line-height: 1.6;
}

.markdown-input {
  background-color: #f9f9fc;
  border-right: 1px solid #e0e0e0;
}

.markdown-preview {
  background-color: white;
}

.markdown-input-overlay,
.markdown-preview-overlay {
  position: absolute;
  top: -30px;
  left: 20px;
  color: #888;
  font-size: 0.9em;
}

/* 自定义滚动条 */
.markdown-input::-webkit-scrollbar,
.markdown-preview::-webkit-scrollbar {
  width: 8px;
}

.markdown-input::-webkit-scrollbar-track,
.markdown-preview::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.markdown-input::-webkit-scrollbar-thumb,
.markdown-preview::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.markdown-input::-webkit-scrollbar-thumb:hover,
.markdown-preview::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* 表格样式优化 */
.markdown-table-container {
  margin: 20px 0;
  overflow-x: auto;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08);
}

.markdown-table-wrapper {
  border-radius: 12px;
  overflow: hidden;
}

.markdown-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

.markdown-table .table-header {
  background-color: #f0f4f8;
  font-weight: 600;
  color: #2c3e50;
  transition: background-color 0.3s ease;
}

.markdown-table .table-header:hover {
  background-color: #e6eaf0;
}

.markdown-table .table-row {
  transition: background-color 0.3s ease;
}

.markdown-table .table-row:nth-child(even) {
  background-color: #f9f9fc;
}

.markdown-table .table-row:hover {
  background-color: #f0f0f5;
}

.markdown-table .table-header-cell,
.markdown-table .table-data-cell {
  padding: 12px 15px;
  border: 1px solid #e0e4e8;
  text-align: left;
  vertical-align: middle;
  font-size: 14px;
}

.markdown-table .table-header-cell {
  background-color: #f0f4f8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.markdown-table .table-data-cell {
  color: #34495e;
}

/* 响应式表格 */
@media screen and (max-width: 600px) {
  .markdown-table-container {
    margin: 10px 0;
  }

  .markdown-table .table-header-cell,
  .markdown-table .table-data-cell {
    padding: 8px 10px;
    font-size: 12px;
  }
}

/* 代码块样式 */
.markdown-preview pre.hljs {
  background-color: #f4f4f4;
  border-radius: 8px;
  padding: 15px;
  margin: 15px 0;
  line-height: 1.6;
  overflow-x: auto;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #4a90e2;
}

.markdown-preview pre.hljs code {
  font-family: 'Fira Code', 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'Courier New', monospace;
  font-size: 14px;
}

/* 语言标签 */
.markdown-preview pre.hljs::before {
  content: attr(class);
  display: block;
  background-color: #4a90e2;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 10px;
  align-self: flex-start;
}
</style> 