<template>
  <div class="about-container">
    <div class="about-content">
      <LoadingScreen :is-loading="isLoading" />
      <div class="about" :class="{ 'content-loaded': !isLoading }">
        <div class="profile-section">
          <div class="avatar-container">
            <div class="avatar">
              <img src="https://picsum.photos/200" alt="我的头像" />
              <div class="avatar-overlay">
                <div class="social-links">
                  <a href="#" title="GitHub">
                    <svg viewBox="0 0 24 24" class="icon">
                      <path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33c.85 0 1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                    </svg>
                  </a>
                  <a href="#" title="抖音">
                    <svg viewBox="0 0 24 24" class="icon">
                      <path fill="currentColor" d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z"/>
                    </svg>
                  </a>
                  <a href="#" title="掘金">
                    <svg viewBox="0 0 28 28" class="icon">
                      <path fill="currentColor" d="M14.175 5.32L19.615 8.64L21.595 7.52L14.175 3.08L6.755 7.52L8.735 8.64L14.175 5.32Z"/>
                      <path fill="currentColor" d="M14.175 9.68L8.735 13L10.715 14.12L14.175 12.04L17.635 14.12L19.615 13L14.175 9.68Z"/>
                      <path fill="currentColor" d="M14.175 16.36L12.195 17.48L14.175 18.6L16.155 17.48L14.175 16.36Z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <h1>{{ profile.name }}</h1>
          <p class="bio">{{ profile.bio }}</p>
          <div class="profile-stats">
            <div class="stat-item">
              <span class="stat-value">{{ profile.experience }}年</span>
              <span class="stat-label">开发经验</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ profile.projects }}+</span>
              <span class="stat-label">项目经验</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">{{ profile.articles }}+</span>
              <span class="stat-label">技术文章</span>
            </div>
          </div>
        </div>

        <div class="skills-section">
          <h2>技术栈</h2>
          <div class="skills-grid">
            <div 
              v-for="(skill, index) in skills" 
              :key="skill.name" 
              class="skill-item"
              :style="{ '--delay': `${index * 0.1}s` }"
            >
              <h3>{{ skill.name }}</h3>
              <div class="skill-level">
                <div 
                  class="skill-progress"
                  :style="{
                    width: isLoading ? '0%' : skill.level + '%'
                  }"
                >
                  <div class="skill-shine"></div>
                </div>
              </div>
              <span class="skill-percentage">{{ skill.level }}%</span>
            </div>
          </div>
        </div>

        <div class="experience-section">
          <h2>工作经历</h2>
          <div class="timeline">
            <div 
              v-for="exp in experience" 
              :key="exp.company" 
              class="timeline-item"
            >
              <div class="timeline-dot"></div>
              <div class="timeline-content">
                <h3>{{ exp.position }}</h3>
                <h4>{{ exp.company }}</h4>
                <p class="timeline-period">{{ exp.period }}</p>
                <ul class="timeline-achievements">
                  <li v-for="achievement in exp.achievements" :key="achievement">
                    {{ achievement }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="projects-section">
          <h2>个人项目</h2>
          <div class="projects-grid">
            <div 
              v-for="project in projects" 
              :key="project.name"
              class="project-card"
            >
              <img :src="project.image" :alt="project.name">
              <div class="project-info">
                <h3>{{ project.name }}</h3>
                <p>{{ project.description }}</p>
                <div class="project-tags">
                  <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
                </div>
                <div class="project-links">
                  <a :href="project.demo" target="_blank">Demo</a>
                  <a :href="project.github" target="_blank">GitHub</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="interests-section">
          <h2>兴趣爱好</h2>
          <div class="interests-grid">
            <div 
              v-for="interest in interests" 
              :key="interest"
              class="interest-item"
            >
              {{ interest }}
            </div>
          </div>
        </div>

        <div class="contact-section">
          <h2>联系我</h2>
          <div class="contact-info">
            <a href="mailto:contact@example.com" class="contact-item">
              <i class="email-icon"></i>
              contact@example.com
            </a>
            <a href="https://github.com/yourusername" target="_blank" class="contact-item">
              <i class="github-icon"></i>
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import LoadingScreen from '@/components/common/LoadingScreen.vue'

const profile = ref({
  name: '余山郡',
  bio: '热爱技术，热爱生活。前端开发工程师，专注于Vue.js和TypeScript开发。',
  experience: 3,
  projects: 20,
  articles: 15
})

const skills = ref([
  { name: 'Vue.js', level: 90 },
  { name: 'TypeScript', level: 85 },
  { name: 'JavaScript', level: 90 },
  { name: 'HTML/CSS', level: 85 },
  { name: 'Node.js', level: 75 }
])

const interests = ref([
  '编程',
  '读书',
  '摄影',
  '旅行',
  '音乐'
])

const experience = ref([
  {
    position: '高级前端开发工程师',
    company: 'XX科技有限公司',
    period: '2021 - 至今',
    achievements: [
      '负责公司核心产品的前端架构设计和开发',
      '优化前端性能，提升加载速度30%',
      '带领团队完成多个重要项目的开发'
    ]
  },
  {
    position: '前端开发工程师',
    company: 'XX网络科技',
    period: '2019 - 2021',
    achievements: [
      '参与电商平台的开发和维护',
      '实现多个复杂交互功能',
      '编写技术文档和开发规范'
    ]
  }
])

const projects = ref([
  {
    name: '个人博客系统',
    description: '基于Vue3和TypeScript开发的现代化博客系统',
    image: 'https://picsum.photos/400/300',
    tags: ['Vue3', 'TypeScript', 'Node.js'],
    demo: '#',
    github: '#'
  },
  {
    name: '在线商城',
    description: '响应式电商平台，支持多端访问',
    image: 'https://picsum.photos/400/301',
    tags: ['Vue3', 'Vite', 'Express'],
    demo: '#',
    github: '#'
  }
])

const isLoading = ref(true)

onMounted(() => {
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>

<style scoped>
.about-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.about-content {
  background: var(--color-surface);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.about {
  opacity: 0;
  transition: opacity 0.5s ease;
}

.content-loaded {
  opacity: 1;
}

.profile-section {
  text-align: center;
  margin-bottom: 3rem;
}

.avatar-container {
  width: 200px;
  height: 200px;
  margin: 0 auto 2rem;
  position: relative;
  cursor: pointer;
}

.avatar {
  width: 100%;
  height: 100%;
  position: relative;
  border-radius: 50%;
  overflow: hidden;
  transform: translateY(0);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.avatar:hover {
  transform: translateY(-10px) scale(1.05);
  box-shadow: 0 20px 30px rgba(0, 0, 0, 0.2);
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.avatar:hover img {
  transform: scale(1.1);
}

.avatar-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to top,
    rgba(var(--color-primary-rgb), 0.9),
    rgba(var(--color-primary-rgb), 0.5)
  );
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.avatar:hover .avatar-overlay {
  opacity: 1;
}

.social-links {
  display: flex;
  gap: 1.5rem;
  transform: translateY(20px);
  opacity: 0;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.avatar:hover .social-links {
  transform: translateY(0);
  opacity: 1;
}

.social-links a {
  color: white;
  text-decoration: none;
  transition: transform 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  backdrop-filter: blur(4px);
}

.social-links a:hover {
  transform: scale(1.2) rotate(8deg);
  background: rgba(255, 255, 255, 0.2);
}

.icon {
  width: 24px;
  height: 24px;
}

.skills-section,
.interests-section {
  margin-bottom: 3rem;
}

.skills-grid {
  display: grid;
  gap: 1rem;
}

.skill-item {
  background: var(--color-surface);
  padding: 1rem;
  border-radius: 8px;
  color: var(--color-text);
  position: relative;
  opacity: 0;
  transform: translateY(20px);
  animation: slideIn 0.6s ease forwards;
}

.skill-level {
  background: rgba(var(--color-primary-rgb), 0.1);
  height: 10px;
  border-radius: 5px;
  overflow: hidden;
  margin-top: 0.5rem;
  position: relative;
}

.skill-progress {
  background: var(--color-primary);
  height: 100%;
  position: relative;
  overflow: hidden;
  transition: width 1.2s ease;
  width: 0;
}

.skill-shine {
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  animation: shine 2s infinite;
}

.skill-percentage {
  position: absolute;
  right: 1rem;
  top: 1rem;
  font-size: 0.9rem;
  opacity: 0.8;
}

@keyframes shine {
  0% {
    left: -100%;
  }
  50%, 100% {
    left: 200%;
  }
}

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.skill-item:nth-child(1) { animation-delay: 0.1s; }
.skill-item:nth-child(2) { animation-delay: 0.2s; }
.skill-item:nth-child(3) { animation-delay: 0.3s; }
.skill-item:nth-child(4) { animation-delay: 0.4s; }
.skill-item:nth-child(5) { animation-delay: 0.5s; }

.interests-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.interest-item {
  background: var(--color-primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
}

.profile-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--color-primary);
  display: block;
}

.stat-label {
  font-size: 0.9rem;
  opacity: 0.8;
}

.timeline {
  position: relative;
  margin: 2rem 0;
  padding-left: 2rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--color-primary);
  opacity: 0.2;
}

.timeline-item {
  position: relative;
  margin-bottom: 2rem;
  padding-left: 1rem;
}

.timeline-dot {
  position: absolute;
  left: -2.1rem;
  top: 0.5rem;
  width: 1rem;
  height: 1rem;
  background: var(--color-primary);
  border-radius: 50%;
}

.timeline-content {
  background: var(--color-surface);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.timeline-period {
  color: var(--color-primary);
  font-size: 0.9rem;
  margin: 0.5rem 0;
}

.timeline-achievements {
  list-style: none;
  padding: 0;
  margin: 1rem 0 0;
}

.timeline-achievements li {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
}

.timeline-achievements li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--color-primary);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.project-card {
  background: var(--color-surface);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.project-card:hover {
  transform: translateY(-5px);
}

.project-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.project-info {
  padding: 1.5rem;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
}

.project-tags span {
  background: rgba(var(--color-primary-rgb), 0.1);
  color: var(--color-primary);
  padding: 0.3rem 0.8rem;
  border-radius: 15px;
  font-size: 0.9rem;
}

.project-links {
  display: flex;
  gap: 1rem;
}

.project-links a {
  color: var(--color-primary);
  text-decoration: none;
}

.contact-section {
  text-align: center;
}

.contact-info {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text);
  text-decoration: none;
  transition: color 0.3s ease;
}

.contact-item:hover {
  color: var(--color-primary);
}

.skill-progress {
  animation: progressIn 1.2s ease forwards;
  animation-delay: var(--delay);
}

@keyframes progressIn {
  from {
    width: 0;
  }
}

@media (max-width: 768px) {
  .about-container {
    padding: 1rem;
  }
  
  .about-content {
    padding: 1.5rem;
  }

  .avatar-container {
    width: 150px;
    height: 150px;
  }

  .skills-grid {
    gap: 0.8rem;
  }

  .skill-item {
    padding: 0.8rem;
  }

  .interests-grid {
    gap: 0.8rem;
  }

  .interest-item {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }

  .social-links a {
    width: 35px;
    height: 35px;
  }

  .icon {
    width: 20px;
    height: 20px;
  }

  .profile-stats {
    gap: 1rem;
  }

  .stat-value {
    font-size: 1.5rem;
  }

  .timeline {
    padding-left: 1.5rem;
  }

  .projects-grid {
    grid-template-columns: 1fr;
  }

  .contact-info {
    flex-direction: column;
    gap: 1rem;
  }
}
</style> 