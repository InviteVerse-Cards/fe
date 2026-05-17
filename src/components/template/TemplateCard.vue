<script setup lang="ts">
import { computed } from 'vue'
import type { Template, LayoutType } from '@/types/template.types'

type CardLayout = 'hero-scroll' | 'chinese-red' | 'photo-story' | 'calligraphy' | 'botanical' | 'traditional-viet' | 'luxury-dark' | 'rustic' | 'birthday-playful' | 'baby-soft'

const LAYOUT_TYPE_TO_CARD: Record<LayoutType, CardLayout> = {
  'botanical':        'botanical',
  'chinese-red':      'chinese-red',
  'luxury-dark':      'luxury-dark',
  'minimalist':       'calligraphy',
  'romantic-photo':   'hero-scroll',
  'rustic':           'rustic',
  'traditional-viet': 'traditional-viet',
  'birthday-playful': 'birthday-playful',
  'birthday-elegant': 'calligraphy',
  'baby-soft':        'baby-soft',
  'house-warm':       'botanical',
}

const props = defineProps<{ template: Template; isSelecting?: boolean }>()
const emit = defineEmits<{
  (e: 'select', t: Template): void
  (e: 'preview', t: Template): void
}>()

// layout_type is the authoritative source (set by migration 032)
// fallback to hero_config.layout_variant (migration 031) for backwards compat
const layout = computed<CardLayout>(() => {
  const lt = props.template.layout_type
  if (lt && lt in LAYOUT_TYPE_TO_CARD) return LAYOUT_TYPE_TO_CARD[lt]
  const lv = props.template.hero_config?.layout_variant as string | undefined
  if (lv === 'hero-scroll') return 'hero-scroll'
  if (lv === 'chinese-red') return 'chinese-red'
  if (lv === 'photo-story') return 'photo-story'
  if (lv === 'calligraphy') return 'calligraphy'
  return 'botanical'
})

const c = computed(() => ({
  primary:   props.template.theme_preview?.primary_color   ?? '#C2637A',
  secondary: props.template.theme_preview?.secondary_color ?? '#E8A0B0',
  accent:    props.template.theme_preview?.accent_color    ?? '#D4A76A',
  bg:        props.template.theme_preview?.background_color ?? '#FFF5F7',
  text:      props.template.theme_preview?.text_color      ?? '#3D2830',
  font:      `'${props.template.theme_preview?.font_heading ?? 'Playfair Display'}', serif`,
}))

const heroUrl    = computed(() => props.template.hero_config?.background_url ?? props.template.thumbnail_url)
const overlayAlpha = computed(() => ((props.template.hero_config?.background_overlay ?? 40) / 100).toFixed(2))
const tagline    = computed(() => props.template.hero_config?.tagline ?? 'Trọn đời bên nhau')
const isPopular  = computed(() => props.template.use_count >= 10)

const groomName = computed(() => props.template.hero_config?.groom_name || 'Chú Rể')
const brideName = computed(() => props.template.hero_config?.bride_name || 'Cô Dâu')
const celebrantName = computed(() => {
  return (props.template.hero_config as any)?.celebrant_name || 'Bảo Ngọc'
})
const ageMilestone = computed(() => {
  return (props.template.hero_config as any)?.age_milestone || 'Sinh Nhật'
})
const previewDate = computed(() => {
  const nextYear = new Date().getFullYear() + 1
  return `12/12/${nextYear}`
})
const previewDotsDate = computed(() => {
  const nextYear = new Date().getFullYear() + 1
  return `12.12.${nextYear}`
})
const previewSpacesDate = computed(() => {
  const nextYear = new Date().getFullYear() + 1
  return `12 / 12 / ${nextYear}`
})
const previewRomanDate = computed(() => {
  const nextYear = new Date().getFullYear() + 1
  const roman = nextYear === 2027 ? 'MMXXVII' : 'MMXXVI'
  return `XII · XII · ${roman}`
})
</script>

<template>
  <div class="flex flex-col">
    <div
      class="group relative aspect-[3/5] cursor-pointer overflow-hidden rounded-2xl shadow-md transition-shadow duration-300 hover:shadow-xl"
    >
      <!-- ═══════════════════════════════════════════════
           INNER SCROLL CONTAINER — height: 200%
           hover: translateY(-50%) lộ bottom half (event info)
           Transition 6s tạo hiệu ứng scroll như chungdoi.com
      ═══════════════════════════════════════════════ -->
      <div
        class="absolute inset-x-0 top-0 transition-transform duration-[6000ms] ease-in-out group-hover:-translate-y-1/2"
        style="height: 200%"
      >

        <!-- ╔══════════════════════════════╗
             ║  LAYOUT 1: HERO SCROLL       ║
             ║  Full-bleed hero background  ║
             ╚══════════════════════════════╝ -->
        <template v-if="layout === 'hero-scroll'">
          <!-- TOP: Hero section với background thật của template -->
          <div class="relative" style="height: 50%">
            <img
              v-if="heroUrl"
              :src="heroUrl"
              :alt="template.name"
              class="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div v-else class="absolute inset-0" :style="{ background: `linear-gradient(150deg,${c.secondary},${c.primary})` }" />
            <div class="absolute inset-0" :style="{ background: `rgba(0,0,0,${overlayAlpha})` }" />

            <div class="absolute inset-0 flex flex-col items-center justify-center px-4 text-center" :style="{ fontFamily: c.font }">
              <div class="mb-2 flex w-full items-center gap-2">
                <div class="h-px flex-1 bg-white/35" />
                <span class="text-[9px] text-white/60">✦</span>
                <div class="h-px flex-1 bg-white/35" />
              </div>
              <p class="mb-3 text-[8px] font-light tracking-[0.28em] text-white/75 uppercase">{{ tagline }}</p>
              <h2 class="text-xl font-bold leading-tight text-white drop-shadow-lg sm:text-2xl">{{ brideName }}</h2>
              <p class="my-1 text-sm font-light text-white/55">&amp;</p>
              <h2 class="text-xl font-bold leading-tight text-white drop-shadow-lg sm:text-2xl">{{ groomName }}</h2>
              <div class="mt-3 flex w-full items-center gap-2">
                <div class="h-px flex-1 bg-white/35" />
                <span class="text-[10px] text-white/60">♥</span>
                <div class="h-px flex-1 bg-white/35" />
              </div>
            </div>
          </div>

          <!-- BOTTOM: Event info section -->
          <div class="flex flex-col" style="height: 50%" :style="{ background: c.bg, fontFamily: c.font }">
            <div class="flex-shrink-0 px-4 py-2.5 text-center" :style="{ background: c.primary }">
              <p class="text-[9px] font-bold tracking-[0.22em] text-white/95 uppercase">Thông Tin Lễ Cưới</p>
            </div>
            <div class="flex flex-1 flex-col items-center justify-center gap-1.5 px-3 py-2">
              <div class="w-full rounded-lg px-3 py-2" :style="{ background:`${c.primary}14`, borderLeft:`3px solid ${c.primary}` }">
                <p class="text-[9px] font-bold tracking-wide" :style="{ color: c.primary }">Lễ Vu Quy</p>
                <p class="mt-0.5 text-[8px]" :style="{ color: c.text, opacity: 0.7 }">08:00 · 12/12/2025</p>
                <p class="text-[7px]" :style="{ color: c.text, opacity: 0.5 }">TP. Hồ Chí Minh</p>
              </div>
              <div class="flex w-full items-center gap-1.5">
                <div class="h-px flex-1" :style="{ background:`${c.primary}22` }" />
                <span class="text-[10px]" :style="{ color: c.accent }">♥</span>
                <div class="h-px flex-1" :style="{ background:`${c.primary}22` }" />
              </div>
              <div class="w-full rounded-lg px-3 py-2" :style="{ background:`${c.primary}14`, borderLeft:`3px solid ${c.accent}` }">
                <p class="text-[9px] font-bold tracking-wide" :style="{ color: c.primary }">Lễ Thành Hôn</p>
                <p class="mt-0.5 text-[8px]" :style="{ color: c.text, opacity: 0.7 }">18:00 · 12/12/2025</p>
                <p class="text-[7px]" :style="{ color: c.text, opacity: 0.5 }">Trung Tâm Tiệc Cưới</p>
              </div>
            </div>
            <div class="h-2 flex-shrink-0" :style="{ background:`linear-gradient(90deg,${c.primary},${c.accent})` }" />
          </div>
        </template>


        <!-- ╔══════════════════════════════════════╗
             ║  LAYOUT 2: CHINESE RED / GOLDEN      ║
             ║  Á Đông: 囍, avatar circles, bold    ║
             ╚══════════════════════════════════════╝ -->
        <template v-else-if="layout === 'chinese-red'">
          <!-- TOP: Chinese style card -->
          <div class="relative flex flex-col items-center" style="height: 50%" :style="{ background: c.primary }">
            <!-- Decorative border frame -->
            <div class="absolute inset-2 rounded border opacity-40" :style="{ borderColor: c.accent }" />
            <div class="absolute inset-3 rounded border opacity-20" :style="{ borderColor: c.accent }" />

            <!-- Inner content -->
            <div class="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
              <!-- Avatar circles row -->
              <div class="flex items-center gap-2 mb-2">
                <!-- Bride circle -->
                <div class="flex flex-col items-center gap-0.5">
                  <div class="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2" :style="{ borderColor: c.accent, background: 'rgba(255,255,255,0.18)' }">
                    <svg viewBox="0 0 40 52" class="h-8 w-7" fill="none">
                      <ellipse cx="20" cy="11" rx="8" ry="9" fill="white" opacity="0.85"/>
                      <path d="M10 23 Q10 21 20 20 Q30 21 30 23 L33 50 H7 Z" fill="white" opacity="0.65"/>
                      <path d="M12 22 Q20 19 28 22 L30 32 Q20 28 10 32Z" fill="white" opacity="0.8"/>
                    </svg>
                  </div>
                  <p class="text-[7px] font-light text-white/80 tracking-wide">Ủi Nữ</p>
                </div>

                <!-- 囍 symbol center -->
                <div class="flex flex-col items-center">
                  <div class="flex h-9 w-9 items-center justify-center rounded-full border" :style="{ borderColor: c.accent, background: 'rgba(255,255,255,0.12)' }">
                    <span class="text-lg font-bold leading-none" :style="{ color: c.accent }">囍</span>
                  </div>
                </div>

                <!-- Groom circle -->
                <div class="flex flex-col items-center gap-0.5">
                  <div class="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2" :style="{ borderColor: c.accent, background: 'rgba(255,255,255,0.18)' }">
                    <svg viewBox="0 0 40 52" class="h-8 w-7" fill="none">
                      <ellipse cx="20" cy="11" rx="8" ry="9" fill="white" opacity="0.85"/>
                      <rect x="13" y="22" width="14" height="26" rx="2" fill="white" opacity="0.65"/>
                      <path d="M13 22 L17 28 L20 25" fill="white" opacity="0.5"/>
                      <path d="M27 22 L23 28 L20 25" fill="white" opacity="0.5"/>
                      <path d="M19 23 L20 26 L21 23 L20.5 36 L20 37 L19.5 36Z" :fill="c.accent" opacity="0.9"/>
                    </svg>
                  </div>
                  <p class="text-[7px] font-light text-white/80 tracking-wide">Trường Nam</p>
                </div>
              </div>

              <!-- Thin gold divider -->
              <div class="my-1.5 flex w-4/5 items-center gap-2">
                <div class="h-px flex-1" :style="{ background: c.accent, opacity: 0.6 }" />
                <span class="text-[10px]" :style="{ color: c.accent }">❧</span>
                <div class="h-px flex-1" :style="{ background: c.accent, opacity: 0.6 }" />
              </div>

              <!-- Couple names bold -->
              <p class="text-base font-bold leading-tight text-white drop-shadow" :style="{ fontFamily: c.font }">{{ brideName }}</p>
              <p class="my-0.5 text-[10px] font-light text-white/50">&amp;</p>
              <p class="text-base font-bold leading-tight text-white drop-shadow" :style="{ fontFamily: c.font }">{{ groomName }}</p>

              <!-- Bottom decorative -->
              <div class="mt-2 flex w-4/5 items-center gap-2">
                <div class="h-px flex-1" :style="{ background: c.accent, opacity: 0.6 }" />
                <span class="text-[9px]" :style="{ color: c.accent }">✦</span>
                <div class="h-px flex-1" :style="{ background: c.accent, opacity: 0.6 }" />
              </div>
            </div>
          </div>

          <!-- BOTTOM: Dark event info -->
          <div class="flex flex-col" style="height: 50%" :style="{ background: `${c.primary}EE`, fontFamily: c.font }">
            <div class="flex-shrink-0 px-3 py-2 text-center" :style="{ background: 'rgba(0,0,0,0.25)' }">
              <p class="text-[8px] font-bold tracking-[0.22em] text-white/90 uppercase">Thông Tin Lễ Cưới</p>
            </div>
            <div class="flex flex-1 flex-col items-center justify-center gap-2 px-3 py-2">
              <div class="w-full rounded px-3 py-1.5 text-center" :style="{ background: 'rgba(255,255,255,0.12)', border: `1px solid ${c.accent}44` }">
                <p class="text-[9px] font-bold" :style="{ color: c.accent }">Lễ Vu Quy</p>
                <p class="text-[7px] text-white/75 mt-0.5">08:00 · 12/12/2025</p>
              </div>
              <div class="w-full rounded px-3 py-1.5 text-center" :style="{ background: 'rgba(255,255,255,0.12)', border: `1px solid ${c.accent}44` }">
                <p class="text-[9px] font-bold" :style="{ color: c.accent }">Lễ Thành Hôn</p>
                <p class="text-[7px] text-white/75 mt-0.5">18:00 · 12/12/2025</p>
              </div>
              <p class="text-[7px] italic text-white/40">Trân trọng kính mời</p>
            </div>
            <div class="h-2 flex-shrink-0" :style="{ background: c.accent }" />
          </div>
        </template>


        <!-- ╔══════════════════════════════════════════╗
             ║  LAYOUT 3: PHOTO STORY                   ║
             ║  Polaroid frames + "THE STORY OF LOVE"   ║
             ╚══════════════════════════════════════════╝ -->
        <template v-else-if="layout === 'photo-story'">
          <!-- TOP: Two overlapping polaroid photo frames -->
          <div class="relative flex flex-col items-center justify-center" style="height: 50%" :style="{ background: c.bg }">
            <!-- Subtle bg pattern -->
            <div class="absolute inset-0 opacity-20" :style="{ backgroundImage: `radial-gradient(circle at 20% 80%, ${c.primary} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${c.secondary} 0%, transparent 50%)` }" />

            <!-- "THE STORY OF LOVE" header -->
            <p class="relative z-10 mb-3 text-[8px] font-light tracking-[0.35em] uppercase" :style="{ color: c.text, opacity: 0.6 }">
              The Story of Love
            </p>

            <!-- Polaroid frames side by side -->
            <div class="relative z-10 flex items-end justify-center gap-1">
              <!-- Groom polaroid (tilted left) -->
              <div
                class="flex flex-col overflow-hidden rounded-sm shadow-lg"
                style="transform: rotate(-4deg); width: 52px; background: white"
              >
                <div class="flex h-14 items-center justify-center" :style="{ background: `${c.secondary}40` }">
                  <svg viewBox="0 0 40 52" class="h-11 w-9" fill="none">
                    <ellipse cx="20" cy="11" rx="8" ry="9" :fill="c.primary" opacity="0.75"/>
                    <rect x="13" y="22" width="14" height="26" rx="2" :fill="c.primary" opacity="0.6"/>
                    <path d="M13 22 L17 28 L20 25" :fill="c.secondary" opacity="0.55"/>
                    <path d="M27 22 L23 28 L20 25" :fill="c.secondary" opacity="0.55"/>
                    <path d="M19 23 L20 26 L21 23 L20.5 36 L20 37 L19.5 36Z" :fill="c.accent" opacity="0.95"/>
                    <rect x="7" y="22" width="6" height="20" rx="2" :fill="c.primary" opacity="0.5"/>
                    <rect x="27" y="22" width="6" height="20" rx="2" :fill="c.primary" opacity="0.5"/>
                  </svg>
                </div>
                <div class="flex h-5 items-center justify-center">
                  <p class="text-[7px] text-gray-500" style="font-family: sans-serif">Trường Nam</p>
                </div>
              </div>

              <!-- Bride polaroid (tilted right, slightly larger/in front) -->
              <div
                class="flex flex-col overflow-hidden rounded-sm shadow-xl"
                style="transform: rotate(4deg) translateY(-6px); width: 56px; background: white; z-index: 1"
              >
                <div class="flex h-16 items-center justify-center" :style="{ background: `${c.primary}30` }">
                  <svg viewBox="0 0 40 52" class="h-12 w-10" fill="none">
                    <ellipse cx="20" cy="10" rx="8" ry="9" :fill="c.primary" opacity="0.8"/>
                    <path d="M16 8 Q20 3 24 8" :stroke="c.accent" stroke-width="2" fill="none" opacity="0.9"/>
                    <path d="M12 22 Q20 19 28 22 L30 40 Q20 36 10 40Z" :fill="c.primary" opacity="0.72"/>
                    <path d="M10 39 Q8 50 6 52 H34 Q32 50 30 39Z" :fill="c.primary" opacity="0.5"/>
                    <path d="M12 26 Q8 34 7 44" :stroke="c.primary" stroke-width="3.5" stroke-linecap="round" opacity="0.45"/>
                    <path d="M28 26 Q32 34 33 44" :stroke="c.primary" stroke-width="3.5" stroke-linecap="round" opacity="0.45"/>
                  </svg>
                </div>
                <div class="flex h-5 items-center justify-center">
                  <p class="text-[7px] text-gray-500" style="font-family: sans-serif">Ủi Nữ / Bride</p>
                </div>
              </div>
            </div>

            <!-- Couple names below frames -->
            <div class="relative z-10 mt-2.5 text-center" :style="{ fontFamily: c.font }">
              <p class="text-[11px] font-bold leading-tight" :style="{ color: c.primary }">{{ brideName }} &amp; {{ groomName }}</p>
            </div>
          </div>

          <!-- BOTTOM: Clean event info -->
          <div class="flex flex-col" style="height: 50%" :style="{ background: c.bg, fontFamily: c.font }">
            <div class="flex-shrink-0 border-b px-3 py-2 text-center" :style="{ borderColor: `${c.primary}30` }">
              <p class="text-[8px] font-bold tracking-[0.2em] uppercase" :style="{ color: c.primary }">Wedding Info</p>
            </div>
            <div class="flex flex-1 flex-col items-center justify-center gap-1.5 px-4 py-2">
              <div class="flex w-full items-center gap-2">
                <div class="h-6 w-6 flex-shrink-0 rounded-full flex items-center justify-center" :style="{ background: `${c.primary}18` }">
                  <span class="text-[9px]" :style="{ color: c.primary }">📅</span>
                </div>
                <div>
                  <p class="text-[9px] font-semibold" :style="{ color: c.text }">{{ previewSpacesDate }}</p>
                  <p class="text-[7px]" :style="{ color: c.text, opacity: 0.55 }">Lễ Thành Hôn</p>
                </div>
              </div>
              <div class="flex w-full items-center gap-2">
                <div class="h-6 w-6 flex-shrink-0 rounded-full flex items-center justify-center" :style="{ background: `${c.primary}18` }">
                  <span class="text-[9px]" :style="{ color: c.primary }">📍</span>
                </div>
                <div>
                  <p class="text-[9px] font-semibold" :style="{ color: c.text }">Trung Tâm Tiệc</p>
                  <p class="text-[7px]" :style="{ color: c.text, opacity: 0.55 }">TP. Hồ Chí Minh</p>
                </div>
              </div>
              <p class="mt-1 text-[8px] italic text-center" :style="{ color: c.text, opacity: 0.4 }">Trân trọng kính mời</p>
            </div>
            <div class="h-2 flex-shrink-0" :style="{ background: `linear-gradient(90deg,${c.primary},${c.accent})` }" />
          </div>
        </template>


        <!-- ╔══════════════════════════════════════════════╗
             ║  LAYOUT 4: CALLIGRAPHY MINIMAL              ║
             ║  White/cream, large script names, album     ║
             ╚══════════════════════════════════════════════╝ -->
        <template v-else-if="layout === 'calligraphy'">
          <!-- TOP: Large calligraphy names on clean background -->
          <div class="relative flex flex-col items-center justify-between" style="height: 50%" :style="{ background: c.bg }">
            <!-- Very subtle tint overlay -->
            <div class="absolute inset-0 opacity-30" :style="{ backgroundImage: `radial-gradient(ellipse at top, ${c.secondary}60 0%, transparent 70%)` }" />

            <div class="relative z-10 w-full flex flex-col items-center justify-center h-full px-4 text-center" :style="{ fontFamily: c.font }">
              <!-- Top ornament -->
              <div class="flex w-4/5 items-center gap-2 mb-2">
                <div class="h-px flex-1" :style="{ background: `${c.primary}35` }" />
                <svg viewBox="0 0 20 20" class="h-3 w-3" :style="{ color: c.primary }">
                  <circle cx="10" cy="10" r="3" fill="currentColor" opacity="0.6"/>
                  <circle cx="3" cy="10" r="2" fill="currentColor" opacity="0.35"/>
                  <circle cx="17" cy="10" r="2" fill="currentColor" opacity="0.35"/>
                </svg>
                <div class="h-px flex-1" :style="{ background: `${c.primary}35` }" />
              </div>

              <!-- Category-based headers -->
              <p v-if="props.template.category === 'birthday' || props.template.category === 'baby_shower'" class="mb-1 text-[7px] font-light tracking-[0.4em] uppercase" :style="{ color: c.text, opacity: 0.45 }">
                Happy Celebration
              </p>
              <p v-else class="mb-1 text-[7px] font-light tracking-[0.4em] uppercase" :style="{ color: c.text, opacity: 0.45 }">
                The Wedding of
              </p>

              <!-- Large couple/celebrant names -->
              <template v-if="props.template.category === 'birthday' || props.template.category === 'baby_shower'">
                <h2 class="text-2xl font-black leading-tight tracking-wide animate-pulse" :style="{ color: c.primary }">{{ celebrantName }}</h2>
                <p class="mt-1 text-[8px] font-bold tracking-[0.2em] uppercase" :style="{ color: c.accent }">{{ ageMilestone }}</p>
              </template>
              <template v-else>
                <h2 class="text-2xl font-bold leading-tight" :style="{ color: c.primary }">{{ brideName }}</h2>
                <p class="my-1 text-sm font-light" :style="{ color: c.text, opacity: 0.4 }">&amp;</p>
                <h2 class="text-2xl font-bold leading-tight" :style="{ color: c.primary }">{{ groomName }}</h2>
              </template>

              <!-- Bottom ornament -->
              <div class="flex w-4/5 items-center gap-2 mt-2">
                <div class="h-px flex-1" :style="{ background: `${c.primary}35` }" />
                <span class="text-xs" :style="{ color: c.accent }">✦</span>
                <div class="h-px flex-1" :style="{ background: `${c.primary}35` }" />
              </div>
            </div>
          </div>

          <!-- BOTTOM: Album photo section -->
          <div class="flex flex-col" style="height: 50%" :style="{ background: c.bg, fontFamily: c.font }">
            <div class="flex-shrink-0 px-3 py-2 text-center" :style="{ background: `${c.primary}10`, borderTop: `2px solid ${c.primary}30` }">
              <p class="text-[8px] font-bold tracking-[0.25em] uppercase" :style="{ color: c.primary }">Album Ảnh Cưới</p>
            </div>
            <!-- Photo placeholder grid (3 boxes) -->
            <div class="flex flex-1 items-center justify-center gap-1.5 px-3 py-2">
              <div
                v-for="i in 3" :key="i"
                class="flex-1 rounded overflow-hidden flex items-center justify-center"
                style="aspect-ratio: 2/3"
                :style="{ background: `${c.secondary}30` }"
              >
                <svg viewBox="0 0 30 40" class="h-8 w-6 opacity-40" fill="none" :style="{ color: c.primary }">
                  <ellipse cx="15" cy="9" rx="6" ry="7" fill="currentColor"/>
                  <path d="M5 40 Q5 22 15 20 Q25 22 25 40" fill="currentColor"/>
                </svg>
              </div>
            </div>
            <!-- Bottom gradient -->
            <div class="h-2 flex-shrink-0" :style="{ background: `linear-gradient(90deg,${c.primary},${c.accent})` }" />
          </div>
        </template>


        <!-- ╔══════════════════════════════════════════╗
             ║  LAYOUT: TRADITIONAL VIET                ║
             ╚══════════════════════════════════════════╝ -->
        <template v-else-if="layout === 'traditional-viet'">
          <div class="relative flex flex-col items-center justify-center" style="height: 50%" :style="{ background: '#8B0000' }">
            <div class="absolute inset-2 border opacity-30" :style="{ borderColor: c.accent }" />
            <div class="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
              <div class="flex h-10 w-10 items-center justify-center rounded-full border mb-2" :style="{ borderColor: c.accent }">
                <span class="text-xl font-bold" :style="{ color: c.accent }">囍</span>
              </div>
              <p class="text-sm font-bold text-[#FFF5E8]" :style="{ fontFamily: c.font }">{{ brideName }} &amp; {{ groomName }}</p>
            </div>
          </div>
          <div class="flex flex-col" style="height: 50%" :style="{ background: '#5A0000', fontFamily: c.font }">
            <div class="flex-shrink-0 px-3 py-2 text-center bg-black/20">
              <p class="text-[8px] font-bold tracking-[0.2em] uppercase" :style="{ color: c.accent }">Thiệp Cưới</p>
            </div>
            <div class="flex flex-1 flex-col items-center justify-center gap-2 px-3 py-2">
              <div class="w-full border p-2 text-center" :style="{ borderColor: `${c.accent}50` }">
                <p class="text-[8px] text-white">{{ previewDate }}</p>
              </div>
            </div>
            <div class="h-2 flex-shrink-0" :style="{ background: c.accent }" />
          </div>
        </template>

        <!-- ╔══════════════════════════════════════════╗
             ║  LAYOUT: LUXURY DARK                     ║
             ╚══════════════════════════════════════════╝ -->
        <template v-else-if="layout === 'luxury-dark'">
          <div class="relative flex flex-col items-center justify-center" style="height: 50%" :style="{ background: '#0F0F0F' }">
            <div class="absolute inset-3 border" :style="{ borderColor: `${c.accent}50` }" />
            <div class="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
              <p class="text-base font-bold text-transparent bg-clip-text mb-1" :style="{ backgroundImage: `linear-gradient(to right, ${c.accent}, #FFF, ${c.accent})`, fontFamily: c.font }">{{ brideName }}</p>
              <p class="text-[10px]" :style="{ color: c.accent }">&amp;</p>
              <p class="text-base font-bold text-transparent bg-clip-text mt-1" :style="{ backgroundImage: `linear-gradient(to right, ${c.accent}, #FFF, ${c.accent})`, fontFamily: c.font }">{{ groomName }}</p>
            </div>
          </div>
          <div class="flex flex-col" style="height: 50%" :style="{ background: '#1A1A1A', fontFamily: c.font }">
            <div class="flex-shrink-0 px-3 py-2 text-center border-b" :style="{ borderColor: `${c.accent}30` }">
              <p class="text-[8px] font-bold tracking-[0.2em] uppercase" :style="{ color: c.accent }">Save The Date</p>
            </div>
            <div class="flex flex-1 flex-col items-center justify-center px-3 py-2">
              <p class="text-[10px] text-white/80">{{ previewRomanDate }}</p>
            </div>
          </div>
        </template>

        <!-- ╔══════════════════════════════════════════╗
             ║  LAYOUT: RUSTIC                          ║
             ╚══════════════════════════════════════════╝ -->
        <template v-else-if="layout === 'rustic'">
          <div class="relative flex flex-col items-center justify-center" style="height: 50%" :style="{ background: c.bg }">
            <div class="absolute inset-0 opacity-20" :style="{ background: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==)' }" />
            <img v-if="heroUrl" :src="heroUrl" class="absolute inset-0 h-full w-full object-cover mix-blend-multiply opacity-50" style="filter: sepia(0.5);" />
            <div class="relative z-10 text-center">
              <p class="text-lg font-bold" :style="{ color: c.text, fontFamily: c.font }">{{ brideName }} &amp; {{ groomName }}</p>
            </div>
          </div>
          <div class="flex flex-col" style="height: 50%" :style="{ background: '#F5F0E6', fontFamily: c.font }">
            <div class="flex-1 flex flex-col justify-center items-center p-3 gap-2">
              <div class="w-full bg-white shadow-sm p-2 text-center rounded">
                <p class="text-[8px] font-bold" :style="{ color: c.text }">{{ previewDotsDate }}</p>
              </div>
            </div>
          </div>
        </template>

        <!-- ╔══════════════════════════════════════════╗
             ║  LAYOUT: BIRTHDAY PLAYFUL                ║
             ╚══════════════════════════════════════════╝ -->
        <template v-else-if="layout === 'birthday-playful'">
          <div class="relative flex flex-col items-center justify-center" style="height: 50%" :style="{ background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})` }">
            <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(white 10%, transparent 11%); background-size: 10px 10px;" />
            <div class="relative z-10 text-center bg-white/90 p-3 rounded-xl mx-4">
              <p class="text-sm font-black animate-pulse" :style="{ color: c.primary }">{{ celebrantName }}</p>
            </div>
          </div>
          <div class="flex flex-col items-center justify-center p-3" style="height: 50%; background: white;">
            <div class="w-full bg-gray-50 rounded-lg p-2 text-center">
              <p class="text-[8px] font-bold" :style="{ color: c.text }">{{ ageMilestone }} · Join the Party!</p>
            </div>
          </div>
        </template>

        <!-- ╔══════════════════════════════════════════╗
             ║  LAYOUT: BABY SOFT                       ║
             ╚══════════════════════════════════════════╝ -->
        <template v-else-if="layout === 'baby-soft'">
          <div class="relative flex flex-col items-center justify-center" style="height: 50%" :style="{ background: c.bg }">
            <div class="relative z-10 text-center bg-white/60 backdrop-blur-sm p-4 rounded-3xl mx-4 shadow-sm">
              <p class="text-sm font-semibold animate-pulse" :style="{ color: c.text, fontFamily: c.font }">{{ celebrantName }}</p>
            </div>
          </div>
          <div class="flex flex-col items-center justify-center p-3" style="height: 50%; background: white;">
            <div class="w-full bg-blue-50/50 rounded-2xl p-2 text-center border" :style="{ borderColor: `${c.primary}20` }">
              <p class="text-[8px] font-medium" :style="{ color: c.text }">{{ previewDate }}</p>
            </div>
          </div>
        </template>

        <!-- ╔══════════════════════════════════════════╗
             ║  LAYOUT 5: BOTANICAL FLORAL              ║
             ║  Botanical corner decorations + script   ║
             ╚══════════════════════════════════════════╝ -->
        <template v-else><!-- botanical -->
          <!-- TOP: Floral card -->
          <div class="relative flex flex-col items-center justify-center" style="height: 50%" :style="{ background: c.bg }">
            <!-- Background tint -->
            <div class="absolute inset-0 opacity-25" :style="{ backgroundImage: `radial-gradient(ellipse at center, ${c.secondary}80 0%, transparent 75%)` }" />

            <!-- Botanical corner decorations (top-left) -->
            <svg class="absolute left-0 top-0 h-16 w-16 opacity-70" :style="{ color: c.secondary }" viewBox="0 0 80 80" fill="none">
              <ellipse cx="15" cy="40" rx="22" ry="9" fill="currentColor" transform="rotate(-50 15 40)"/>
              <ellipse cx="30" cy="15" rx="22" ry="9" fill="currentColor" transform="rotate(-20 30 15)"/>
              <ellipse cx="8" cy="20" rx="16" ry="7" fill="currentColor" transform="rotate(-70 8 20)"/>
              <ellipse cx="40" cy="8" rx="16" ry="7" fill="currentColor" transform="rotate(-10 40 8)"/>
            </svg>

            <!-- Botanical corner (bottom-right) -->
            <svg class="absolute bottom-0 right-0 h-16 w-16 opacity-70" :style="{ color: c.secondary }" viewBox="0 0 80 80" fill="none" style="transform: rotate(180deg)">
              <ellipse cx="15" cy="40" rx="22" ry="9" fill="currentColor" transform="rotate(-50 15 40)"/>
              <ellipse cx="30" cy="15" rx="22" ry="9" fill="currentColor" transform="rotate(-20 30 15)"/>
              <ellipse cx="8" cy="20" rx="16" ry="7" fill="currentColor" transform="rotate(-70 8 20)"/>
              <ellipse cx="40" cy="8" rx="16" ry="7" fill="currentColor" transform="rotate(-10 40 8)"/>
            </svg>

            <!-- Central content -->
            <div class="relative z-10 flex flex-col items-center px-6 text-center" :style="{ fontFamily: c.font }">
              <!-- Small flower ornament -->
              <svg class="mb-2 h-5 w-5 opacity-60" :style="{ color: c.primary }" viewBox="0 0 24 24" fill="none">
                <ellipse cx="12" cy="5" rx="3" ry="5" fill="currentColor" opacity="0.8"/>
                <ellipse cx="12" cy="5" rx="3" ry="5" fill="currentColor" opacity="0.8" transform="rotate(60 12 12)"/>
                <ellipse cx="12" cy="5" rx="3" ry="5" fill="currentColor" opacity="0.8" transform="rotate(120 12 12)"/>
                <ellipse cx="12" cy="5" rx="3" ry="5" fill="currentColor" opacity="0.8" transform="rotate(180 12 12)"/>
                <ellipse cx="12" cy="5" rx="3" ry="5" fill="currentColor" opacity="0.8" transform="rotate(240 12 12)"/>
                <ellipse cx="12" cy="5" rx="3" ry="5" fill="currentColor" opacity="0.8" transform="rotate(300 12 12)"/>
                <circle cx="12" cy="12" r="3" fill="currentColor"/>
              </svg>

              <p class="mb-1 text-[7px] font-light tracking-[0.35em] uppercase" :style="{ color: c.text, opacity: 0.45 }">
                {{ tagline }}
              </p>
              <h2 class="text-xl font-bold leading-snug" :style="{ color: c.primary }">{{ brideName }}</h2>
              <p class="my-0.5 text-sm font-light" :style="{ color: c.text, opacity: 0.4 }">&amp;</p>
              <h2 class="text-xl font-bold leading-snug" :style="{ color: c.primary }">{{ groomName }}</h2>

              <!-- Thin divider -->
              <div class="mt-2 flex w-3/4 items-center gap-1.5">
                <div class="h-px flex-1" :style="{ background: `${c.primary}40` }" />
                <span class="text-[8px]" :style="{ color: c.accent }">❀</span>
                <div class="h-px flex-1" :style="{ background: `${c.primary}40` }" />
              </div>
            </div>
          </div>

          <!-- BOTTOM: Floral event info -->
          <div class="flex flex-col" style="height: 50%" :style="{ background: c.bg, fontFamily: c.font }">
            <!-- Botanical top border -->
            <div class="flex-shrink-0 flex items-center gap-1 px-3 pt-2 pb-1 justify-center" :style="{ borderTop: `2px solid ${c.primary}25` }">
              <div class="h-px flex-1" :style="{ background: `${c.primary}25` }" />
              <span class="text-[9px]" :style="{ color: c.secondary }">❀</span>
              <p class="text-[8px] font-bold tracking-[0.18em] uppercase" :style="{ color: c.primary }">Thông Tin Lễ Cưới</p>
              <span class="text-[9px]" :style="{ color: c.secondary }">❀</span>
              <div class="h-px flex-1" :style="{ background: `${c.primary}25` }" />
            </div>

            <div class="flex flex-1 flex-col items-center justify-center gap-1.5 px-3 py-1">
              <div class="w-full rounded-lg px-3 py-1.5" :style="{ background: `${c.primary}10`, border: `1px solid ${c.primary}20` }">
                <p class="text-[8px] font-bold" :style="{ color: c.primary }">🌸 Lễ Vu Quy</p>
                <p class="text-[7px] mt-0.5" :style="{ color: c.text, opacity: 0.65 }">08:00 · 12/12/2025 · TP.HCM</p>
              </div>
              <div class="w-full rounded-lg px-3 py-1.5" :style="{ background: `${c.primary}10`, border: `1px solid ${c.primary}20` }">
                <p class="text-[8px] font-bold" :style="{ color: c.primary }">💐 Lễ Thành Hôn</p>
                <p class="text-[7px] mt-0.5" :style="{ color: c.text, opacity: 0.65 }">18:00 · 12/12/2025 · Tiệc Cưới</p>
              </div>
              <p class="text-[7px] italic" :style="{ color: c.text, opacity: 0.38 }">Trân trọng kính mời ✦</p>
            </div>

            <div class="h-2 flex-shrink-0" :style="{ background: `linear-gradient(90deg,${c.secondary},${c.primary},${c.accent})` }" />
          </div>
        </template>

      </div>
      <!-- ═══ END INNER SCROLLING CONTAINER ═══ -->


      <!-- PRO badge -->
      <span
        v-if="template.plan_required === 'pro'"
        class="absolute right-2.5 top-2.5 z-10 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-amber-900 shadow"
      >PRO</span>

      <!-- Hot badge -->
      <span
        v-else-if="isPopular"
        class="absolute left-2.5 top-2.5 z-10 rounded-full bg-rose-500 px-2.5 py-1 text-xs font-bold text-white shadow"
      >Hot</span>

      <!-- Action buttons — appear fast (300ms), scroll independent -->
      <div
        class="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-2 pb-4 pt-12 opacity-0 transition-opacity duration-300 group-hover:pointer-events-auto group-hover:opacity-100"
        style="background: linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)"
      >
        <button
          class="w-4/5 rounded-xl border border-white/50 bg-white/15 py-2.5 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/25"
          @click.stop="emit('preview', template)"
        >
          Xem demo
        </button>
        <button
          class="w-4/5 rounded-xl bg-white py-2.5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="isSelecting"
          @click.stop="!isSelecting && emit('select', template)"
        >
          {{ isSelecting ? 'Đang tạo...' : 'Dùng mẫu này' }}
        </button>
      </div>
    </div>

    <!-- Template name -->
    <div class="mt-2.5 px-0.5">
      <p class="text-sm font-semibold leading-tight text-gray-800">{{ template.name }}</p>
      <p v-if="template.description" class="mt-0.5 line-clamp-1 text-xs text-gray-400">
        {{ template.description }}
      </p>
    </div>
  </div>
</template>
