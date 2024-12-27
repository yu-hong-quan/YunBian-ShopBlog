import { ref, watch } from 'vue'
import { lightTheme, darkTheme, type Theme } from '@/styles/theme'

const currentTheme = ref<'light' | 'dark'>(
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
)

export function useTheme() {
  const theme = ref<Theme>(currentTheme.value === 'dark' ? darkTheme : lightTheme)

  const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light'
    theme.value = currentTheme.value === 'dark' ? darkTheme : lightTheme
    document.documentElement.setAttribute('data-theme', currentTheme.value)
    localStorage.setItem('theme', currentTheme.value)
  }

  // 初始化主题
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      currentTheme.value = savedTheme
      theme.value = savedTheme === 'dark' ? darkTheme : lightTheme
    }
    document.documentElement.setAttribute('data-theme', currentTheme.value)
  }

  // 监听系统主题变化
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      currentTheme.value = e.matches ? 'dark' : 'light'
      theme.value = e.matches ? darkTheme : lightTheme
      document.documentElement.setAttribute('data-theme', currentTheme.value)
    }
  })

  return {
    theme,
    currentTheme,
    toggleTheme,
    initTheme
  }
} 