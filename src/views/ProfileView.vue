<template>
  <div class="profile-view">
    <div class="profile-container">
      <h1 class="page-title">个人信息</h1>
      
      <div class="profile-tabs">
        <div 
          class="tab" 
          :class="{ active: activeTab === 'profile' }" 
          @click="activeTab = 'profile'"
        >
          <i class="fa fa-user"></i> 基本信息
        </div>
        <div 
          class="tab" 
          :class="{ active: activeTab === 'password' }" 
          @click="activeTab = 'password'"
        >
          <i class="fa fa-lock"></i> 修改密码
        </div>
        <div 
          class="tab" 
          :class="{ active: activeTab === 'settings' }" 
          @click="activeTab = 'settings'"
        >
          <i class="fa fa-cog"></i> 系统设置
        </div>
      </div>
      
      <!-- 基本信息表单 -->
      <div v-if="activeTab === 'profile'" class="tab-content">
        <form @submit.prevent="saveProfile" class="profile-form">
          <div class="form-group">
            <label for="username">用户名</label>
            <input 
              id="username" 
              v-model="profile.username" 
              type="text" 
              placeholder="用户名"
              required
            />
            <span class="form-hint">修改用户名后需要重新登录</span>
          </div>
          
          <div class="form-group">
            <label for="name">姓名</label>
            <input 
              id="name" 
              v-model="profile.name" 
              type="text" 
              placeholder="姓名"
            />
          </div>
          
          <div class="form-group">
            <label for="email">邮箱</label>
            <input 
              id="email" 
              v-model="profile.email" 
              type="email" 
              placeholder="邮箱"
            />
          </div>
          
          <div class="form-group">
            <label for="description">个人简介</label>
            <textarea 
              id="description" 
              v-model="profile.description" 
              placeholder="简单介绍一下自己吧"
              rows="4"
            ></textarea>
          </div>
          
          <div v-if="profileMessage" class="form-message" :class="profileMessage.type">
            <i :class="messageIcon"></i> {{ profileMessage.text }}
          </div>
          
          <div class="form-actions">
            <button type="submit" class="save-btn" :disabled="savingProfile">
              <i v-if="savingProfile" class="fa fa-circle-o-notch fa-spin"></i>
              {{ savingProfile ? '保存中...' : '保存信息' }}
            </button>
          </div>
        </form>
      </div>
      
      <!-- 修改密码表单 -->
      <div v-if="activeTab === 'password'" class="tab-content">
        <form @submit.prevent="changePassword" class="password-form">
          <div class="form-group">
            <label for="currentPassword">当前密码</label>
            <div class="password-input">
              <input 
                id="currentPassword" 
                v-model="passwordForm.currentPassword" 
                :type="showPassword.current ? 'text' : 'password'" 
                placeholder="当前密码"
                required
              />
              <i 
                class="password-toggle" 
                :class="showPassword.current ? 'fa fa-eye-slash' : 'fa fa-eye'" 
                @click="showPassword.current = !showPassword.current"
              ></i>
            </div>
          </div>
          
          <div class="form-group">
            <label for="newPassword">新密码</label>
            <div class="password-input">
              <input 
                id="newPassword" 
                v-model="passwordForm.newPassword" 
                :type="showPassword.new ? 'text' : 'password'" 
                placeholder="新密码"
                required
              />
              <i 
                class="password-toggle" 
                :class="showPassword.new ? 'fa fa-eye-slash' : 'fa fa-eye'" 
                @click="showPassword.new = !showPassword.new"
              ></i>
            </div>
            <span class="form-hint">密码长度至少6位</span>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">确认密码</label>
            <div class="password-input">
              <input 
                id="confirmPassword" 
                v-model="passwordForm.confirmPassword" 
                :type="showPassword.confirm ? 'text' : 'password'" 
                placeholder="确认新密码"
                required
              />
              <i 
                class="password-toggle" 
                :class="showPassword.confirm ? 'fa fa-eye-slash' : 'fa fa-eye'" 
                @click="showPassword.confirm = !showPassword.confirm"
              ></i>
            </div>
          </div>
          
          <div v-if="passwordMessage" class="form-message" :class="passwordMessage.type">
            <i :class="messageIcon"></i> {{ passwordMessage.text }}
          </div>
          
          <div class="form-actions">
            <button type="submit" class="save-btn" :disabled="changingPassword">
              <i v-if="changingPassword" class="fa fa-circle-o-notch fa-spin"></i>
              {{ changingPassword ? '修改中...' : '修改密码' }}
            </button>
          </div>
        </form>
      </div>
      
      <!-- 系统设置面板 -->
      <div v-if="activeTab === 'settings'" class="tab-content">
        <form @submit.prevent="saveSettings" class="settings-form">
          <div class="form-group">
            <label for="apiBaseUrl">API基础路径</label>
            <input 
              id="apiBaseUrl" 
              v-model="settings.apiBaseUrl" 
              type="text" 
              placeholder="例如: /api/v1"
            />
            <span class="form-hint">设置API的基础路径，通常无需修改</span>
          </div>
          
          <div class="form-group">
            <label for="backendUrl">后端服务地址</label>
            <input 
              id="backendUrl" 
              v-model="settings.backendUrl" 
              type="text" 
              placeholder="例如: http://127.0.0.1:8000"
            />
            <span class="form-hint">设置后端服务器的地址，修改后需要刷新页面</span>
          </div>
          
          <div v-if="settingsMessage" class="form-message" :class="settingsMessage.type">
            <i :class="messageIcon"></i> {{ settingsMessage.text }}
          </div>
          
          <div class="form-actions">
            <button type="submit" class="save-btn" :disabled="savingSettings">
              <i v-if="savingSettings" class="fa fa-circle-o-notch fa-spin"></i>
              {{ savingSettings ? '保存中...' : '保存设置' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import api from '@/api'
import config from '@/config/config'

const router = useRouter()
const authStore = useAuthStore()

const activeTab = ref('profile')
const savingProfile = ref(false)
const changingPassword = ref(false)
const savingSettings = ref(false)
const profileMessage = ref(null)
const passwordMessage = ref(null)
const settingsMessage = ref(null)

// 密码可见性控制
const showPassword = reactive({
  current: false,
  new: false,
  confirm: false
})

// 个人信息表单
const profile = reactive({
  username: '',
  name: '',
  email: '',
  description: ''
})

// 密码修改表单
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 系统设置
const settings = reactive({
  apiBaseUrl: localStorage.getItem('apiBaseUrl') || config.baseApi,
  backendUrl: localStorage.getItem('backendUrl') || config.backendUrl
})

// 消息图标
const messageIcon = computed(() => {
  let message
  
  if (activeTab.value === 'profile') {
    message = profileMessage.value
  } else if (activeTab.value === 'password') {
    message = passwordMessage.value
  } else if (activeTab.value === 'settings') {
    message = settingsMessage.value
  }
  
  if (!message) return ''
  return message.type === 'success' ? 'fa fa-check-circle' : 'fa fa-exclamation-circle'
})

// 加载用户信息
onMounted(() => {
  if (authStore.getUser) {
    profile.username = authStore.getUser.username || ''
    profile.name = authStore.getUser.name || ''
    profile.email = authStore.getUser.email || ''
    profile.description = authStore.getUser.description || ''
  }
})

// 保存个人信息
const saveProfile = async () => {
  profileMessage.value = null
  savingProfile.value = true
  
  try {
    // 检查用户名是否被修改
    const isUsernameChanged = profile.username !== authStore.getUser.username
    
    // 调用 API 保存个人信息
    const response = await authStore.updateProfile(profile)
    
    // 显示成功消息
    profileMessage.value = {
      type: 'success',
      text: '个人信息已成功更新'
    }
    
    // 如果用户名被修改，则需要重新登录
    if (isUsernameChanged) {
      setTimeout(() => {
        authStore.logout()
        router.push({
          name: 'Login',
          query: { message: 'username_changed' }
        })
      }, 1500)
    }
  } catch (error) {
    profileMessage.value = {
      type: 'error',
      text: error.message || '保存失败，请重试'
    }
  } finally {
    savingProfile.value = false
  }
}

// 修改密码
const changePassword = async () => {
  // 清除之前的消息
  passwordMessage.value = null
  
  // 验证新密码
  if (passwordForm.newPassword.length < 6) {
    passwordMessage.value = {
      type: 'error',
      text: '新密码长度至少6位'
    }
    return
  }
  
  // 验证两次密码输入是否一致
  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    passwordMessage.value = {
      type: 'error',
      text: '两次输入的密码不一致'
    }
    return
  }
  
  changingPassword.value = true
  
  try {
    // 调用 API 修改密码
    await api.auth.changePassword({
      currentPassword: passwordForm.currentPassword,
      newPassword: passwordForm.newPassword
    })
    
    // 显示成功消息
    passwordMessage.value = {
      type: 'success',
      text: '密码修改成功，即将退出登录'
    }
    
    // 清空表单
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
    passwordForm.confirmPassword = ''
    
    // 密码修改成功后，退出登录
    setTimeout(() => {
      authStore.logout()
      router.push({
        name: 'Login',
        query: { message: 'password_changed' }
      })
    }, 1500)
  } catch (error) {
    passwordMessage.value = {
      type: 'error',
      text: error.message || '密码修改失败，请重试'
    }
  } finally {
    changingPassword.value = false
  }
}

// 保存系统设置
const saveSettings = async () => {
  settingsMessage.value = null
  savingSettings.value = true
  
  try {
    // 保存API基础地址到本地存储
    localStorage.setItem('apiBaseUrl', settings.apiBaseUrl)
    localStorage.setItem('backendUrl', settings.backendUrl)
    
    // 显示成功消息
    settingsMessage.value = {
      type: 'success',
      text: '设置已保存，请刷新页面使修改生效'
    }
    
    // 可选：2秒后刷新页面
    setTimeout(() => {
      window.location.reload()
    }, 2000)
  } catch (error) {
    settingsMessage.value = {
      type: 'error',
      text: error.message || '保存设置失败'
    }
  } finally {
    savingSettings.value = false
  }
}
</script>

<style scoped>
.profile-view {
  padding: 40px 20px;
}

.profile-container {
  max-width: 800px;
  margin: 0 auto;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  padding: 40px;
}

.page-title {
  font-size: 24px;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

.profile-tabs {
  display: flex;
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
}

.tab {
  padding: 15px 20px;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  transition: all 0.3s ease;
}

.tab:hover {
  color: #4a90e2;
}

.tab.active {
  color: #4a90e2;
  border-bottom-color: #4a90e2;
}

.tab i {
  font-size: 14px;
}

.tab-content {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.form-group {
  margin-bottom: 25px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #555;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s;
  box-sizing: border-box;
}

.form-group textarea {
  resize: vertical;
  min-height: 100px;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
}

.form-hint {
  display: block;
  font-size: 12px;
  color: #888;
  margin-top: 5px;
}

.password-input {
  position: relative;
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

.form-message {
  padding: 12px 15px;
  border-radius: 6px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
}

.form-message.success {
  background-color: rgba(76, 175, 80, 0.1);
  color: #4caf50;
}

.form-message.error {
  background-color: rgba(244, 67, 54, 0.1);
  color: #f44336;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.save-btn {
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 12px 25px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;
}

.save-btn:hover {
  background-color: #3a7bc8;
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(74, 144, 226, 0.2);
}

.save-btn:disabled {
  background-color: #94bff0;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

@media (max-width: 768px) {
  .profile-container {
    padding: 20px;
  }
  
  .tab {
    padding: 12px 15px;
    font-size: 14px;
  }
}
</style> 