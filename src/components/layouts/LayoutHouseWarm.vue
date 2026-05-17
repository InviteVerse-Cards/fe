<script setup lang="ts">
import { computed } from 'vue'
import type { ThemeConfig } from '@/types/section.types'
import DecorationHouse from '@/components/decorations/DecorationHouse.vue'

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
    <!-- Subtle warm radial background -->
    <div
      class="pointer-events-none fixed inset-0 z-0"
      :style="{
        background: `radial-gradient(circle at 50% 0%, ${theme.primary_color}22 0%, transparent 70%)`,
      }"
    />

    <!-- House decoration at top -->
    <div class="pointer-events-none fixed left-1/2 top-8 z-[1] -translate-x-1/2 opacity-20">
      <DecorationHouse :color="theme.primary_color" :size="150" />
    </div>

    <!-- House decoration at bottom -->
    <div class="pointer-events-none fixed left-1/2 bottom-8 z-[1] -translate-x-1/2 opacity-10">
      <DecorationHouse :color="theme.secondary_color" :size="200" />
    </div>

    <div class="relative z-10 pt-24 pb-16">
      <slot />
    </div>
  </div>
</template>

<style scoped>
:deep(section) {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  margin: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}
:deep(section:first-child) {
  background: transparent;
  box-shadow: none;
  backdrop-filter: none;
}
</style>
