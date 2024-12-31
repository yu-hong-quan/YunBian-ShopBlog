import { ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'

type ToastType = 'success' | 'error' | 'info'
type ToastManager = ComponentPublicInstance & {
  addToast: (message: string, type: ToastType) => void
}

// 创建一个全局的 toast manager 引用
const toastManager = ref<ToastManager | null>(null)

export function useToast() {
  // 显示提示
  const toast = (message: string, type: ToastType = 'success') => {
    if (toastManager.value) {
      toastManager.value.addToast(message, type)
    } else {
      console.warn('Toast manager is not initialized')
    }
  }

  // 设置 toast manager 实例
  const setToastManager = (manager: ComponentPublicInstance | null) => {
    if (manager && 'addToast' in manager) {
      toastManager.value = manager as ToastManager
    }
  }

  return {
    toast,
    setToastManager
  }
} 