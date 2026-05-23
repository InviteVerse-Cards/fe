<script setup lang="ts">
import { computed, ref } from 'vue'
import type { GalleryConfig, ThemeConfig } from '@/types/section.types'
import { getThumbnailUrl } from '@/utils/cloudinaryUrl'
import FloralDecoration from '@/components/invitation/FloralDecoration.vue'

const props = defineProps<{ config: Record<string, unknown>; theme: ThemeConfig; isPreview?: boolean }>()
const cfg = computed(() => props.config as unknown as GalleryConfig)

const lightboxImg = ref<{ url: string; caption?: string } | null>(null)

function openLightbox(img: { url: string; caption?: string }) {
  lightboxImg.value = img
}
function closeLightbox() {
  lightboxImg.value = null
}
</script>

<template>
  <section
    class="px-4 py-16"
    data-reveal
    :style="{ backgroundColor: theme.background_color }"
  >
    <div class="mx-auto max-w-5xl">
      <!-- Section heading -->
      <div v-if="cfg.title" class="mb-10 flex flex-col items-center gap-3 text-center">
        <FloralDecoration variant="divider" :color="theme.primary_color" :opacity="0.45" :size="220" />
        <h2
          class="text-3xl font-semibold"
          :style="{ fontFamily: `'${theme.font_heading}', serif`, color: theme.primary_color }"
        >
          {{ cfg.title }}
        </h2>
        <FloralDecoration variant="divider" :color="theme.primary_color" :opacity="0.45" :size="220" />
      </div>

      <!-- Grid -->
      <div v-if="cfg.images?.length > 0" class="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        <div
          v-for="(img, i) in cfg.images"
          :key="i"
          class="group relative aspect-square cursor-pointer overflow-hidden rounded-xl"
          @click="!isPreview && openLightbox(img)"
        >
          <img
            :src="getThumbnailUrl(img.url)"
            :alt="img.caption || ''"
            loading="lazy"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <!-- Caption overlay -->
          <div
            v-if="img.caption"
            class="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/60 px-2 pb-2 pt-4 text-center text-xs text-white transition-transform duration-300 group-hover:translate-y-0"
          >
            {{ img.caption }}
          </div>
          <!-- Zoom icon on hover -->
          <div class="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div class="rounded-full bg-white/20 p-2 backdrop-blur-sm">
              <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="py-12 text-center text-sm opacity-40" :style="{ color: theme.text_color }">
        Thêm ảnh ở sidebar
      </div>
    </div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="lightbox">
        <div
          v-if="lightboxImg"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          @click.self="closeLightbox"
        >
          <button
            class="absolute right-4 top-4 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
            @click="closeLightbox"
          >
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div class="max-h-full max-w-4xl">
            <img
              :src="lightboxImg.url"
              :alt="lightboxImg.caption || ''"
              class="max-h-[85vh] w-auto rounded-xl object-contain shadow-2xl"
            />
            <p v-if="lightboxImg.caption" class="mt-3 text-center text-sm text-white/80">
              {{ lightboxImg.caption }}
            </p>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.lightbox-enter-active, .lightbox-leave-active { transition: opacity 0.2s ease; }
.lightbox-enter-from, .lightbox-leave-to { opacity: 0; }
</style>
