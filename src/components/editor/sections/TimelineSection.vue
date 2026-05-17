<script setup lang="ts">
import { computed } from 'vue'
import type { ThemeConfig } from '@/types/section.types'

const props = defineProps<{
  config: Record<string, unknown>
  theme: ThemeConfig
  isPreview?: boolean
}>()

interface TimelineEvent {
  date?: string
  title: string
  description?: string
  image?: string
}

const events = computed(() => (props.config.events as TimelineEvent[]) ?? [])
const title = computed(() => (props.config.title as string) || 'Hành Trình Của Chúng Tôi')
</script>

<template>
  <section
    class="px-4 py-16"
    data-reveal
    :style="{ backgroundColor: theme.background_color, color: theme.text_color }"
  >
    <div class="mx-auto max-w-3xl">
      <h2
        class="mb-12 text-center text-3xl font-bold"
        :style="{ fontFamily: `'${theme.font_heading}', serif`, color: theme.primary_color }"
      >
        {{ title }}
      </h2>

      <div v-if="events.length > 0" class="relative">
        <!-- Vertical connector line -->
        <div
          class="absolute left-1/2 top-0 h-full w-0.5 -translate-x-1/2"
          :style="{ backgroundColor: theme.primary_color + '40' }"
        />

        <div
          v-for="(event, i) in events"
          :key="i"
          class="relative mb-10 flex"
          :class="i % 2 === 0 ? 'flex-row' : 'flex-row-reverse'"
        >
          <!-- Content side -->
          <div class="w-5/12 px-4" :class="i % 2 === 0 ? 'text-right' : 'text-left'">
            <p v-if="event.date" class="mb-1 text-xs font-semibold uppercase tracking-widest opacity-60">{{ event.date }}</p>
            <h3 class="mb-1 font-semibold" :style="{ fontFamily: `'${theme.font_heading}', serif` }">{{ event.title }}</h3>
            <p v-if="event.description" class="text-sm opacity-70 leading-relaxed">{{ event.description }}</p>
            <img v-if="event.image" :src="event.image" :alt="event.title" class="mt-2 w-full rounded-xl object-cover h-32" loading="lazy" />
          </div>

          <!-- Center dot -->
          <div class="relative flex w-2/12 items-center justify-center">
            <div
              class="z-10 h-4 w-4 rounded-full border-2 border-white shadow"
              :style="{ backgroundColor: theme.primary_color }"
            />
          </div>

          <!-- Empty side -->
          <div class="w-5/12" />
        </div>
      </div>

      <div v-else class="py-12 text-center opacity-40">
        <p class="text-sm">Thêm mốc tình yêu ở sidebar</p>
      </div>
    </div>
  </section>
</template>
