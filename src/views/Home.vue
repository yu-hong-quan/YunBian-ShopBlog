<template>
  <LoadingScreen :is-loading="isLoading" />
  <div class="home" :class="{ 'content-loaded': !isLoading }">
    <!-- 视差滚动区域 -->
    <section class="hero-section">
      <div class="sticky-container">
        <div class="parallax-content" ref="parallaxContent">
          <div class="hero-text" :style="{ opacity: textOpacity, transform: `translateY(${textTranslate}px)` }">
            <h1>欢迎来到我的个人网站</h1>
            <p class="subtitle">一个充满创意和技术的空间</p>
            <button class="cta-button" @click="scrollToContent">了解更多</button>
          </div>
          <div class="parallax-bg" :style="{ transform: `scale(${bgScale})` }"></div>
        </div>
      </div>
    </section>

    <!-- 内容部分 -->
    <section class="content-section" ref="contentSection">

      <div class="section-container" v-observe-visibility="onProjectsVisible">
        <h2 class="section-title">精选项目</h2>
        <div class="projects-grid" :class="{ 'fade-in': isProjectsVisible }">
          <div v-for="project in projects" :key="project.id" class="project-card">
            <div class="project-image">
              <img :src="project.image" :alt="project.title" loading="lazy">
            </div>
            <div class="project-content">
              <h3>{{ project.title }}</h3>
              <p>{{ project.description }}</p>
              <div class="project-tags">
                <span v-for="tag in project.tags" :key="tag" class="tag">{{ tag }}</span>
              </div>
              <a :href="project.link" class="project-link" target="_blank">查看项目</a>
            </div>
          </div>
        </div>
      </div>

      <div class="section-container" v-observe-visibility="onUpdatesVisible">
        <h2 class="section-title">最新动态</h2>
        <div class="updates-grid" :class="{ 'fade-in': isUpdatesVisible }">
          <!-- 主要更新 -->
          <article 
            class="update-main" 
            @click="navigateToDetail(latestUpdates[0])"
            style="cursor: pointer;"
          >
            <div class="update-image">
              <img :src="latestUpdates[0].image" :alt="latestUpdates[0].title" loading="lazy">
            </div>
            <div class="update-content">
              <span class="update-tag">置顶</span>
              <h3>{{ latestUpdates[0].title }}</h3>
              <p>{{ latestUpdates[0].description }}</p>
              <div class="update-meta">
                <span class="date">{{ latestUpdates[0].date }}</span>
                <span class="read-more">阅读更多 →</span>
              </div>
            </div>
          </article>

          <!-- 次要更新表 -->
          <div class="updates-list">
            <article 
              v-for="update in latestUpdates.slice(1)" 
              :key="update.id" 
              class="update-item"
              @click="navigateToDetail(update)"
              style="cursor: pointer;"
            >
              <div class="update-image">
                <img :src="update.image" :alt="update.title" loading="lazy">
              </div>
              <div class="update-content">
                <h4>{{ update.title }}</h4>
                <div class="update-meta">
                  <span class="date">{{ update.date }}</span>
                  <span class="read-more">阅读更多 →</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
      <!-- 技能专长部分 -->
      <SkillsSection />
      <div class="section-container" v-observe-visibility="onContactVisible">
        <h2 class="section-title">联系我</h2>
        <div class="contact-container" :class="{ 'fade-in': isContactVisible }">
          <div class="contact-cards">
            <div class="contact-card">
              <div class="icon-wrapper">
                <i class="icon">📧</i>
              </div>
              <div class="contact-info">
                <h3>邮箱</h3>
                <p>15017872695@163.com</p>
              </div>
            </div>
            <div class="contact-card">
              <div class="icon-wrapper">
                <i class="icon">📱</i>
              </div>
              <div class="contact-info">
                <h3>微信</h3>
                <p>Name_YuHongQuan</p>
              </div>
            </div>
          </div>

          <div class="message-form">
            <h3>给我留言</h3>
            <div class="form-grid">
              <div class="form-group">
                <input type="text" placeholder="您的称呼" />
              </div>
              <div class="form-group">
                <input type="email" placeholder="您的邮箱" />
              </div>
              <div class="form-group full-width">
                <textarea placeholder="留言内容"></textarea>
              </div>
              <div class="form-group full-width">
                <button class="submit-btn">发送消息</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue'
import LoadingScreen from '@/components/common/LoadingScreen.vue'
import { useRouter } from 'vue-router'
import SkillsSection from '@/components/home/SkillsSection.vue'

const router = useRouter()

const contentSection = ref<HTMLElement | null>(null)
const parallaxContent = ref<HTMLElement | null>(null)
const textOpacity = ref(1)
const textTranslate = ref(0)
const bgScale = ref(1)

// 技能数据
const skills = [
  {
    icon: '🎨',
    title: '前端开发',
    description: '专注于创作优雅的用户界面和流畅的交互体验，追求极致的用户体验',
    tags: ['Vue.js', 'React', 'TypeScript', 'Tailwind CSS']
  },
  {
    icon: '⚡',
    title: '性能优化',
    description: '致力于提供快速加载和响应的网页应用，确保最佳的用户体验',
    tags: ['Webpack', 'Vite', 'PWA', '性能监控']
  },
  {
    icon: '🛠️',
    title: '工程化实践',
    description: '规范的代码风格，完善的测试覆盖，自动化的部署流程',
    tags: ['Git', 'Jest', 'CI/CD', 'Docker']
  },
  {
    icon: '📱',
    title: '移动端开发',
    description: '专业的移动端适配，响应式设计，混合应用开发',
    tags: ['移动适配', 'Flutter', 'React Native', 'Hybrid App']
  },
  {
    icon: '🎮',
    title: '动效开发',
    description: '创意的动画效果，流畅的页面转场，引人入胜的交互设计',
    tags: ['GSAP', 'Framer Motion', 'Three.js', 'CSS Animation']
  },
  {
    icon: '🔧',
    title: '后端开发',
    description: '掌握全栈开发能力，能够独立完成完整的应用开发',
    tags: ['Node.js', 'Express', 'MongoDB', 'RESTful API']
  }
]

interface Update {
  id: number
  title: string
  description: string
  date: string
  image: string
  category: string
  type: 'article' | 'gallery' // 添加类型字段
}

const latestUpdates = ref<Update[]>([
  {
    id: 1,
    title: '2024 年前端开发趋势展望',
    description: '探讨新的前端技术发展方向，包括AI辅助开发、WebAssembly的应用前景、微前端架构的演进、低代码平台的发展等热门话题...',
    date: '2024-01-20',
    image: 'https://picsum.photos/seed/update1/800/400',
    category: '技术',
    type: 'article'
  },
  {
    id: 2,
    title: '摄影作品：城市掠影',
    description: '记录城市中的光与影，用镜头捕捉都市生活的点滴瞬间...',
    date: '2024-01-18',
    image: 'https://picsum.photos/seed/update2/400/300',
    category: '图集',
    type: 'gallery'
  },
  {
    id: 3,
    title: 'Vue 3 性能优化实践指南',
    description: '分享在实际项目中的 Vue 3 性能优化经验，包括组件设计、状态管理、渲染优化等多个方面...',
    date: '2024-01-15',
    image: 'https://picsum.photos/seed/update3/400/300',
    category: '技术',
    type: 'article'
  },
  {
    id: 4,
    title: '旅行日记：青海湖之行',
    description: '记录在青海湖畔的所见所闻，分享高原风光与人文风情...',
    date: '2024-01-12',
    image: 'https://picsum.photos/seed/update4/400/300',
    category: '图集',
    type: 'gallery'
  },
  {
    id: 5,
    title: 'TypeScript 高级特性详解',
    description: '深入探讨 TypeScript 的类型系统，包括泛型、类型推导、装饰器等进阶主题...',
    date: '2024-01-10',
    image: 'https://picsum.photos/seed/update5/400/300',
    category: '技术',
    type: 'article'
  }
])

const projects = [
  {
    id: 1,
    title: '个人博客系统',
    description: '基于 Vue 3 + TypeScript 开发的现代化博客系统，支持Markdown编辑、代码高亮等功能。',
    image: 'https://picsum.photos/seed/project1/600/400',
    tags: ['Vue 3', 'TypeScript', 'Markdown'],
    link: '#'
  },
  {
    id: 2,
    title: '在线协作工具',
    description: '实时协作的项目管理工具，支持任务分配、进度追踪、文件共享等功能。',
    image: 'https://picsum.photos/seed/project2/600/400',
    tags: ['Vue', 'WebSocket', 'Node.js'],
    link: '#'
  },
  {
    id: 3,
    title: '移动端商城',
    description: '基于 Vue 3 开发的移动端电商平台，支持商品展示、购物车、订单管理等功能。',
    image: 'https://picsum.photos/seed/project3/600/400',
    tags: ['Vue 3', 'Vant', 'Mobile'],
    link: '#'
  }
]

// 更新视差滚动效果
const handleScroll = () => {
  if (!parallaxContent.value) return
  
  const scrolled = window.pageYOffset
  const rate = scrolled / window.innerHeight
  
  // 文字透明度和位置效果
  textOpacity.value = Math.max(0, 1 - rate * 2)
  textTranslate.value = scrolled * 0.5
  
  // 背景缩放效果
  bgScale.value = 1 + rate * 0.2
}

// 平滑滚动到内容区域
const scrollToContent = () => {
  contentSection.value?.scrollIntoView({ behavior: 'smooth' })
}

// 添加可见性状态
const isSkillsVisible = ref(false)
const isProjectsVisible = ref(false)
const isUpdatesVisible = ref(false)
const isContactVisible = ref(false)

// 可见性理函数
const onSkillsVisible = (isVisible: boolean) => {
  if (isVisible) isSkillsVisible.value = true
}

const onProjectsVisible = (isVisible: boolean) => {
  if (isVisible) isProjectsVisible.value = true
}

const onUpdatesVisible = (isVisible: boolean) => {
  if (isVisible) isUpdatesVisible.value = true
}

const onContactVisible = (isVisible: boolean) => {
  if (isVisible) isContactVisible.value = true
}

// 自定义观察者指令
const vObserveVisibility = {
  mounted: (el: HTMLElement, binding: any) => {
    const observer = new IntersectionObserver((entries) => {
      binding.value(entries[0].isIntersecting)
    }, {
      threshold: 0.1
    })
    observer.observe(el)
    // 保存 observer 实例以便清理
    el._observer = observer
  },
  unmounted: (el: HTMLElement) => {
    if (el._observer) {
      el._observer.disconnect()
    }
  }
}

const isLoading = ref(true)

// 添加导航函数
const navigateToDetail = (update: Update) => {
  if (update.type === 'article') {
    router.push({
      path: `/articles/${update.id}`,
      query: { category: update.category }
    })
  } else if (update.type === 'gallery') {
    router.push({
      path: `/gallery`,
      query: { id: update.id }
    })
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  // 模拟加载时间
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.content-loaded {
  opacity: 1;
}

/* 英雄区域样式 */
.hero-section {
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.sticky-container {
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
}

.parallax-content {
  position: relative;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-text {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 1.5rem 2rem;
  background-color: rgba(0, 0, 0, 0.4);
  border-radius: 12px;
  backdrop-filter: blur(8px);
  max-width: 600px;
  margin: 0 auto;
  will-change: transform, opacity;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.parallax-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url('https://picsum.photos/seed/hero/1920/1080');
  background-size: cover;
  background-position: center;
  will-change: transform;
  z-index: 1;
}

/* 优化动画性能 */
.hero-text, .parallax-bg {
  backface-visibility: hidden;
  transform-style: preserve-3d;
}

/* 添加渐变遮罩 */
.parallax-bg::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.5)
  );
}

/* 响应式调整 */
@media (max-width: 768px) {
  .hero-text {
    padding: 1.2rem 1.5rem;
    width: 85%;
    max-width: 400px;
  }

  .hero-text h1 {
    font-size: 1.8rem;
    margin-bottom: 0.6rem;
  }

  .subtitle {
    font-size: 1rem;
    margin-bottom: 1.2rem;
  }

  .cta-button {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
    margin-top: 1.2rem;
  }
}

/* 添加文字样式 */
.hero-text h1 {
  font-size: 2.5rem;
  margin-bottom: 0.8rem;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-weight: 600;
  letter-spacing: 0.5px;
  line-height: 1.2;
}

.subtitle {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  font-weight: 500;
  line-height: 1.4;
}

/* 优化过渡效果 */
.hero-text, .parallax-bg {
  transition: transform 0.1s linear, opacity 0.1s linear;
}

/* 内容区域样式 */
.content-section {
  padding: 4rem 2rem;
  background: var(--color-background);
}

/* 技能卡片样式 */
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 0 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.skill-card {
  background: var(--color-surface);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(var(--color-border-rgb), 0.1);
  backdrop-filter: blur(10px);
}

.skill-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.skill-icon-wrapper {
  width: 60px;
  height: 60px;
  background: rgba(var(--color-primary-rgb), 0.1);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;
}

.skill-card:hover .skill-icon-wrapper {
  transform: scale(1.1);
  background: rgba(var(--color-primary-rgb), 0.2);
}

.skill-icon {
  font-size: 2rem;
}

.skill-card h3 {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: var(--color-text);
}

.skill-card p {
  color: var(--color-text-light);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.skill-details {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
}

.skill-tag {
  padding: 0.4rem 0.8rem;
  background: rgba(var(--color-primary-rgb), 0.1);
  border-radius: 20px;
  font-size: 0.9rem;
  color: var(--color-primary);
  transition: all 0.3s ease;
}

.skill-card:hover .skill-tag {
  background: rgba(var(--color-primary-rgb), 0.15);
}

@media (max-width: 768px) {
  .skills-grid {
    grid-template-columns: 1fr;
    padding: 0 1rem;
    gap: 1.5rem;
  }

  .skill-card {
    padding: 1.5rem;
  }

  .skill-icon-wrapper {
    width: 50px;
    height: 50px;
  }

  .skill-icon {
    font-size: 1.5rem;
  }
}

/* 最新动态样式 */
.latest-updates {
  margin: 4rem 0;
}

.latest-updates h2 {
  margin-bottom: 2rem;
  color: var(--color-text);
}

.updates-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 2rem;
}

.update-main {
  background: var(--color-surface);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.update-main:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
}

.update-main .update-image {
  height: 300px;
  overflow: hidden;
}

.update-main .update-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.update-main:hover .update-image img {
  transform: scale(1.05);
}

.update-main .update-content {
  padding: 1.5rem;
}

.update-tag {
  background: var(--color-primary);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.9rem;
  display: inline-block;
  margin-bottom: 1rem;
}

.update-main h3 {
  font-size: 1.5rem;
  margin: 0 0 1rem;
  color: var(--color-text);
}

.update-main p {
  color: var(--color-text);
  opacity: 0.8;
  margin-bottom: 1.5rem;
}

.update-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--color-text);
  opacity: 0.6;
}

.read-more {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: opacity 0.3s ease;
}

.read-more:hover {
  opacity: 0.8;
}

.updates-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.update-item {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 1rem;
  padding: 1rem;
  background: var(--color-surface);
  border-radius: 8px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.update-item:hover {
  transform: translateX(5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.update-item .update-image {
  height: 80px;
  border-radius: 4px;
  overflow: hidden;
}

.update-item .update-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.update-item h4 {
  margin: 0 0 0.5rem;
  font-size: 1.1rem;
  color: var(--color-text);
}

.update-item .date {
  font-size: 0.9rem;
  color: var(--color-text);
  opacity: 0.6;
}

@media (max-width: 768px) {
  .updates-grid {
    grid-template-columns: 1fr;
  }

  .update-main .update-image {
    height: 200px;
  }

  .update-item {
    grid-template-columns: 100px 1fr;
  }
}

.projects-section {
  margin: 4rem 0;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.project-card {
  background: var(--color-surface);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.project-image {
  height: 200px;
  overflow: hidden;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.project-card:hover .project-image img {
  transform: scale(1.05);
}

.project-content {
  padding: 1.5rem;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
}

.tag {
  background: rgba(var(--color-primary-rgb), 0.1);
  color: var(--color-primary);
  padding: 0.25rem 0.75rem;
  border-radius: 15px;
  font-size: 0.9rem;
}

.project-link {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: var(--color-primary);
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background 0.3s ease;
}

.project-link:hover {
  background: var(--color-secondary);
}

.contact-section {
  margin: 4rem auto;
  padding: 0 2rem;
  max-width: 1200px;
}

.contact-section h2 {
  text-align: center;
  margin-bottom: 3rem;
  color: var(--color-text);
}

.contact-container {
  display: flex;
  flex-direction: column;
  gap: 3rem;
  padding: 0 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.contact-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
}

.contact-card {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--color-surface);
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid rgba(var(--color-border-rgb), 0.1);
}

.message-form {
  background: var(--color-surface);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid rgba(var(--color-border-rgb), 0.1);
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  background: rgba(var(--color-primary-rgb), 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-wrapper .icon {
  font-size: 1.8rem;
}

.contact-info h3 {
  margin: 0 0 0.5rem;
  color: var(--color-text);
  font-size: 1.2rem;
}

.contact-info p {
  margin: 0;
  color: var(--color-text);
  opacity: 0.8;
}

.message-form h3 {
  margin: 0 0 1.5rem;
  color: var(--color-text);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.form-group {
  position: relative;
  width: 100%;
}

.form-group.full-width {
  grid-column: 1 / -1;
  margin-top: 0.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.95rem;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-group textarea {
  height: 120px;
  resize: vertical;
  min-height: 120px;
  max-height: 200px;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(var(--color-primary-rgb), 0.1);
}

.submit-btn {
  width: 100%;
  max-width: 200px;
  padding: 0.8rem;
  margin: 0 auto;
  display: block;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: var(--color-secondary);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .contact-container {
    padding: 0 1rem;
    gap: 2rem;
  }

  .message-form {
    padding: 1.5rem;
    width: 100%;
    max-width: 100%;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .form-group {
    width: 100%;
  }

  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 0.8rem 1rem;
    font-size: 0.95rem;
  }

  .submit-btn {
    width: 100%;
    max-width: none;
    padding: 0.8rem;
    font-size: 0.95rem;
  }
}

/* 暗色模式优化 */
@media (prefers-color-scheme: dark) {
  .contact-card,
  .message-form {
    background: rgba(var(--color-surface-rgb), 0.8);
    backdrop-filter: blur(10px);
  }

  .form-group input,
  .form-group textarea {
    background: rgba(var(--color-background-rgb), 0.8);
    border-color: rgba(var(--color-border-rgb), 0.2);
  }
}

.section-container {
  padding: 4rem 0;
  position: relative;
}

/* 添加分隔装饰 */
.section-container:not(:last-child)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    var(--color-border),
    transparent
  );
}

.section-title {
  text-align: center;
  margin-bottom: 3rem;
  color: var(--color-text);
  font-size: 2rem;
  position: relative;
  padding-bottom: 1rem;
}

/* 标题装饰 */
.section-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: var(--color-primary);
  border-radius: 3px;
}

/* 渐入动画 */
.fade-in {
  opacity: 0;
  transform: translateY(30px);
  animation: fadeIn 0.8s ease forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 为不同区块设置不同动画延迟 */
.skills-grid.fade-in {
  animation-delay: 0.2s;
}

.projects-grid.fade-in {
  animation-delay: 0.3s;
}

.updates-grid.fade-in {
  animation-delay: 0.4s;
}

.contact-container.fade-in {
  animation-delay: 0.5s;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .section-container {
    padding: 3rem 0;
  }

  .section-title {
    font-size: 1.8rem;
    margin-bottom: 2rem;
  }
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.2rem;
  }

  .cta-button {
    padding: 0.8rem 1.6rem;
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  .hero-content h1 {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  .section-container {
    padding: 2rem 1rem;
  }

  .skills-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .projects-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .updates-grid {
    grid-template-columns: 1fr;
  }

  .update-main {
    margin-bottom: 1.5rem;
  }

  .updates-list {
    grid-template-columns: 1fr;
  }

  .contact-cards {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}

.update-main,
.update-item {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.update-main:hover,
.update-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.read-more {
  color: var(--color-primary);
  font-weight: 500;
  transition: transform 0.3s ease;
}

.update-main:hover .read-more,
.update-item:hover .read-more {
  transform: translateX(4px);
}

/* 按钮样式 */
.cta-button {
  padding: 0.7rem 1.4rem;
  font-size: 0.95rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  letter-spacing: 0.5px;
  margin-top: 1.5rem;
  box-shadow: 0 4px 15px rgba(var(--color-primary-rgb), 0.3);
}

.cta-button:hover {
  transform: translateY(-2px);
  background-color: var(--color-secondary);
  box-shadow: 0 6px 20px rgba(var(--color-primary-rgb), 0.4);
}

.cta-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 10px rgba(var(--color-primary-rgb), 0.2);
}

/* 响应式调整 */
@media (max-width: 768px) {
  .hero-text {
    padding: 1.2rem 1.5rem;
    width: 85%;
    max-width: 400px;
  }

  .hero-text h1 {
    font-size: 1.8rem;
    margin-bottom: 0.6rem;
  }

  .subtitle {
    font-size: 1rem;
    margin-bottom: 1.2rem;
  }

  .cta-button {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
    margin-top: 1.2rem;
  }
}

/* 添加文字样式 */
.hero-text h1 {
  font-size: 2.5rem;
  margin-bottom: 0.8rem;
  color: #ffffff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  font-weight: 600;
  letter-spacing: 0.5px;
  line-height: 1.2;
}

.subtitle {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: rgba(255, 255, 255, 0.95);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  font-weight: 500;
  line-height: 1.4;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .contact-container {
    padding: 0 1rem;
    gap: 2rem;
  }

  .contact-cards {
    grid-template-columns: 1fr;
    max-width: 100%;
    gap: 1rem;
  }

  .contact-card {
    padding: 1rem;
    gap: 1rem;
    max-width: 320px;
    margin: 0 auto;
    width: 100%;
  }

  .icon-wrapper {
    width: 45px;
    height: 45px;
    flex-shrink: 0;
  }

  .icon-wrapper .icon {
    font-size: 1.5rem;
  }

  .contact-info {
    flex: 1;
    min-width: 0;
  }

  .contact-info h3 {
    font-size: 1.1rem;
    margin-bottom: 0.3rem;
  }

  .contact-info p {
    font-size: 0.95rem;
    word-break: break-all;
  }
}
</style> 