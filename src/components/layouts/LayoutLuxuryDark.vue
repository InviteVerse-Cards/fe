<script setup lang="ts">
import { computed } from 'vue'
import type { ThemeConfig } from '@/types/section.types'
import DecorationGoldFrame from '@/components/decorations/DecorationGoldFrame.vue'

const props = defineProps<{ theme: ThemeConfig }>()

const rootStyle = computed(() => ({
  '--color-primary': props.theme.primary_color,
  '--color-secondary': props.theme.secondary_color,
  '--color-bg': '#0F0F0F',
  '--color-text': '#F5F0E8',
  '--color-accent': props.theme.accent_color,
  '--font-heading': `'${props.theme.font_heading}', serif`,
  '--font-body': `'${props.theme.font_body}', sans-serif`,
  backgroundColor: '#0F0F0F',
  color: '#F5F0E8',
  fontFamily: `'${props.theme.font_body}', sans-serif`,
}))

const sectionCardStyle = computed(() => ({
  background: 'rgba(255,255,255,0.04)',
  borderTop: `1px solid ${props.theme.accent_color}30`,
}))
</script>

<template>
  <div :style="rootStyle" class="relative overflow-hidden">
    <!-- Subtle dark radial gradient -->
    <div
      class="pointer-events-none fixed inset-0 z-0"
      :style="{
        background: `radial-gradient(ellipse at 50% 30%, #1a1a1a 0%, #050505 80%)`,
      }"
    />

    <!-- Gold frame — fixed so it persists across scroll -->
    <div class="pointer-events-none fixed inset-x-4 inset-y-4 z-[2] border" :style="{ borderColor: `${theme.accent_color}40` }"/>
    <div class="pointer-events-none fixed inset-x-6 inset-y-6 z-[2] border" :style="{ borderColor: `${theme.accent_color}20` }"/>

    <!-- Corner ornaments -->
    <div
      class="pointer-events-none fixed left-4 top-4 z-[3] h-8 w-8"
      :style="{ color: theme.accent_color, opacity: 0.6 }"
    >
      <svg viewBox="0 0 32 32" fill="none">
        <circle cx="0" cy="0" r="4" fill="currentColor"/>
        <path d="M4 0 L20 0" stroke="currentColor" stroke-width="1"/>
        <path d="M0 4 L0 20" stroke="currentColor" stroke-width="1"/>
      </svg>
    </div>
    <div
      class="pointer-events-none fixed right-4 top-4 z-[3] h-8 w-8"
      :style="{ color: theme.accent_color, opacity: 0.6, transform: 'scaleX(-1)' }"
    >
      <svg viewBox="0 0 32 32" fill="none">
        <circle cx="0" cy="0" r="4" fill="currentColor"/>
        <path d="M4 0 L20 0" stroke="currentColor" stroke-width="1"/>
        <path d="M0 4 L0 20" stroke="currentColor" stroke-width="1"/>
      </svg>
    </div>
    <div
      class="pointer-events-none fixed bottom-4 left-4 z-[3] h-8 w-8"
      :style="{ color: theme.accent_color, opacity: 0.6, transform: 'scaleY(-1)' }"
    >
      <svg viewBox="0 0 32 32" fill="none">
        <circle cx="0" cy="0" r="4" fill="currentColor"/>
        <path d="M4 0 L20 0" stroke="currentColor" stroke-width="1"/>
        <path d="M0 4 L0 20" stroke="currentColor" stroke-width="1"/>
      </svg>
    </div>
    <div
      class="pointer-events-none fixed bottom-4 right-4 z-[3] h-8 w-8"
      :style="{ color: theme.accent_color, opacity: 0.6, transform: 'scale(-1, -1)' }"
    >
      <svg viewBox="0 0 32 32" fill="none">
        <circle cx="0" cy="0" r="4" fill="currentColor"/>
        <path d="M4 0 L20 0" stroke="currentColor" stroke-width="1"/>
        <path d="M0 4 L0 20" stroke="currentColor" stroke-width="1"/>
      </svg>
    </div>

    <!-- Sections slot -->
    <div class="relative z-10">
      <slot />
    </div>

    <!-- Bottom ornament -->
    <div class="relative z-10 py-6 text-center" :style="{ color: theme.accent_color, opacity: 0.5 }">
      <div class="flex items-center justify-center gap-3">
        <div class="h-px w-16" :style="{ background: theme.accent_color }"/>
        <span class="text-lg">✦</span>
        <div class="h-px w-16" :style="{ background: theme.accent_color }"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Override text colors for dark layout */
:deep(*) {
  --color-text: #F5F0E8;
  --color-bg: #0F0F0F;
}
</style>
