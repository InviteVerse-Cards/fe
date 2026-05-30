<script setup lang="ts">
import { computed } from 'vue'
import type { EventInfoConfig, ThemeConfig, Ceremony } from '@/types/section.types'
import FloralDecoration from '@/components/invitation/FloralDecoration.vue'
import { buildGoogleMapsEmbedUrl, buildGoogleMapsOpenUrl, getGoogleMapsApiKey } from '@/utils/googleMaps'

const props = defineProps<{ config: Record<string, unknown>; theme: ThemeConfig; isPreview?: boolean; category?: string }>()
const cfg = computed(() => props.config as unknown as EventInfoConfig)

const sectionHeading = computed(() => {
  if (props.category === 'birthday') return 'Thông tin tiệc sinh nhật'
  if (props.category === 'baby_shower') return 'Thông tin tiệc thôi nôi'
  if (props.category === 'house_warming') return 'Thông tin tân gia'
  return 'Thông tin hôn lễ'
})

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    })
  } catch { return dateStr }
}

function getEmbedUrl(c: Ceremony) {
  return buildGoogleMapsEmbedUrl({
    apiKey: getGoogleMapsApiKey(),
    address: c.address,
    lat: c.lat,
    lng: c.lng,
    placeId: c.place_id,
  })
}

function getOpenUrl(c: Ceremony) {
  return buildGoogleMapsOpenUrl({
    address: c.address,
    lat: c.lat,
    lng: c.lng,
    placeId: c.place_id,
  })
}
</script>

<template>
  <section
    class="relative px-4 py-20 text-center"
    data-reveal
    :style="{ backgroundColor: theme.background_color, color: theme.text_color }"
  >
    <!-- Top wave divider -->
    <svg
      class="absolute -top-px left-0 w-full"
      viewBox="0 0 1440 40"
      preserveAspectRatio="none"
      :style="{ fill: theme.primary_color + '18' }"
    >
      <path d="M0,40 C360,0 1080,40 1440,0 L1440,40 Z" />
    </svg>

    <div class="mx-auto max-w-3xl">
      <!-- Section heading -->
      <div class="mb-10 flex flex-col items-center gap-3">
        <FloralDecoration variant="divider" :color="theme.primary_color" :opacity="0.45" :size="240" />
        <h2
          class="text-3xl font-semibold"
          :style="{ fontFamily: `'${theme.font_heading}', serif`, color: theme.primary_color }"
        >
          {{ sectionHeading }}
        </h2>
        <FloralDecoration variant="divider" :color="theme.primary_color" :opacity="0.45" :size="240" />
      </div>

      <!-- Invitation message -->
      <div v-if="cfg.invitation_message" class="relative mb-12 px-4">
        <!-- Decorative opening quote -->
        <svg
          class="absolute -left-1 -top-3 h-8 w-8 opacity-15"
          :style="{ color: theme.primary_color }"
          viewBox="0 0 24 24" fill="currentColor"
        >
          <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L9.758 4.03c0 0-.218.052-.597.144C8.97 4.222 8.737 4.278 8.472 4.345c-.271.05-.56.187-.882.312C7.272 4.799 6.904 4.895 6.562 5.123c-.344.218-.741.4-1.091.692C5.132 6.116 4.723 6.377 4.421 6.76c-.33.358-.656.734-.909 1.162C3.219 8.33 3.02 8.778 2.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C2.535 17.474 4.338 19 6.5 19c2.485 0 4.5-2.015 4.5-4.5S8.985 10 6.5 10zm11 0c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.125.474-.197.474-.197L20.758 4.03c0 0-.218.052-.597.144-.191.048-.424.104-.689.171-.271.05-.56.187-.882.312-.318.142-.686.238-1.028.466-.344.218-.741.4-1.091.692-.339.301-.748.562-1.05.944-.33.358-.656.734-.909 1.162C14.219 8.33 14.02 8.778 13.81 9.221c-.19.443-.343.896-.468 1.336-.237.882-.343 1.72-.384 2.437-.034.718-.014 1.315.028 1.747.015.204.043.402.063.539.017.109.025.168.025.168l.026-.006C13.535 17.474 15.338 19 17.5 19c2.485 0 4.5-2.015 4.5-4.5S19.985 10 17.5 10z"/>
        </svg>
        <p
          class="mx-auto max-w-2xl text-lg leading-relaxed opacity-80"
          :style="{ fontFamily: `'${theme.font_body}', sans-serif`, color: theme.text_color }"
        >
          {{ cfg.invitation_message }}
        </p>
      </div>

      <!-- Ceremony cards -->
      <div :class="['grid gap-6', (!props.category || props.category === 'wedding') && cfg.ceremonies?.length > 1 ? 'sm:grid-cols-2' : 'grid-cols-1 max-w-md mx-auto w-full']">
        <div
          v-for="(ceremony, i) in cfg.ceremonies"
          :key="ceremony.name"
          class="overflow-hidden rounded-2xl border bg-white shadow-sm transition-all hover:shadow-lg"
          :style="{
            borderTopWidth: '4px',
            borderTopColor: theme.primary_color,
            borderColor: theme.primary_color + '28',
            transitionDelay: `${i * 150}ms`,
          }"
        >
          <div class="p-7">
            <h3
              class="mb-5 text-xl font-bold"
              :style="{ fontFamily: `'${theme.font_heading}', serif`, color: theme.primary_color }"
            >
              {{ ceremony.name }}
            </h3>
            <div
              class="space-y-3.5 text-sm"
              :style="{ fontFamily: `'${theme.font_body}', sans-serif`, color: theme.text_color }"
            >
              <div v-if="ceremony.date" class="flex items-start gap-3">
                <svg class="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" :style="{ color: theme.primary_color }">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ formatDate(ceremony.date) }}</span>
              </div>
              <div v-if="ceremony.time" class="flex items-center gap-3">
                <svg class="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" :style="{ color: theme.primary_color }">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{{ ceremony.time }}</span>
              </div>
              <div v-if="ceremony.venue" class="flex items-start gap-3">
                <svg class="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" :style="{ color: theme.primary_color }">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p class="font-semibold">{{ ceremony.venue }}</p>
                  <p v-if="ceremony.address" class="mt-0.5 text-xs opacity-60">{{ ceremony.address }}</p>
                </div>
              </div>

              <!-- Map Embed for this ceremony -->
              <div v-if="ceremony.lat && ceremony.lng" class="mt-4 pt-4 border-t border-gray-100 space-y-3">
                <div class="relative overflow-hidden rounded-xl border border-gray-100 shadow-sm" style="height: 200px">
                  <iframe
                    :src="getEmbedUrl(ceremony)"
                    class="h-full w-full"
                    style="border: 0"
                    allowfullscreen
                    loading="lazy"
                    referrerpolicy="no-referrer-when-downgrade"
                    title="Bản đồ địa điểm"
                  />
                </div>
                <div class="text-center">
                  <a
                    :href="getOpenUrl(ceremony)"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors hover:opacity-85"
                    :style="{ borderColor: theme.primary_color, color: theme.primary_color }"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                    Mở Google Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!cfg.ceremonies?.length" class="py-10 text-sm opacity-40">
        Thêm thông tin buổi lễ ở sidebar
      </div>
    </div>

    <!-- Bottom wave divider -->
    <svg
      class="absolute -bottom-px left-0 w-full rotate-180"
      viewBox="0 0 1440 40"
      preserveAspectRatio="none"
      :style="{ fill: theme.primary_color + '18' }"
    >
      <path d="M0,40 C360,0 1080,40 1440,0 L1440,40 Z" />
    </svg>
  </section>
</template>
