<script setup lang="ts">
import { computed } from 'vue'
import type { ThemeConfig } from '@/types/section.types'
import DecorationCherryBlossom from '@/components/decorations/DecorationCherryBlossom.vue'
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
</script>

<template>
  <div :style="rootStyle" class="relative overflow-hidden min-h-screen">
    <!-- Fixed background color (photo usually set via CSS var or hero section) -->
    <div class="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat" style="background-image: var(--hero-bg-url, none); opacity: 0.15;" />
    
    <div class="pointer-events-none fixed left-0 top-0 z-[1] opacity-70">
      <DecorationCherryBlossom :color="theme.secondary_color" />
    </div>
    
    <div class="pointer-events-none fixed right-0 bottom-0 z-[1] opacity-70 rotate-180">
      <FloralDecoration variant="corner-br" :color="theme.secondary_color" :opacity="0.3" :size="250" />
    </div>

    <div class="relative z-10">
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* Apply frosted glass to all sections except the first (Hero) */
:deep(section:not(:first-child)) {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  margin: 1rem;
  border-radius: 1rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

/* Floral dividers */
:deep(section:not(:first-child) + section:not(:first-child)) {
  margin-top: 2rem;
  position: relative;
}
:deep(section:not(:first-child) + section:not(:first-child)::before) {
  content: '';
  display: block;
  width: 100%;
  height: 40px;
  background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 400 40" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M 100 20 L 300 20" stroke="%23000" stroke-width="0.5" opacity="0.2"/></svg>');
  background-position: center;
  background-repeat: no-repeat;
  position: absolute;
  top: -30px;
  left: 0;
}
</style>
