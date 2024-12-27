<template>
  <div 
    class="load-more" 
    v-observe-visibility="onLoadMoreVisible"
    :class="{ 'fade-in': isLoadMoreVisible }"
  >
    <button 
      @click="$emit('load-more')" 
      :disabled="loading"
      class="load-more-btn"
    >
      {{ loading ? '加载中...' : '加载更多' }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

defineProps<{
  loading: boolean
}>()

defineEmits<{
  'load-more': []
}>()

const isLoadMoreVisible = ref(false)
const onLoadMoreVisible = (visible: boolean) => {
  if (visible) isLoadMoreVisible.value = true
}
</script>

<style scoped>
.load-more {
  text-align: center;
  margin-top: 2rem;
}

.load-more-btn {
  padding: 1rem 2rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.load-more-btn:hover {
  background: var(--color-secondary);
  transform: translateY(-2px);
}

.load-more-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

/* 渐入动画 */
.fade-in {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style> 