<template>
  <div class="articles-section" v-observe-visibility="onArticlesVisible">
    <div class="articles-list" :class="{ 'fade-in': isArticlesVisible }">
      <article 
        v-for="article in articles" 
        :key="article.id" 
        class="article-card"
        @click="navigateToArticle(article.id, article.category)"
        style="cursor: pointer;"
      >
        <div class="article-image">
          <img :src="article.cover" :alt="article.title" loading="lazy">
        </div>
        <div class="article-content">
          <div class="article-tags">
            <span class="tag">{{ article.category }}</span>
            <span 
              v-for="tag in article.tags" 
              :key="tag" 
              class="tag"
            >{{ tag }}</span>
          </div>
          <h3>{{ article.title }}</h3>
          <p class="article-preview">{{ article.preview }}</p>
          <div class="article-meta">
            <div class="meta-left">
              <span class="date">{{ article.date }}</span>
              <span class="read-time">{{ article.readTime }}分钟阅读</span>
            </div>
            <div class="meta-right">
              <span class="views">👁️ {{ article.views }}</span>
              <span class="likes">❤️ {{ article.likes }}</span>
            </div>
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
}>()

const router = useRouter()

const isArticlesVisible = ref(false)
const onArticlesVisible = (visible: boolean) => {
  if (visible) isArticlesVisible.value = true
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
.articles-section {
  margin-bottom: 2rem;
}

.article-card {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  background: var(--color-surface);
  border-radius: 12px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.article-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.article-image {
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-card:hover .article-image img {
  transform: scale(1.05);
}

.article-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tag {
  background: rgba(var(--color-primary-rgb), 0.1);
  color: var(--color-primary);
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.9rem;
}

.article-content h3 {
  margin: 0;
  color: var(--color-text);
  font-size: 1.5rem;
}

.article-preview {
  color: var(--color-text);
  opacity: 0.8;
  margin: 0;
  line-height: 1.6;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.9rem;
  color: var(--color-text);
  opacity: 0.8;
}

.meta-left, .meta-right {
  display: flex;
  gap: 1rem;
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
  .article-card {
    grid-template-columns: 1fr;
  }

  .article-image {
    height: 200px;
  }

  .article-content {
    padding: 1rem;
  }
}
</style> 