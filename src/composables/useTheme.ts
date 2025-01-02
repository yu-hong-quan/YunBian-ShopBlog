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