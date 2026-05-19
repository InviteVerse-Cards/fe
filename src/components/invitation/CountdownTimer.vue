<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { ThemeConfig } from '@/types/section.types'

const props = defineProps<{
  targetDate: string
  expiredMessage?: string
  theme?: ThemeConfig
}>()

interface Remaining { days: number; hours: number; minutes: number; seconds: number }

function getRemaining(): Remaining | null {
  const diff = new Date(props.targetDate).getTime() - Date.now()
  if (diff <= 0) return null
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
  }
}

const remaining = ref<Remaining | null>(getRemaining())
let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => { timer = setInterval(() => { remaining.value = getRemaining() }, 1000) })
onUnmounted(() => { if (timer) clearInterval(timer) })

const LABELS: Record<keyof Remaining, string> = { days: 'Ngày', hours: 'Giờ', minutes: 'Phút', seconds: 'Giây' }
</script>

<template>
  <div v-if="remaining" class="flex justify-center gap-3 sm:gap-4">
    <div
      v-for="(val, unit) in remaining"
      :key="unit"
      class="flex min-w-[64px] flex-col items-center justify-center rounded-xl px-3 py-4 shadow-inner backdrop-blur-sm sm:min-w-[76px]"
      :style="{
        background: theme
          ? `linear-gradient(135deg, ${theme.primary_color}20, ${theme.secondary_color}30)`
          : 'rgba(255,255,255,0.15)',
        border: theme ? `1px solid ${theme.primary_color}30` : '1px solid rgba(255,255,255,0.2)',
      }"
    >
      <span
        class="text-4xl font-bold tabular-nums sm:text-5xl"
        :style="theme ? { color: theme.primary_color } : { color: 'white' }"
      >
        {{ String(val).padStart(2, '0') }}
      </span>
      <span
        class="mt-1 text-xs font-semibold tracking-widest opacity-70"
        :style="theme ? { color: theme.text_color } : { color: 'white' }"
      >
        {{ LABELS[unit] }}
      </span>
    </div>
  </div>
  <p v-else class="text-lg font-medium opacity-70" :style="theme ? { color: theme.primary_color } : {}">
    {{ expiredMessage || '🎉 Sự kiện đã diễn ra!' }}
  </p>
</template>
