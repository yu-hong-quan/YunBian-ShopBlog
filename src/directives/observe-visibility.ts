import type { DirectiveBinding } from 'vue'

interface ObserveVisibilityBinding {
  callback: (isVisible: boolean) => void
  once?: boolean
}

export const ObserveVisibility = {
  mounted(el: HTMLElement, binding: DirectiveBinding<ObserveVisibilityBinding>) {
    const observer = new IntersectionObserver(
      (entries) => {
        const isVisible = entries[0].isIntersecting
        binding.value.callback(isVisible)
        
        if (binding.value.once && isVisible) {
          observer.disconnect()
        }
      },
      {
        threshold: 0.1
      }
    )

    observer.observe(el)

    // 保存 observer 实例以便后续清理
    ;(el as any)._observer = observer
  },

  unmounted(el: HTMLElement) {
    if ((el as any)._observer) {
      (el as any)._observer.disconnect()
    }
  }
} 