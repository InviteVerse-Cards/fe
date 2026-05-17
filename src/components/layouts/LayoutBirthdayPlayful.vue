<script setup lang="ts">
import { computed } from 'vue'
import type { ThemeConfig } from '@/types/section.types'
import DecorationConfetti from '@/components/decorations/DecorationConfetti.vue'

const props = defineProps<{ theme: ThemeConfig }>()

const rootStyle = computed(() => ({
  '--color-primary': props.theme.primary_color,
  '--color-secondary': props.theme.secondary_color,
  '--color-bg': props.theme.background_color,
  '--color-text': props.theme.text_color,
  '--color-accent': props.theme.accent_color,
  '--font-heading': `'${props.theme.font_heading}', sans-serif`,
  '--font-body': `'${props.theme.font_body}', sans-serif`,
  color: props.theme.text_color,
  fontFamily: `'${props.theme.font_body}', sans-serif`,
}))
</script>

<template>
  <div :style="rootStyle" class="relative overflow-hidden min-h-screen">
    <!-- Bold gradient background -->
    <div
      class="pointer-events-none fixed inset-0 z-0"
      :style="{
        background: `linear-gradient(135deg, ${theme.primary_color}, ${theme.secondary_color})`,
        opacity: 0.15
      }"
    />

    <!-- Confetti at 4 corners -->
    <div class="pointer-events-none fixed left-4 top-4 z-[1]">
      <DecorationConfetti :color="theme.primary_color" :size="120" />
    </div>
    <div class="pointer-events-none fixed right-4 top-4 z-[1] rotate-90">
      <DecorationConfetti :color="theme.secondary_color" :size="120" />
    </div>
    <div class="pointer-events-none fixed left-4 bottom-4 z-[1] -rotate-90">
      <DecorationConfetti :color="theme.accent_color" :size="120" />
    </div>
    <div class="pointer-events-none fixed right-4 bottom-4 z-[1] rotate-180">
      <DecorationConfetti :color="theme.primary_color" :size="120" />
    </div>

    <div class="relative z-10 p-4">
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* Bright white cards with border radius */
:deep(section) {
  background: #ffffff;
  border-radius: 24px;
  margin-bottom: 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* Hide background of hero section since card style is applied */
:deep(section:first-child) {
  background: transparent;
  box-shadow: none;
}
:deep(section:first-child > div) {
  background: #ffffff;
  border-radius: 24px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}
</style>
