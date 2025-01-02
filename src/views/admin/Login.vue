<template>
  <div class="admin-login">
    <div class="login-container">
      <h2>管理员登录</h2>
      <div class="form-group">
        <input 
          type="password" 
          v-model="adminToken"
          placeholder="请输入管理员令牌"
          @keyup.enter="handleLogin"
        >
      </div>
      <button 
        class="login-btn" 
        @click="handleLogin"
        :disabled="loading"
      >
        {{ loading ? '登录中...' : '登录' }}
      </button>
      <p class="error-message" v-if="error">{{ error }}</p>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login } = useAuth()

const adminToken = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (!adminToken.value) {
    error.value = '请输入管理员令牌'
    return
  }

  loading.value = true
  error.value = ''

  try {
    const success = login(adminToken.value)
    if (success) {
      handleLoginSuccess()
    } else {
      error.value = '令牌无效'
    }
  } catch (e) {
    error.value = '登录失败，请重试'
  } finally {
    loading.value = false
  }
}

const handleLoginSuccess = () => {
  router.push('/admin/dashboard')
}
</script>

<style scoped>
.admin-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background);
}

.login-container {
  background: var(--color-surface);
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

h2 {
  margin-bottom: 2rem;
  text-align: center;
  color: var(--color-text);
}

.form-group {
  margin-bottom: 1.5rem;
  width: 100%;
  display: flex;
  justify-content: center;
}

input {
  width: calc(100% - 4rem);
  margin: 0;
  padding: 0.8rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
}

.login-btn {
  width: calc(100% - 8rem);
  margin: 0;
  padding: 0.8rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  color: #dc3545;
  margin-top: 1rem;
  text-align: center;
  padding: 0 1rem;
}

@media (max-width: 768px) {
  .login-container {
    margin: 1rem;
    padding: 1.5rem;
  }
}
</style> 