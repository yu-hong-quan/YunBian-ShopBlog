<template>
  <div 
    class="featured-section" 
    v-if="!hideSection"
    v-observe-visibility="onFeaturedVisible"
  >
    <h2 :class="{ 'fade-in': isFeaturedVisible }">热门推荐</h2>
    <div class="featured-grid" :class="{ 'fade-in': isFeaturedVisible }">
      <article 
        v-for="article in articles" 
        :key="article.id" 
        class="featured-card"
        @click="navigateToArticle(article.id, article.category)"
        style="cursor: pointer;"
      >
        <div class="featured-image" :style="{ backgroundImage: `url(${article.cover})` }"></div>
        <div class="featured-content">
          <span class="featured-tag">{{ article.category }}</span>
          <h3>{{ article.title }}</h3>
          <p>{{ article.preview }}</p>
          <div class="article-meta">
            <span>{{ article.date }}</span>
            <span>{{ article.readTime }}分钟阅读</span>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

defineProps<{
  articles: Array<any>
  hideSection: boolean
}>()

const router = useRouter()

const isFeaturedVisible = ref(false)
const onFeaturedVisible = (visible: boolean) => {
  if (visible) isFeaturedVisible.value = true
}

const navigateToArticle = (id: number, category: string) => {
  router.push({
    name: 'ArticleDetail',
    params: { id },
    query: { category }
  })
}
</script>

<style scoped>
.featured-section {
  margin-bottom: 3rem;
}

.featured-section h2 {
  margin-bottom: 2rem;
  color: var(--color-text);
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.featured-card {
  background: var(--color-surface);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
}

.featured-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.featured-image {
  height: 200px;
  background-size: cover;
  background-position: center;
}

.featured-content {
  padding: 1.5rem;
}

.featured-tag {
  background: var(--color-primary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.9rem;
  display: inline-block;
  margin-bottom: 1rem;
}

.featured-content h3 {
  color: var(--color-text);
  margin: 0 0 1rem;
  font-size: 1.5rem;
}

.featured-content p {
  color: var(--color-text);
  opacity: 0.8;
  margin: 0 0 1.5rem;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  color: var(--color-text);
  opacity: 0.6;
  font-size: 0.9rem;
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
  .featured-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .featured-card {
    height: 250px;
  }
}
</style> 