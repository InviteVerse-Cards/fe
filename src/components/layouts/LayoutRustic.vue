<script setup lang="ts">
import { computed } from 'vue'
import type { ThemeConfig } from '@/types/section.types'
import FloralDecoration from '@/components/invitation/FloralDecoration.vue'

const props = defineProps<{ theme: ThemeConfig }>()

const rootStyle = computed(() => ({
  '--color-primary': props.theme.primary_color,
  '--color-secondary': props.theme.secondary_color,
  '--color-bg': props.theme.background_color,
  '--color-text': props.theme.text_color,
  '--color-accent': props.theme.accent_color,
  '--font-heading': `'${props.theme.font_heading}', serif`,
  '--font-body': `'${props.theme.font_body}', sans-serif`,
  backgroundColor: props.theme.background_color,
  color: props.theme.text_color,
  fontFamily: `'${props.theme.font_body}', sans-serif`,
}))

const textureBg = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch"/></filter><rect width="200" height="200" fill="%23e4d5b7"/><rect width="200" height="200" filter="url(%23n)" opacity="0.5"/></svg>')`
</script>

<template>
  <div :style="rootStyle" class="relative overflow-hidden min-h-screen">
    <!-- Linen texture background -->
    <div
      class="pointer-events-none fixed inset-0 z-0 opacity-20 mix-blend-multiply"
      :style="{ backgroundImage: textureBg }"
    />

    <div class="pointer-events-none fixed left-0 top-0 z-[1]">
      <FloralDecoration variant="corner-tl" :color="theme.secondary_color" :opacity="0.3" :size="220" />
    </div>
    <div class="pointer-events-none fixed right-0 bottom-0 z-[1]">
      <FloralDecoration variant="corner-br" :color="theme.secondary_color" :opacity="0.3" :size="220" />
    </div>

    <div class="relative z-10">
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* Sepia filter on hero image */
:deep(section:first-child .bg-cover),
:deep(section:first-child img) {
  filter: sepia(15%) saturate(110%);
}

/* Wheat sprig dividers */
:deep(section + section) {
  position: relative;
}
:deep(section + section::before) {
  content: '';
  display: block;
  width: 100%;
  height: 40px;
  background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 400 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 150 20 Q 200 10 250 20 Q 200 30 150 20" stroke="%238c7a6b" stroke-width="1.5" fill="none" opacity="0.4"/></svg>');
  background-position: center;
  background-repeat: no-repeat;
  position: absolute;
  top: -20px;
  left: 0;
}
</style>
