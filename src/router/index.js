import { createRouter, createWebHistory } from 'vue-router'
import MarkdownView from '../views/MarkdownView.vue'
import DocumentListView from '../views/DocumentListView.vue'

const routes = [
  {
    path: '/',
    name: 'DocumentList',
    component: DocumentListView
  },
  {
    path: '/editor',
    name: 'MarkdownEditor',
    component: MarkdownView
  },
  {
    path: '/editor/:id',
    name: 'EditDocument',
    component: MarkdownView,
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 