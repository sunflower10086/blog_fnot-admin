<template>
  <div class="editor-toolbar">
    <button class="toolbar-button" title="一级标题" @click="insertText('# ')">
      <span class="button-icon">H1</span>
    </button>
    <button class="toolbar-button" title="二级标题" @click="insertText('## ')">
      <span class="button-icon">H2</span>
    </button>
    <button class="toolbar-button" title="三级标题" @click="insertText('### ')">
      <span class="button-icon">H3</span>
    </button>
    <div class="divider"></div>
    <button class="toolbar-button" title="粗体" @click="insertText('**', '**')">
      <span class="button-icon">B</span>
    </button>
    <button class="toolbar-button" title="斜体" @click="insertText('*', '*')">
      <span class="button-icon">I</span>
    </button>
    <div class="divider"></div>
    <button class="toolbar-button" title="引用" @click="insertText('> ')">
      <span class="button-icon">"</span>
    </button>
    <button class="toolbar-button" title="无序列表" @click="insertList('- ')">
      <span class="button-icon">•</span>
    </button>
    <button class="toolbar-button" title="有序列表" @click="insertList('1. ')">
      <span class="button-icon">1.</span>
    </button>
    <div class="divider"></div>
    <button class="toolbar-button" title="表格" @click="insertTable">
      <span class="button-icon">⊞</span>
    </button>
    <button class="toolbar-button" title="代码块" @click="insertCode">
      <span class="button-icon">{}</span>
    </button>
    <button class="toolbar-button" title="Vue模板" @click="insertVueTemplate">
      <span class="button-icon">Vue</span>
    </button>
    <div class="divider"></div>
    <button class="toolbar-button" title="上传图片" @click="uploadImage">
      <span class="button-icon">📷</span>
    </button>
    <button class="toolbar-button" title="插入链接" @click="insertText('[', ']()')">
      <span class="button-icon">🔗</span>
    </button>
  </div>
</template>

<script setup>
import { supportedLanguages, getLanguageDisplayName } from '@/config/highlight.config'

const emit = defineEmits(['insert'])

// 工具栏功能
const insertText = (prefix, suffix = '') => {
  emit('insert', { type: 'text', data: { prefix, suffix } })
}

const insertList = (prefix) => {
  emit('insert', { type: 'list', data: { prefix } })
}

const insertTable = () => {
  const tableTemplate = `
| 标题1 | 标题2 | 标题3 |
|-------|-------|-------|
| 内容1 | 内容2 | 内容3 |
| 内容4 | 内容5 | 内容6 |
`
  emit('insert', { type: 'text', data: { prefix: tableTemplate } })
}

const insertCode = () => {
  // 生成语言选项列表，带有显示名称
  const languageOptions = supportedLanguages
    .map(lang => `${getLanguageDisplayName(lang)} (${lang})`)
    .join('\n')
  
  const language = window.prompt(`请选择编程语言：\n${languageOptions}`, 'javascript')
  if (language) {
    const normalizedLang = language.toLowerCase().trim()
    // 移除可能的显示名称部分，只保留语言标识符
    const langId = normalizedLang.match(/\((.*?)\)$/)
      ? normalizedLang.match(/\((.*?)\)$/)[1]
      : normalizedLang
    
    if (supportedLanguages.includes(langId)) {
      const codeTemplate = `\`\`\`${langId}\n// 在此输入代码\n\`\`\``
      emit('insert', { type: 'text', data: { prefix: codeTemplate } })
    } else {
      alert('不支持的语言类型！请从列表中选择。')
    }
  }
}

const insertVueTemplate = () => {
  const vueTemplate = '```vue\n' +
    '<template>\n' +
    '  <div class="example">\n' +
    '    <h1>{{ message }}</h1>\n' +
    '    <button @click="count++">点击次数: {{ count }}</button>\n' +
    '  </div>\n' +
    '</template>\n\n' +
    '<script setup>\n' +
    'import { ref } from "vue"\n\n' +
    'const message = ref("Hello Vue!")\n' +
    'const count = ref(0)\n' +
    '</sc' + 'ript>\n\n' +
    '<style scoped>\n' +
    '.example { padding: 20px; text-align: center; }\n' +
    '</style>\n' +
    '```'
  emit('insert', { type: 'text', data: { prefix: vueTemplate } })
}

const uploadImage = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageMarkdown = `![${file.name}](${e.target.result})`
        emit('insert', { type: 'text', data: { prefix: imageMarkdown } })
      }
      reader.readAsDataURL(file)
    }
  }
  input.click()
}
</script>

<style scoped>
.editor-toolbar {
  padding: 8px 12px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  background-color: #f8f9fa;
}

.toolbar-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  padding: 0 8px;
  border: 1px solid #dfe1e5;
  background-color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #444;
  transition: all 0.2s ease;
  position: relative;
}

.toolbar-button:hover {
  background-color: #f1f3f4;
  border-color: #c6c9cc;
  color: #1a73e8;
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.toolbar-button:active {
  transform: translateY(0);
  box-shadow: none;
}

.button-icon {
  font-size: 16px;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

.divider {
  width: 1px;
  height: 24px;
  margin: 6px 4px;
  background-color: #e0e0e0;
  align-self: center;
}

/* 特殊按钮样式 */
.toolbar-button[title="粗体"] .button-icon {
  font-weight: bold;
}

.toolbar-button[title="斜体"] .button-icon {
  font-style: italic;
}

.toolbar-button[title="Vue模板"] .button-icon {
  color: #42b883;
  font-weight: bold;
}

/* 悬浮提示 */
.toolbar-button:hover::after {
  content: attr(title);
  position: absolute;
  bottom: -30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 4px 8px;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .toolbar-button {
    min-width: 32px;
    height: 32px;
    padding: 0 6px;
  }

  .button-icon {
    font-size: 14px;
  }

  .divider {
    height: 20px;
    margin: 6px 2px;
  }
}
</style> 