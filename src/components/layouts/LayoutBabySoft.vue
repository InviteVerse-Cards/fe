<script setup lang="ts">
import { computed } from 'vue'
import type { ThemeConfig } from '@/types/section.types'
import DecorationBabyIcons from '@/components/decorations/DecorationBabyIcons.vue'

const props = defineProps<{ theme: ThemeConfig }>()

const rootStyle = computed(() => ({
  '--color-primary': props.theme.primary_color,
  '--color-secondary': props.theme.secondary_color,
  '--color-bg': props.theme.background_color,
  '--color-text': props.theme.text_color,
  '--color-accent': props.theme.accent_color,
  '--font-heading': `'${props.theme.font_heading}', sans-serif`,
  '--font-body': `'${props.theme.font_body}', sans-serif`,
  backgroundColor: props.theme.background_color,
  color: props.theme.text_color,
  fontFamily: `'${props.theme.font_body}', sans-serif`,
}))
</script>

<template>
  <div :style="rootStyle" class="relative overflow-hidden min-h-screen">
    <!-- Scattered clouds -->
    <div class="pointer-events-none fixed left-8 top-12 z-[1]">
      <DecorationBabyIcons variant="cloud" :color="theme.primary_color" :opacity="0.3" :size="80" />
    </div>
    <div class="pointer-events-none fixed right-12 top-32 z-[1]">
      <DecorationBabyIcons variant="cloud" :color="theme.secondary_color" :opacity="0.3" :size="60" />
    </div>
    <div class="pointer-events-none fixed left-1/4 bottom-24 z-[1]">
      <DecorationBabyIcons variant="cloud" :color="theme.accent_color" :opacity="0.2" :size="100" />
    </div>
    <div class="pointer-events-none fixed right-8 bottom-12 z-[1]">
      <DecorationBabyIcons variant="cloud" :color="theme.primary_color" :opacity="0.25" :size="70" />
    </div>

    <div class="relative z-10 p-4 sm:p-6">
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* Rounded corners and soft shadows */
:deep(section) {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(4px);
  border-radius: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);
  overflow: hidden;
}

:deep(section:first-child) {
  background: transparent;
  box-shadow: none;
}
:deep(section:first-child > div) {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(4px);
  border-radius: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.03);
}

/* Star dividers */
:deep(section + section) {
  position: relative;
}
:deep(section + section::before) {
  content: '★';
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--color-accent);
  opacity: 0.4;
  font-size: 1.5rem;
}
</style>
