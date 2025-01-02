<template>
  <LoadingScreen :is-loading="isLoading" />
  
  <div class="article-detail" :class="{ 'content-loaded': !isLoading }">
    <div class="article-header" v-if="article">
      <div class="article-cover">
        <!-- 封面图加载效果 -->
        <div 
          class="image-placeholder"
          :class="{ 'hidden': imageLoaded }"
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
          :src="article.cover" 
          :alt="article.title"
          @load="onImageLoad"
          :class="{ 'loaded': imageLoaded }"
        >
      </div>
      
      <div class="article-info">
        <div class="article-meta">
          <span class="category">{{ article.category }}</span>
          <span class="date">{{ article.date }}</span>
        </div>
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-stats">
          <span class="read-time">
            <svg viewBox="0 0 24 24" class="meta-icon">
              <path fill="currentColor" d="M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5c-1.7-4.4-6-7.5-11-7.5zM12 17c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z"/>
            </svg>
            {{ article.readTime }}分钟阅读
          </span>
          <span class="views">
            <svg viewBox="0 0 24 24" class="meta-icon">
              <path fill="currentColor" d="M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5c-1.7-4.4-6-7.5-11-7.5zM12 17c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5z"/>
            </svg>
            {{ article.views }} 阅读
          </span>
          <span class="likes">
            <svg viewBox="0 0 24 24" class="meta-icon">
              <path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
            {{ article.likes }} 喜欢
          </span>
        </div>
      </div>
    </div>

    <div class="article-content" v-if="article">
      <div class="content-body markdown-body" v-html="renderedContent"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MarkdownIt from 'markdown-it'
import LoadingScreen from '@/components/common/LoadingScreen.vue'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

const route = useRoute()
const article = ref<any>(null)
const isLoading = ref(true)
const imageLoaded = ref(false)

const renderedContent = ref('')

const onImageLoad = () => {
  imageLoaded.value = true
}

onMounted(async () => {
  try {
    const articleId = Number(route.params.id)
    // 模拟 API 请求延迟
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 模拟文章数据
    article.value = {
      id: articleId,
      title: 'Vue 3 + TypeScript 实战指南',
      content: `
# Vue 3 + TypeScript 实战指南

## 1. 介绍

Vue 3 带来了许多激动人心的新特性，结合 TypeScript 可以让我们的代码更加健壮和易于维护。

## 2. 组合式 API

组合式 API 是 Vue 3 最重要的特性之一，它允许我们：

- 更好地组织代码逻辑
- 提高代码的可复用性
- 更好的 TypeScript 支持

### 示例代码

\`\`\`typescript
import { ref, onMounted } from 'vue'

interface User {
  id: number
  name: string
}

export function useUser() {
  const user = ref<User | null>(null)
  
  const fetchUser = async (id: number) => {
    // 实现获取用户数据的逻辑
  }
  
  onMounted(() => {
    // 组件挂载时的逻辑
  })
  
  return {
    user,
    fetchUser
  }
}
\`\`\`

## 3. 性能优化

Vue 3 在性能方面有很大提升...
      `,
      date: '2024-01-15',
      category: '技术',
      cover: `https://picsum.photos/seed/article${articleId}/1200/400`,
      readTime: 15,
      views: 1234,
      likes: 88
    }
    
    // 渲染 Markdown 内容
    renderedContent.value = md.render(article.value.content)
  } catch (error) {
    console.error('Failed to fetch article:', error)
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.article-detail {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.content-loaded {
  opacity: 1;
}

.article-header {
  margin-bottom: 2rem;
}

.article-cover {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 2rem;
  position: relative;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.article-cover img.loaded {
  opacity: 1;
}

.article-info {
  text-align: center;
}

.article-meta {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.category {
  color: var(--color-primary);
  font-weight: 500;
}

.date {
  color: var(--color-text-secondary);
}

.article-title {
  font-size: 2.5rem;
  margin: 0 0 1.5rem;
  color: var(--color-text);
  line-height: 1.3;
}

.article-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  color: var(--color-text-secondary);
}

.meta-icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
  margin-right: 4px;
}

.content-body {
  font-size: 1.1rem;
  line-height: 1.8;
  color: var(--color-text);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .article-detail {
    padding: 1rem;
  }

  .article-cover {
    height: 200px;
    margin-bottom: 1.5rem;
  }

  .article-title {
    font-size: 1.8rem;
  }

  .article-stats {
    gap: 1rem;
    flex-wrap: wrap;
  }

  .content-body {
    font-size: 1rem;
  }
}

/* 暗色主题适配 */
:root.dark .article-detail {
  background: var(--color-surface);
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

/* Markdown 样式 */
.markdown-body {
  color: var(--color-text);
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  color: var(--color-text);
  margin: 1.5em 0 0.5em;
}

.markdown-body h1 {
  font-size: 2em;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.3em;
}

.markdown-body h2 {
  font-size: 1.5em;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0.3em;
}

.markdown-body p {
  margin: 1em 0;
  line-height: 1.8;
}

.markdown-body code {
  background-color: var(--color-surface);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
}

.markdown-body pre {
  background-color: var(--color-surface);
  padding: 1em;
  border-radius: 8px;
  overflow-x: auto;
}

.markdown-body pre code {
  background-color: transparent;
  padding: 0;
}

.markdown-body ul,
.markdown-body ol {
  padding-left: 2em;
  margin: 1em 0;
}

.markdown-body li {
  margin: 0.5em 0;
}

.markdown-body blockquote {
  margin: 1em 0;
  padding-left: 1em;
  border-left: 4px solid var(--color-primary);
  color: var(--color-text-secondary);
}

/* 暗色主题适配 */
:root.dark .markdown-body {
  color: var(--color-text);
}

:root.dark .markdown-body code {
  background-color: rgba(255, 255, 255, 0.1);
}

:root.dark .markdown-body pre {
  background-color: rgba(255, 255, 255, 0.1);
}
</style> 