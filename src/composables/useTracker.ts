import api from '@/services/api'
import { onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'

export function useTracker() {
  const trackPage = async (page: string) => {
    try {
      await api.post('/track', {
        type: 'pageview',
        page,
        referrer: document.referrer || null,
      })
    } catch (err) {
      console.warn('Ghi nhận pageview thất bại:', err)
    }
  }

  const trackEvent = async (
    eventType: string,
    module?: string,
    meta?: Record<string, unknown>
  ) => {
    try {
      await api.post('/track', {
        type: 'event',
        event_type: eventType,
        module,
        meta,
      })
    } catch (err) {
      console.warn('Ghi nhận event thất bại:', err)
    }
  }

  const pingHeartbeat = async (page: string) => {
    try {
      await api.post('/heartbeat', { page })
    } catch (err) {
      // Bỏ qua log lỗi để tránh nhiễu console
    }
  }

  return {
    trackPage,
    trackEvent,
    pingHeartbeat,
  }
}

export function useOnlineTracker() {
  const route = useRoute()
  const { trackPage, pingHeartbeat } = useTracker()
  let intervalId: any = null

  const startHeartbeat = (pagePath: string) => {
    stopHeartbeat()
    pingHeartbeat(pagePath)
    intervalId = setInterval(() => {
      pingHeartbeat(pagePath)
    }, 30000) // Mỗi 30 giây
  }

  const stopHeartbeat = () => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  onMounted(() => {
    const currentPath = route.path
    trackPage(currentPath)
    startHeartbeat(currentPath)
  })

  onUnmounted(() => {
    stopHeartbeat()
  })

  watch(
    () => route.path,
    (newPath) => {
      trackPage(newPath)
      startHeartbeat(newPath)
    }
  )
}
