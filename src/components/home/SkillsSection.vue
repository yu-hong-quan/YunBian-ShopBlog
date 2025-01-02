<template>
  <section 
    class="skills-section" 
    v-observe-visibility="{ 
      callback: onSectionVisible,
      once: true 
    }"
  >
    <h2 class="section-title">技能专长</h2>
    <div class="skills-container">
      <!-- 前端开发 -->
      <div class="skill-category" :class="{ 'fade-in': isVisible }" style="--delay: 0s">
        <div class="category-header">
          <svg class="category-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 18.178l-4.62-1.256-.328-3.544h2.27l.158 1.844 2.52.667 2.52-.667.26-2.866H6.96l-.635-6.678h11.35l-.227 2.21H8.822l.204 2.256h8.217l-.624 6.778L12 18.178z"/>
          </svg>
          <h3>前端开发</h3>
        </div>
        <div class="skills-grid">
          <div class="skill-item" v-for="skill in frontendSkills" :key="skill.name">
            <div class="skill-info">
              <img :src="skill.icon" :alt="skill.name" class="skill-icon">
              <span class="skill-name">{{ skill.name }}</span>
            </div>
            <div class="skill-bar">
              <div class="skill-progress" :style="{ width: `${skill.proficiency}%` }"></div>
            </div>
            <span class="skill-percentage">{{ skill.proficiency }}%</span>
          </div>
        </div>
      </div>

      <!-- 后端开发 -->
      <div class="skill-category" :class="{ 'fade-in': isVisible }" style="--delay: 0.2s">
        <div class="category-header">
          <svg class="category-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M20 4v13.2L13.2 11l-.4.3 6.4 7.7H4v-15h16M3 3c-.6 0-1 .4-1 1v16c0 .6.4 1 1 1h17c.6 0 1-.4 1-1V3c0-.6-.4-1-1-1H3z"/>
          </svg>
          <h3>后端开发</h3>
        </div>
        <div class="skills-grid">
          <div class="skill-item" v-for="skill in backendSkills" :key="skill.name">
            <div class="skill-info">
              <img :src="skill.icon" :alt="skill.name" class="skill-icon">
              <span class="skill-name">{{ skill.name }}</span>
            </div>
            <div class="skill-bar">
              <div class="skill-progress" :style="{ width: `${skill.proficiency}%` }"></div>
            </div>
            <span class="skill-percentage">{{ skill.proficiency }}%</span>
          </div>
        </div>
      </div>

      <!-- 其他技能 -->
      <div class="skill-category" :class="{ 'fade-in': isVisible }" style="--delay: 0.4s">
        <div class="category-header">
          <svg class="category-icon" viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z"/>
          </svg>
          <h3>其他技能</h3>
        </div>
        <div class="skills-grid">
          <div class="skill-item" v-for="skill in otherSkills" :key="skill.name">
            <div class="skill-info">
              <img :src="skill.icon" :alt="skill.name" class="skill-icon">
              <span class="skill-name">{{ skill.name }}</span>
            </div>
            <div class="skill-bar">
              <div class="skill-progress" :style="{ width: `${skill.proficiency}%` }"></div>
            </div>
            <span class="skill-percentage">{{ skill.proficiency }}%</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useObserveVisibility } from '@/composables/useObserveVisibility'

const frontendSkills = ref([
  { name: 'Vue.js', proficiency: 90, icon: '/src/assets/icons/vue.svg' },
  { name: 'TypeScript', proficiency: 85, icon: '/src/assets/icons/typescript.svg' },
  { name: 'React', proficiency: 80, icon: '/src/assets/icons/react.svg' },
  { name: 'CSS3', proficiency: 85, icon: '/src/assets/icons/css.svg' }
])

const backendSkills = ref([
  { name: 'Node.js', proficiency: 85, icon: '/src/assets/icons/nodejs.svg' },
  { name: 'Python', proficiency: 75, icon: '/src/assets/icons/python.svg' },
  { name: 'Java', proficiency: 70, icon: '/src/assets/icons/java.svg' },
  { name: 'MySQL', proficiency: 80, icon: '/src/assets/icons/mysql.svg' }
])

const otherSkills = ref([
  { name: 'Git', proficiency: 85, icon: '/src/assets/icons/git.svg' },
  { name: 'Docker', proficiency: 75, icon: '/src/assets/icons/docker.svg' },
  { name: 'Linux', proficiency: 80, icon: '/src/assets/icons/linux.svg' },
  { name: 'AWS', proficiency: 70, icon: '/src/assets/icons/aws.svg' }
])

const isVisible = ref(false)

const onSectionVisible = (visible: boolean) => {
  if (visible) {
    isVisible.value = true
  }
}

const { vObserveVisibility } = useObserveVisibility()
</script>

<style scoped>
.skills-section {
  padding: 4rem 0;
  max-width: 1200px;
  margin: 0 auto;
}

.section-title {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 3rem;
  color: var(--color-text);
}

.skills-container {
  display: grid;
  gap: 2rem;
}

.skill-category {
  background: var(--color-surface);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  transition-delay: var(--delay);
}

.category-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.category-icon {
  width: 24px;
  height: 24px;
  color: var(--color-primary);
}

.category-header h3 {
  font-size: 1.5rem;
  color: var(--color-text);
  margin: 0;
}

.skills-grid {
  display: grid;
  gap: 1.5rem;
}

.skill-item {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
}

.skill-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  min-width: 120px;
}

.skill-icon {
  width: 24px;
  height: 24px;
}

.skill-name {
  font-size: 1rem;
  color: var(--color-text);
}

.skill-bar {
  height: 8px;
  background: var(--color-border);
  border-radius: 4px;
  overflow: hidden;
}

.skill-progress {
  height: 100%;
  background: var(--color-primary);
  border-radius: 4px;
  transition: width 1s ease-in-out;
}

.skill-percentage {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  min-width: 45px;
  text-align: right;
}

.skill-category.fade-in {
  opacity: 1;
  transform: translateY(0);
}

/* 移动端适配 */
@media (max-width: 768px) {
  .skills-section {
    padding: 2rem 1rem;
  }

  .section-title {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }

  .skill-category {
    padding: 1.5rem;
  }

  .category-header h3 {
    font-size: 1.2rem;
  }

  .skill-info {
    min-width: 100px;
  }

  .skill-name {
    font-size: 0.9rem;
  }

  .skill-percentage {
    font-size: 0.8rem;
  }
}

/* 暗色主题适配 */
:root.dark .skill-category {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

:root.dark .skill-bar {
  background: rgba(255, 255, 255, 0.1);
}
</style> 