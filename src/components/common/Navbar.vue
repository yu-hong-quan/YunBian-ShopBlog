<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="logo">
        云边
      </router-link>

      <!-- 移动端菜单按钮 -->
      <button class="menu-toggle" @click="toggleMenu" aria-label="菜单">
        <div class="menu-icon" :class="{ 'is-active': isMenuOpen }">
          <!-- 使用 SVG 图标 -->
          <svg v-if="!isMenuOpen" viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
          </svg>
          <svg v-else viewBox="0 0 24 24" width="24" height="24">
            <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </div>
      </button>

      <!-- 导航链接 -->
      <div class="nav-content" :class="{ 'is-open': isMenuOpen }">
        <div class="nav-links">
          <router-link to="/" class="nav-link" @click="closeMenu">首页</router-link>
          <router-link to="/articles" class="nav-link" @click="closeMenu">文章分享</router-link>
          <router-link to="/gallery" class="nav-link" @click="closeMenu">图集分享</router-link>
          <router-link to="/about" class="nav-link" @click="closeMenu">关于作者</router-link>
        </div>

        <div class="nav-actions">
          <button class="theme-toggle" @click="toggleTheme">
            {{ isDark ? '🌞' : '🌙' }}
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

const closeMenu = () => {
  isMenuOpen.value = false
  document.body.style.overflow = ''
}
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(10px);
  height: 64px;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-primary);
  text-decoration: none;
  letter-spacing: 0.5px;
  z-index: 101;
}

.nav-content {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: var(--color-text);
  text-decoration: none;
  font-size: 1rem;
  transition: all 0.3s ease;
  position: relative;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--color-primary);
  transition: width 0.3s ease;
}

.nav-link:hover::after,
.nav-link.router-link-active::after {
  width: 100%;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.theme-toggle {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.theme-toggle:hover {
  background: rgba(var(--color-primary-rgb), 0.1);
  transform: rotate(360deg);
}

.menu-toggle {
  display: none;
  padding: 8px;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 101;
  color: var(--color-text);
}

.menu-icon {
  width: 24px;
  height: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.menu-icon span {
  display: block;
  width: 100%;
  height: 2px;
  background-color: var(--color-text);
  transition: all 0.3s ease;
  transform-origin: left center;
}

.menu-icon.is-active span:first-child {
  transform: rotate(45deg);
}

.menu-icon.is-active span:nth-child(2) {
  opacity: 0;
}

.menu-icon.is-active span:last-child {
  transform: rotate(-45deg);
}

@media (max-width: 768px) {
  .navbar {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 56px;
    background: var(--color-surface);
    border-bottom: 1px solid var(--color-border);
    backdrop-filter: blur(10px);
    z-index: 1000;
  }

  .navbar-container {
    padding: 0 1rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .menu-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
  }

  .menu-icon svg {
    transition: transform 0.3s ease;
  }

  .menu-icon.is-active svg {
    transform: rotate(180deg);
  }

  .menu-icon {
    width: 38px;
    height: 26px;
  }

  .menu-icon span {
    position: absolute;
    width: 24px;
    height: 2px;
    background-color: var(--color-text);
    transition: all 0.3s ease;
  }

  .menu-icon span:first-child {
    top: 0;
  }

  .menu-icon span:nth-child(2) {
    top: 8px;
  }

  .menu-icon span:last-child {
    top: 16px;
  }

  .menu-icon.is-active span:first-child {
    transform: rotate(45deg);
    top: 8px;
  }

  .menu-icon.is-active span:nth-child(2) {
    opacity: 0;
  }

  .menu-icon.is-active span:last-child {
    transform: rotate(-45deg);
    top: 8px;
  }

  .nav-content {
    position: fixed;
    top: 56px; /* 导航栏高度 */
    left: 0;
    width: 100%;
    height: calc(100vh - 56px);
    background: var(--color-surface);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2rem;
    transform: translateY(-100%);
    transition: transform 0.3s ease;
    z-index: 999;
    opacity: 0;
    visibility: hidden;
  }

  .nav-content.is-open {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .nav-links {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    width: 100%;
  }

  .nav-link {
    font-size: 1.2rem;
    padding: 1rem;
    width: 100%;
    text-align: center;
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .nav-link:hover,
  .nav-link.router-link-active {
    background: rgba(var(--color-primary-rgb), 0.1);
    color: var(--color-primary);
  }

  /* 修复内容区域的上边距 */
  main {
    padding-top: 56px;
  }
}
</style> 