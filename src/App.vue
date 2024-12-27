<template>
  <div class="app-container">
    <nav class="navbar">
      <div class="nav-brand">
        <router-link to="/" class="logo">云边小铺博客</router-link>
      </div>
      
      <!-- PC端导航链接 -->
      <div class="nav-links-desktop">
        <router-link to="/" class="nav-item">首页</router-link>
        <router-link to="/about" class="nav-item">关于作者</router-link>
        <router-link to="/articles" class="nav-item">文章分享</router-link>
        <router-link to="/gallery" class="nav-item">图集分享</router-link>
      </div>

      <!-- 移动端导航链接 -->
      <div class="nav-links" :class="{ 'open': isMenuOpen }">
        <div class="nav-links-container">
          <div class="mobile-header">
            <h2>导航菜单</h2>
          </div>
          <div class="mobile-nav-items">
            <router-link to="/" class="nav-item" @click="closeMenu">
              <span class="nav-icon">🏠</span>
              <span class="nav-text">首页</span>
            </router-link>
            <router-link to="/about" class="nav-item" @click="closeMenu">
              <span class="nav-icon">👤</span>
              <span class="nav-text">关于作者</span>
            </router-link>
            <router-link to="/articles" class="nav-item" @click="closeMenu">
              <span class="nav-icon">📚</span>
              <span class="nav-text">文章分享</span>
            </router-link>
            <router-link to="/gallery" class="nav-item" @click="closeMenu">
              <span class="nav-icon">🖼️</span>
              <span class="nav-text">图集分享</span>
            </router-link>
          </div>
          <div class="mobile-footer">
            <button class="theme-toggle-mobile" @click="toggleTheme">
              {{ currentTheme === 'light' ? '🌙 切换到暗色模式' : '☀️ 切换到亮色模式' }}
            </button>
          </div>
        </div>
      </div>

      <div class="nav-right">
        <button class="theme-toggle" @click="toggleTheme">
          {{ currentTheme === 'light' ? '🌙' : '☀️' }}
        </button>
        <button class="menu-toggle" @click="toggleMenu" :class="{ 'active': isMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script lang="ts" setup>
import { useTheme } from '@/composables/useTheme'
import { onMounted, watch, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const { currentTheme, toggleTheme, initTheme } = useTheme()
const route = useRoute()
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  // 当菜单打开时禁止滚动
  document.body.style.overflow = isMenuOpen.value ? 'hidden' : ''
}

const closeMenu = () => {
  isMenuOpen.value = false
  document.body.style.overflow = ''
}

// 监听路由变化时关闭菜单
watch(
  () => route.path,
  () => {
    closeMenu()
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    })
  },
  { immediate: true }
)

onMounted(() => {
  initTheme()
})
</script>

<style>
@import '@/styles/global.css';

.app-container {
  min-height: 100vh;
  padding-top: 70px;
}

.navbar {
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-surface);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  background-color: rgba(var(--color-surface-rgb), 0.8);
}

.nav-brand {
  flex-shrink: 0;
}

.logo {
  font-size: 1.3rem;
  font-weight: bold;
  color: var(--color-primary);
  text-decoration: none;
  letter-spacing: 1px;
  white-space: nowrap;
}

.nav-links {
  display: none; /* 默认隐藏移动端导航 */
}

.nav-item {
  padding: 0.5rem 1rem;
  color: var(--color-text);
  text-decoration: none;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
}

.nav-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background-color: var(--color-primary);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-item:hover::after,
.nav-item.router-link-active::after {
  width: 80%;
}

.nav-item:hover {
  color: var(--color-primary);
  background-color: rgba(var(--color-primary-rgb), 0.1);
}

.nav-item.router-link-active {
  color: var(--color-primary);
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.theme-toggle {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  background-color: rgba(var(--color-primary-rgb), 0.1);
  transform: rotate(15deg);
}

/* PC端导航样式 */
.nav-links-desktop {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin: 0 auto;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar {
    padding: 0 1rem;
    height: 60px;
    display: flex;
    align-items: center;
  }

  .nav-right {
    height: 60px;
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .nav-links-desktop {
    display: none; /* 隐藏PC端导航 */
  }

  .nav-links {
    display: flex; /* 显示移动端导航 */
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100vh;
    background-color: var(--color-surface);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 1000;
    padding: 0;
  }

  .nav-item {
    flex: 1;
    text-align: center;
    font-size: 0.9rem;
  }

  .nav-item::after {
    display: none;
  }

  .app-container {
    padding-top: 60px;
    padding-bottom: 60px;
  }

  .logo {
    font-size: 1.1rem;
  }

  .nav-links::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.3);
    visibility: hidden;
    transition: visibility 0.3s ease;
    z-index: -1;
    backdrop-filter: blur(4px);
  }

  .nav-links.open::before {
    visibility: visible;
  }

  .menu-toggle {
    display: flex;
    order: 1;
    height: 20px;
    width: 30px;
    position: relative;
    z-index: 1002;
  }

  .menu-toggle.active {
    position: fixed;
    right: 1.5rem;
    top: 1.5rem;
  }

  .mobile-header {
    padding: 1.5rem;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1px solid var(--color-border);
    min-height: 70px;
  }

  .mobile-header h2 {
    margin: 0;
    font-size: 1.2rem;
    color: var(--color-text);
    line-height: 20px;
  }

  .close-menu {
    display: none;
  }
}

/* 汉堡菜单按钮样式 */
.menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1001;
  margin-left: 1rem;
}

.menu-toggle span {
  width: 100%;
  height: 2px;
  background-color: var(--color-text);
  transition: all 0.3s ease;
}

.menu-toggle.active span:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}

.menu-toggle.active span:nth-child(2) {
  opacity: 0;
}

.menu-toggle.active span:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}

@media (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }

  .nav-links {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100vh;
    background-color: var(--color-surface);
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 1000;
    padding: 0;
    display: flex;
  }

  .nav-links-container {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--color-surface);
  }

  .mobile-nav-items {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .mobile-header {
    padding: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--color-border);
    min-height: 70px;
  }

  .mobile-footer {
    padding: 1.5rem;
    border-top: 1px solid var(--color-border);
    min-height: 90px;
  }

  .nav-links::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.3);
    visibility: hidden;
    transition: visibility 0.3s ease;
    z-index: -1;
    backdrop-filter: blur(4px);
  }

  .nav-links.open::before {
    visibility: visible;
  }

  .mobile-header h2 {
    margin: 0;
    font-size: 1.2rem;
    color: var(--color-text);
  }

  .close-menu {
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--color-text);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .close-menu:hover {
    background-color: rgba(var(--color-primary-rgb), 0.1);
  }

  .mobile-nav-items {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
  }

  .nav-item {
    display: flex;
    align-items: center;
    padding: 1rem 1.2rem;
    margin-bottom: 0.8rem;
    border-radius: 12px;
    background-color: var(--color-background);
    transition: all 0.3s ease;
  }

  .nav-icon {
    font-size: 1.2rem;
    margin-right: 1rem;
    opacity: 0.8;
  }

  .nav-text {
    font-size: 1rem;
    font-weight: 500;
  }

  .nav-item:hover {
    transform: translateX(8px);
    background-color: rgba(var(--color-primary-rgb), 0.1);
  }

  .nav-item.router-link-active {
    background-color: var(--color-primary);
    color: white;
  }

  .mobile-footer {
    padding: 1.5rem;
    border-top: 1px solid var(--color-border);
  }

  .theme-toggle-mobile {
    width: 100%;
    padding: 1rem;
    border: none;
    border-radius: 12px;
    background-color: var(--color-background);
    color: var(--color-text);
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .theme-toggle-mobile:hover {
    background-color: rgba(var(--color-primary-rgb), 0.1);
  }

  .nav-links.open {
    transform: translateX(0);
  }

  /* 动画效果 */
  .nav-links.open .nav-item {
    animation: slideIn 0.3s ease forwards;
    opacity: 0;
  }

  .nav-links.open .nav-item:nth-child(1) { animation-delay: 0.1s; }
  .nav-links.open .nav-item:nth-child(2) { animation-delay: 0.2s; }
  .nav-links.open .nav-item:nth-child(3) { animation-delay: 0.3s; }
  .nav-links.open .nav-item:nth-child(4) { animation-delay: 0.4s; }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .mobile-nav-items .nav-item {
    background-color: rgba(var(--color-surface-rgb), 0.5);
  }

  .theme-toggle-mobile {
    background-color: rgba(var(--color-surface-rgb), 0.5);
  }
}
</style> 