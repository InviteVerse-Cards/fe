<script setup lang="ts">
import { computed } from 'vue'
import type { ThemeConfig } from '@/types/section.types'
import FloralDecoration from '@/components/invitation/FloralDecoration.vue'

const props = defineProps<{ config: Record<string, unknown>; theme: ThemeConfig; isPreview?: boolean }>()

const title = computed(() => (props.config.title as string | undefined) || 'Lời chúc')

// Preview placeholder wishes
const PREVIEW_WISHES = [
  { name: 'Nguyễn Thị Hương', initial: 'H', message: 'Chúc hai bạn trăm năm hạnh phúc, mãi mãi yêu thương nhau! Hy vọng cuộc sống hôn nhân sẽ luôn tràn đầy niềm vui và bình an.', time: '2 giờ trước' },
  { name: 'Trần Văn Minh', initial: 'M', message: 'Xin chúc mừng đám cưới! Chúc đôi uyên ương luôn hòa thuận, hạnh phúc bên nhau đến đầu bạc răng long.', time: '5 giờ trước' },
  { name: 'Lê Thu Phương', initial: 'P', message: 'Chúc mừng hạnh phúc! Một tình yêu đẹp xứng đáng có một lễ cưới thật đặc biệt. Chúc hai bạn mãi mãi bên nhau!', time: '1 ngày trước' },
]

function initials(name: string) {
  return name
    .split(' ')
    .map(w => w[0])
    .slice(-2)
    .join('')
    .toUpperCase()
}

// Avatar background colors cycling
const AVATAR_BG = ['#F9A8D4', '#A5B4FC', '#86EFAC', '#FDE68A', '#C4B5FD']
function avatarBg(index: number) { return AVATAR_BG[index % AVATAR_BG.length] }
</script>

<template>
  <section
    data-reveal
    class="py-20 px-4"
    :style="{ backgroundColor: theme.background_color, color: theme.text_color }"
  >
    <div class="mx-auto max-w-2xl">
      <!-- Heading -->
      <div class="mb-12 flex flex-col items-center gap-4 text-center">
        <FloralDecoration variant="divider" :color="theme.primary_color" :opacity="0.5" :size="220" />
        <h2
          class="text-3xl font-semibold"
          :style="{ fontFamily: `'${theme.font_heading}', serif`, color: theme.primary_color }"
        >
          {{ title }}
        </h2>
        <p
          class="text-sm opacity-60"
          :style="{ fontFamily: `'${theme.font_body}', sans-serif` }"
        >
          Những lời yêu thương từ người thân và bạn bè
        </p>
        <FloralDecoration variant="divider" :color="theme.primary_color" :opacity="0.5" :size="220" />
      </div>

      <!-- Wish cards -->
      <div class="space-y-5">
        <div
          v-for="(wish, i) in PREVIEW_WISHES"
          :key="i"
          class="flex gap-4 rounded-2xl p-5 shadow-sm transition-shadow hover:shadow-md"
          :style="{ backgroundColor: theme.primary_color + '0D', border: `1px solid ${theme.primary_color}22` }"
        >
          <!-- Avatar -->
          <div
            class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            :style="{ backgroundColor: avatarBg(i) }"
          >
            {{ initials(wish.name) }}
          </div>

          <!-- Content -->
          <div class="min-w-0 flex-1">
            <div class="mb-1 flex items-center justify-between gap-2">
              <p class="text-sm font-semibold" :style="{ color: theme.text_color }">{{ wish.name }}</p>
              <p class="shrink-0 text-xs opacity-40" :style="{ fontFamily: `'${theme.font_body}', sans-serif` }">
                {{ wish.time }}
              </p>
            </div>
            <p
              class="text-sm leading-relaxed opacity-80"
              :style="{ fontFamily: `'${theme.font_body}', sans-serif`, color: theme.text_color }"
            >
              {{ wish.message }}
            </p>
          </div>
        </div>
      </div>

      <!-- Note in preview mode -->
      <p
        v-if="isPreview"
        class="mt-8 text-center text-xs opacity-40"
        :style="{ fontFamily: `'${theme.font_body}', sans-serif` }"
      >
        * Lời chúc thật từ khách sẽ xuất hiện ở đây sau khi xuất bản
      </p>
    </div>
  </section>
</template>
