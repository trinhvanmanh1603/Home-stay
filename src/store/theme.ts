import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'

export const useThemeStore = defineStore('theme', () => {
  const isDark = useLocalStorage<boolean>('dark-mode', false)

  const toggleTheme = (): void => {
    isDark.value = !isDark.value
    updateTheme()
  }

  const updateTheme = (): void => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const initTheme = (): void => {
    updateTheme()
  }

  return {
    isDark,
    toggleTheme,
    initTheme
  }
})
