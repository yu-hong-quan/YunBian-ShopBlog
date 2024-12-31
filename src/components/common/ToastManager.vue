<template>
  <div class="toast-container">
    <Transition-group name="toast">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="toast"
        :class="toast.type"
      >
        {{ toast.message }}
      </div>
    </Transition-group>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

const toasts = ref<Toast[]>([])

// 添加提示
const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  const id = Date.now()
  toasts.value.push({ id, message, type })
  
  // 3秒后自动移除
  setTimeout(() => {
    removeToast(id)
  }, 3000)
}

// 移除提示
const removeToast = (id: number) => {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index > -1) {
    toasts.value.splice(index, 1)
  }
}

// 暴露方法给外部使用
defineExpose({
  addToast
})
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
}

.toast {
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  pointer-events: all;
}

.success {
  background: var(--color-success);
}

.error {
  background: var(--color-error);
}

.info {
  background: var(--color-primary);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.toast-move {
  transition: transform 0.3s ease;
}
</style> 