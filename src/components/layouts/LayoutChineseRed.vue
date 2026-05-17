<script setup lang="ts">
import { computed } from 'vue'
import type { ThemeConfig } from '@/types/section.types'
import DecorationDragonPhoenix from '@/components/decorations/DecorationDragonPhoenix.vue'
import DecorationLotus from '@/components/decorations/DecorationLotus.vue'

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

const textureBg = `url('data:image/svg+xml;utf8,<svg width="40" height="40" xmlns="http://www.w3.org/2000/svg"><path d="M20 0 L40 20 L20 40 L0 20 Z" fill="none" stroke="%23000" stroke-width="0.5"/></svg>')`
</script>

<template>
  <div :style="rootStyle" class="relative overflow-hidden min-h-screen">
    <!-- Diamond grid pattern -->
    <div
      class="pointer-events-none fixed inset-0 z-0 opacity-[0.03]"
      :style="{
        backgroundImage: textureBg,
        backgroundSize: '40px 40px',
      }"
    />

    <div class="pointer-events-none fixed left-0 top-32 z-[1] -translate-x-1/3">
      <DecorationDragonPhoenix side="dragon" :color="theme.primary_color" :opacity="0.1" :size="300" />
    </div>
    <div class="pointer-events-none fixed right-0 top-32 z-[1] translate-x-1/3">
      <DecorationDragonPhoenix side="phoenix" :color="theme.primary_color" :opacity="0.1" :size="300" />
    </div>

    <div class="relative z-10">
      <slot />
    </div>
    
    <div class="pointer-events-none relative z-10 flex justify-center py-6 opacity-30">
      <DecorationLotus variant="full" :color="theme.primary_color" :size="48" />
    </div>
  </div>
</template>

<style scoped>
:deep(section + section) {
  border-top: 1px solid var(--color-accent);
  position: relative;
}
:deep(section + section::before) {
  content: '囍';
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-bg);
  padding: 0 12px;
  color: var(--color-accent);
  font-size: 1.25rem;
  line-height: 1;
}
</style>
