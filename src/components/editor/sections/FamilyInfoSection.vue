<script setup lang="ts">
import { computed } from 'vue'
import type { FamilyInfoConfig, ThemeConfig, FamilySide } from '@/types/section.types'
import FloralDecoration from '@/components/invitation/FloralDecoration.vue'

const props = defineProps<{ config: Record<string, unknown>; theme: ThemeConfig; isPreview?: boolean }>()
const cfg = computed(() => props.config as unknown as FamilyInfoConfig)

function familySideValid(side: FamilySide | undefined): boolean {
  return !!(side?.father?.name || side?.mother?.name)
}
</script>

<template>
  <section
    class="relative px-4 py-20 text-center"
    data-reveal
    :style="{ backgroundColor: theme.background_color, color: theme.text_color }"
  >
    <div class="mx-auto max-w-4xl">
      <!-- Heading -->
      <div class="mb-12 flex flex-col items-center gap-3">
        <FloralDecoration variant="divider" :color="theme.primary_color" :opacity="0.45" :size="240" />
        <h2
          class="text-3xl font-semibold"
          :style="{ fontFamily: `'${theme.font_heading}', serif`, color: theme.primary_color }"
        >
          {{ cfg.title || 'Thông báo hôn lễ' }}
        </h2>
        <FloralDecoration variant="divider" :color="theme.primary_color" :opacity="0.45" :size="240" />
      </div>

      <!-- Two-column family layout -->
      <div class="grid grid-cols-1 gap-0 sm:grid-cols-2">
        <!-- Groom family (Nhà Trai) -->
        <div
          class="border-b pb-10 sm:border-b-0 sm:border-r sm:pb-0 sm:pr-10"
          :style="{ borderColor: theme.primary_color + '30' }"
        >
          <p
            class="mb-6 text-xs uppercase tracking-[0.2em] font-semibold opacity-60"
            :style="{ color: theme.primary_color }"
          >
            {{ cfg.groom_family?.family_name || 'Nhà Trai' }}
          </p>
          <p
            class="mb-1 text-sm italic opacity-60"
            :style="{ fontFamily: `'${theme.font_body}', sans-serif` }"
          >
            {{ cfg.groom_family?.note || 'Trân trọng thông báo' }}
          </p>
          <div
            class="mt-5 space-y-3"
            :style="{ fontFamily: `'${theme.font_body}', sans-serif` }"
          >
            <div v-if="cfg.groom_family?.father?.name || !isPreview">
              <p class="text-xs opacity-50">{{ cfg.groom_family?.father?.title || 'Ông' }}</p>
              <p class="text-lg font-semibold" :style="{ color: theme.text_color }">
                {{ cfg.groom_family?.father?.name || (isPreview ? '—' : 'Chưa điền') }}
              </p>
            </div>
            <div v-if="cfg.groom_family?.mother?.name || !isPreview">
              <p class="text-xs opacity-50">{{ cfg.groom_family?.mother?.title || 'Bà' }}</p>
              <p class="text-lg font-semibold" :style="{ color: theme.text_color }">
                {{ cfg.groom_family?.mother?.name || (isPreview ? '—' : 'Chưa điền') }}
              </p>
            </div>
          </div>
        </div>

        <!-- Divider ornament (between columns on md+) -->
        <div class="hidden sm:absolute sm:left-1/2 sm:top-1/2 sm:block sm:-translate-x-1/2 sm:-translate-y-1/2">
          <div
            class="flex h-10 w-10 items-center justify-center rounded-full text-lg"
            :style="{ backgroundColor: theme.primary_color + '20', color: theme.primary_color }"
          >
            ✦
          </div>
        </div>

        <!-- Bride family (Nhà Gái) -->
        <div class="pt-10 sm:pl-10 sm:pt-0">
          <p
            class="mb-6 text-xs uppercase tracking-[0.2em] font-semibold opacity-60"
            :style="{ color: theme.primary_color }"
          >
            {{ cfg.bride_family?.family_name || 'Nhà Gái' }}
          </p>
          <p
            class="mb-1 text-sm italic opacity-60"
            :style="{ fontFamily: `'${theme.font_body}', sans-serif` }"
          >
            {{ cfg.bride_family?.note || 'Trân trọng thông báo' }}
          </p>
          <div
            class="mt-5 space-y-3"
            :style="{ fontFamily: `'${theme.font_body}', sans-serif` }"
          >
            <div v-if="cfg.bride_family?.father?.name || !isPreview">
              <p class="text-xs opacity-50">{{ cfg.bride_family?.father?.title || 'Ông' }}</p>
              <p class="text-lg font-semibold" :style="{ color: theme.text_color }">
                {{ cfg.bride_family?.father?.name || (isPreview ? '—' : 'Chưa điền') }}
              </p>
            </div>
            <div v-if="cfg.bride_family?.mother?.name || !isPreview">
              <p class="text-xs opacity-50">{{ cfg.bride_family?.mother?.title || 'Bà' }}</p>
              <p class="text-lg font-semibold" :style="{ color: theme.text_color }">
                {{ cfg.bride_family?.mother?.name || (isPreview ? '—' : 'Chưa điền') }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-if="!familySideValid(cfg.groom_family) && !familySideValid(cfg.bride_family)"
        class="mt-8 py-6 text-sm opacity-40"
        :style="{ color: theme.text_color }"
      >
        Điền tên bố mẹ hai bên ở sidebar
      </div>
    </div>
  </section>
</template>
