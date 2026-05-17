<script setup lang="ts">
import { computed } from 'vue'
import type { ThemeConfig } from '@/types/section.types'

const props = defineProps<{ theme: ThemeConfig }>()

const rootStyle = computed(() => ({
  '--color-primary': props.theme.primary_color,
  '--color-secondary': props.theme.secondary_color,
  '--color-bg': '#FFFFFF',
  '--color-text': props.theme.text_color,
  '--color-accent': props.theme.accent_color,
  '--font-heading': `'${props.theme.font_heading}', sans-serif`,
  '--font-body': `'${props.theme.font_body}', sans-serif`,
  '--section-padding-y': '80px',
  backgroundColor: '#FFFFFF',
  color: props.theme.text_color,
  fontFamily: `'${props.theme.font_body}', sans-serif`,
}))
</script>

<template>
  <div :style="rootStyle" class="relative overflow-hidden min-h-screen">
    <!-- Single hairline rectangle border -->
    <div 
      class="pointer-events-none fixed inset-4 z-[2] border" 
      :style="{ borderColor: props.theme.text_color, opacity: 0.08 }"
    />

    <div class="relative z-10">
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* Minimalist dividers */
:deep(section) {
  padding-top: var(--section-padding-y, 4rem);
  padding-bottom: var(--section-padding-y, 4rem);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}
:deep(section:last-child) {
  border-bottom: none;
}
</style>
