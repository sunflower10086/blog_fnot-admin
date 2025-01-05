import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

// 导入常用语言的语法高亮
import xml from 'highlight.js/lib/languages/xml'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import java from 'highlight.js/lib/languages/java'
import cpp from 'highlight.js/lib/languages/cpp'
import csharp from 'highlight.js/lib/languages/csharp'
import php from 'highlight.js/lib/languages/php'
import ruby from 'highlight.js/lib/languages/ruby'
import go from 'highlight.js/lib/languages/go'
import rust from 'highlight.js/lib/languages/rust'
import sql from 'highlight.js/lib/languages/sql'
import shell from 'highlight.js/lib/languages/shell'
import json from 'highlight.js/lib/languages/json'
import yaml from 'highlight.js/lib/languages/yaml'
import css from 'highlight.js/lib/languages/css'
import scss from 'highlight.js/lib/languages/scss'
import less from 'highlight.js/lib/languages/less'
import markdown from 'highlight.js/lib/languages/markdown'

// 语言别名映射
const languageAliases = {
  'vue': 'xml',
  'html': 'xml',
  'js': 'javascript',
  'ts': 'typescript',
  'py': 'python',
  'c++': 'cpp',
  'cs': 'csharp',
  'rb': 'ruby',
  'golang': 'go',
  'rs': 'rust',
  'bash': 'shell',
  'sh': 'shell',
  'yml': 'yaml',
  'md': 'markdown'
}

// 支持的语言列表
export const supportedLanguages = [
  'javascript', 'typescript', 'python', 'java', 'cpp', 'csharp',
  'php', 'ruby', 'go', 'rust', 'sql', 'shell', 'json', 'yaml',
  'css', 'scss', 'less', 'html', 'xml', 'markdown', 'vue'
]

// 注册所有语言
const languages = {
  xml, javascript, typescript, python, java, cpp,
  csharp, php, ruby, go, rust, sql, shell,
  json, yaml, css, scss, less, markdown
}

// 注册主要语言
Object.entries(languages).forEach(([lang, definition]) => {
  hljs.registerLanguage(lang, definition)
})

// 注册语言别名
Object.entries(languageAliases).forEach(([alias, lang]) => {
  hljs.registerAliases(alias, { languageName: lang })
})

// 高亮函数
export function highlightCode(str, lang) {
  if (lang && hljs.getLanguage(lang)) {
    try {
      return hljs.highlight(str, { language: lang }).value
    } catch (__) {}
  }
  return str
}

// 获取语言的显示名称
export function getLanguageDisplayName(lang) {
  const displayNames = {
    'javascript': 'JavaScript',
    'typescript': 'TypeScript',
    'python': 'Python',
    'java': 'Java',
    'cpp': 'C++',
    'csharp': 'C#',
    'php': 'PHP',
    'ruby': 'Ruby',
    'go': 'Go',
    'rust': 'Rust',
    'sql': 'SQL',
    'shell': 'Shell',
    'json': 'JSON',
    'yaml': 'YAML',
    'css': 'CSS',
    'scss': 'SCSS',
    'less': 'Less',
    'html': 'HTML',
    'xml': 'XML',
    'markdown': 'Markdown',
    'vue': 'Vue'
  }
  return displayNames[lang] || lang.toUpperCase()
} 