<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>博客管理系统</h2>
        <p>请登录后继续</p>
      </div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="username">用户名</label>
          <div class="input-with-icon">
            <i class="fa fa-user"></i>
            <input 
              id="username" 
              v-model="username" 
              type="text" 
              placeholder="请输入用户名"
              autocomplete="username"
              required
            />
          </div>
        </div>
        
        <div class="form-group">
          <label for="password">密码</label>
          <div class="input-with-icon">
            <i class="fa fa-lock"></i>
            <input 
              id="password" 
              v-model="password" 
              :type="showPassword ? 'text' : 'password'" 
              placeholder="请输入密码"
              autocomplete="current-password"
              required
            />
            <i 
              class="password-toggle" 
              :class="showPassword ? 'fa fa-eye-slash' : 'fa fa-eye'" 
              @click="showPassword = !showPassword"
            ></i>
          </div>
        </div>
        
        <div v-if="error" class="error-message">
          <i class="fa fa-exclamation-circle"></i> {{ error }}
        </div>
        
        <button 
          type="submit" 
          class="login-button" 
          :disabled="isLoading"
        >
          <i v-if="isLoading" class="fa fa-circle-o-notch fa-spin"></i>
          {{ isLoading ? '登录中...' : '登录' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)
const showPassword = ref(false)

// 如果用户已登录，则重定向到首页或请求的页面
onMounted(() => {
  if (authStore.isUserAuthenticated) {
    const redirectPath = route.query.redirect || '/'
    router.replace(redirectPath)
  }
})

const handleLogin = async () => {
  if (!username.value || !password.value) {
    error.value = '用户名和密码不能为空'
    return
  }
  
  error.value = ''
  isLoading.value = true
  
  try {
    await authStore.login(username.value, password.value)
    // 登录成功后，重定向到之前请求的页面或默认页面
    const redirectPath = route.query.redirect || '/'
    router.replace(redirectPath)
  } catch (err) {
    error.value = err.message || '登录失败，请检查用户名和密码'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 5%;
  box-sizing: border-box;
}

.login-card {
  width: 90%;
  max-width: 90%;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  padding: 5%;
  animation: fadeIn 0.5s ease-out;
}

@media (min-width: 480px) {
  .login-card {
    width: 80%;
    max-width: 80%;
  }
}

@media (min-width: 768px) {
  .login-card {
    width: 60%;
    max-width: 60%;
  }
}

@media (min-width: 992px) {
  .login-card {
    width: 40%;
    max-width: 40%;
  }
}

@media (min-width: 1200px) {
  .login-card {
    width: 30%;
    max-width: 30%;
  }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #333;
  margin-bottom: 10px;
  font-weight: 600;
}

.login-header p {
  color: #666;
  font-size: 14px;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-size: 14px;
  font-weight: 500;
}

.input-with-icon {
  position: relative;
}

.input-with-icon i.fa-user,
.input-with-icon i.fa-lock {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
}

.input-with-icon input {
  width: 100%;
  padding: 3% 5% 3% 12%;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: clamp(14px, 1.5vw, 16px);
  transition: all 0.3s;
  box-sizing: border-box;
}

.input-with-icon input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.password-toggle {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: #aaa;
  cursor: pointer;
  transition: color 0.3s;
}

.password-toggle:hover {
  color: #666;
}

.error-message {
  color: #f44336;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
  background-color: rgba(244, 67, 54, 0.1);
  padding: 10px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.error-message i {
  margin-right: 8px;
}

.login-button {
  width: 100%;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 3% 0;
  font-size: clamp(14px, 1.5vw, 16px);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-button i {
  margin-right: 8px;
}

.login-button:hover {
  background-color: #3a7bc8;
  transform: translateY(-1px);
  box-shadow: 0 4px 10px rgba(74, 144, 226, 0.2);
}

.login-button:active {
  transform: translateY(0);
}

.login-button:disabled {
  background-color: #94bff0;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}
</style> 