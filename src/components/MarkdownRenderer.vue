<template>
  <div class="markdown-renderer">
    <div v-if="loading" class="markdown-loading">
      <div class="loading-spinner"></div>
    </div>
    <div v-else class="markdown-content" v-html="renderedContent"></div>
  </div>
</template>

<script>
import { parseMarkdown } from '@/utils/markdown';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css'; // 引入一个样式，可以替换为其他主题

export default {
  name: 'MarkdownRenderer',
  props: {
    content: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    renderedContent() {
      // 使用highlight.js进行代码高亮
      const highlightCode = (code, language) => {
        if (language && hljs.getLanguage(language)) {
          try {
            return hljs.highlight(code, { language }).value;
          } catch (e) {
            console.error('代码高亮出错:', e);
          }
        }
        
        // 如果指定的语言不可用或发生错误，尝试自动检测语言
        try {
          return hljs.highlightAuto(code).value;
        } catch (e) {
          console.error('自动代码高亮出错:', e);
        }
        
        // 如果所有尝试都失败，返回转义后的代码
        return code;
      };
      
      return parseMarkdown(this.content, highlightCode);
    }
  }
};
</script>

<style scoped>
.markdown-renderer {
  position: relative;
  width: 100%;
}

.markdown-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100px;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top-color: #409EFF;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.markdown-content {
  width: 100%;
}

/* 确保代码样式应用于内部元素 */
:deep(pre) {
  background-color: #f6f8fa;
  border-radius: 4px;
  padding: 16px;
  overflow: auto;
  margin-bottom: 16px;
}

:deep(code) {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  font-size: 85%;
}

:deep(p) {
  line-height: 1.6;
  margin-bottom: 16px;
}

:deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

:deep(h1) {
  font-size: 2em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: .3em;
}

:deep(h2) {
  font-size: 1.5em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: .3em;
}

:deep(blockquote) {
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
  margin: 0 0 16px 0;
}

:deep(ul), :deep(ol) {
  padding-left: 2em;
  margin-bottom: 16px;
}

:deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 16px;
}

:deep(table th), :deep(table td) {
  padding: 6px 13px;
  border: 1px solid #dfe2e5;
}

:deep(table tr) {
  background-color: #fff;
  border-top: 1px solid #c6cbd1;
}

:deep(table tr:nth-child(2n)) {
  background-color: #f6f8fa;
}

:deep(img) {
  max-width: 100%;
  box-sizing: content-box;
}

:deep(a) {
  color: #0366d6;
  text-decoration: none;
}

:deep(a:hover) {
  text-decoration: underline;
}

:deep(hr) {
  height: 0.25em;
  padding: 0;
  margin: 24px 0;
  background-color: #e1e4e8;
  border: 0;
}
</style> 