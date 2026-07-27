// Dynamically load & configure Google Analytics 4 (GA4) and Meta (Facebook) Pixel

declare global {
  interface Window {
    dataLayer?: any[]
    gtag?: (...args: any[]) => void
    fbq?: (...args: any[]) => void
    _fbq?: any
  }
}

const GA_MEASUREMENT_ID = (import.meta.env.VITE_GA_MEASUREMENT_ID || '').trim()
const META_PIXEL_ID = (import.meta.env.VITE_META_PIXEL_ID || '').trim()

let isInitialized = false

export function initAnalytics() {
  if (isInitialized || typeof window === 'undefined') return
  isInitialized = true

  // 1. Initialize Google Analytics 4 if Measurement ID exists
  if (GA_MEASUREMENT_ID) {
    try {
      const script = document.createElement('script')
      script.async = true
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
      document.head.appendChild(script)

      window.dataLayer = window.dataLayer || []
      window.gtag = function () {
        window.dataLayer?.push(arguments)
      }
      window.gtag('js', new Date())
      window.gtag('config', GA_MEASUREMENT_ID, {
        send_page_view: false, // We manually send pageviews on route change
      })
      console.log('[Analytics] GA4 initialized with ID:', GA_MEASUREMENT_ID)
    } catch (err) {
      console.warn('[Analytics] Failed to initialize GA4:', err)
    }
  }

  // 2. Initialize Meta Pixel if Pixel ID exists
  if (META_PIXEL_ID) {
    try {
      /* eslint-disable */
      ;(function (f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
        if (f.fbq) return
        n = f.fbq = function () {
          n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
        }
        if (!f._fbq) f._fbq = n
        n.push = n
        n.loaded = !0
        n.version = '2.0'
        n.queue = []
        t = b.createElement(e)
        t.async = !0
        t.src = v
        s = b.getElementsByTagName(e)[0]
        s.parentNode.insertBefore(t, s)
      })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
      /* eslint-enable */

      if (window.fbq) {
        window.fbq('init', META_PIXEL_ID)
        console.log('[Analytics] Meta Pixel initialized with ID:', META_PIXEL_ID)
      }
    } catch (err) {
      console.warn('[Analytics] Failed to initialize Meta Pixel:', err)
    }
  }
}

/**
 * Track page view on route change
 */
export function trackPageView(pagePath?: string) {
  const path = pagePath || window.location.pathname

  // GA4 Pageview
  if (GA_MEASUREMENT_ID && window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: path,
      page_title: document.title,
    })
  }

  // Meta Pixel Pageview
  if (META_PIXEL_ID && window.fbq) {
    window.fbq('track', 'PageView')
  }
}

/**
 * Track custom event (e.g., 'CreateInvitation', 'Purchase', 'Register')
 */
export function trackEvent(eventName: string, params: Record<string, any> = {}) {
  // GA4 Event
  if (GA_MEASUREMENT_ID && window.gtag) {
    window.gtag('event', eventName, params)
  }

  // Meta Pixel Event
  if (META_PIXEL_ID && window.fbq) {
    window.fbq('trackCustom', eventName, params)
  }
}
