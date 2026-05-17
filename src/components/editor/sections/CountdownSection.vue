<script setup lang="ts">
import { computed } from 'vue'
import type { CountdownConfig, ThemeConfig } from '@/types/section.types'
import CountdownTimer from '@/components/invitation/CountdownTimer.vue'
import FloralDecoration from '@/components/invitation/FloralDecoration.vue'

const props = defineProps<{ config: Record<string, unknown>; theme: ThemeConfig; isPreview?: boolean }>()
const cfg = computed(() => props.config as CountdownConfig)
</script>

<template>
  <section
    class="relative overflow-hidden px-6 py-20 text-center"
    data-reveal
    :style="{ backgroundColor: theme.background_color, color: theme.text_color }"
  >
    <!-- Botanical corner accents -->
    <FloralDecoration
      variant="corner-tl"
      :color="theme.primary_color"
      :opacity="0.15"
      :size="150"
      class="absolute left-0 top-0 pointer-events-none"
    />
    <FloralDecoration
      variant="corner-br"
      :color="theme.primary_color"
      :opacity="0.15"
      :size="150"
      class="absolute bottom-0 right-0 pointer-events-none"
    />

    <div class="relative z-10 flex flex-col items-center gap-6">
      <FloralDecoration variant="divider" :color="theme.primary_color" :opacity="0.45" :size="220" />
      <h2
        v-if="cfg.title"
        class="text-2xl font-semibold tracking-wide"
        :style="{ fontFamily: `'${theme.font_heading}', serif`, color: theme.primary_color }"
      >
        {{ cfg.title }}
      </h2>
      <FloralDecoration variant="divider" :color="theme.primary_color" :opacity="0.45" :size="220" />

      <div class="mt-4 w-full">
        <CountdownTimer
          v-if="cfg.target_date"
          :target-date="cfg.target_date"
          :expired-message="cfg.expired_message"
          :theme="theme"
        />
        <p v-else class="text-sm opacity-40">Chọn ngày sự kiện ở sidebar để hiện đếm ngược</p>
      </div>
    </div>
  </section>
</template>
