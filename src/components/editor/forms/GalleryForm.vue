<script setup lang="ts">
import { ref, watch } from 'vue'
import { useEditorStore } from '@/stores/editor.store'
import type { GalleryConfig } from '@/types/section.types'
import ImageUploader from '@/components/editor/ImageUploader.vue'

const props = defineProps<{ config: Record<string, unknown>; sectionType: string }>()
const editorStore = useEditorStore()
const defaultForm: GalleryConfig = { images: [], layout: 'grid' }
const form = ref<GalleryConfig>(Object.assign({}, defaultForm, props.config as unknown as Partial<GalleryConfig>))

watch(() => props.config, (v) => {
  form.value = Object.assign({}, defaultForm, v as unknown as Partial<GalleryConfig>)
}, { deep: true })

function sync() {
  editorStore.updateSectionConfig('gallery', { images: form.value.images, layout: form.value.layout })
}

function onImageUploaded(url: string) {
  form.value.images.push({ url, caption: '' })
  sync()
}

function removeImage(i: number) {
  form.value.images.splice(i, 1)
  sync()
}
</script>

<template>
  <div class="space-y-6">
    <!-- Layout selection -->
    <!-- <div>
      <label class="mb-1.5 block text-sm font-semibold text-gray-700">Bố cục hiển thị</label>
      <div class="grid grid-cols-3 gap-2">
        <button
          v-for="l in (['grid', 'masonry', 'slider'] as const)"
          :key="l"
          class="rounded-lg border-2 py-2 text-xs font-medium capitalize transition-all"
          :class="form.layout === l 
            ? 'border-rose-400 bg-rose-50 text-rose-700' 
            : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'"
          @click="form.layout = l; sync()"
        >
          {{ l }}
        </button>
      </div>
    </div> -->

    <!-- Upload section -->
    <div>
      <label class="mb-1.5 block text-sm font-semibold text-gray-700">Tải ảnh lên album</label>
      <ImageUploader 
        purpose="gallery" 
        @uploaded="onImageUploaded" 
      />
      <p class="mt-2 text-[10px] text-gray-400 italic">Mẹo: Bạn có thể tải lên nhiều ảnh lần lượt để tạo album.</p>
    </div>

    <!-- Image list -->
    <div v-if="form.images.length > 0" class="space-y-3">
      <label class="block text-sm font-semibold text-gray-700">Đã tải lên ({{ form.images.length }})</label>
      <div class="grid grid-cols-1 gap-2">
        <div
          v-for="(img, i) in form.images"
          :key="i"
          class="group relative flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-2 pr-4 transition-all hover:bg-white hover:shadow-sm"
        >
          <img :src="img.url" class="h-12 w-12 rounded-lg object-cover shadow-sm" />
          <div class="flex-1 min-w-0">
            <p class="truncate text-[10px] text-gray-400 font-mono">{{ img.url.split('/').pop() }}</p>
            <input 
              v-model="img.caption" 
              placeholder="Thêm chú thích..." 
              class="w-full bg-transparent text-xs focus:outline-none focus:text-gray-900"
              @change="sync"
            />
          </div>
          <button 
            class="ml-2 rounded-full p-1.5 text-gray-300 hover:bg-red-50 hover:text-red-500 transition-colors"
            @click="removeImage(i)"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
