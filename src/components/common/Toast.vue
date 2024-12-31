<template>
  <Transition name="toast">
    <div 
      v-if="visible"
      class="toast"
      :class="type"
    >
      {{ message }}
    </div>
  </Transition>
</template>

<script lang="ts" setup>
defineProps<{
  visible: boolean
  message: string
  type?: 'success' | 'error' | 'info'
}>()
</script>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
  transform: translate(-50%, -20px);
}
</style> 