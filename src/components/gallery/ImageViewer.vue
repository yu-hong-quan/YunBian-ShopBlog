<template>
  <div class="image-viewer" @click="handleClose">
    <div class="viewer-content" @click.stop>
      <button class="close-btn" @click="handleClose">×</button>
      
      <div class="viewer-body">
        <div class="image-container">
          <!-- 加载动画 -->
          <div class="loading-spinner" v-if="isLoading">
            <svg class="spinner-icon" viewBox="0 0 50 50">
              <circle cx="25" cy="25" r="20" fill="none" stroke="currentColor" stroke-width="5"/>
            </svg>
          </div>
          
          <img 
            :src="currentImage.url" 
            :alt="currentImage.title"
            @load="handleImageLoad"
            @error="handleImageError"
            :class="{ 'loaded': !isLoading }"
          >
        </div>
        
        <!-- 图片信息浮层 -->
        <div class="image-info" :class="{ 'show-info': showInfo }">
          <div class="info-toggle" @click="toggleInfo">
            <svg 
              class="toggle-icon" 
              viewBox="0 0 24 24" 
              :class="{ 'rotate': showInfo }"
            >
              <path 
                fill="currentColor" 
                d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"
              />
            </svg>
          </div>
          <div class="info-content">
            <h3>{{ currentImage.title }}</h3>
            <p>{{ currentImage.description }}</p>
            <div class="image-meta">
              <span class="date">{{ currentImage.date }}</span>
              <span class="views" v-if="currentImage.views">
                {{ currentImage.views }} 浏览
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface ImageProps {
  url: string
  title?: string
  description?: string
  date?: string
  views?: number
}

const props = defineProps<{
  image: ImageProps
}>()

const emit = defineEmits(['close'])

const isLoading = ref(true)
const showInfo = ref(true)

const currentImage = computed(() => {
  return {
    url: props.image?.url || '',
    title: props.image?.title || '',
    description: props.image?.description || '',
    date: props.image?.date || '',
    views: props.image?.views
  }
})

const handleImageLoad = () => {
  isLoading.value = false
}

const handleImageError = () => {
  isLoading.value = false
  // 可以添加错误处理逻辑
}

const handleClose = () => {
  emit('close')
}

const toggleInfo = () => {
  showInfo.value = !showInfo.value
}
</script>

<style scoped>
.image-viewer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.viewer-content {
  position: relative;
  width: 90vw;
  height: 90vh;
  display: flex;
  flex-direction: column;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  color: white;
  font-size: 1.5rem;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  cursor: pointer;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}

.viewer-body {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.image-container {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.image-container img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-container img.loaded {
  opacity: 1;
}

/* 加载动画 */
.loading-spinner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.spinner-icon {
  width: 50px;
  height: 50px;
  animation: rotate 2s linear infinite;
}

.spinner-icon circle {
  stroke: var(--color-primary);
  stroke-linecap: round;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1, 150;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 90, 150;
    stroke-dashoffset: -124;
  }
}

/* 图片信息浮层 */
.image-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8) 20%);
  color: white;
  padding-top: 3rem;
  transform: translateY(calc(100% - 3rem));
  transition: transform 0.3s ease;
}

.image-info.show-info {
  transform: translateY(0);
}

.info-toggle {
  position: absolute;
  top: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  width: 3.5rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 20px;
  backdrop-filter: blur(4px);
  transition: all 0.3s ease;
}

.info-toggle:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: translateX(-50%) scale(1.05);
}

.toggle-icon {
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
}

.toggle-icon.rotate {
  transform: rotate(180deg);
}

.info-content {
  padding: 1rem 1.5rem;
  max-height: 40vh;
  overflow-y: auto;
}

.info-content h3 {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
}

.info-content p {
  margin: 0 0 1rem;
  font-size: 0.9rem;
  line-height: 1.5;
}

.image-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.8rem;
  opacity: 0.8;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .viewer-content {
    width: 100vw;
    height: 100vh;
  }

  .image-info {
    transform: translateY(calc(100% - 2.5rem));
  }

  .info-content {
    padding: 0.75rem 1rem;
    max-height: 50vh;
  }

  .info-toggle {
    top: 0.25rem;
    height: 1.5rem;
    width: 3rem;
    border-radius: 15px;
  }

  .close-btn {
    top: 0.5rem;
    right: 0.5rem;
  }

  .toggle-icon {
    width: 20px;
    height: 20px;
  }
}
</style> 