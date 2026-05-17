import { onMounted, onUnmounted, nextTick } from 'vue'

export function useScrollReveal() {
  let observer: IntersectionObserver | null = null

  function observe() {
    document.querySelectorAll('[data-reveal]:not(.revealed)').forEach(el => observer?.observe(el))
  }

  onMounted(async () => {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer?.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.08 }
    )

    // Wait for child components to mount
    await nextTick()
    observe()
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
  })
}
