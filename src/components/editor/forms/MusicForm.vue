<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import { useEditorStore } from '@/stores/editor.store'
import type { MusicConfig } from '@/types/section.types'
import api from '@/services/api'
import AppSpinner from '@/components/common/AppSpinner.vue'

const props = defineProps<{ config: Record<string, unknown>; sectionType: string }>()
const editorStore = useEditorStore()
const form = ref<MusicConfig>({ enabled: false, autoplay: false, ...(props.config as MusicConfig) })

const tracks = ref<Array<{ id: number, name: string, url: string }>>([])
const isLoading = ref(true)

// Preview audio logic
const previewAudio = ref<HTMLAudioElement | null>(null)
const currentlyPlayingId = ref<number | null>(null)

async function fetchTracks() {
  try {
    const { data } = await api.get('/public/music-tracks')
    tracks.value = data.data
  } catch (err) {
    console.error('Failed to fetch music tracks:', err)
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchTracks)
onUnmounted(() => {
  if (previewAudio.value) {
    previewAudio.value.pause()
    previewAudio.value.src = ''
  }
})

watch(() => props.config, (v) => {
  form.value = { enabled: false, autoplay: false, ...(v as MusicConfig) }
}, { deep: true })

function togglePreview(track: { id: number, name: string, url: string }) {
  if (!previewAudio.value) {
    previewAudio.value = new Audio()
    previewAudio.value.onended = () => { currentlyPlayingId.value = null }
  }

  if (currentlyPlayingId.value === track.id) {
    previewAudio.value.pause()
    currentlyPlayingId.value = null
  } else {
    previewAudio.value.src = track.url
    previewAudio.value.play().catch(e => console.error('Play blocked:', e))
    currentlyPlayingId.value = track.id
  }
}

function selectTrack(track: { name: string, url: string }) {
  form.value.track_name = track.name
  form.value.track_url = track.url
  form.value.enabled = true
  sync()
  
  // Stop preview if selecting
  if (previewAudio.value) {
    previewAudio.value.pause()
    currentlyPlayingId.value = null
  }
}

function sync() {
  editorStore.updateSectionConfig('music', { ...form.value })
}
</script>

<template>
  <div class="space-y-6">
    <!-- Music List -->
    <div class="space-y-3">
      <label class="text-sm font-semibold text-gray-700">Danh sách nhạc đám cưới</label>
      
      <div v-if="isLoading" class="flex justify-center py-4">
        <AppSpinner size="sm" />
      </div>
      
      <div v-else class="grid grid-cols-1 gap-2">
        <div
          v-for="track in tracks"
          :key="track.id"
          class="group flex items-center justify-between rounded-xl border-2 px-3 py-2 transition-all"
          :class="form.track_url === track.url
            ? 'border-rose-400 bg-rose-50'
            : 'border-gray-100 bg-white hover:border-gray-200'"
        >
          <!-- Select area -->
          <div 
            class="flex flex-1 cursor-pointer items-center gap-3"
            @click="selectTrack(track)"
          >
            <div 
              class="flex h-10 w-10 items-center justify-center rounded-lg text-lg"
              :class="form.track_url === track.url ? 'bg-rose-100 text-rose-600' : 'bg-gray-50 text-gray-400'"
            >
              {{ form.track_url === track.url ? '🎵' : '📻' }}
            </div>
            <div class="flex flex-col">
              <span class="text-sm font-bold" :class="form.track_url === track.url ? 'text-rose-700' : 'text-gray-700'">
                {{ track.name }}
              </span>
              <span v-if="form.track_url === track.url" class="text-[10px] font-medium text-rose-500 uppercase tracking-tight">Đã chọn</span>
            </div>
          </div>

          <!-- Preview toggle -->
          <button
            class="flex h-10 w-10 items-center justify-center rounded-full transition-all active:scale-90"
            :class="currentlyPlayingId === track.id ? 'bg-rose-500 text-white shadow-md' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'"
            :title="currentlyPlayingId === track.id ? 'Dừng nghe thử' : 'Nghe thử'"
            @click.stop="togglePreview(track)"
          >
            <svg v-if="currentlyPlayingId === track.id" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
            </svg>
            <svg v-else class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Options -->
    <div class="space-y-4 rounded-xl bg-gray-50 p-4">
      <div class="flex items-center justify-between">
        <div class="space-y-0.5">
          <label class="text-sm font-medium text-gray-700">Tự phát nhạc</label>
          <p class="text-xs text-gray-500">Nhạc tự bật khi khách mở thiệp</p>
        </div>
        <button
          class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none"
          :class="form.autoplay ? 'bg-rose-500' : 'bg-gray-300'"
          @click="form.autoplay = !form.autoplay; sync()"
        >
          <span
            class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200"
            :class="form.autoplay ? 'translate-x-5' : 'translate-x-0'"
          />
        </button>
      </div>
    </div>
  </div>
</template>
