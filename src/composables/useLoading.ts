import { ref } from 'vue'

// 创建全局单例
const globalLoading = ref(false)

export function useLoading() {
  const showLoading = () => {
    globalLoading.value = true
  }

  const hideLoading = () => {
    globalLoading.value = false
  }

  return {
    isLoading: globalLoading,
    showLoading,
    hideLoading
  }
} 