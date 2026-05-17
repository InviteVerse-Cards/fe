<script setup lang="ts">
import { computed } from 'vue'
import type { ThemeConfig } from '@/types/section.types'
import DecorationGoldFrame from '@/components/decorations/DecorationGoldFrame.vue'

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
</script>

<template>
  <div :style="rootStyle" class="relative overflow-hidden min-h-screen">
    <!-- Elegant border frame -->
    <div class="pointer-events-none fixed inset-4 z-[2] border border-opacity-30" :style="{ borderColor: theme.accent_color }" />
    
    <div class="pointer-events-none fixed inset-0 z-[1] flex items-stretch p-4">
      <DecorationGoldFrame
        :color="theme.accent_color"
        :opacity="0.15"
        :width="400"
        :height="800"
        :inset="0"
        class="h-full w-full"
        style="position: absolute; inset: 1rem; width: calc(100% - 2rem); height: calc(100% - 2rem)"
      />
    </div>

    <div class="relative z-10 px-6 py-8">
      <slot />
    </div>
  </div>
</template>

<style scoped>
:deep(section) {
  padding: 3rem 0;
}
:deep(section + section) {
  border-top: 1px solid var(--color-accent);
  position: relative;
}
:deep(section + section::before) {
  content: '✦';
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-bg);
  padding: 0 16px;
  color: var(--color-accent);
  font-size: 1rem;
  opacity: 0.7;
}
</style>
