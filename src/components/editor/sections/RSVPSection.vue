<script setup lang="ts">
import { computed } from 'vue'
import type { RSVPConfig, ThemeConfig } from '@/types/section.types'

const props = defineProps<{ config: Record<string, unknown>; theme: ThemeConfig; isPreview?: boolean }>()
const cfg = computed(() => props.config as RSVPConfig)
</script>

<template>
  <section class="px-6 py-16" :style="{ backgroundColor: theme.background_color, color: theme.text_color }">
    <div class="mx-auto max-w-md">
      <h2
        class="mb-2 text-center text-2xl font-bold"
        :style="{ fontFamily: `'${theme.font_heading}', serif`, color: theme.primary_color }"
      >
        {{ cfg.title || 'Xác nhận tham dự' }}
      </h2>
      <p
        v-if="cfg.subtitle"
        class="mb-6 text-center text-sm opacity-70"
        :style="{ fontFamily: `'${theme.font_body}', sans-serif` }"
      >
        {{ cfg.subtitle }}
      </p>

      <!-- Preview only — not functional -->
      <div class="space-y-3 opacity-60">
        <div class="rounded-lg border border-gray-200 px-4 py-3 text-sm">Tên của bạn *</div>
        <div class="flex gap-2">
          <div class="flex-1 rounded-lg border-2 p-3 text-sm text-center" :style="{ borderColor: theme.primary_color }">✅ Có, tôi sẽ đến</div>
          <div class="flex-1 rounded-lg border border-gray-200 p-3 text-sm text-center">❌ Không thể đến</div>
        </div>
        <div
          class="w-full rounded-lg py-3 text-center text-sm font-semibold text-white"
          :style="{ backgroundColor: theme.primary_color }"
        >
          Xác nhận
        </div>
      </div>
    </div>
  </section>
</template>
