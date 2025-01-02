<template>
  <section v-if="!hideSection" class="featured-section">
    <div class="featured-content">
      <div 
        v-for="(article, index) in articles" 
        :key="article.id"
        class="featured-item"
        :style="{ '--delay': `${index * 0.1}s` }"
        @click="navigateToArticle(article.id)"
      >
        <div class="featured-image">
          <img v-lazy="article.cover" :alt="article.title">
        </div>
        <div class="featured-info">
          <div class="article-meta">
            <span class="category">{{ article.category }}</span>
            <span class="read-time">{{ article.readTime }}分钟阅读</span>
          </div>
          <h3 class="article-title">{{ article.title }}</h3>
          <p class="article-preview">{{ article.preview }}</p>
          <div class="article-date">{{ article.date }}</div>
        </div>
      </div>
    </div>

    <!-- 移动端轮播指示器 -->
    <div class="mobile-indicators">
      <div 
        v-for="(_, index) in articles" 
        :key="index"
        :class="['indicator', { active: currentIndex === index }]"
        @click="setCurrentIndex(index)"
      ></div>
    </div>
  </section>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  articles: any[]
  hideSection: boolean
}>()

const router = useRouter()
const currentIndex = ref(0)
let autoplayInterval: number | null = null

const navigateToArticle = (id: number) => {
  router.push(`/article/${id}`)
}

const setCurrentIndex = (index: number) => {
  currentIndex.value = index
}

const startAutoplay = () => {
  autoplayInterval = window.setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % props.articles.length
  }, 5000)
}

const stopAutoplay = () => {
  if (autoplayInterval) {
    clearInterval(autoplayInterval)
  }
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})
</script>

<style scoped>
.featured-section {
  margin-bottom: 3rem;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: var(--color-text);
}

.featured-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.featured-item {
  background: var(--color-surface);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;
  animation: slideIn 0.6s ease forwards;
  animation-delay: var(--delay);
  opacity: 0;
}

.featured-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.featured-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.featured-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.featured-item:hover .featured-image img {
  transform: scale(1.05);
}

.featured-info {
  padding: 1.5rem;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
  font-size: 0.9rem;
}

.category {
  color: var(--color-primary);
  font-weight: 500;
}

.read-time {
  color: var(--color-text-secondary);
}

.article-title {
  font-size: 1.2rem;
  margin: 0 0 0.8rem;
  color: var(--color-text);
  line-height: 1.4;
}

.article-preview {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  margin: 0 0 1rem;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-date {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.mobile-indicators {
  display: none;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-border);
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: var(--color-primary);
  transform: scale(1.2);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 移动端样式 */
@media (max-width: 768px) {
  .featured-content {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 0;
    margin: 0 -1rem;
    padding: 0 1rem;
    -webkit-overflow-scrolling: touch;
    padding-bottom: 2rem;
  }

  .featured-item {
    flex: 0 0 100%;
    scroll-snap-align: start;
    display: none;
  }

  .featured-item:nth-child(1) {
    display: block;
  }

  .featured-image {
    height: 180px;
  }

  .featured-info {
    padding: 1rem;
  }

  .article-title {
    font-size: 1.1rem;
  }

  .article-preview {
    font-size: 0.9rem;
    -webkit-line-clamp: 2;
  }

  .mobile-indicators {
    display: flex;
  }

  /* 显示当前活动的文章 */
  .featured-item:nth-child(1) {
    display: block;
    transform: translateX(calc(-100% * var(--current-index)));
    transition: transform 0.3s ease;
  }
}

/* 暗色主题适配 */
:root.dark .featured-item {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

:root.dark .featured-item:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}
</style> 