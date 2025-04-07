<template>
  <header class="app-header">
    <div class="header-container">
      <div class="logo">
        <router-link to="/">博客管理系统</router-link>
      </div>
      
      <div class="nav-menu">
        <router-link to="/" class="nav-item">文档列表</router-link>
        <router-link to="/editor" class="nav-item">创建文档</router-link>
      </div>
      
      <div class="user-menu">
        <div v-if="authStore.isUserAuthenticated" class="user-dropdown" @click="toggleDropdown" ref="dropdownRef">
          <div class="avatar">
            <img src="../assets/avatar-placeholder.png" alt="用户头像">
          </div>
          <span class="username">{{ authStore.getUser?.name || authStore.getUser?.username }}</span>
          <i class="fa fa-angle-down"></i>
          
          <div v-show="showDropdown" class="dropdown-menu">
            <router-link to="/profile" class="dropdown-item" @click="showDropdown = false">
              <i class="fa fa-user"></i>
              <span>个人信息</span>
            </router-link>
            <div class="dropdown-item">
              <i class="fa fa-gear"></i>
              <span>设置</span>
            </div>
            <div class="dropdown-divider"></div>
            <div class="dropdown-item logout" @click="handleLogout">
              <i class="fa fa-sign-out"></i>
              <span>退出登录</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const showDropdown = ref(false)
const dropdownRef = ref(null)

const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const getUserInitials = () => {
  const user = authStore.getUser
  if (!user) return '?'
  
  if (user.name) {
    return user.name.charAt(0).toUpperCase()
  }
  
  return user.username.charAt(0).toUpperCase()
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

// 计算属性：用户名显示
const displayName = computed(() => {
  const user = authStore.getUser
  return user?.name || user?.username || '用户'
})
</script>

<style scoped>
.app-header {
  background-color: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 64px;
}

.logo {
  font-size: 20px;
  font-weight: 600;
}

.logo a {
  color: #4a90e2;
  text-decoration: none;
}

.nav-menu {
  display: flex;
  gap: 20px;
}

.nav-item {
  color: #555;
  text-decoration: none;
  font-size: 14px;
  padding: 8px 0;
  position: relative;
}

.nav-item:hover {
  color: #4a90e2;
}

.nav-item.router-link-active {
  color: #4a90e2;
}

.nav-item.router-link-active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #4a90e2;
}

.user-menu {
  display: flex;
  align-items: center;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-dropdown:hover {
  background-color: #f5f5f5;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.username {
  font-size: 14px;
  color: #555;
}

.dropdown-arrow {
  font-size: 12px;
  color: #999;
  transition: transform 0.3s ease;
}

.user-dropdown:hover .dropdown-arrow {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 180px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 8px 0;
  z-index: 10;
  transition: all 0.2s ease;
}

.dropdown-item {
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #555;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-item i {
  font-size: 14px;
  width: 16px;
  text-align: center;
  opacity: 0.7;
}

.dropdown-divider {
  height: 1px;
  background-color: #eee;
  margin: 8px 0;
}

.dropdown-item.logout {
  color: #e74c3c;
}

.dropdown-item.logout:hover {
  background-color: rgba(231, 76, 60, 0.1);
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }
  
  .header-container {
    justify-content: space-between;
  }
}
</style> 