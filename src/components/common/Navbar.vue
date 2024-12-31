<template>
  <nav class="navbar">
    <div class="navbar-container">
      <router-link to="/" class="logo">
        云边
      </router-link>

      <!-- 移动端菜单按钮 -->
      <button class="menu-toggle" @click="toggleMenu" aria-label="Toggle menu">
        <span class="menu-icon" :class="{ 'is-active': isMenuOpen }"></span>
      </button>

      <!-- 导航链接 -->
      <div class="nav-content" :class="{ 'is-open': isMenuOpen }">
        <div class="nav-links">
          <router-link to="/" class="nav-link" @click="closeMenu">首页</router-link>
          <router-link to="/articles" class="nav-link" @click="closeMenu">文章</router-link>
          <router-link to="/gallery" class="nav-link" @click="closeMenu">图集</router-link>
          <router-link to="/about" class="nav-link" @click="closeMenu">关于</router-link>
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
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(10px);
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
  z-index: 101;
}

.menu-icon {
  position: relative;
  width: 24px;
  height: 2px;
  background: var(--color-text);
  transition: all 0.3s ease;
}

.menu-icon::before,
.menu-icon::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background: var(--color-text);
  transition: all 0.3s ease;
}

.menu-icon::before {
  top: -8px;
}

.menu-icon::after {
  bottom: -8px;
}

.menu-icon.is-active {
  background: transparent;
}

.menu-icon.is-active::before {
  transform: rotate(45deg);
  top: 0;
}

.menu-icon.is-active::after {
  transform: rotate(-45deg);
  bottom: 0;
}

@media (max-width: 768px) {
  .navbar-container {
    padding: 1rem;
  }

  .menu-toggle {
    display: block;
  }

  .nav-content {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--color-surface);
    flex-direction: column;
    justify-content: center;
    padding: 2rem;
    transform: translateX(100%);
    transition: transform 0.3s ease;
    z-index: 100;
  }

  .nav-content.is-open {
    transform: translateX(0);
  }

  .nav-links {
    flex-direction: column;
    align-items: center;
    gap: 2rem;
  }

  .nav-link {
    font-size: 1.2rem;
  }
}
</style> 