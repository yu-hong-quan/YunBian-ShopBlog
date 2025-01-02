<template>
  <div class="articles-container">
    <!-- 搜索和筛选区域 -->
    <div class="search-section">
      <div class="search-bar">
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="搜索文章..."
          @input="handleSearch"
        >
        <svg class="search-icon" viewBox="0 0 24 24">
          <path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
      </div>
      
      <div class="categories-filter">
        <button 
          v-for="category in categories" 
          :key="category.id"
          :class="['category-btn', { active: currentCategory === category.id }]"
          @click="selectCategory(category.id)"
        >
          {{ category.name }}
        </button>
      </div>
    </div>

    <!-- 精选文章区域 -->
    <section class="featured-section" v-if="!searchQuery && !currentCategory">
      <div class="section-header">
        <h2 class="section-title">精选文章</h2>
        <div class="section-divider"></div>
      </div>
      <FeaturedArticles 
        :articles="featuredArticles"
        :hide-section="false"
      />
    </section>

    <!-- 所有文章区域 -->
    <section class="all-articles-section">
      <div class="section-header">
        <h2 class="section-title">
          {{ searchQuery || currentCategory ? '搜索结果' : '最新文章' }}
        </h2>
        <div class="section-divider"></div>
      </div>
      <div class="articles-grid">
        <article 
          v-for="article in displayedArticles" 
          :key="article.id"
          class="article-card"
          @click="navigateToArticle(article.id)"
        >
          <div class="article-image">
            <!-- 加载占位 -->
            <div 
              class="image-placeholder"
              :class="{ 'hidden': article.imageLoaded }"
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
            <img 
              v-lazy="article.cover" 
              :alt="article.title"
              @load="onImageLoad(article.id)"
              :class="{ 'loaded': article.imageLoaded }"
            >
            <div class="article-category">{{ article.category }}</div>
          </div>
          
          <div class="article-content">
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-preview">{{ article.preview }}</p>
            
            <div class="article-meta">
              <div class="meta-left">
                <span class="date">
                  <svg viewBox="0 0 24 24" class="meta-icon">
                    <path fill="currentColor" d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
                  </svg>
                  {{ article.date }}
                </span>
                <span class="read-time">
                  <svg viewBox="0 0 24 24" class="meta-icon">
                    <path fill="currentColor" d="M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5c-1.7-4.4-6-7.5-11-7.5zM12 17c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z"/>
                  </svg>
                  {{ article.readTime }}分钟
                </span>
              </div>
              <div class="meta-right">
                <span class="views">{{ article.views }} 阅读</span>
                <span class="likes">{{ article.likes }} 喜欢</span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>

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
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue'
import SearchBar from '@/components/articles/SearchBar.vue'
import FeaturedArticles from '@/components/articles/FeaturedArticles.vue'
import ArticleList from '@/components/articles/ArticleList.vue'
import LoadMore from '@/components/articles/LoadMore.vue'
import { useDebounce } from '@/composables/useDebounce'
import LoadingScreen from '@/components/common/LoadingScreen.vue'
import { useAuth } from '@/composables/useAuth'
import { useRouter } from 'vue-router'

interface Article {
  id: number
  title: string
  preview: string
  date: string
  category: string
  categoryId: number
  cover: string
  tags: string[]
  readTime: number
  views: number
  likes: number
  imageLoaded: boolean
}

const searchQuery = ref('')
const currentCategory = ref<number | null>(null)
const loading = ref(false)
const pageSize = 6 // 每页显示的文章数量
const currentPage = ref(1)
const allArticles = ref<Article[]>([])
const displayedArticles = computed(() => {
  const start = 0
  const end = currentPage.value * pageSize
  return filteredArticles.value.slice(start, end)
})

const hasMore = computed(() => {
  return displayedArticles.value.length < filteredArticles.value.length
})

const categories = ref([
  { id: 1, name: '技术' },
  { id: 2, name: '生活' },
  { id: 3, name: '随笔' },
  { id: 4, name: '前端' },
  { id: 5, name: '后端' }
])

const featuredArticles = ref([
  {
    id: 1,
    title: 'Vue 3 组合式 API 最佳实践',
    preview: '深入探讨 Vue 3 组合式 API 的使用技巧和注意事项，帮助你写出更优雅的代码...',
    date: '2024-01-20',
    category: '技术',
    cover: 'https://picsum.photos/seed/featured1/800/400',
    readTime: 8
  },
  {
    id: 2,
    title: '2024 前端开发趋势展望',
    preview: '探讨新的一年前端开发领域可能出现的新技术、新工具和新方向...',
    date: '2024-01-18',
    category: '前端',
    cover: 'https://picsum.photos/seed/featured2/800/400',
    readTime: 10
  },
  {
    id: 3,
    title: '程序员健康指南',
    preview: '关注程序员的身体健康，分享实用的护眼、运动和心理调节方法...',
    date: '2024-01-16',
    category: '生活',
    cover: 'https://picsum.photos/seed/featured3/800/400',
    readTime: 6
  }
])

const articles = ref<Article[]>([
  {
    id: 1,
    title: 'Vue 3 + TypeScript 实战指南',
    preview: '从零开始学习如何使用 Vue 3 和 TypeScript 构建现代化的 Web 应用，包括组合式 API、类型推导、性能优化等核心内容...',
    date: '2024-01-15',
    category: '技术',
    categoryId: 1,
    cover: 'https://picsum.photos/seed/article1/600/400',
    tags: ['Vue', 'TypeScript', '教程'],
    readTime: 15,
    views: 1234,
    likes: 88,
    imageLoaded: false
  },
  {
    id: 2,
    title: '前端性能优化实践',
    preview: '探索现代前端应用的性能优化技巧，从打包构建、代码分割到运行时优化，全方位提升应用性能...',
    date: '2024-01-12',
    category: '前端',
    categoryId: 4,
    cover: 'https://picsum.photos/seed/article2/600/400',
    tags: ['性能优化', 'Webpack', 'Vite'],
    readTime: 12,
    views: 856,
    likes: 67,
    imageLoaded: false
  },
  {
    id: 3,
    title: '2024 年值得关注的后端技术趋势',
    preview: '盘点 2024 年后端开发领域的新技术、新框架和新思路，帮助你把握发展方向...',
    date: '2024-01-10',
    category: '后端',
    categoryId: 5,
    cover: 'https://picsum.photos/seed/article3/600/400',
    tags: ['Node.js', 'Golang', '微服务'],
    readTime: 10,
    views: 723,
    likes: 45,
    imageLoaded: false
  },
  {
    id: 4,
    title: '我的远程工作感悟',
    preview: '分享一年远程工作的心得体会，包括时间管理、沟通技巧、工作效率等方面的经验总结...',
    date: '2024-01-08',
    category: '生活',
    categoryId: 2,
    cover: 'https://picsum.photos/seed/article4/600/400',
    tags: ['远程工作', '经验分享'],
    readTime: 8,
    views: 1502,
    likes: 120,
    imageLoaded: false
  },
  {
    id: 5,
    title: 'React vs Vue：2024年该如何选择？',
    preview: '深入对比 React 和 Vue 的最新特性、生态系统、学习曲线等方面，帮助你做出最佳选择...',
    date: '2024-01-05',
    category: '技术',
    categoryId: 1,
    cover: 'https://picsum.photos/seed/article5/600/400',
    tags: ['React', 'Vue', '术选型'],
    readTime: 18,
    views: 2341,
    likes: 165,
    imageLoaded: false
  },
  {
    id: 6,
    title: '程序员的自我修养',
    preview: '探讨作为一名程序员，除了技术能力之外，还需要具备哪些软技能和个人素养...',
    date: '2024-01-03',
    category: '随笔',
    categoryId: 3,
    cover: 'https://picsum.photos/seed/article6/600/400',
    tags: ['成长', '职业发展'],
    readTime: 6,
    views: 986,
    likes: 72,
    imageLoaded: false
  },
  {
    id: 7,
    title: 'CSS Grid 布局完全指南',
    preview: '详细介绍 CSS Grid 布局的使用方法、最佳实践和常见应用场景，助你掌握现代布局技术...',
    date: '2024-01-01',
    category: '前端',
    categoryId: 4,
    cover: 'https://picsum.photos/seed/article7/600/400',
    tags: ['CSS', 'Grid', '布局'],
    readTime: 14,
    views: 1123,
    likes: 94,
    imageLoaded: false
  },
  {
    id: 8,
    title: '从零搭建 Node.js 微服务架构',
    preview: '手把手教你使用 Node.js 构建微服务应用，包括服务拆分、通信、部署等完整流程...',
    date: '2023-12-28',
    category: '后端',
    categoryId: 5,
    cover: 'https://picsum.photos/seed/article8/600/400',
    tags: ['Node.js', '微服务', 'Docker'],
    readTime: 20,
    views: 1678,
    likes: 143,
    imageLoaded: false
  }
])

const handleSearch = useDebounce(() => {
  // 实现搜索逻辑
}, 300)

const selectCategory = (categoryId: number) => {
  currentCategory.value = currentCategory.value === categoryId ? null : categoryId
  page.value = 1
}

const filteredArticles = computed(() => {
  let result = articles.value

  if (searchQuery.value) {
    result = result.filter(article => 
      article.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      article.preview.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  if (currentCategory.value) {
    result = result.filter(article => article.categoryId === currentCategory.value)
  }

  return result
})

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

// 图片加载处理
const onImageLoad = (articleId: number) => {
  const article = allArticles.value.find(a => a.id === articleId)
  if (article) {
    article.imageLoaded = true
  }
}

// 重置分页
const resetPagination = () => {
  currentPage.value = 1
  allArticles.value.forEach(article => {
    article.imageLoaded = false
  })
}

// 在搜索和分类切换时重置分页
watch([searchQuery, currentCategory], () => {
  resetPagination()
})

const isContentVisible = ref(false)

const onContentVisible = (visible: boolean) => {
  if (visible) isContentVisible.value = true
}

const isLoading = ref(true)

const { isAdmin } = useAuth()
const router = useRouter()

const handleEdit = (articleId: number) => {
  router.push(`/admin/editor?id=${articleId}`)
}

const navigateToArticle = (id: number) => {
  router.push(`/article/${id}`)
}

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>

<style scoped>
.articles-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

/* 搜索区域样式 */
.search-section {
  margin-bottom: 2rem;
}

.search-bar {
  position: relative;
  margin-bottom: 1.5rem;
}

.search-bar input {
  width: 100%;
  padding: 1rem 1.5rem;
  padding-left: 3rem;
  border: none;
  border-radius: 12px;
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-bar input:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-primary);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 20px;
  color: var(--color-text-secondary);
}

.categories-filter {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  -webkit-overflow-scrolling: touch;
}

.category-btn {
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 20px;
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.category-btn.active {
  background: var(--color-primary);
  color: white;
}

/* 文章网格样式 */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.article-card {
  background: var(--color-surface);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
}

.article-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.article-image {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: var(--color-surface);
}

.image-placeholder {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface);
  transition: opacity 0.3s ease;
  z-index: 1;
}

.image-placeholder.hidden {
  opacity: 0;
  pointer-events: none;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
  opacity: 0;
}

.article-image img.loaded {
  opacity: 1;
}

.article-category {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.4rem 0.8rem;
  background: var(--color-primary);
  color: white;
  border-radius: 15px;
  font-size: 0.8rem;
}

.article-content {
  padding: 1.5rem;
}

.article-title {
  margin: 0 0 1rem;
  font-size: 1.2rem;
  color: var(--color-text);
  line-height: 1.4;
}

.article-preview {
  margin: 0 0 1.5rem;
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.meta-left, .meta-right {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.meta-icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin-right: 4px;
}

/* 加载更多按钮样式 */
.load-more-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.load-more-btn {
  padding: 0.6rem 1.5rem;
  border: none;
  border-radius: 20px;
  background: var(--color-primary);
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(var(--color-primary-rgb), 0.2);
}

.load-more-icon {
  width: 16px;
  height: 16px;
}

.load-more-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--color-primary-rgb), 0.3);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  color: var(--color-primary);
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

/* 移动端适配 */
@media (max-width: 768px) {
  .articles-container {
    padding: 1rem;
  }

  .search-section {
    margin-bottom: 1.5rem;
  }

  .search-bar input {
    padding: 0.8rem 1.2rem;
    padding-left: 2.5rem;
    font-size: 0.95rem;
  }

  .search-icon {
    width: 18px;
    height: 18px;
    left: 0.8rem;
  }

  .categories-filter {
    margin: 0 -1rem;
    padding: 0 1rem 0.5rem;
  }

  .category-btn {
    padding: 0.4rem 1rem;
    font-size: 0.85rem;
  }

  .articles-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .article-image {
    height: 180px;
  }

  .article-content {
    padding: 1rem;
  }

  .article-title {
    font-size: 1.1rem;
  }

  .article-preview {
    font-size: 0.9rem;
    -webkit-line-clamp: 2;
    margin-bottom: 1rem;
  }

  .article-meta {
    font-size: 0.8rem;
  }
}

/* 暗色主题适配 */
:root.dark .article-card {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

:root.dark .article-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

:root.dark .search-bar input {
  background: var(--color-surface);
}

:root.dark .category-btn {
  background: var(--color-surface);
}

/* 区块样式 */
.featured-section {
  margin-bottom: 2rem;
  padding: 2rem 0;
  position: relative;
}

.all-articles-section {
  padding-top: 2rem;
  position: relative;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
  white-space: nowrap;
}

.section-divider {
  height: 2px;
  flex-grow: 1;
  background: linear-gradient(
    to right,
    var(--color-primary),
    transparent
  );
  border-radius: 2px;
  opacity: 0.3;
}

/* 精选文章背景 */
.featured-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100vw;
  right: -100vw;
  bottom: 0;
  background: var(--color-surface);
  z-index: -1;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .featured-section {
    margin: -1rem -1rem 2rem -1rem;
    padding: 1.5rem 1rem;
    margin-bottom: 0rem;
    padding-bottom: 1rem;
  }

  .section-header {
    margin-bottom: 1.5rem;
  }

  .section-title {
    font-size: 1.25rem;
  }

  .all-articles-section {
    padding-top: 1rem;
  }
}

/* 暗色主题适配 */
:root.dark .section-divider {
  opacity: 0.2;
}

:root.dark .featured-section::before {
  background: var(--color-surface);
}
</style> 