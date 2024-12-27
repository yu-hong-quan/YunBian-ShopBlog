<template>
  <div 
    class="image-viewer" 
    v-if="visible" 
    @click="closeViewer"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <div class="viewer-content" @click.stop>
      <button class="close-btn" @click="closeViewer">×</button>
      
      <div class="main-content">
        <div 
          class="image-container"
          @touchstart.stop
          @touchmove.stop
        >
          <div class="image-placeholder" v-if="isLoading">
            <div class="loading-spinner"></div>
          </div>
          <img 
            :src="currentImage" 
            :alt="title" 
            ref="imageRef"
            @load="handleImageLoad"
            @error="handleImageError"
            :class="{ 'image-loaded': !isLoading }"
          >
        </div>

        <div class="viewer-info">
          <h3>{{ title }}</h3>
          <p>{{ description }}</p>
        </div>
      </div>

      <div class="thumbnail-sidebar" v-if="images.length > 1">
        <div class="thumbnail-list">
          <div 
            v-for="(img, index) in images" 
            :key="index"
            class="thumbnail"
            :class="{ active: index === currentIndex }"
            @click="currentIndex = index"
          >
            <img :src="img" :alt="`缩略图 ${index + 1}`">
          </div>
        </div>
      </div>

      <button 
        class="nav-btn prev" 
        v-if="images.length > 1" 
        @click="prevImage"
      >‹</button>
      <button 
        class="nav-btn next" 
        v-if="images.length > 1" 
        @click="nextImage"
      >›</button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  visible: boolean
  images: string[]
  title: string
  description: string
}>()

const emit = defineEmits(['close'])

const currentIndex = ref(0)
const imageRef = ref<HTMLImageElement | null>(null)

const currentImage = computed(() => props.images[currentIndex.value])

const closeViewer = () => {
  emit('close')
  currentIndex.value = 0
}

const prevImage = () => {
  currentIndex.value = currentIndex.value > 0 ? currentIndex.value - 1 : props.images.length - 1
}

const nextImage = () => {
  currentIndex.value = currentIndex.value < props.images.length - 1 ? currentIndex.value + 1 : 0
}

// 添加加载状态
const isLoading = ref(true)

// 处理图片加载完成
const handleImageLoad = () => {
  isLoading.value = false
}

// 处理图片加载失败
const handleImageError = () => {
  isLoading.value = false
  // 可以设置一个默认的错误图片
  if (imageRef.value) {
    imageRef.value.src = 'https://picsum.photos/400/300?blur=10'
  }
}

// 监听图片切换
watch(currentImage, () => {
  isLoading.value = true
})

// 监听键盘事件
const handleKeydown = (e: KeyboardEvent) => {
  if (!props.visible) return
  switch (e.key) {
    case 'Escape':
      closeViewer()
      break
    case 'ArrowLeft':
      prevImage()
      break
    case 'ArrowRight':
      nextImage()
      break
  }
}

watch(() => props.visible, (newVal) => {
  if (newVal) {
    document.addEventListener('keydown', handleKeydown)
    document.body.style.overflow = 'hidden'
  } else {
    document.removeEventListener('keydown', handleKeydown)
    document.body.style.overflow = ''
  }
})

// 添加触摸相关的状态和处理函数
const touchStartX = ref(0)
const touchStartY = ref(0)
const isSwiping = ref(false)
const swipeThreshold = 50 // 滑动阈值

const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
  isSwiping.value = true
}

const handleTouchMove = (e: TouchEvent) => {
  if (!isSwiping.value) return

  const touchEndX = e.touches[0].clientX
  const touchEndY = e.touches[0].clientY
  
  // 计算水平和垂直方向的移动距离
  const deltaX = touchEndX - touchStartX.value
  const deltaY = touchEndY - touchStartY.value

  // 如果垂直滑动距离大于水平滑动距离，则不处理
  if (Math.abs(deltaY) > Math.abs(deltaX)) {
    isSwiping.value = false
    return
  }

  // 阻止页面滚动
  e.preventDefault()
}

const handleTouchEnd = (e: TouchEvent) => {
  if (!isSwiping.value) return

  const touchEndX = e.changedTouches[0].clientX
  const deltaX = touchEndX - touchStartX.value

  if (Math.abs(deltaX) > swipeThreshold) {
    if (deltaX > 0) {
      prevImage()
    } else {
      nextImage()
    }
  }

  isSwiping.value = false
}
</script>

<style scoped>
.image-viewer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn 0.3s ease;
}

.viewer-content {
  position: relative;
  max-width: 95%;
  height: 85vh;
  margin: auto;
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 85vh;
}

.image-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 300px;
  max-height: calc(85vh - 100px);
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

.image-container img {
  max-width: 100%;
  max-height: calc(85vh - 100px);
  object-fit: contain;
  transition: all 0.3s ease;
  opacity: 0;
}

.image-container img.image-loaded {
  opacity: 1;
}

.close-btn {
  position: absolute;
  top: -40px;
  right: -40px;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  z-index: 1001;
}

.nav-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.prev {
  left: -70px;
}

.next {
  right: -70px;
}

.viewer-info {
  color: white;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
}

.viewer-info h3 {
  margin: 0 0 0.5rem;
  font-size: 1.2rem;
}

.viewer-info p {
  margin: 0;
  opacity: 0.8;
  font-size: 0.95rem;
}

.thumbnail-sidebar {
  width: 100px;
  height: 85vh;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.thumbnail-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  padding: 0.5rem;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
  cursor: pointer;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.thumbnail:hover {
  opacity: 0.8;
}

.thumbnail.active {
  opacity: 1;
  box-shadow: 0 0 0 2px white;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .viewer-content {
    flex-direction: column;
    gap: 0.5rem;
    height: auto;
    max-height: 90vh;
    padding: 1rem;
    width: 100%; /* 确保在移动端占满宽度 */
    margin: 0; /* 移除外边距 */
  }

  .main-content {
    width: 100%;
    max-height: calc(90vh - 120px);
  }

  .image-container {
    min-height: 200px;
    max-height: calc(70vh - 60px); /* 调整图片容器高度 */
    touch-action: none; /* 禁用默认触摸行为 */
  }

  .image-container img {
    max-height: calc(70vh - 60px);
    user-select: none; /* 禁止选择 */
    -webkit-user-drag: none; /* 禁止拖动 */
  }

  .thumbnail-sidebar {
    width: 100%;
    height: 80px; /* 减小高度 */
    margin-top: auto; /* 将缩略图推到底部 */
    background: rgba(0, 0, 0, 0.4); /* 加深背景 */
  }

  .thumbnail-list {
    flex-direction: row;
    justify-content: center;
    padding: 0.5rem;
    gap: 0.5rem;
  }

  .thumbnail {
    width: 50px; /* 减小缩略图尺寸 */
    height: 50px;
    flex-shrink: 0;
  }

  .nav-btn {
    width: 36px;
    height: 36px;
    font-size: 1.2rem;
    background: rgba(0, 0, 0, 0.4);
  }

  .prev {
    left: 8px;
  }

  .next {
    right: 8px;
  }

  .close-btn {
    top: 8px;
    right: 8px;
    width: 36px;
    height: 36px;
    font-size: 1.5rem;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 50%;
  }

  .viewer-info {
    padding: 0.8rem;
    margin-top: 0.5rem;
    background: rgba(0, 0, 0, 0.4);
  }

  .viewer-info h3 {
    font-size: 1rem;
    margin-bottom: 0.3rem;
  }

  .viewer-info p {
    font-size: 0.9rem;
    line-height: 1.4;
  }
}

/* 滚动条样式 */
.thumbnail-sidebar::-webkit-scrollbar {
  width: 6px;
}

.thumbnail-sidebar::-webkit-scrollbar-track {
  background: transparent;
}

.thumbnail-sidebar::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
}

@media (max-width: 768px) {
  .thumbnail-sidebar::-webkit-scrollbar {
    height: 6px;
    width: auto;
  }
}
</style> 