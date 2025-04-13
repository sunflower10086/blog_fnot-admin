import { marked } from 'marked';
import DOMPurify from 'dompurify';

/**
 * 配置marked选项
 */
marked.setOptions({
  breaks: true, // 允许换行符转换为<br>
  gfm: true,    // 启用GitHub风格的Markdown
  headerIds: true, // 为标题生成ID
  mangle: false,   // 不转义标题文本
  pedantic: false, // 不使用原始markdown规范
  sanitize: false, // 由DOMPurify负责净化
  smartLists: true, // 使用更智能的列表行为
  smartypants: true // 使用更智能的标点符号
});

/**
 * 解析Markdown为安全的HTML
 * @param {string} markdown - 要解析的Markdown文本
 * @param {Function} highlightFn - 可选的代码高亮函数
 * @returns {string} - 安全的HTML字符串
 */
export function parseMarkdown(markdown, highlightFn) {
  if (!markdown) return '';
  
  // 如果提供了高亮函数，设置它
  if (highlightFn) {
    marked.setOptions({
      highlight: highlightFn
    });
  }
  
  // 使用marked将Markdown解析为HTML
  const rawHtml = marked(markdown);
  
  // 使用DOMPurify净化HTML，防止XSS攻击
  return DOMPurify.sanitize(rawHtml, {
    ADD_ATTR: ['target'], // 允许target属性
    FORBID_TAGS: ['script', 'style', 'iframe', 'form', 'input', 'button'], // 禁止标签
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'], // 禁止属性
    ALLOW_DATA_ATTR: false // 不允许data-*属性
  });
}

/**
 * 解析并预览Markdown，同时支持代码高亮
 * @param {string} markdown - 要解析的Markdown文本
 * @param {Function} highlightFn - 可选的代码高亮函数
 * @returns {string} - 安全的HTML字符串，带有高亮的代码
 */
export function renderMarkdownWithHighlight(markdown, highlightFn) {
  if (!markdown) return '';
  
  // 如果提供了高亮函数，设置它
  if (highlightFn) {
    marked.setOptions({
      highlight: highlightFn
    });
  }
  
  return parseMarkdown(markdown);
}

/**
 * 提取Markdown文档中的纯文本内容
 * @param {string} markdown - Markdown文本
 * @returns {string} - 提取的纯文本
 */
export function extractTextFromMarkdown(markdown) {
  if (!markdown) return '';
  
  // 将Markdown转换为HTML，然后创建临时元素来提取文本
  const html = parseMarkdown(markdown);
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // 获取纯文本内容并清理多余空白
  return tempDiv.textContent
    .replace(/\s+/g, ' ')
    .trim();
} 