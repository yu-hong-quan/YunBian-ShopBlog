<template>
  <div class="lazy-image" ref="imageContainer">
    <img
      :src="loadedSrc || placeholder"
      :alt="alt"
      :class="{ 'fade-in': isLoaded }"
      @load="onLoad"
      @error="onError"
    >
    <div class="loading-placeholder" v-if="!isLoaded">
      <div class="loading-spinner"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  src: string
  alt: string
  placeholder?: string
}>()

const loadedSrc = ref('')
const isLoaded = ref(false)
const imageContainer = ref<HTMLElement | null>(null)
const observer = ref<IntersectionObserver | null>(null)

const loadImage = () => {
  const img = new Image()
  img.src = props.src
  img.onload = () => {
    loadedSrc.value = props.src
    isLoaded.value = true
  }
  img.onerror = onError
}

const onLoad = () => {
  isLoaded.value = true
}

const onError = () => {
  loadedSrc.value = props.placeholder || 'error-image-url'
  isLoaded.value = true
}

onMounted(() => {
  observer.value = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        loadImage()
        observer.value?.disconnect()
      }
    },
    { threshold: 0.1 }
  )

  if (imageContainer.value) {
    observer.value.observe(imageContainer.value)
  }
})

onUnmounted(() => {
  observer.value?.disconnect()
})
</script>

<style scoped>
.lazy-image {
  position: relative;
  width: 100%;
  height: 100%;
}

img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
}

img.fade-in {
  opacity: 1;
}

.loading-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style> 