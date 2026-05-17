<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import type { HeroConfig, ThemeConfig } from '@/types/section.types'
import CountdownTimer from '@/components/invitation/CountdownTimer.vue'
import FloralDecoration from '@/components/invitation/FloralDecoration.vue'

const props = defineProps<{
  config: Record<string, unknown>
  theme: ThemeConfig
  isPreview?: boolean
  guestName?: string
}>()

const cfg = computed(() => props.config as HeroConfig)

const overlayStyle = computed(() => ({
  backgroundColor: `rgba(0,0,0,${((cfg.value.background_overlay ?? 35) as number) / 100})`,
}))

// Parallax
const scrollY = ref(0)
const handleScroll = () => { scrollY.value = window.scrollY }
const bgTransform = computed(() => {
  if (props.isPreview || !cfg.value.background_url) return 'translateY(0) scale(1.15)'
  return `translateY(${scrollY.value * 0.25}px) scale(1.15)`
})

onMounted(() => {
  if (!props.isPreview) window.addEventListener('scroll', handleScroll, { passive: true })
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Calligraphy fonts — these look best at larger sizes
const CALLIGRAPHY_FONTS = ['Great Vibes', 'Dancing Script', 'Pinyon Script', 'Sacramento']
const isCalligraphyFont = computed(() => CALLIGRAPHY_FONTS.includes(props.theme.font_heading))
const nameSize = computed(() => isCalligraphyFont.value ? 'text-7xl sm:text-9xl' : 'text-5xl sm:text-7xl')
const nameFontWeight = computed(() => isCalligraphyFont.value ? 'font-normal' : 'font-bold')
const andSize = computed(() => isCalligraphyFont.value ? 'text-4xl sm:text-6xl' : 'text-3xl sm:text-4xl')

// Floating petals config
const PETALS = [
  { left: '8%',  delay: 0,    duration: 9,  size: 10, drift: 30,  rot: 280 },
  { left: '18%', delay: 2.5,  duration: 11, size: 7,  drift: -20, rot: 400 },
  { left: '30%', delay: 1,    duration: 8,  size: 12, drift: 40,  rot: 320 },
  { left: '42%', delay: 4,    duration: 13, size: 8,  drift: -30, rot: 360 },
  { left: '55%', delay: 0.5,  duration: 10, size: 9,  drift: 25,  rot: 450 },
  { left: '67%', delay: 3,    duration: 9,  size: 11, drift: -40, rot: 300 },
  { left: '76%', delay: 1.5,  duration: 12, size: 7,  drift: 35,  rot: 380 },
  { left: '85%', delay: 6,    duration: 10, size: 10, drift: -25, rot: 420 },
  { left: '92%', delay: 2,    duration: 8,  size: 8,  drift: 20,  rot: 360 },
  { left: '50%', delay: 7,    duration: 11, size: 6,  drift: -35, rot: 300 },
]

const floral_color = computed(() =>
  cfg.value.background_url ? '#ffffff' : props.theme.primary_color
)
const content_color = computed(() =>
  cfg.value.background_url ? '#ffffff' : props.theme.text_color
)
const petal_color = computed(() =>
  cfg.value.background_url ? 'rgba(255,255,255,0.55)' : props.theme.primary_color + '88'
)

const effectiveLayout = computed(() =>
  (cfg.value.layout_type as string | undefined)
  ?? (cfg.value.layout_variant as string | undefined)  // backward compat
  ?? 'botanical'
)

const romanize = (num: number) => {
  const lookup: { [key: string]: number } = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1}
  let roman = ''
  for (let i in lookup) {
    while (num >= lookup[i]) {
      roman += i
      num -= lookup[i]
    }
  }
  return roman
}

const romanDate = computed(() => {
  if (!cfg.value.event_date) return ''
  const d = new Date(cfg.value.event_date)
  return `${romanize(d.getDate())} · ${romanize(d.getMonth() + 1)} · ${romanize(d.getFullYear())}`
})
</script>


<template>
  <!-- ═══════════════════════════════════════════════════════
       CHINESE RED / Á ĐÔNG VARIANT
       Solid primary_color background, 囍 symbol, gold borders
  ═══════════════════════════════════════════════════════ -->
  <section
    v-if="effectiveLayout === 'chinese-red'"
    class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
    :style="{ fontFamily: `'${theme.font_heading}', serif`, backgroundColor: theme.primary_color }"
  >
    <!-- Decorative double-border frame -->
    <div class="absolute inset-4 rounded border pointer-events-none opacity-40" :style="{ borderColor: theme.accent_color }" />
    <div class="absolute inset-6 rounded border pointer-events-none opacity-20" :style="{ borderColor: theme.accent_color }" />

    <!-- Subtle grid pattern overlay -->
    <div
      class="absolute inset-0 opacity-5 pointer-events-none"
      style="background-image: repeating-linear-gradient(45deg, rgba(255,255,255,.15) 0, rgba(255,255,255,.15) 1px, transparent 0, transparent 50%); background-size: 20px 20px"
    />

    <!-- Floating petals -->
    <template v-if="!isPreview">
      <span
        v-for="(p, i) in PETALS"
        :key="i"
        class="petal pointer-events-none absolute top-0"
        :style="{
          left: p.left,
          width: `${p.size}px`,
          height: `${p.size * 1.4}px`,
          backgroundColor: theme.accent_color + '88',
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.duration}s`,
          '--drift': `${p.drift}px`,
          '--rot': `${p.rot}deg`,
        }"
      />
    </template>

    <!-- Content -->
    <div class="relative z-10 flex flex-col items-center px-8 py-20 text-center text-white">
      <!-- 囍 circle -->
      <div
        class="mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 animate-fade-in"
        :style="{ borderColor: theme.accent_color }"
        style="animation-delay: 0.1s"
      >
        <span class="text-4xl font-bold leading-none" :style="{ color: theme.accent_color }">囍</span>
      </div>

      <!-- Tagline -->
      <p
        v-if="cfg.tagline"
        class="mb-4 text-sm uppercase tracking-[0.32em] animate-fade-in"
        :style="{ color: theme.accent_color, animationDelay: '0.25s' }"
      >
        {{ cfg.tagline }}
      </p>

      <!-- Gold divider -->
      <div class="my-3 flex w-3/4 items-center gap-3 animate-fade-in" style="animation-delay: 0.35s">
        <div class="h-px flex-1 opacity-50" :style="{ background: theme.accent_color }" />
        <span :style="{ color: theme.accent_color }">❧</span>
        <div class="h-px flex-1 opacity-50" :style="{ background: theme.accent_color }" />
      </div>

      <!-- Names -->
      <h1 class="leading-tight text-white animate-fade-in" :class="[nameSize, nameFontWeight]" style="animation-delay: 0.5s">
        {{ cfg.groom_name || 'Chú Rể' }}
      </h1>
      <p class="my-5 font-light italic leading-none" :class="andSize" :style="{ color: theme.accent_color }">
        &amp;
      </p>
      <h1 class="leading-tight text-white animate-fade-in" :class="[nameSize, nameFontWeight]" style="animation-delay: 0.8s">
        {{ cfg.bride_name || 'Cô Dâu' }}
      </h1>

      <!-- Bottom gold divider -->
      <div class="my-5 flex w-3/4 items-center gap-3 animate-fade-in" style="animation-delay: 1s">
        <div class="h-px flex-1 opacity-50" :style="{ background: theme.accent_color }" />
        <span :style="{ color: theme.accent_color }">✦</span>
        <div class="h-px flex-1 opacity-50" :style="{ background: theme.accent_color }" />
      </div>

      <!-- Guest personalization -->
      <div
        v-if="guestName"
        class="mt-4 animate-fade-in rounded-2xl px-5 py-3"
        :style="{
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(8px)',
          border: `1px solid ${theme.accent_color}60`,
          animationDelay: '1.2s',
          fontFamily: `'${theme.font_body}', sans-serif`,
        }"
      >
        <p class="text-xs uppercase tracking-[0.2em] opacity-70">Kính mời</p>
        <p class="mt-1 text-lg font-semibold">{{ guestName }}</p>
      </div>

      <!-- Event date -->
      <p
        v-if="cfg.event_date && !cfg.show_countdown"
        class="mt-8 text-lg opacity-80 animate-fade-in"
        :style="{ fontFamily: `'${theme.font_body}', sans-serif`, animationDelay: '1.3s' }"
      >
        {{ new Date(cfg.event_date).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }) }}
      </p>

      <!-- Countdown -->
      <div v-if="cfg.show_countdown && cfg.event_date" class="mt-10 animate-fade-in" style="animation-delay: 1.4s">
        <CountdownTimer :target-date="cfg.event_date" :theme="theme" />
      </div>
    </div>

    <!-- Scroll chevron -->
    <div class="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
      <svg class="h-7 w-7 opacity-40" :style="{ color: theme.accent_color }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════════
       CALLIGRAPHY / MINIMAL VARIANT
       Clean light background, oversized script names, minimal deco
  ═══════════════════════════════════════════════════════ -->
  <section
    v-else-if="effectiveLayout === 'calligraphy'"
    class="relative flex min-h-screen items-center justify-center overflow-hidden"
    :style="{ fontFamily: `'${theme.font_heading}', serif`, backgroundColor: theme.background_color, color: theme.text_color }"
  >
    <!-- Radial tint -->
    <div
      class="absolute inset-0 opacity-20 pointer-events-none"
      :style="{ background: `radial-gradient(ellipse at top, ${theme.secondary_color}80 0%, transparent 70%)` }"
    />

    <!-- Botanical corners — very low opacity for minimal style -->
    <FloralDecoration
      variant="corner-tl"
      :color="theme.primary_color"
      :opacity="0.10"
      :size="200"
      class="absolute left-0 top-0 pointer-events-none"
    />
    <FloralDecoration
      variant="corner-tr"
      :color="theme.primary_color"
      :opacity="0.10"
      :size="200"
      class="absolute right-0 top-0 pointer-events-none"
    />

    <!-- Content -->
    <div class="relative z-10 flex flex-col items-center px-8 py-20 text-center">
      <!-- "The Wedding of" label -->
      <p
        class="mb-3 text-xs tracking-[0.5em] uppercase opacity-35 animate-fade-in"
        :style="{ fontFamily: `'${theme.font_body}', sans-serif`, animationDelay: '0.1s' }"
      >
        The Wedding of
      </p>

      <!-- Top ornament -->
      <div class="flex w-3/4 items-center gap-3 mb-6 animate-fade-in" style="animation-delay: 0.2s">
        <div class="h-px flex-1 opacity-20" :style="{ background: theme.primary_color }" />
        <span class="text-xs opacity-50" :style="{ color: theme.primary_color }">✦</span>
        <div class="h-px flex-1 opacity-20" :style="{ background: theme.primary_color }" />
      </div>

      <!-- Huge calligraphy names — the hero of this layout -->
      <h1
        class="leading-tight animate-fade-in"
        :class="[nameSize, nameFontWeight]"
        :style="{ color: theme.primary_color, animationDelay: '0.35s' }"
      >
        {{ cfg.groom_name || 'Chú Rể' }}
      </h1>

      <div class="my-8 flex flex-col items-center gap-3 animate-fade-in" style="animation-delay: 0.7s">
        <FloralDecoration variant="divider" :color="theme.primary_color" :opacity="0.28" :size="220" />
        <p class="font-light italic leading-none" :class="andSize" :style="{ color: theme.text_color, opacity: '0.45' }">&amp;</p>
        <FloralDecoration variant="divider" :color="theme.primary_color" :opacity="0.28" :size="220" />
      </div>

      <h1
        class="leading-tight animate-fade-in"
        :class="[nameSize, nameFontWeight]"
        :style="{ color: theme.primary_color, animationDelay: '1.0s' }"
      >
        {{ cfg.bride_name || 'Cô Dâu' }}
      </h1>

      <!-- Guest personalization -->
      <div
        v-if="guestName"
        class="mt-10 animate-fade-in rounded-2xl px-6 py-3 border"
        :style="{
          borderColor: `${theme.primary_color}28`,
          background: `${theme.primary_color}08`,
          animationDelay: '1.3s',
          fontFamily: `'${theme.font_body}', sans-serif`,
        }"
      >
        <p class="text-xs uppercase tracking-[0.2em] opacity-50">Kính mời</p>
        <p class="mt-1 text-lg font-semibold" :style="{ color: theme.text_color }">{{ guestName }}</p>
      </div>

      <!-- Event date -->
      <p
        v-if="cfg.event_date && !cfg.show_countdown"
        class="mt-10 text-lg animate-fade-in"
        :style="{ fontFamily: `'${theme.font_body}', sans-serif`, color: theme.text_color, opacity: '0.55', animationDelay: '1.3s' }"
      >
        {{ new Date(cfg.event_date).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }) }}
      </p>

      <!-- Countdown -->
      <div v-if="cfg.show_countdown && cfg.event_date" class="mt-10 animate-fade-in" style="animation-delay: 1.4s">
        <CountdownTimer :target-date="cfg.event_date" :theme="theme" />
      </div>
    </div>

    <!-- Scroll chevron -->
    <div class="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
      <svg class="h-7 w-7" :style="{ color: theme.primary_color, opacity: '0.35' }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════════
       TRADITIONAL VIET VARIANT
  ═══════════════════════════════════════════════════════ -->
  <section
    v-else-if="effectiveLayout === 'traditional-viet'"
    class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
    :style="{ fontFamily: `'${theme.font_heading}', serif`, color: '#FFF5E8' }"
  >
    <div class="relative z-10 flex flex-col items-center px-6 py-20 text-center w-full">
      <!-- 囍 circle -->
      <div
        class="mb-8 flex h-24 w-24 items-center justify-center rounded-full border-2"
        :style="{ borderColor: theme.accent_color }"
      >
        <span class="text-5xl font-bold leading-none" :style="{ color: theme.accent_color }">囍</span>
      </div>

      <!-- Gold divider -->
      <div class="mb-6 flex w-3/4 items-center gap-3">
        <div class="h-px flex-1 opacity-40" :style="{ background: theme.accent_color }" />
        <span class="text-xs opacity-60" :style="{ color: theme.accent_color }">✦</span>
        <div class="h-px flex-1 opacity-40" :style="{ background: theme.accent_color }" />
      </div>

      <!-- Names — always stacked vertically to prevent overflow at 375px -->
      <h1 class="w-full break-words text-center text-4xl font-bold leading-tight">
        {{ cfg.groom_name || 'Chú Rể' }}
      </h1>
      <p class="my-5 text-2xl font-light italic" :style="{ color: theme.accent_color }">&amp;</p>
      <h1 class="w-full break-words text-center text-4xl font-bold leading-tight">
        {{ cfg.bride_name || 'Cô Dâu' }}
      </h1>

      <!-- Bottom divider -->
      <div class="mt-6 flex w-3/4 items-center gap-3">
        <div class="h-px flex-1 opacity-40" :style="{ background: theme.accent_color }" />
        <span class="text-xs opacity-60" :style="{ color: theme.accent_color }">❧</span>
        <div class="h-px flex-1 opacity-40" :style="{ background: theme.accent_color }" />
      </div>

      <p v-if="cfg.event_date" class="mt-8 text-lg tracking-widest uppercase opacity-80">
        {{ new Date(cfg.event_date).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }) }}
      </p>
    </div>
    <div class="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
      <svg class="h-7 w-7 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════════
       LUXURY DARK VARIANT
  ═══════════════════════════════════════════════════════ -->
  <section
    v-else-if="effectiveLayout === 'luxury-dark'"
    class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden p-8"
    :style="{ fontFamily: `'${theme.font_heading}', serif` }"
  >
    <div class="relative z-10 flex w-full max-w-2xl flex-col items-center border p-12 text-center backdrop-blur-sm"
         :style="{ borderColor: `${theme.accent_color}40`, backgroundColor: 'rgba(0,0,0,0.4)' }">
      
      <p v-if="cfg.tagline" class="mb-8 text-xs uppercase tracking-[0.3em]" :style="{ color: theme.accent_color }">
        {{ cfg.tagline }}
      </p>

      <h1 class="bg-clip-text text-transparent leading-tight" 
          :class="[nameSize, nameFontWeight]"
          style="background-image: linear-gradient(to right, #D4A73A, #FFF4D0, #D4A73A);">
        {{ cfg.groom_name || 'Chú Rể' }}
      </h1>
      <p class="my-6 italic" :class="andSize" :style="{ color: theme.accent_color }">&amp;</p>
      <h1 class="bg-clip-text text-transparent leading-tight" 
          :class="[nameSize, nameFontWeight]"
          style="background-image: linear-gradient(to right, #D4A73A, #FFF4D0, #D4A73A);">
        {{ cfg.bride_name || 'Cô Dâu' }}
      </h1>

      <div v-if="romanDate" class="mt-12 tracking-[0.2em] text-lg" :style="{ color: theme.accent_color }">
        {{ romanDate }}
      </div>
    </div>
    <div class="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
      <svg class="h-7 w-7" :style="{ color: theme.accent_color, opacity: '0.5' }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════════
       RUSTIC VARIANT
  ═══════════════════════════════════════════════════════ -->
  <section
    v-else-if="effectiveLayout === 'rustic'"
    class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
    :style="{ fontFamily: `'${theme.font_heading}', serif`, color: '#ffffff' }"
  >
    <div
      v-if="cfg.background_url"
      class="absolute inset-0 bg-cover bg-center will-change-transform"
      :style="{ backgroundImage: `url('${cfg.background_url}')`, transform: bgTransform }"
    />
    <div class="absolute inset-0" :style="overlayStyle" />

    <div class="relative z-10 flex flex-col items-center text-center px-6">
      <FloralDecoration variant="divider" color="#ffffff" :opacity="0.8" :size="200" class="mb-4" />
      <h1 class="leading-tight" :class="[nameSize, nameFontWeight]">
        {{ cfg.groom_name || 'Chú Rể' }}
      </h1>
      <p class="my-4 italic" :class="andSize">&amp;</p>
      <h1 class="leading-tight" :class="[nameSize, nameFontWeight]">
        {{ cfg.bride_name || 'Cô Dâu' }}
      </h1>
      <FloralDecoration variant="divider" color="#ffffff" :opacity="0.8" :size="200" class="mt-4 rotate-180" />
      
      <p v-if="cfg.event_date" class="mt-8 text-xl" :style="{ fontFamily: `'${theme.font_body}', sans-serif` }">
        {{ new Date(cfg.event_date).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }) }}
      </p>
    </div>
    <div class="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
      <svg class="h-7 w-7 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════════
       ROMANTIC PHOTO VARIANT
  ═══════════════════════════════════════════════════════ -->
  <section
    v-else-if="effectiveLayout === 'romantic-photo'"
    class="relative flex min-h-screen flex-col justify-end overflow-hidden pb-32"
    :style="{ fontFamily: `'${theme.font_heading}', serif`, color: '#ffffff' }"
  >
    <div
      v-if="cfg.background_url"
      class="absolute inset-0 bg-cover bg-center"
      :style="{ backgroundImage: `url('${cfg.background_url}')` }"
    />
    <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

    <div class="relative z-10 px-8 text-left max-w-3xl mx-auto w-full">
      <p v-if="cfg.tagline" class="mb-2 text-sm uppercase tracking-widest drop-shadow-md">
        {{ cfg.tagline }}
      </p>
      <h1 class="leading-tight drop-shadow-lg" :class="[nameSize, nameFontWeight]">
        {{ cfg.groom_name || 'Chú Rể' }}
      </h1>
      <p class="my-1 italic drop-shadow-md" :class="andSize">&amp;</p>
      <h1 class="leading-tight drop-shadow-lg" :class="[nameSize, nameFontWeight]">
        {{ cfg.bride_name || 'Cô Dâu' }}
      </h1>
      <p v-if="cfg.event_date" class="mt-4 text-lg drop-shadow-md" :style="{ fontFamily: `'${theme.font_body}', sans-serif` }">
        {{ new Date(cfg.event_date).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }) }}
      </p>
    </div>
    
    <div class="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
      <svg class="h-8 w-8 text-red-400 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
      </svg>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════════
       BIRTHDAY PLAYFUL VARIANT
  ═══════════════════════════════════════════════════════ -->
  <section
    v-else-if="effectiveLayout === 'birthday-playful' || effectiveLayout === 'birthday-elegant' || effectiveLayout === 'baby-soft'"
    class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden"
    :style="{ fontFamily: `'${theme.font_heading}', sans-serif`, color: theme.text_color }"
  >
    <div class="relative z-10 flex flex-col items-center text-center p-8 bg-white/80 backdrop-blur-md rounded-3xl mx-4 shadow-xl w-full max-w-xl">
      <p v-if="cfg.tagline" class="mb-4 text-lg font-bold uppercase tracking-widest" :style="{ color: theme.accent_color }">
        {{ cfg.tagline }}
      </p>
      
      <h1 class="leading-tight text-6xl sm:text-7xl font-black mb-6" :style="{ color: theme.primary_color }">
        {{ (cfg as any).celebrant_name || 'Sinh Nhật' }}
      </h1>
      
      <div v-if="(cfg as any).age_milestone" class="text-2xl font-bold bg-clip-text text-transparent"
           :style="{ backgroundImage: `linear-gradient(to right, ${theme.primary_color}, ${theme.secondary_color})` }">
        Turning {{ (cfg as any).age_milestone }}
      </div>
      
      <p v-if="cfg.event_date" class="mt-6 text-xl font-medium" :style="{ fontFamily: `'${theme.font_body}', sans-serif` }">
        {{ new Date(cfg.event_date).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }) }}
      </p>
    </div>
    <div class="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
      <svg class="h-7 w-7 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </section>

  <!-- ═══════════════════════════════════════════════════════
       DEFAULT VARIANT: hero-scroll, botanical, photo-story
       Full-bleed parallax photo hero (original behavior)
  ═══════════════════════════════════════════════════════ -->
  <section
    v-else
    class="relative flex min-h-screen items-center justify-center overflow-hidden"
    :style="{ fontFamily: `'${theme.font_heading}', serif`, backgroundColor: theme.background_color }"
  >
    <!-- Parallax background -->
    <div
      v-if="cfg.background_url"
      class="absolute inset-0 bg-cover bg-center will-change-transform"
      :style="{ backgroundImage: `url('${cfg.background_url}')`, transform: bgTransform }"
    />

    <!-- Dark overlay -->
    <div v-if="cfg.background_url" class="absolute inset-0" :style="overlayStyle" />

    <!-- Gradient fallback (no photo) -->
    <div
      v-else
      class="absolute inset-0"
      :style="{
        background: `linear-gradient(160deg, ${theme.primary_color}25 0%, ${theme.secondary_color}18 50%, ${theme.accent_color}12 100%)`
      }"
    />

    <!-- Botanical corner decorations -->
    <FloralDecoration
      variant="corner-tl"
      :color="floral_color"
      :opacity="cfg.background_url ? 0.22 : 0.25"
      :size="200"
      class="absolute left-0 top-0 pointer-events-none"
    />
    <FloralDecoration
      variant="corner-tr"
      :color="floral_color"
      :opacity="cfg.background_url ? 0.22 : 0.25"
      :size="200"
      class="absolute right-0 top-0 pointer-events-none"
    />
    <FloralDecoration
      variant="corner-bl"
      :color="floral_color"
      :opacity="cfg.background_url ? 0.15 : 0.18"
      :size="160"
      class="absolute bottom-0 left-0 pointer-events-none"
    />
    <FloralDecoration
      variant="corner-br"
      :color="floral_color"
      :opacity="cfg.background_url ? 0.15 : 0.18"
      :size="160"
      class="absolute bottom-0 right-0 pointer-events-none"
    />

    <!-- Floating petals (public page only) -->
    <template v-if="!isPreview">
      <span
        v-for="(p, i) in PETALS"
        :key="i"
        class="petal pointer-events-none absolute top-0"
        :style="{
          left: p.left,
          width: `${p.size}px`,
          height: `${p.size * 1.4}px`,
          backgroundColor: petal_color,
          animationDelay: `${p.delay}s`,
          animationDuration: `${p.duration}s`,
          '--drift': `${p.drift}px`,
          '--rot': `${p.rot}deg`,
        }"
      />
    </template>

    <!-- Content -->
    <div
      class="relative z-10 flex flex-col items-center px-6 py-20 text-center"
      :style="{ color: content_color }"
    >
      <!-- Tagline -->
      <p
        v-if="cfg.tagline"
        class="mb-6 text-sm uppercase tracking-[0.35em] opacity-80 animate-fade-in"
        :style="{ fontFamily: `'${theme.font_body}', sans-serif`, animationDelay: '0.2s' }"
      >
        {{ cfg.tagline }}
      </p>

      <!-- Couple photo — oval portrait frame -->
      <div
        v-if="cfg.couple_photo_url"
        class="mb-8 animate-fade-in"
        style="animation-delay: 0.35s"
      >
        <div
          class="relative mx-auto overflow-hidden rounded-[50%] shadow-2xl"
          style="width: 176px; height: 224px;"
          :style="{
            border: `4px solid rgba(255,255,255,${cfg.background_url ? '0.85' : '0.6'})`,
            boxShadow: '0 8px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.15)',
          }"
        >
          <img
            :src="cfg.couple_photo_url"
            alt="Ảnh đôi"
            class="h-full w-full object-cover"
          />
        </div>
      </div>

      <!-- Names container (respecting display_order) -->
      <div
        class="flex flex-col items-center"
        :class="cfg.display_order === 'bride_first' ? 'flex-col-reverse' : 'flex-col'"
      >
        <!-- Groom block -->
        <div class="flex flex-col items-center">
          <p
            v-if="cfg.groom_title"
            class="mb-1 text-xs uppercase tracking-widest opacity-60"
            :style="{ fontFamily: `'${theme.font_body}', sans-serif` }"
          >
            {{ cfg.groom_title }}
          </p>
          <h1
            class="leading-tight animate-fade-in"
            :class="[nameSize, nameFontWeight]"
            :style="{ animationDelay: cfg.couple_photo_url ? '0.6s' : '0.5s' }"
          >
            {{ cfg.groom_name || 'Chú Rể' }}
          </h1>
        </div>

        <!-- & separator with floral divider -->
        <div class="my-6 flex flex-col items-center gap-3 animate-fade-in" style="animation-delay: 0.9s">
          <FloralDecoration
            variant="divider"
            :color="content_color"
            :opacity="cfg.background_url ? 0.5 : 0.4"
            :size="240"
          />
          <p
            class="font-light italic leading-none"
            :class="andSize"
            :style="{ color: theme.accent_color, opacity: 0.9 }"
          >
            &amp;
          </p>
          <FloralDecoration
            variant="divider"
            :color="content_color"
            :opacity="cfg.background_url ? 0.5 : 0.4"
            :size="240"
          />
        </div>

        <!-- Bride block -->
        <div class="flex flex-col items-center">
          <p
            v-if="cfg.bride_title"
            class="mb-1 text-xs uppercase tracking-widest opacity-60"
            :style="{ fontFamily: `'${theme.font_body}', sans-serif` }"
          >
            {{ cfg.bride_title }}
          </p>
          <h1
            class="leading-tight animate-fade-in"
            :class="[nameSize, nameFontWeight]"
            style="animation-delay: 1.2s"
          >
            {{ cfg.bride_name || 'Cô Dâu' }}
          </h1>
        </div>
      </div>

      <!-- Guest personalization -->
      <div
        v-if="guestName"
        class="mt-8 animate-fade-in rounded-2xl px-5 py-3"
        :style="{
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.25)',
          animationDelay: '1.4s',
          fontFamily: `'${theme.font_body}', sans-serif`,
          color: content_color,
        }"
      >
        <p class="text-xs uppercase tracking-[0.2em] opacity-70">Kính mời</p>
        <p class="mt-1 text-lg font-semibold">{{ guestName }}</p>
      </div>

      <!-- Event date -->
      <p
        v-if="cfg.event_date && !cfg.show_countdown"
        class="mt-8 text-lg opacity-80 animate-fade-in"
        :style="{ fontFamily: `'${theme.font_body}', sans-serif`, animationDelay: '1.4s' }"
      >
        {{ new Date(cfg.event_date).toLocaleDateString('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }) }}
      </p>

      <!-- Countdown -->
      <div v-if="cfg.show_countdown && cfg.event_date" class="mt-10 animate-fade-in" style="animation-delay: 1.5s">
        <CountdownTimer :target-date="cfg.event_date" :theme="theme" />
      </div>
    </div>

    <!-- Scroll chevron -->
    <div class="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 animate-bounce">
      <svg
        class="h-7 w-7 opacity-50"
        :style="{ color: content_color }"
        fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  </section>
</template>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  opacity: 0;
  animation: fade-in 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@keyframes petal-fall {
  0%   { transform: translateY(-30px) rotate(0deg) translateX(0); opacity: 0; }
  8%   { opacity: 1; }
  92%  { opacity: 0.8; }
  100% { transform: translateY(105vh) rotate(var(--rot, 360deg)) translateX(var(--drift, 30px)); opacity: 0; }
}
.petal {
  border-radius: 50% 0 50% 0;
  animation: petal-fall var(--duration, 10s) var(--delay, 0s) ease-in infinite;
}
</style>
