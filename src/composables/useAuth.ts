import { ref, readonly } from 'vue'
import { useRouter } from 'vue-router'

const isAdmin = ref(false)
const token = ref('')

export function useAuth() {
  const router = useRouter()

  const checkAuth = () => {
    // 从 localStorage 获取 token
    const savedToken = localStorage.getItem('admin_token')
    if (savedToken) {
      token.value = savedToken
      isAdmin.value = true
      return true
    }
    return false
  }

  const login = (adminToken: string) => {
    // 这里应该调用后端 API 验证 token
    if (adminToken === import.meta.env.VITE_ADMIN_TOKEN) {
      token.value = adminToken
      isAdmin.value = true
      localStorage.setItem('admin_token', adminToken)
      return true
    }
    return false
  }

  const logout = () => {
    token.value = ''
    isAdmin.value = false
    localStorage.removeItem('admin_token')
    router.push('/admin/login')
  }

  return {
    isAdmin: readonly(isAdmin),
    token: readonly(token),
    checkAuth,
    login,
    logout
  }
} 