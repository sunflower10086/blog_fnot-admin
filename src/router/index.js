import { createRouter, createWebHistory } from 'vue-router'
import MarkdownView from '../views/MarkdownView.vue'
import DocumentListView from '../views/DocumentListView.vue'
import LoginView from '../views/LoginView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import ProfileView from '../views/ProfileView.vue'
import { useUserStore } from '../stores/auth'

const routes = [
  {
    path: '/',
    name: 'DocumentList',
    component: DocumentListView,
    meta: { requiresAuth: true }
  },
  {
    path: '/editor',
    name: 'MarkdownEditor',
    component: MarkdownView,
    meta: { requiresAuth: true }
  },
  {
    path: '/editor/:id',
    name: 'EditDocument',
    component: MarkdownView,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFoundView
  },
  // 将匹配所有路径并重定向到 404 页面
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 全局前置守卫
router.beforeEach((to, from) => {
  const authStore = useUserStore()
  
  // 检查该路由是否需要登录
  if (to.meta.requiresAuth) {
    // 如果用户未登录，重定向到登录页面
    if (!authStore.isUserAuthenticated) {
      return {
        path: '/login',
        query: { redirect: to.fullPath }
      }
    }
  }
  
  return true
})

export default router 