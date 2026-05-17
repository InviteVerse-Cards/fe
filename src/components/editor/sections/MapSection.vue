<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { ThemeConfig } from '@/types/section.types'

const props = defineProps<{
  config: Record<string, unknown>
  theme: ThemeConfig
  isPreview?: boolean
}>()

const venueName = computed(() => (props.config.venue_name as string) || '')
const address = computed(() => (props.config.address as string) || '')
const embedUrl = computed(() => (props.config.embed_url as string) || '')
const mapsUrl = computed(() => {
  if (address.value) return `https://maps.google.com/maps?q=${encodeURIComponent(address.value)}`
  return ''
})

const iframeVisible = ref(false)
const containerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (!embedUrl.value) return
  const observer = new IntersectionObserver(
    ([entry]) => { if (entry.isIntersecting) { iframeVisible.value = true; observer.disconnect() } },
    { threshold: 0.1 }
  )
  if (containerRef.value) observer.observe(containerRef.value)
})
</script>

<template>
  <section
    class="px-4 py-16"
    data-reveal
    :style="{ backgroundColor: theme.background_color, color: theme.text_color }"
  >
    <div class="mx-auto max-w-3xl">
      <div v-if="venueName || address" class="mb-6 text-center">
        <h2
          v-if="venueName"
          class="text-2xl font-bold"
          :style="{ fontFamily: `'${theme.font_heading}', serif`, color: theme.primary_color }"
        >
          {{ venueName }}
        </h2>
        <p v-if="address" class="mt-2 text-sm opacity-70">{{ address }}</p>
      </div>
      <div v-else class="mb-6 text-center opacity-40">
        <p class="text-sm">Thêm thông tin địa điểm ở sidebar</p>
      </div>

      <!-- Map embed -->
      <div ref="containerRef" class="relative overflow-hidden rounded-2xl border border-gray-200 shadow-sm" style="height: 300px">
        <iframe
          v-if="iframeVisible && embedUrl"
          :src="embedUrl"
          class="h-full w-full"
          style="border: 0"
          allowfullscreen
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Bản đồ địa điểm"
        />
        <div v-else class="flex h-full flex-col items-center justify-center gap-3 bg-gray-50">
          <svg class="h-10 w-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p v-if="address" class="max-w-xs text-center text-sm opacity-50">{{ address }}</p>
        </div>
      </div>

      <div v-if="mapsUrl" class="mt-4 text-center">
        <a
          :href="mapsUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:opacity-80"
          :style="{ borderColor: theme.primary_color, color: theme.primary_color }"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Mở Google Maps
        </a>
      </div>
    </div>
  </section>
</template>
