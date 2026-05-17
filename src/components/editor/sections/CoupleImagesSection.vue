<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useEditorStore } from '@/stores/editor.store'
import type { CoupleImagesConfig, ThemeConfig } from '@/types/section.types'

const props = defineProps<{ config: Record<string, unknown>; theme: ThemeConfig; isPreview?: boolean }>()
const cfg = computed(() => props.config as CoupleImagesConfig)

const editorStore = useEditorStore()
const { previewMode } = storeToRefs(editorStore)

// When in editor preview, use previewMode to force exact size.
// On public page (isPreview=false), fall back to responsive Tailwind breakpoints.
const avatarClass = computed(() => {
  if (!props.isPreview) return 'h-28 w-28 border-4 md:h-56 md:w-56 md:border-8'
  return previewMode.value === 'mobile' ? 'h-28 w-28 border-4' : 'h-56 w-56 border-8'
})

const spacingClass = computed(() => {
  if (!props.isPreview) return 'space-y-3 md:space-y-6'
  return previewMode.value === 'mobile' ? 'space-y-3' : 'space-y-6'
})

const gapClass = computed(() => {
  if (!props.isPreview) return 'gap-4 md:gap-8'
  return previewMode.value === 'mobile' ? 'gap-4' : 'gap-8'
})

const iconClass = computed(() => {
  if (!props.isPreview) return 'h-12 w-12 md:h-20 md:w-20'
  return previewMode.value === 'mobile' ? 'h-12 w-12' : 'h-20 w-20'
})
</script>

<template>
  <section
    class="relative px-6 py-20"
    data-reveal
    :style="{ backgroundColor: theme.background_color }"
  >
    <div class="mx-auto max-w-4xl">
      <div class="grid grid-cols-2" :class="gapClass">
        <!-- Groom profile -->
        <div class="flex flex-col items-center" :class="spacingClass">
          <div
            class="relative overflow-hidden rounded-full border-white shadow-2xl"
            :class="avatarClass"
            :style="{ borderColor: 'white' }"
          >
            <img
              v-if="cfg.groom_photo_url"
              :src="cfg.groom_photo_url"
              class="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
              alt="Groom"
            />
            <div v-else class="flex h-full w-full items-center justify-center bg-gray-50 text-gray-200">
              <svg :class="iconClass" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
          <div class="text-center">
            <h3
              class="font-bold italic"
              :class="!isPreview ? 'text-lg md:text-2xl' : previewMode === 'mobile' ? 'text-lg' : 'text-2xl'"
              :style="{ fontFamily: `'${theme.font_heading}', serif`, color: theme.primary_color }"
            >
              Chú Rể
            </h3>
          </div>
        </div>

        <!-- Bride profile -->
        <div class="flex flex-col items-center" :class="spacingClass">
          <div
            class="relative overflow-hidden rounded-full border-white shadow-2xl"
            :class="avatarClass"
            :style="{ borderColor: 'white' }"
          >
            <img
              v-if="cfg.bride_photo_url"
              :src="cfg.bride_photo_url"
              class="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
              alt="Bride"
            />
            <div v-else class="flex h-full w-full items-center justify-center bg-gray-50 text-gray-200">
              <svg :class="iconClass" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          </div>
          <div class="text-center">
            <h3
              class="font-bold italic"
              :class="!isPreview ? 'text-lg md:text-2xl' : previewMode === 'mobile' ? 'text-lg' : 'text-2xl'"
              :style="{ fontFamily: `'${theme.font_heading}', serif`, color: theme.primary_color }"
            >
              Cô Dâu
            </h3>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
