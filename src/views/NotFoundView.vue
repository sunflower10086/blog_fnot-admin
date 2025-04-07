<template>
  <div class="not-found">
    <div class="not-found-container">
      <div class="error-code">404</div>
      <h1 class="error-title">页面未找到</h1>
      <p class="error-message">抱歉，您访问的页面不存在或已被移除</p>
      <div class="actions">
        <button @click="goBack" class="back-button">
          <i class="fa fa-arrow-left"></i> 返回上一页
        </button>
        <router-link to="/" class="back-home">
          <i class="fa fa-home"></i> 返回首页
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 0 20px;
  background-color: #f9f9fc;
}

.not-found-container {
  text-align: center;
  max-width: 500px;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.error-code {
  font-size: 120px;
  font-weight: 700;
  color: #4a90e2;
  line-height: 1;
  text-shadow: 4px 4px 0px rgba(74, 144, 226, 0.1);
  margin-bottom: 20px;
}

.error-title {
  font-size: 28px;
  color: #333;
  margin-bottom: 15px;
}

.error-message {
  font-size: 16px;
  color: #666;
  margin-bottom: 30px;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 15px;
  flex-wrap: wrap;
}

.back-button,
.back-home {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 14px;
  cursor: pointer;
}

.back-button {
  background-color: #f2f2f2;
  color: #555;
  border: none;
}

.back-button:hover {
  background-color: #e5e5e5;
  transform: translateY(-2px);
}

.back-home {
  background-color: #4a90e2;
  color: white;
  text-decoration: none;
}

.back-home:hover {
  background-color: #3a7bc8;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(74, 144, 226, 0.2);
}

@media (max-width: 480px) {
  .error-code {
    font-size: 100px;
  }
  
  .error-title {
    font-size: 24px;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .back-button,
  .back-home {
    width: 100%;
    justify-content: center;
  }
}
</style> 