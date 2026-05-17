# [SK-FE-07] Performance & SEO

> Trigger: Public invitation page, landing page, image loading, route setup, meta tags.

---

## Route Lazy Loading

```typescript
// router/index.ts — Tất cả pages phải lazy load
const routes = [
  // Landing (eager — load ngay, above the fold)
  {
    path: '/',
    component: () => import('@/pages/landing/HomePage.vue'),
    meta: { layout: 'landing' },
  },

  // Auth pages (lazy)
  {
    path: '/login',
    component: () => import('@/pages/auth/LoginPage.vue'),
    meta: { layout: 'auth', guest: true },
  },

  // App pages (lazy + requiresAuth)
  {
    path: '/app/editor/:uuid',
    component: () => import('@/pages/app/EditorPage.vue'),
    meta: { layout: 'editor', requiresAuth: true },
  },

  // Public invitation (lazy, KHÔNG requiresAuth)
  {
    path: '/i/:slug',
    component: () => import('@/pages/public/InvitationViewPage.vue'),
    meta: { layout: 'public' },
  },
]
```

---

## Image Lazy Loading

```vue
<!-- Dùng loading="lazy" cho tất cả img không phải above-the-fold -->
<img
  :src="image.url"
  :alt="image.caption || ''"
  loading="lazy"
  decoding="async"
  class="h-full w-full object-cover"
/>

<!-- Với Cloudinary: dùng URL transformation để tối ưu size -->
<img
  :src="getOptimizedUrl(image.url, 800)"
  loading="lazy"
/>

<!-- Composable -->
```

```typescript
// utils/cloudinaryUrl.ts
export function getOptimizedUrl(url: string, width: number): string {
  // Transform Cloudinary URL để resize
  return url.replace(
    '/upload/',
    `/upload/w_${width},q_auto,f_auto/`
  )
}

export function getThumbnailUrl(url: string): string {
  return url.replace('/upload/', '/upload/w_400,h_300,c_fill,q_auto,f_auto/')
}
```

---

## SEO Meta Tags (useHead)

```typescript
// Cài @vueuse/head hoặc @unhead/vue
// npm install @vueuse/head

// main.ts
import { createHead } from '@vueuse/head'
const head = createHead()
app.use(head)

// Trong component
import { useHead } from '@vueuse/head'

// Static page
useHead({
  title: 'Tạo thiệp cưới online đẹp miễn phí - InviteVerse',
  meta: [
    { name: 'description', content: 'Tạo thiệp cưới và thiệp sinh nhật online...' },
    { property: 'og:title', content: 'InviteVerse — Thiệp online đẹp' },
    { property: 'og:description', content: '...' },
    { property: 'og:image', content: 'https://yourdomain.com/og-default.jpg' },
    { property: 'og:url', content: 'https://yourdomain.com' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
})

// Dynamic page (invitation)
useHead(computed(() => ({
  title: `${invitation.value?.title} - InviteVerse`,
  meta: [
    { name: 'description', content: invitation.value?.meta?.description || '' },
    { property: 'og:title', content: invitation.value?.meta?.title || '' },
    { property: 'og:image', content: invitation.value?.meta?.og_image || '' },
    { property: 'og:url', content: `${import.meta.env.VITE_PUBLIC_BASE_URL}/i/${slug.value}` },
    { property: 'og:type', content: 'website' },
  ],
})))
```

---

## Google Fonts Loading

```typescript
// utils/fontLoader.ts
const FONT_CACHE = new Set<string>()

export function loadGoogleFont(fontName: string) {
  if (FONT_CACHE.has(fontName)) return
  FONT_CACHE.add(fontName)

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@400;600;700&display=swap`
  document.head.appendChild(link)
}

// Preload common fonts trong index.html
// <link rel="preconnect" href="https://fonts.googleapis.com">
// <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

---

## Vite Build Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-vue': ['vue', 'vue-router', 'pinia'],
          'vendor-query': ['@tanstack/vue-query'],
          'vendor-ui': ['@vueuse/core', '@vueuse/head'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
  plugins: [
    vue(),
    // Tắt inline SVG để giảm bundle size
  ],
})
```

---

## Performance Checklist (Public Invitation Page)

```
Above-the-fold (LCP target < 2.5s):
  ✅ Hero section render không block → skeleton placeholder
  ✅ Background image: preload với <link rel="preload">
  ✅ Font: font-display: swap
  ✅ Hero image: fetchpriority="high" (không lazy)

Below-the-fold:
  ✅ Gallery images: loading="lazy"
  ✅ Map embed: load on scroll (Intersection Observer)
  ✅ Music: không autoload audio file (chỉ load khi user tương tác hoặc explicit autoplay)

Bundle:
  ✅ Route lazy loading (mỗi page chunk riêng)
  ✅ Google Fonts: chỉ load fonts đang dùng
  ✅ Cloudinary: f_auto, q_auto cho tất cả images
```

---

## Countdown Timer Component

```vue
<!-- components/invitation/CountdownTimer.vue -->
<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps<{
  targetDate: string
  expiredMessage?: string
}>()

const remaining = ref(getRemaining())
let timer: ReturnType<typeof setInterval> | null = null

function getRemaining() {
  const diff = new Date(props.targetDate).getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
  }
}

onMounted(() => {
  timer = setInterval(() => { remaining.value = getRemaining() }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)  // LUÔN cleanup
})
</script>

<template>
  <div v-if="remaining" class="flex gap-4 text-center">
    <div v-for="(val, unit) in remaining" :key="unit" class="min-w-[60px]">
      <div class="text-4xl font-bold tabular-nums">{{ String(val).padStart(2, '0') }}</div>
      <div class="text-xs uppercase tracking-wider opacity-70">
        {{ { days: 'ngày', hours: 'giờ', minutes: 'phút', seconds: 'giây' }[unit] }}
      </div>
    </div>
  </div>
  <p v-else class="text-lg font-medium opacity-80">
    {{ expiredMessage || '🎉 Sự kiện đã diễn ra!' }}
  </p>
</template>
```

---

## Preload Hero Image

```vue
<!-- PublicInvitationRenderer — khi biết hero background url -->
<script setup lang="ts">
onMounted(() => {
  const heroSection = invitation.sections.find(s => s.section_type === 'hero')
  const bgUrl = heroSection?.config?.background_url
  if (bgUrl) {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = getOptimizedUrl(bgUrl, 1200)
    document.head.appendChild(link)
  }
})
</script>
```

---

## Core Web Vitals Targets

| Metric | Target | Cách đạt |
|---|---|---|
| LCP | < 2.5s | Preload hero image, Cloudinary CDN |
| FID/INP | < 200ms | Không block main thread, lazy hydration |
| CLS | < 0.1 | Đặt width/height cố định cho images |
| TTFB | < 600ms | Nginx caching, Cloudflare CDN |
