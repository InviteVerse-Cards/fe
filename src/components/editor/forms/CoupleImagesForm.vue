<script setup lang="ts">
import { ref, watch } from 'vue'
import { useEditorStore } from '@/stores/editor.store'
import type { CoupleImagesConfig } from '@/types/section.types'
import ImageUploader from '@/components/editor/ImageUploader.vue'

const props = defineProps<{ config: Record<string, unknown>; sectionType: string }>()
const editorStore = useEditorStore()
const form = ref<CoupleImagesConfig>({
  groom_photo_url: '',
  bride_photo_url: '',
  ...(props.config as CoupleImagesConfig),
})

watch(() => props.config, (v) => {
  form.value = { groom_photo_url: '', bride_photo_url: '', ...(v as CoupleImagesConfig) }
}, { deep: true })

function update(field: keyof CoupleImagesConfig, value: string) {
  form.value[field] = value
  editorStore.updateSectionConfig('couple_images', { [field]: value })
}
</script>

<template>
  <div class="space-y-6 py-2">
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
      <!-- Groom photo -->
      <div class="flex flex-col items-center gap-4">
        <label class="text-xs font-semibold uppercase tracking-wider text-gray-400">Ảnh chú rể</label>
        <div class="relative group">
          <div 
            class="h-28 w-28 sm:h-32 sm:w-32 overflow-hidden rounded-full border-4 border-white shadow-lg transition-transform group-hover:scale-105"
            :class="!form.groom_photo_url ? 'bg-gray-100 flex items-center justify-center' : ''"
          >
            <img 
              v-if="form.groom_photo_url" 
              :src="form.groom_photo_url" 
              class="h-full w-full object-cover" 
            />
            <svg v-else class="h-12 w-12 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>
        <ImageUploader 
          purpose="avatar" 
          @uploaded="update('groom_photo_url', $event)" 
        />
        <p class="text-[10px] text-gray-400">JPG, PNG, GIF, WebP, HEIC</p>
      </div>

      <!-- Bride photo -->
      <div class="flex flex-col items-center gap-4">
        <label class="text-xs font-semibold uppercase tracking-wider text-gray-400">Ảnh cô dâu</label>
        <div class="relative group">
          <div 
            class="h-28 w-28 sm:h-32 sm:w-32 overflow-hidden rounded-full border-4 border-white shadow-lg transition-transform group-hover:scale-105"
            :class="!form.bride_photo_url ? 'bg-gray-100 flex items-center justify-center' : ''"
          >
            <img 
              v-if="form.bride_photo_url" 
              :src="form.bride_photo_url" 
              class="h-full w-full object-cover" 
            />
            <svg v-else class="h-12 w-12 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>
        <ImageUploader 
          purpose="avatar" 
          @uploaded="update('bride_photo_url', $event)" 
        />
        <p class="text-[10px] text-gray-400">JPG, PNG, GIF, WebP, HEIC</p>
      </div>
    </div>
  </div>
</template>
