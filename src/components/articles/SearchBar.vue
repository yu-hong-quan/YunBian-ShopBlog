<template>
  <div class="search-section" v-observe-visibility="onSearchVisible">
    <div class="search-bar" :class="{ 'fade-in': isSearchVisible }">
      <input 
        :value="modelValue"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        type="text" 
        placeholder="搜索文章..."
      >
      <div class="categories">
        <button 
          v-for="category in categories" 
          :key="category.id"
          :class="{ active: currentCategory === category.id }"
          @click="$emit('select-category', category.id)"
        >
          {{ category.name }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps<{
  modelValue: string
  categories: Array<{ id: number; name: string }>
  currentCategory: number | null
}>()

defineEmits<{
  'update:modelValue': [value: string]
  'select-category': [categoryId: number]
}>()

const isSearchVisible = ref(false)
const onSearchVisible = (visible: boolean) => {
  if (visible) isSearchVisible.value = true
}
</script>

<style scoped>
.search-section {
  margin-bottom: 2rem;
}

.search-bar {
  background: var(--color-surface);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-bar input {
  width: 100%;
  padding: 1rem 1.2rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 1rem;
  transition: all 0.3s ease;
  margin-bottom: 1rem;
  box-sizing: border-box;
}

.search-bar input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
}

.categories {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.categories button {
  padding: 0.6rem 1.2rem;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  cursor: pointer;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.categories button:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.categories button.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
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

@media (max-width: 768px) {
  .search-section {
    padding: 0 1rem;
  }

  .search-bar {
    padding: 1rem;
  }

  .search-bar input {
    padding: 0.8rem 1rem;
  }

  .categories button {
    padding: 0.5rem 1rem;
  }
}
</style> 