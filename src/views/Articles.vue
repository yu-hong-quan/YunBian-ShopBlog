<template>
  <LoadingScreen :is-loading="isLoading" />
  <div class="articles" :class="{ 'content-loaded': !isLoading }">
    <div class="articles-container" v-observe-visibility="onContentVisible">
      <SearchBar
        v-model="searchQuery"
        :categories="categories"
        :current-category="currentCategory"
        @select-category="selectCategory"
        :class="{ 'fade-in': isContentVisible }"
      />

      <FeaturedArticles
        :articles="featuredArticles"
        :hide-section="!!searchQuery || !!currentCategory"
        :class="{ 'fade-in': isContentVisible }"
        style="animation-delay: 0.2s"
      />
      
      <ArticleList 
        :articles="filteredArticles"
        :class="{ 'fade-in': isContentVisible }"
        style="animation-delay: 0.4s"
      />

      <LoadMore
        v-if="hasMore"
        :loading="loading"
        @load-more="loadMore"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
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
}

const searchQuery = ref('')
const currentCategory = ref<number | null>(null)
const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)

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
    preview: '关注程序员的身��健康，分享实用的护眼、运动和心理调节方法...',
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
    likes: 88
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
    likes: 67
  },
  {
    id: 3,
    title: '2024 年值得关注的后端技术趋势',
    preview: '盘点 2024 年后端开发领域的新技术、新框架和新思路，���你把握发展方向...',
    date: '2024-01-10',
    category: '后端',
    categoryId: 5,
    cover: 'https://picsum.photos/seed/article3/600/400',
    tags: ['Node.js', 'Golang', '微服务'],
    readTime: 10,
    views: 723,
    likes: 45
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
    likes: 120
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
    likes: 165
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
    likes: 72
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
    likes: 94
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
    likes: 143
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
  loading.value = true
  // 模拟加载更多文章
  await new Promise(resolve => setTimeout(resolve, 1000))
  loading.value = false
  page.value++
  if (page.value > 3) hasMore.value = false
}

// 添加可见性状态
const isContentVisible = ref(false)

// 添加可见性处理函数
const onContentVisible = (visible: boolean) => {
  if (visible) isContentVisible.value = true
}

const isLoading = ref(true)

const { isAdmin } = useAuth()
const router = useRouter()

const handleEdit = (articleId: number) => {
  router.push(`/admin/editor?id=${articleId}`)
}

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>

<style scoped>
.articles {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  opacity: 0;
  transition: opacity 0.5s ease;
}

/* 移除容器的初始透明度 */
/* .articles-container {
  opacity: 0;
} */

/* 渐入动画 */
.fade-in {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  will-change: opacity, transform; /* 优化性能 */
}

@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .articles {
    padding: 1rem;
  }

  .articles-container {
    padding: 1rem;
  }

  .articles-header {
    flex-direction: column;
    gap: 1rem;
  }

  .filter-section {
    flex-direction: column;
    width: 100%;
  }

  .category-filters {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }

  .category-filters button {
    white-space: nowrap;
  }

  .search-bar {
    width: 100%;
  }
}

.content-loaded {
  opacity: 1;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.edit-btn {
  padding: 0.4rem 0.8rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}
</style> 