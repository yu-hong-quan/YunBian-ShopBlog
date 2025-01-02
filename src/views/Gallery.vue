<template>
  <div class="gallery-container">
    <!-- 顶部筛选栏 -->
    <div class="gallery-header">
      <div class="filter-bar">
        <button 
          v-for="category in categories" 
          :key="category.id"
          :class="['filter-btn', { active: currentCategory === category.id }]"
          @click="setCategory(category.id)"
        >
          {{ category.name }}
        </button>
      </div>
      <div class="view-toggle">
        <button 
          class="toggle-btn"
          :class="{ active: viewMode === 'grid' }"
          @click="viewMode = 'grid'"
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M3 3h8v8H3V3zm0 10h8v8H3v-8zM13 3h8v8h-8V3zm0 10h8v8h-8v-8z"/>
          </svg>
        </button>
        <button 
          class="toggle-btn"
          :class="{ active: viewMode === 'masonry' }"
          @click="viewMode = 'masonry'"
        >
          <svg viewBox="0 0 24 24" width="20" height="20">
            <path fill="currentColor" d="M3 3h18v6H3V3zm0 8h12v10H3V11zm14 0h4v4h-4v-4zm0 6h4v4h-4v-4z"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- 图集内容 -->
    <div :class="['gallery-content', viewMode]">
      <div 
        v-for="item in displayedGallery" 
        :key="item.id"
        class="gallery-item"
        @click="openLightbox(item)"
      >
        <div class="item-container">
          <div class="image-wrapper">
            <!-- 加载占位 -->
            <div 
              class="image-placeholder"
              :class="{ 'hidden': item.loaded }"
            >
              <div class="loading-spinner">
                <svg viewBox="0 0 50 50" class="spinner-icon">
                  <circle
                    cx="25"
                    cy="25"
                    r="20"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="4"
                    stroke-linecap="round"
                  />
                </svg>
              </div>
            </div>
            <!-- 图片 -->
            <img 
              :src="item.thumbnail"
              :alt="item.title"
              @load="onImageLoad(item.id)"
              :class="{ 'loaded': item.loaded }"
            >
          </div>
          <div class="item-overlay">
            <div class="item-content">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
              <div class="item-meta">
                <span class="date">
                  <svg viewBox="0 0 24 24" class="meta-icon">
                    <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
                  </svg>
                  {{ item.date }}
                </span>
                <span class="views">
                  <svg viewBox="0 0 24 24" class="meta-icon">
                    <path fill="currentColor" d="M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5c-1.7-4.4-6-7.5-11-7.5zM12 17c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z"/>
                  </svg>
                  {{ item.views }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载更多 -->
    <div class="load-more-container">
      <div v-if="hasMore && !loading" class="load-more">
        <button class="load-more-btn" @click="loadMore">
          <span class="btn-content">
            <svg viewBox="0 0 24 24" class="load-more-icon">
              <path fill="currentColor" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
            </svg>
            加载更多
          </span>
        </button>
      </div>
      <div v-if="loading" class="loading-more">
        <div class="loading-spinner">
          <svg viewBox="0 0 50 50" class="spinner-icon">
            <circle
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke="currentColor"
              stroke-width="4"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <span>加载中...</span>
      </div>
    </div>

    <!-- 图片预览 -->
    <div 
      v-if="selectedImage"
      class="lightbox"
      @click="closeLightbox"
    >
      <button class="close-btn" @click="closeLightbox">×</button>
      <div class="lightbox-content" @click.stop>
        <div class="lightbox-image-container">
          <img :src="selectedImage.url" :alt="selectedImage.title">
        </div>
        <div class="lightbox-info">
          <h2>{{ selectedImage.title }}</h2>
          <p>{{ selectedImage.description }}</p>
          <div class="lightbox-meta">
            <span class="date">{{ selectedImage.date }}</span>
            <span class="views">{{ selectedImage.views }} 浏览</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'

const viewMode = ref<'grid' | 'masonry'>('grid')
const currentCategory = ref('all')
const loading = ref(false)
const selectedImage = ref<any>(null)
const currentPage = ref(1)
const pageSize = 12
const loadedImages = ref<Set<number>>(new Set())

const categories = [
  { id: 'all', name: '全部' },
  { id: 'nature', name: '自然' },
  { id: 'city', name: '城市' },
  { id: 'people', name: '人物' },
  { id: 'architecture', name: '建筑' },
  { id: 'animal', name: '动物' }
]

// 生成30张图片的数据
const generateGalleryData = () => {
  const data = []
  const categories = ['nature', 'city', 'people', 'architecture', 'animal']
  const descriptions = [
    '壮丽的自然风光',
    '繁华的城市夜景',
    '温暖的人文瞬间',
    '宏伟的建筑设计',
    '可爱的动物世界'
  ]
  
  for (let i = 1; i <= 30; i++) {
    const categoryIndex = Math.floor(Math.random() * categories.length)
    data.push({
      id: i,
      title: `图片 ${i}`,
      description: descriptions[categoryIndex],
      thumbnail: `https://picsum.photos/seed/${i}/400/300`,
      url: `https://picsum.photos/seed/${i}/1200/900`,
      category: categories[categoryIndex],
      date: `2024-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      views: Math.floor(Math.random() * 1000) + 100,
      loaded: false
    })
  }
  return data
}

const gallery = ref(generateGalleryData())

const filteredGallery = computed(() => {
  if (currentCategory.value === 'all') return gallery.value
  return gallery.value.filter(item => item.category === currentCategory.value)
})

const displayedGallery = computed(() => {
  return filteredGallery.value.slice(0, currentPage.value * pageSize)
})

const hasMore = computed(() => {
  return displayedGallery.value.length < filteredGallery.value.length
})

const setCategory = (category: string) => {
  currentCategory.value = category
  currentPage.value = 1
  gallery.value.forEach(item => {
    item.loaded = false
  })
}

const loadMore = async () => {
  if (loading.value) return
  loading.value = true
  
  try {
    // 模拟加载延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    currentPage.value++
  } finally {
    loading.value = false
  }
}

const onImageLoad = (id: number) => {
  const item = gallery.value.find(item => item.id === id)
  if (item) {
    item.loaded = true
  }
}

const openLightbox = (image: any) => {
  selectedImage.value = image
  document.body.style.overflow = 'hidden'
}

const closeLightbox = () => {
  selectedImage.value = null
  document.body.style.overflow = ''
}
</script>

<style scoped>
.gallery-container {
  padding: 2rem;
  max-width: 100%;
  margin: 0;
}

.gallery-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.filter-bar {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  -webkit-overflow-scrolling: touch;
}

.filter-btn {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.filter-btn.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
}

.toggle-btn {
  padding: 0.5rem;
  border-radius: 8px;
  background: var(--color-surface);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.3s ease;
}

.toggle-btn.active {
  background: var(--color-primary);
  color: white;
}

.gallery-content {
  margin: 0 -1rem;
}

.gallery-content.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 0;
}

.gallery-content.masonry {
  column-count: 4;
  column-gap: 2rem;
  padding: 0 1rem;
}

.gallery-item {
  break-inside: avoid;
  margin-bottom: 1.5rem;
}

.item-container {
  position: relative;
  background: var(--color-surface);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.item-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.item-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.item-container:hover img {
  transform: scale(1.05);
}

.item-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(0, 0, 0, 0.85)
  );
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.3s ease;
}

.item-container:hover .item-overlay {
  opacity: 1;
  transform: translateY(0);
}

.item-content {
  position: relative;
  z-index: 2;
}

.item-content h3 {
  color: #ffffff;
  font-size: 1.2rem;
  margin: 0 0 0.5rem;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.item-content p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.95rem;
  margin: 0 0 0.8rem;
  line-height: 1.4;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.meta-icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin-right: 4px;
  opacity: 0.8;
}

.date, .views {
  display: flex;
  align-items: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.load-more-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem 0;
}

.load-more {
  width: 100%;
  max-width: 200px;
}

.load-more-btn {
  width: 100%;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  background: var(--color-primary);
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.3);
}

.load-more-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(var(--color-primary-rgb), 0.4);
}

.load-more-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(var(--color-primary-rgb), 0.3);
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.load-more-icon {
  width: 20px;
  height: 20px;
}

.loading-more {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  color: var(--color-text);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  color: var(--color-primary);
}

.spinner-icon {
  animation: rotate 2s linear infinite;
  width: 100%;
  height: 100%;
}

/* 暗色主题适配 */
:root.dark .item-container {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

:root.dark .item-container:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

:root.dark .load-more-btn {
  box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.2);
}

:root.dark .load-more-btn:hover {
  box-shadow: 0 6px 16px rgba(var(--color-primary-rgb), 0.3);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .gallery-container {
    padding: 1rem;
  }

  .gallery-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .filter-bar {
    width: 100%;
  }

  .gallery-content.grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1rem;
  }

  .gallery-content.masonry {
    column-count: 1;
  }

  .item-overlay {
    opacity: 1;
    transform: none;
    padding: 1rem;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.75) 30%,
      rgba(0, 0, 0, 0.9) 100%
    );
  }

  .item-content h3 {
    font-size: 1.1rem;
  }

  .item-content p {
    font-size: 0.9rem;
    margin-bottom: 0.6rem;
  }

  .item-meta {
    font-size: 0.8rem;
  }

  .meta-icon {
    width: 14px;
    height: 14px;
  }

  .lightbox-content {
    width: 100%;
    height: 100%;
    max-width: 100vw;
    max-height: 100vh;
    border-radius: 0;
  }

  .lightbox-image-container {
    height: 60vh;
  }

  .lightbox-info {
    padding: 1rem;
  }

  .load-more-container {
    margin: 1.5rem 0;
  }

  .load-more-btn {
    padding: 0.7rem 1.2rem;
    font-size: 0.95rem;
  }

  .load-more-icon {
    width: 18px;
    height: 18px;
  }
}

.image-wrapper {
  position: relative;
  width: 100%;
  padding-top: 75%;
  background: var(--color-surface);
  border-radius: 8px;
  overflow: hidden;
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
}

.image-placeholder.hidden {
  opacity: 0;
  pointer-events: none;
}

img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
}

img.loaded {
  opacity: 1;
}

.spinner-icon {
  animation: rotate 2s linear infinite;
}

.spinner-icon circle {
  stroke: currentColor;
  stroke-dasharray: 128;
  stroke-dashoffset: 128;
  animation: dash 1.5s ease-in-out infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dashoffset: 128;
  }
  50% {
    stroke-dashoffset: 32;
  }
  100% {
    stroke-dashoffset: 128;
  }
}
</style> 