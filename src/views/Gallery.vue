<template>
  <LoadingScreen :is-loading="isLoading" />
  <div class="gallery" :class="{ 'content-loaded': !isLoading }">
    <div class="gallery-container" v-observe-visibility="onContentVisible">
      <!-- 搜索和筛选区域 -->
      <div class="gallery-header" :class="{ 'fade-in': isContentVisible }">
        <div class="search-bar">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="搜索图集..."
            @input="handleSearch"
          >
        </div>
        <div class="filter-tags">
          <button 
            v-for="tag in tags" 
            :key="tag.id"
            :class="{ active: currentTag === tag.id }"
            @click="selectTag(tag.id)"
          >
            {{ tag.name }}
          </button>
        </div>
      </div>

      <!-- 瀑布流图集 -->
      <vue-masonry-wall 
        v-if="filteredGallery.length"
        :items="filteredGallery" 
        :ssr="false"
        :padding="20"
        :column-width="280"
        :class="{ 'fade-in': isContentVisible }"
        style="animation-delay: 0.2s"
      >
        <template v-slot="{ item }">
          <div class="gallery-item" @click="openGallery(item)">
            <div class="image-wrapper">
              <img 
                v-lazy="item.cover" 
                :alt="item.title"
                loading="lazy"
              >
            </div>
            <div class="item-info">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
              <div class="item-meta">
                <span class="date">{{ item.date }}</span>
                <span class="views">👁️ {{ item.views }}</span>
              </div>
              <div class="item-tags">
                <span v-for="tag in item.tags" :key="tag" class="tag">
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </template>
      </vue-masonry-wall>

      <!-- 加载更多 -->
      <div class="load-more" v-if="hasMore">
        <button 
          @click="loadMore" 
          :disabled="loading"
          :class="{ loading }"
        >
          {{ loading ? '加载中...' : '加载更多' }}
        </button>
      </div>
    </div>
  </div>

  <!-- 添加图片查看器组件 -->
  <ImageViewer
    :visible="isViewerVisible"
    :images="currentImages"
    :title="currentTitle"
    :description="currentDescription"
    @close="closeViewer"
  />
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import VueMasonryWall from '@yeger/vue-masonry-wall'
import { useDebounce } from '@/composables/useDebounce'
import LoadingScreen from '@/components/common/LoadingScreen.vue'
import ImageViewer from '@/components/gallery/ImageViewer.vue'

interface GalleryItem {
  id: number
  title: string
  description: string
  cover: string
  images: string[]
  date: string
  views: number
  tags: string[]
}

const searchQuery = ref('')
const currentTag = ref<number | null>(null)
const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)
const isContentVisible = ref(false)
const isLoading = ref(true)

const tags = ref([
  { id: 1, name: '风景' },
  { id: 2, name: '人像' },
  { id: 3, name: '城市' },
  { id: 4, name: '建筑' },
  { id: 5, name: '生活' }
])

const gallery = ref<GalleryItem[]>([
  {
    id: 1,
    title: '青海湖的日落',
    description: '记录青海湖畔的绝美日落时分，金色的阳光洒在湖面上...',
    cover: 'https://picsum.photos/seed/gallery1/600/800',
    images: [
      'https://picsum.photos/seed/gallery1-1/1200/800',
      'https://picsum.photos/seed/gallery1-2/800/1200',
      'https://picsum.photos/seed/gallery1-3/1200/800'
    ],
    date: '2024-01-20',
    views: 1234,
    tags: ['风景', '自然']
  },
  {
    id: 2,
    title: '城市掠影',
    description: '捕捉都市中的光与影，记录现代都市的繁华与静谧...',
    cover: 'https://picsum.photos/seed/gallery2/600/800',
    images: [
      'https://picsum.photos/seed/gallery2-1/1200/800',
      'https://picsum.photos/seed/gallery2-2/800/1200',
      'https://picsum.photos/seed/gallery2-3/1200/800'
    ],
    date: '2024-01-18',
    views: 986,
    tags: ['城市', '建筑']
  },
  {
    id: 3,
    title: '人像摄影集',
    description: '通过镜头记录不同人物的故事和情感...',
    cover: 'https://picsum.photos/seed/gallery3/600/800',
    images: [
      'https://picsum.photos/seed/gallery3-1/1200/800',
      'https://picsum.photos/seed/gallery3-2/800/1200',
      'https://picsum.photos/seed/gallery3-3/1200/800'
    ],
    date: '2024-01-15',
    views: 1567,
    tags: ['人像', '生活']
  },
  {
    id: 4,
    title: '建筑几何',
    description: '探索现代建筑的几何美学，展现建筑的力量与美感...',
    cover: 'https://picsum.photos/seed/gallery4/600/800',
    images: [
      'https://picsum.photos/seed/gallery4-1/1200/800',
      'https://picsum.photos/seed/gallery4-2/800/1200',
      'https://picsum.photos/seed/gallery4-3/1200/800'
    ],
    date: '2024-01-12',
    views: 892,
    tags: ['建筑', '城市']
  },
  {
    id: 5,
    title: '自然印象',
    description: '记录大自然的四季变迁，展现自然的神奇与美丽...',
    cover: 'https://picsum.photos/seed/gallery5/600/800',
    images: [
      'https://picsum.photos/seed/gallery5-1/1200/800',
      'https://picsum.photos/seed/gallery5-2/800/1200',
      'https://picsum.photos/seed/gallery5-3/1200/800'
    ],
    date: '2024-01-10',
    views: 1234,
    tags: ['风景', '自然']
  },
  {
    id: 6,
    title: '街头摄影：城市印象',
    description: '用相机记录城市中的精彩瞬间，展现都市生活的多彩面貌...',
    cover: 'https://picsum.photos/seed/gallery6/400/600',
    images: ['https://picsum.photos/seed/gallery6-1/1200/800'],
    date: '2024-01-08',
    views: 945,
    tags: ['街拍', '城市', '生活']
  },
  {
    id: 7,
    title: '山水之间',
    description: '行走在山水之间，感受大自然的鬼斧神工...',
    cover: 'https://picsum.photos/seed/gallery7/600/400',
    images: ['https://picsum.photos/seed/gallery7-1/1200/800'],
    date: '2024-01-06',
    views: 1432,
    tags: ['风景', '自然']
  },
  {
    id: 8,
    title: '现代建筑美学',
    description: '探索现代建筑的设计语言，记录城市发展的印记...',
    cover: 'https://picsum.photos/seed/gallery8/500/800',
    images: ['https://picsum.photos/seed/gallery8-1/1200/800'],
    date: '2024-01-04',
    views: 876,
    tags: ['建筑', '城市']
  },
  {
    id: 9,
    title: '人文纪实',
    description: '记录普通人的生活故事，展现生活的真实面貌...',
    cover: 'https://picsum.photos/seed/gallery9/600/500',
    images: ['https://picsum.photos/seed/gallery9-1/1200/800'],
    date: '2024-01-02',
    views: 1123,
    tags: ['人文', '纪实', '生活']
  },
  {
    id: 10,
    title: '自然微距',
    description: '走进自然的微观世界，发现平凡中的非凡...',
    cover: 'https://picsum.photos/seed/gallery10/500/700',
    images: ['https://picsum.photos/seed/gallery10-1/1200/800'],
    date: '2023-12-30',
    views: 892,
    tags: ['自然', '微距']
  },
  {
    id: 11,
    title: '城市夜景',
    description: '捕捉城市的璀璨夜色，展现不夜城的魅力...',
    cover: 'https://picsum.photos/seed/gallery11/600/900',
    images: ['https://picsum.photos/seed/gallery11-1/1200/800'],
    date: '2023-12-28',
    views: 1567,
    tags: ['城市', '夜景']
  },
  {
    id: 12,
    title: '旅行日记：西藏行',
    description: '记录在西藏高原的所见所闻，分享神秘西藏的独特魅力...',
    cover: 'https://picsum.photos/seed/gallery12/500/600',
    images: ['https://picsum.photos/seed/gallery12-1/1200/800'],
    date: '2023-12-26',
    views: 2134,
    tags: ['风景', '旅行', '人文']
  },
  {
    id: 13,
    title: '工业摄影',
    description: '探索工业设施的几何美感，展现现代工业的力量...',
    cover: 'https://picsum.photos/seed/gallery13/700/500',
    images: ['https://picsum.photos/seed/gallery13-1/1200/800'],
    date: '2023-12-24',
    views: 765,
    tags: ['工业', '建筑']
  },
  {
    id: 14,
    title: '雨中即景',
    description: '记录雨中的城市风景，展现雨天独特的诗意...',
    cover: 'https://picsum.photos/seed/gallery14/400/700',
    images: ['https://picsum.photos/seed/gallery14-1/1200/800'],
    date: '2023-12-22',
    views: 987,
    tags: ['城市', '风景']
  },
  {
    id: 15,
    title: '人像：光影之美',
    description: '探索光影在人像摄影中的运用，创造独特的视觉效果...',
    cover: 'https://picsum.photos/seed/gallery15/600/800',
    images: ['https://picsum.photos/seed/gallery15-1/1200/800'],
    date: '2023-12-20',
    views: 1432,
    tags: ['人像', '艺术']
  },
  {
    id: 16,
    title: '老街记忆',
    description: '漫步老街巷弄，记录城市的历史印记...',
    cover: 'https://picsum.photos/seed/gallery16/500/400',
    images: ['https://picsum.photos/seed/gallery16-1/1200/800'],
    date: '2023-12-18',
    views: 876,
    tags: ['街拍', '人文']
  },
  {
    id: 17,
    title: '花卉摄影',
    description: '记录花卉的绚丽色彩，展现大自然的精致之美...',
    cover: 'https://picsum.photos/seed/gallery17/400/500',
    images: ['https://picsum.photos/seed/gallery17-1/1200/800'],
    date: '2023-12-16',
    views: 654,
    tags: ['自然', '微距']
  },
  {
    id: 18,
    title: '海边剪影',
    description: '捕捉海边的剪影瞬间，展现大海的浪漫与神秘...',
    cover: 'https://picsum.photos/seed/gallery18/700/400',
    images: ['https://picsum.photos/seed/gallery18-1/1200/800'],
    date: '2023-12-14',
    views: 1234,
    tags: ['风景', '自然']
  },
  {
    id: 19,
    title: '现代舞台',
    description: '记录现代舞台表演的精彩瞬间，展现艺术的感染力...',
    cover: 'https://picsum.photos/seed/gallery19/500/700',
    images: ['https://picsum.photos/seed/gallery19-1/1200/800'],
    date: '2023-12-12',
    views: 897,
    tags: ['艺术', '人文']
  },
  {
    id: 20,
    title: '冬日印象',
    description: '记录冬日里的温暖瞬间，展现冬季的独特魅力...',
    cover: 'https://picsum.photos/seed/gallery20/600/500',
    images: ['https://picsum.photos/seed/gallery20-1/1200/800'],
    date: '2023-12-10',
    views: 765,
    tags: ['风景', '生活']
  }
])

const handleSearch = useDebounce(() => {
  // 实现搜索逻辑
}, 300)

const selectTag = (tagId: number) => {
  currentTag.value = currentTag.value === tagId ? null : tagId
  page.value = 1
}

const filteredGallery = computed(() => {
  let result = gallery.value

  if (searchQuery.value) {
    result = result.filter(item => 
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (currentTag.value) {
    const tagName = tags.value.find(t => t.id === currentTag.value)?.name
    result = result.filter(item => item.tags.includes(tagName || ''))
  }

  return result
})

const loadMore = async () => {
  loading.value = true
  // 模拟加载更多图集
  await new Promise(resolve => setTimeout(resolve, 1000))
  loading.value = false
  page.value++
  if (page.value > 3) hasMore.value = false
}

const onContentVisible = (visible: boolean) => {
  if (visible) isContentVisible.value = true
}

// 添加查看器相关的状态
const isViewerVisible = ref(false)
const currentImages = ref<string[]>([])
const currentTitle = ref('')
const currentDescription = ref('')

// 更新 openGallery 方法
const openGallery = (item: GalleryItem) => {
  currentImages.value = item.images
  currentTitle.value = item.title
  currentDescription.value = item.description
  isViewerVisible.value = true
}

// 添加关闭查看器方法
const closeViewer = () => {
  isViewerVisible.value = false
}

onMounted(() => {
  // 模拟加载时间
  setTimeout(() => {
    isLoading.value = false
  }, 800)
})
</script>

<style scoped>
.gallery {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.gallery-container {
  width: 100%;
}

.gallery-header {
  margin-bottom: 2rem;
}

.search-bar {
  margin-bottom: 1rem;
}

.search-bar input {
  width: 100%;
  max-width: 400px;
  padding: 0.8rem 1.2rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--color-surface);
  color: var(--color-text);
}

.filter-tags {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  padding: 0.5rem 0;
}

.filter-tags button {
  padding: 0.6rem 1.2rem;
  border: 1px solid var(--color-border);
  border-radius: 20px;
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.filter-tags button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.filter-tags button.active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.2);
}

.gallery-item {
  border-radius: 12px;
  overflow: hidden;
  background: var(--color-surface);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  border: 1px solid rgba(var(--color-border-rgb), 0.1);
  margin: 0 8px 24px;
  width: calc(100% - 16px);
}

.gallery-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.image-wrapper {
  position: relative;
  overflow: hidden;
}

.image-wrapper img {
  width: 100%;
  height: auto;
  display: block;
  transition: transform 0.3s ease;
}

.gallery-item:hover .image-wrapper img {
  transform: scale(1.05);
}

.item-info {
  padding: 1.5rem;
}

.item-info h3 {
  margin: 0 0 1rem;
  color: var(--color-text);
  font-size: 1.2rem;
  line-height: 1.4;
}

.item-info p {
  margin: 0 0 1.2rem;
  color: var(--color-text);
  opacity: 0.8;
  font-size: 0.95rem;
  line-height: 1.6;
}

.item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
  color: var(--color-text);
  opacity: 0.7;
  font-size: 0.9rem;
}

.item-tags {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(var(--color-border-rgb), 0.1);
}

.tag {
  padding: 0.4rem 1rem;
  background: rgba(var(--color-primary-rgb), 0.1);
  color: var(--color-primary);
  border-radius: 15px;
  font-size: 0.85rem;
  transition: all 0.3s ease;
}

.gallery-item:hover .tag {
  background: rgba(var(--color-primary-rgb), 0.15);
}

.load-more {
  text-align: center;
  margin-top: 3rem;
}

.load-more button {
  padding: 0.8rem 2rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.load-more button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

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

.content-loaded {
  opacity: 1;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .gallery {
    padding: 1rem;
  }

  .gallery-header {
    margin-bottom: 1.5rem;
  }

  .search-bar input {
    font-size: 0.95rem;
  }

  .filter-tags {
    padding: 0.3rem 0;
    margin-bottom: 1.5rem;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE and Edge */
  }

  .filter-tags::-webkit-scrollbar {
    display: none; /* Chrome, Safari and Opera */
  }

  .filter-tags button {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    white-space: nowrap;
  }

  .item-info {
    padding: 1.2rem;
  }

  .item-info h3 {
    font-size: 1.1rem;
    margin-bottom: 0.8rem;
  }

  .item-info p {
    font-size: 0.9rem;
    margin-bottom: 1rem;
  }

  .item-meta {
    margin-bottom: 1rem;
  }

  .tag {
    padding: 0.3rem 0.8rem;
    font-size: 0.8rem;
  }

  :deep(.masonry-wall) {
    padding: 0 8px;
  }

  .gallery-item {
    margin: 0 6px 16px;
    width: calc(100% - 12px);
  }
}

/* 暗色模式优化 */
@media (prefers-color-scheme: dark) {
  .gallery-item {
    background: rgba(var(--color-surface-rgb), 0.8);
    backdrop-filter: blur(10px);
  }

  .filter-tags button {
    background: rgba(var(--color-surface-rgb), 0.8);
    backdrop-filter: blur(5px);
  }
}

/* 调整瀑布流容器样式 */
:deep(.masonry-wall) {
  padding: 0 12px;
}
</style> 