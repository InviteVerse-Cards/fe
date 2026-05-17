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
  '--decoration-color': props.theme.secondary_color,
  backgroundColor: props.theme.background_color,
  color: props.theme.text_color,
  fontFamily: `'${props.theme.font_body}', sans-serif`,
}))
</script>

<template>
  <div :style="rootStyle" class="relative overflow-hidden">
    <div class="pointer-events-none fixed left-0 top-0 z-[1]">
      <FloralDecoration variant="corner-tl" :color="theme.secondary_color" :opacity="0.2" :size="200" />
    </div>
    <div class="pointer-events-none fixed right-0 top-0 z-[1]">
      <FloralDecoration variant="corner-tr" :color="theme.secondary_color" :opacity="0.2" :size="200" />
    </div>
    <div class="pointer-events-none fixed left-0 bottom-0 z-[1]">
      <FloralDecoration variant="corner-bl" :color="theme.secondary_color" :opacity="0.2" :size="200" />
    </div>
    <div class="pointer-events-none fixed right-0 bottom-0 z-[1]">
      <FloralDecoration variant="corner-br" :color="theme.secondary_color" :opacity="0.2" :size="200" />
    </div>

    <div class="relative z-10">
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* Floral dividers between sections */
:deep(section + section) {
  position: relative;
}
:deep(section + section::before) {
  content: '';
  display: block;
  width: 100%;
  height: 40px;
  background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 400 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 100 20 L 300 20" stroke="%23000" stroke-width="0.5" opacity="0.2"/><circle cx="200" cy="20" r="2" fill="%23000" opacity="0.2"/></svg>');
  background-position: center;
  background-repeat: no-repeat;
  position: absolute;
  top: -20px;
  left: 0;
}
</style>
