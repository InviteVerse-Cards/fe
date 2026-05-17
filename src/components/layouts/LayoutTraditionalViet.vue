<script setup lang="ts">
import { computed } from 'vue'
import type { ThemeConfig } from '@/types/section.types'
import DecorationDragonPhoenix from '@/components/decorations/DecorationDragonPhoenix.vue'
import DecorationLotus from '@/components/decorations/DecorationLotus.vue'
import DecorationGoldFrame from '@/components/decorations/DecorationGoldFrame.vue'

const props = defineProps<{ theme: ThemeConfig }>()

const rootStyle = computed(() => ({
  '--color-primary': props.theme.primary_color,
  '--color-secondary': props.theme.secondary_color,
  '--color-bg': props.theme.background_color,
  '--color-text': '#FFF5E8',
  '--color-accent': props.theme.accent_color,
  '--font-heading': `'${props.theme.font_heading}', serif`,
  '--font-body': `'${props.theme.font_body}', sans-serif`,
  // Force deep red as base background
  backgroundColor: '#8B0000',
  color: '#FFF5E8',
  fontFamily: `'${props.theme.font_body}', sans-serif`,
  position: 'relative' as const,
}))
</script>

<template>
  <div :style="rootStyle" class="relative overflow-hidden">
    <!-- Fixed deep-red tinted texture overlay -->
    <div
      class="pointer-events-none fixed inset-0 z-0"
      :style="{
        background: `radial-gradient(ellipse at center, ${theme.primary_color}CC 0%, #5a0000 60%, #3a0000 100%)`,
        opacity: 0.95,
      }"
    />

    <!-- Dragon left decoration -->
    <div class="pointer-events-none fixed left-0 top-1/4 z-[1] -translate-x-1/4">
      <DecorationDragonPhoenix
        side="dragon"
        :color="theme.accent_color"
        :opacity="0.22"
        :size="280"
      />
    </div>

    <!-- Phoenix right decoration -->
    <div class="pointer-events-none fixed right-0 top-1/4 z-[1] translate-x-1/4">
      <DecorationDragonPhoenix
        side="phoenix"
        :color="theme.accent_color"
        :opacity="0.22"
        :size="280"
      />
    </div>

    <!-- Gold frame overlay (pointer-events-none so it doesn't block interactions) -->
    <div class="pointer-events-none fixed inset-0 z-[2] flex items-stretch">
      <DecorationGoldFrame
        :color="theme.accent_color"
        :opacity="0.35"
        :width="400"
        :height="800"
        :inset="12"
        class="h-full w-full"
        style="position: absolute; inset: 0; width: 100%; height: 100%"
      />
    </div>

    <!-- Sections content -->
    <div class="relative z-10">
      <slot />

      <!-- Lotus dividers injected between sections via global CSS -->
    </div>

    <!-- Bottom lotus row decoration -->
    <div class="pointer-events-none relative z-10 flex justify-center py-4 opacity-40">
      <DecorationLotus variant="half" :color="theme.accent_color" :size="60" />
    </div>
  </div>
</template>

<style scoped>
/* Force all text in traditional-viet to be warm white */
:deep(*) {
  --color-text: #FFF5E8;
}
</style>
