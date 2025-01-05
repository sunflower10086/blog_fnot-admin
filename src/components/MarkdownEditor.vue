<template>
  <div class="markdown-editor">
    <MarkdownToolbar @insert="handleInsert" />
    <div class="editor-content">
      <div class="editor-container">
        <textarea
          ref="editorTextarea"
          class="editor-textarea"
          v-model="localContent"
          @scroll="handleEditorScroll"
          placeholder="开始编辑..."
        ></textarea>
      </div>
      <div class="preview-container">
        <div ref="previewContainer" v-html="renderedContent" @scroll="handlePreviewScroll"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import { createMarkdownRenderer, editorStyles } from '@/config/editor.config'
import MarkdownToolbar from './MarkdownToolbar.vue'
import 'highlight.js/styles/github.css'

const props = defineProps({
  content: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:content'])
const md = createMarkdownRenderer()
const editorTextarea = ref(null)
const previewContainer = ref(null)
let isScrolling = false

// 添加自定义样式
const addCustomStyles = () => {
  const style = document.createElement('style')
  style.textContent = editorStyles
  document.head.appendChild(style)
}

// 在组件挂载时添加样式
addCustomStyles()

// 确保初始滚动位置为顶部
onMounted(() => {
  if (editorTextarea.value) {
    editorTextarea.value.scrollTop = 0
  }
  if (previewContainer.value) {
    previewContainer.value.scrollTop = 0
  }
})

const localContent = computed({
  get: () => props.content,
  set: (value) => {
    emit('update:content', value)
  }
})

const renderedContent = computed(() => {
  return md.render(localContent.value || '')
})

// 同步滚动处理
const handleEditorScroll = (e) => {
  if (isScrolling) return
  isScrolling = true

  const { scrollTop, scrollHeight, clientHeight } = e.target
  const scrollPercentage = scrollTop / (scrollHeight - clientHeight)
  
  if (previewContainer.value) {
    const previewScrollHeight = previewContainer.value.scrollHeight - previewContainer.value.clientHeight
    previewContainer.value.scrollTop = previewScrollHeight * scrollPercentage
  }

  setTimeout(() => {
    isScrolling = false
  }, 50)
}

const handlePreviewScroll = (e) => {
  if (isScrolling) return
  isScrolling = true

  const { scrollTop, scrollHeight, clientHeight } = e.target
  const scrollPercentage = scrollTop / (scrollHeight - clientHeight)
  
  if (editorTextarea.value) {
    const editorScrollHeight = editorTextarea.value.scrollHeight - editorTextarea.value.clientHeight
    editorTextarea.value.scrollTop = editorScrollHeight * scrollPercentage
  }

  setTimeout(() => {
    isScrolling = false
  }, 50)
}

// 处理工具栏的插入事件
const handleInsert = ({ type, data }) => {
  const textarea = editorTextarea.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = localContent.value || ''
  
  if (type === 'text') {
    const { prefix, suffix = '' } = data
    const selectedText = text.substring(start, end)
    const newText = text.substring(0, start) + 
                   prefix + selectedText + suffix +
                   text.substring(end)
    
    localContent.value = newText
    nextTick(() => {
      textarea.focus()
      textarea.setSelectionRange(
        start + prefix.length,
        end + prefix.length
      )
    })
  } else if (type === 'list') {
    const { prefix } = data
    const selectedText = text.substring(start, end)
    const lines = selectedText.split('\n')
    const newLines = lines.map(line => prefix + line).join('\n')
    
    const newText = text.substring(0, start) + newLines + text.substring(end)
    localContent.value = newText
  }
}

watch(() => props.content, (newVal) => {
  if (newVal !== localContent.value) {
    localContent.value = newVal
  }
})
</script>

<style scoped>
.markdown-editor {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #ffffff;
  overflow: hidden;
}

.editor-content {
  display: flex;
  flex: 1;
  overflow: hidden;
  min-height: 0;
  max-height: 100%;
}

.editor-container,
.preview-container {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  max-height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}

.editor-textarea {
  width: 100%;
  flex: 1;
  border: none;
  resize: none;
  outline: none;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.6;
  padding: 10px;
  box-sizing: border-box;
  overflow-y: hidden;
}

.preview-container {
  border-left: 1px solid #e0e0e0;
  background-color: #fafafa;
  box-sizing: border-box;
  overflow: hidden;
}

.preview-container > div {
  height: 100%;
  overflow-y: auto;
}
</style> 
