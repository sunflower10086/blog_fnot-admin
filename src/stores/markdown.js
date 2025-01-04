import { defineStore } from 'pinia'

export const useMarkdownStore = defineStore('markdown', {
  state: () => ({
    documents: [],
    currentDocument: null,
    tags: ['技术', '生活', '随笔', '工作', '学习'],
    categories: ['前端', '后端', '设计', '产品', '管理']
  }),
  actions: {
    addDocument(document) {
      const newDocument = {
        id: Date.now(),
        content: document.content,
        title: document.title || '未命名文档',
        createdAt: new Date(),
        tags: document.tags || [],
        category: document.category || null
      }
      this.documents.push(newDocument)
      return newDocument
    },
    updateDocument(id, updatedContent, tags = [], category = null) {
      const doc = this.documents.find(doc => doc.id === id)
      if (doc) {
        doc.content = updatedContent
        doc.tags = tags
        doc.category = category
      }
    },
    deleteDocument(id) {
      this.documents = this.documents.filter(doc => doc.id !== id)
    },
    setCurrentDocument(document) {
      this.currentDocument = document
    },
    addTag(tag) {
      if (!this.tags.includes(tag)) {
        this.tags.push(tag)
      }
    },
    addCategory(category) {
      if (!this.categories.includes(category)) {
        this.categories.push(category)
      }
    }
  },
  persist: {
    enabled: true,
    strategies: [
      {
        key: 'markdown-documents',
        storage: localStorage
      }
    ]
  }
}) 