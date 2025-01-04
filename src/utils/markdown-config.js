import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

// 导入更多语言的高亮支持
import 'highlight.js/styles/github.css'
import 'highlight.js/lib/common'
import 'highlight.js/lib/languages/python'
import 'highlight.js/lib/languages/javascript'
import 'highlight.js/lib/languages/typescript'
import 'highlight.js/lib/languages/cpp'
import 'highlight.js/lib/languages/java'
import 'highlight.js/lib/languages/rust'
import 'highlight.js/lib/languages/go'
import 'highlight.js/lib/languages/swift'
import 'highlight.js/lib/languages/kotlin'
import 'highlight.js/lib/languages/php'
import 'highlight.js/lib/languages/ruby'
import 'highlight.js/lib/languages/shell'
import 'highlight.js/lib/languages/sql'
import 'highlight.js/lib/languages/xml'
import 'highlight.js/lib/languages/css'

// Markdown 配置
export const createMarkdownRenderer = () => {
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return `<pre class="hljs language-${lang}"><code class="language-${lang}">${
            hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
          }</code></pre>`;
        } catch (__) {}
      }
      return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
    }
  })

  // 自定义渲染规则，美化表格
  const defaultTableOpen = md.renderer.rules.table_open
  const defaultTableClose = md.renderer.rules.table_close
  const defaultTableRowOpen = md.renderer.rules.tr_open
  const defaultTableRowClose = md.renderer.rules.tr_close
  const defaultTableHeaderOpen = md.renderer.rules.th_open
  const defaultTableCellOpen = md.renderer.rules.td_open

  md.renderer.rules.table_open = (tokens, idx, options, env, self) => {
    return '<div class="markdown-table-container">' +
           '<div class="markdown-table-wrapper">' +
           (defaultTableOpen ? defaultTableOpen(tokens, idx, options, env, self) : '<table>')
  }

  md.renderer.rules.table_close = (tokens, idx, options, env, self) => {
    return (defaultTableClose ? defaultTableClose(tokens, idx, options, env, self) : '</table>') +
           '</div></div>'
  }

  md.renderer.rules.tr_open = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const isHeader = token.level === 1
    return `<tr class="${isHeader ? 'table-header' : 'table-row'}">`
  }

  md.renderer.rules.th_open = (tokens, idx, options, env, self) => {
    return '<th class="table-header-cell">'
  }

  md.renderer.rules.td_open = (tokens, idx, options, env, self) => {
    return '<td class="table-data-cell">'
  }

  return md
}

// 支持的编程语言列表
export const programmingLanguages = [
  'javascript', 'python', 'java', 'cpp', 'typescript', 
  'rust', 'go', 'swift', 'kotlin', 'php', 
  'ruby', 'scala', 'shell', 'sql', 'html', 'css'
]

// Markdown 渲染工具
export const markdownRenderer = createMarkdownRenderer() 