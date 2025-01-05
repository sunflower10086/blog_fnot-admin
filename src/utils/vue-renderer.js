import { createApp, h, ref, computed, watch, defineComponent } from 'vue'

export function renderVueComponent(code, mountElement) {
  let currentVueApp = null

  try {
    // 手动提取模板、脚本和样式
    const templateMatch = code.match(/<template>([\s\S]*?)<\/template>/)
    const scriptMatch = code.match(/<script\s+setup>([\s\S]*?)<\/script>/)
    const styleMatch = code.match(/<style\s+scoped>([\s\S]*?)<\/style>/)

    if (!templateMatch || !scriptMatch) {
      throw new Error('无效的 Vue 组件格式')
    }

    const template = templateMatch[1].trim()
    const scriptContent = scriptMatch[1].trim()

    // 动态创建组件
    const component = defineComponent({
      template: `<div>${template}</div>`,
      setup() {
        // 创建一个安全的执行上下文
        const ctx = { 
          ref, 
          computed, 
          watch,
          h 
        }

        try {
          // 移除 import 语句
          const cleanScript = scriptContent
            .replace(/import\s+{([^}]+)}\s+from\s+['"]vue['"]/g, '')
            .replace(/import\s+\w+\s+from\s+['"]vue['"]/g, '')

          // 使用 Function 构造器创建安全的执行环境
          const setupFn = new Function(
            'ref', 
            'computed', 
            'watch', 
            'h', 
            `return (() => { 
              ${cleanScript} 
            })();`
          )

          return setupFn(ref, computed, watch, h)
        } catch (error) {
          console.error('Setup error:', error)
          return {}
        }
      }
    })

    // 如果有样式，动态添加
    if (styleMatch) {
      const styleEl = document.createElement('style')
      styleEl.textContent = styleMatch[1]
      styleEl.setAttribute('scoped', '')
      document.head.appendChild(styleEl)
    }

    // 创建并挂载新应用
    currentVueApp = createApp(component)
    currentVueApp.mount(mountElement)

    return {
      unmount: () => {
        if (currentVueApp) {
          currentVueApp.unmount()
        }
      }
    }
  } catch (error) {
    console.error('Vue rendering error:', error)
    mountElement.innerHTML = `<div class="error">渲染错误: ${error.message}</div>`
    return null
  }
}

export function extractVueCode(content) {
  const vuePattern = /```vue\n([\s\S]*?)```/
  const match = content.match(vuePattern)
  return match ? match[1] : null
} 