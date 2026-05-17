<script setup lang="ts">
import { ref } from 'vue'
import api from '@/services/api'
import AppSpinner from '@/components/common/AppSpinner.vue'

const props = defineProps<{
  label?: string
  url?: string
  purpose?: 'background' | 'gallery' | 'avatar' | 'other'
}>()

const emit = defineEmits<{
  (e: 'uploaded', url: string): void
}>()

const isUploading = ref(false)
const errorMsg = ref('')
const isDragging = ref(false)

async function handleFile(file: File) {
  if (!file.type.startsWith('image/')) {
    errorMsg.value = 'Chỉ chấp nhận file ảnh'
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    errorMsg.value = 'File quá lớn (tối đa 5MB)'
    return
  }

  errorMsg.value = ''
  isUploading.value = true

  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('purpose', props.purpose || 'other')
    const { data } = await api.post('/uploads', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    emit('uploaded', data.data.url)
  } catch {
    errorMsg.value = 'Upload thất bại, thử lại'
  } finally {
    isUploading.value = false
  }
}

function onFileInput(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) handleFile(file)
}

function onDrop(e: DragEvent) {
  isDragging.value = false
  const file = e.dataTransfer?.files?.[0]
  if (file) handleFile(file)
}

const fileInput = ref<HTMLInputElement | null>(null)

function triggerInput() {
  fileInput.value?.click()
}
</script>

<template>
  <div class="space-y-1.5">
    <label v-if="label" class="block text-sm font-medium text-gray-700">{{ label }}</label>

    <div
      class="relative cursor-pointer overflow-hidden rounded-xl border-2 border-dashed transition-colors"
      :class="isDragging ? 'border-indigo-400 bg-indigo-50' : 'border-gray-300 hover:border-indigo-300'"
      @click="triggerInput"
      @dragenter.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @dragover.prevent
      @drop.prevent="onDrop"
    >
      <!-- Preview -->
      <div v-if="url && !isUploading" class="relative group">
        <img :src="url" alt="Preview" class="h-32 w-full object-cover" />
        <div class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <span class="text-xs font-medium text-white">Click để thay ảnh</span>
        </div>
      </div>

      <!-- Upload zone -->
      <div v-else class="flex flex-col items-center justify-center gap-2 py-6">
        <div v-if="isUploading" class="flex flex-col items-center gap-2">
          <AppSpinner size="md" />
          <span class="text-xs text-gray-500">Đang upload...</span>
        </div>
        <template v-else>
          <svg class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p class="text-xs text-gray-500">
            Kéo thả hoặc <span class="text-indigo-600 font-medium">chọn ảnh</span>
          </p>
          <p class="text-xs text-gray-400">JPEG, PNG, WebP — tối đa 5MB</p>
        </template>
      </div>
    </div>

    <p v-if="errorMsg" class="text-xs text-red-600">{{ errorMsg }}</p>
    <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="onFileInput" />
  </div>
</template>
