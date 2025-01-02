import { ref, watch } from 'vue'

const THEME_KEY = 'preferred-theme'

export function useTheme() {
  // 从 localStorage 获取保存的主题，如果没有则使用系统主题
  const getInitialTheme = (): boolean => {
    const savedTheme = localStorage.getItem(THEME_KEY)
    if (savedTheme !== null) {
      return savedTheme === 'dark'
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  const isDark = ref(getInitialTheme())

  // 更新 DOM 中的主题类和 CSS 变量
  const updateTheme = (dark: boolean) => {
    document.documentElement.classList.toggle('dark', dark)
    // 设置主题色
    if (dark) {
      document.documentElement.style.setProperty('--color-background', '#1a1a1a')
      document.documentElement.style.setProperty('--color-surface', '#242424')
      document.documentElement.style.setProperty('--color-text', '#ffffff')
      document.documentElement.style.setProperty('--color-border', '#333333')
    } else {
      document.documentElement.style.setProperty('--color-background', '#ffffff')
      document.documentElement.style.setProperty('--color-surface', '#f8f8f8')
      document.documentElement.style.setProperty('--color-text', '#333333')
      document.documentElement.style.setProperty('--color-border', '#e5e5e5')
    }
  }

  // 监听主题变化并保存到 localStorage
  watch(isDark, (newValue) => {
    localStorage.setItem(THEME_KEY, newValue ? 'dark' : 'light')
    updateTheme(newValue)
  }, { immediate: true })

  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  // 初始化主题
  updateTheme(isDark.value)

  return {
    isDark,
    toggleTheme
  }
}

export const lightTheme = {
  // 调整亮色主题的颜色
  '--color-background': '#f8f9fa',  // 更柔和的背景色
  '--color-surface': '#ffffff',
  '--color-primary': '#3b7cff',    // 更深的主色调
  '--color-secondary': '#2563eb',  // 更深的次要色
  '--color-text': '#2c3e50',      // 更深的文字颜色
  '--color-text-secondary': '#64748b', // 更深的次要文字颜色
  '--color-border': '#e2e8f0',    // 更柔和的边框色
  '--color-error': '#ef4444',
  '--color-success': '#22c55e',
  '--color-warning': '#f59e0b',
  '--color-info': '#3b82f6',
  
  // RGB 值（用于透明度计算）
  '--color-primary-rgb': '59, 124, 255',
  '--color-text-rgb': '44, 62, 80',
  '--color-surface-rgb': '255, 255, 255',
  
  // 覆盖层颜色
  '--color-overlay': 'rgba(0, 0, 0, 0.5)',
  '--color-surface-overlay': 'rgba(255, 255, 255, 0.9)'
}

// 暗色主题保持不变
export const darkTheme = {
  // ... 暗色主题配置保持不变 ...
} 