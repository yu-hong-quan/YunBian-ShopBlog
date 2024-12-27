<template>
  <div class="article-detail" v-observe-visibility="onContentVisible">
    <!-- 文章头部 -->
    <header class="article-header" :class="{ 'fade-in': isContentVisible }">
      <div class="header-content">
        <div class="article-meta">
          <div class="meta-left">
            <span class="category">{{ article.category }}</span>
            <span class="date">{{ article.date }}</span>
            <span class="read-time">{{ article.readTime }}分钟阅读</span>
          </div>
          <div class="meta-right">
            <span class="views">👁️ {{ article.views }}</span>
            <span class="likes">❤️ {{ article.likes }}</span>
          </div>
        </div>
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-tags">
          <span v-for="tag in article.tags" :key="tag" class="tag">{{ tag }}</span>
        </div>
      </div>
      <!-- 编辑按钮 -->
      <button
        class="edit-btn"
        @click="handleEdit"
      >
        编辑文章
      </button>
    </header>

    <!-- 文章封面 -->
    <div 
      class="article-cover" 
      :class="{ 'fade-in': isContentVisible }"
      style="animation-delay: 0.2s"
    >
      <img :src="article.cover" :alt="article.title">
    </div>

    <!-- 文章内容 -->
    <div 
      class="article-content" 
      :class="{ 'fade-in': isContentVisible }"
      style="animation-delay: 0.4s"
    >
      <div class="content-wrapper">
        {{ article.content }}
      </div>
    </div>

    <!-- 相关文章 -->
    <div 
      class="related-articles"
      :class="{ 'fade-in': isContentVisible }"
      style="animation-delay: 0.6s"
    >
      <h2>相关文章</h2>
      <div class="related-grid">
        <article 
          v-for="item in relatedArticles" 
          :key="item.id" 
          class="related-card"
          @click="navigateToArticle(item.id, item.category)"
        >
          <div class="related-image">
            <img :src="item.cover" :alt="item.title">
          </div>
          <div class="related-content">
            <h3>{{ item.title }}</h3>
            <p>{{ item.preview }}</p>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const { isAdmin } = useAuth()
const route = useRoute()
const router = useRouter()
const isContentVisible = ref(false)

const article = ref({
  id: 1,
  title: 'Vue 3 组合式 API 最佳实践',
  content: '这里是文章的详细内容...',
  date: '2024-01-20',
  category: '技术',
  cover: 'https://picsum.photos/seed/article1/1200/600',
  tags: ['Vue', 'TypeScript', '前端开发'],
  readTime: 15,
  views: 1234,
  likes: 88
})

const relatedArticles = ref([
  {
    id: 2,
    title: '前端性能优化实践',
    preview: '探索现代前端应用的性能优化技巧...',
    cover: 'https://picsum.photos/seed/article2/600/400'
  },
  {
    id: 3,
    title: 'TypeScript 高级特性详解',
    preview: '深入理解 TypeScript 的类型系统...',
    cover: 'https://picsum.photos/seed/article3/600/400'
  }
])

const onContentVisible = (visible: boolean) => {
  if (visible) isContentVisible.value = true
}

const articleId = route.params.id
const category = route.query.category as string

const navigateToArticle = (id: number, category: string) => {
  router.push({
    name: 'ArticleDetail',
    params: { id },
    query: { category }
  })
}

const handleEdit = () => {
  router.push(`/admin/editor?id=${route.params.id}`)
}

onMounted(() => {
  // 这里可以根据路由参数获取文章详情
  const articleId = route.params.id
  // fetchArticleDetails(articleId)
})
</script>

<style scoped>
.article-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 2rem;
}

.header-content {
  flex: 1;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 1.5rem;
  color: var(--color-text);
  opacity: 0.8;
}

.meta-left, .meta-right {
  display: flex;
  gap: 1rem;
}

.article-title {
  font-size: 2.5rem;
  color: var(--color-text);
  margin: 1rem 0;
}

.article-tags {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.tag {
  background: rgba(var(--color-primary-rgb), 0.1);
  color: var(--color-primary);
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.9rem;
}

.article-cover {
  margin-bottom: 3rem;
  border-radius: 12px;
  overflow: hidden;
}

.article-cover img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.article-content {
  margin-bottom: 4rem;
}

.content-wrapper {
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
  color: var(--color-text);
}

.related-articles {
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--color-border);
}

.related-articles h2 {
  margin-bottom: 2rem;
  color: var(--color-text);
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.related-card {
  background: var(--color-surface);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.related-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.related-image {
  height: 200px;
  overflow: hidden;
}

.related-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.related-card:hover .related-image img {
  transform: scale(1.05);
}

.related-content {
  padding: 1.5rem;
}

.related-content h3 {
  margin: 0 0 1rem;
  color: var(--color-text);
}

.related-content p {
  margin: 0;
  color: var(--color-text);
  opacity: 0.8;
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

/* 响应式调整 */
@media (max-width: 768px) {
  .article-detail {
    padding: 1rem;
  }

  .article-header {
    flex-direction: column;
    gap: 1rem;
  }

  .article-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .meta-left, .meta-right {
    width: 100%;
    justify-content: flex-start;
  }

  .article-title {
    font-size: 2rem;
    margin: 0.5rem 0;
  }

  .edit-btn {
    align-self: flex-start;
  }

  .related-articles {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .related-card {
    flex-direction: row;
    height: auto;
  }

  .related-image {
    width: 120px;
    height: 80px;
  }
}

.edit-btn {
  padding: 0.6rem 1.2rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.edit-btn:hover {
  background: var(--color-primary-dark);
}
</style> 