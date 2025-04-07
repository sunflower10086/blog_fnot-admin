<script setup>
import { RouterView } from 'vue-router'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import AppHeader from '@/components/AppHeader.vue'

const route = useRoute()

// 计算是否显示头部导航（登录页面不显示）
const showHeader = computed(() => route.name !== 'Login')
</script>

<template>
  <div id="app">
    <AppHeader v-if="showHeader" />
    <main class="main-content" :class="{ 'with-header': showHeader }">
      <RouterView />
    </main>
  </div>
</template>

<style>
body, html {
  margin: 0;
  padding: 0;
  height: 100%;
  font-family: 'Arial', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #f9f9fc;
}

#app {
  height: 100%;
}

.main-content {
  min-height: 100%;
}

.main-content.with-header {
  padding-top: 64px; /* 与头部高度相同 */
}
</style>
