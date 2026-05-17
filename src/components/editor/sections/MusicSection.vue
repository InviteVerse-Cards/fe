<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useEditorStore } from '@/stores/editor.store'
import type { ThemeConfig, MusicConfig } from '@/types/section.types'

const props = defineProps<{
  config: Record<string, unknown>
  theme: ThemeConfig
  isPreview?: boolean
  slug?: string
}>()

const audioRef = ref<HTMLAudioElement | null>(null)
const isPlaying = ref(false)
const hasInteracted = ref(false)
const cfg = computed(() => props.config as MusicConfig)
const musicUrl = computed(() => cfg.value.track_url || '')
const trackName = computed(() => cfg.value.track_name || 'Nhạc nền')
const autoplay = computed(() => !!cfg.value.autoplay)

const editorStore = useEditorStore()

// Watch for mode switch to 'preview' to trigger autoplay
watch(() => editorStore.editorMode, (mode) => {
  if (mode === 'preview' && autoplay.value && musicUrl.value && !isPlaying.value) {
    audioRef.value?.play()
      .then(() => { isPlaying.value = true })
      .catch(() => {})
  }
})

function toggle() {
  const audio = audioRef.value
  if (!audio) return
  hasInteracted.value = true
  if (isPlaying.value) {
    audio.pause()
    isPlaying.value = false
  } else {
    audio.play().then(() => { isPlaying.value = true }).catch(() => {})
  }
}

function handleFirstInteraction() {
  if (autoplay.value && musicUrl.value && !isPlaying.value && audioRef.value) {
    audioRef.value.play().then(() => { isPlaying.value = true }).catch(() => {})
    document.removeEventListener('click', handleFirstInteraction)
  }
}

onMounted(() => {
  if (autoplay.value && musicUrl.value) {
    // Try play immediately (works if mounted right after envelope click)
    const audio = audioRef.value
    if (audio) {
      audio.play()
        .then(() => { 
          isPlaying.value = true
        })
        .catch(() => {
          // Blocked by browser, wait for next click
          document.addEventListener('click', handleFirstInteraction, { once: true })
        })
    }
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleFirstInteraction)
  if (audioRef.value) {
    audioRef.value.pause()
    audioRef.value.src = ''
  }
})

watch(musicUrl, (newUrl) => {
  if (audioRef.value) {
    audioRef.value.load()
    if (props.isPreview && newUrl) {
      audioRef.value.play().then(() => { isPlaying.value = true }).catch(() => { isPlaying.value = false })
    } else {
      isPlaying.value = false
    }
  }
})

watch(isPlaying, (playing) => {
  const audio = audioRef.value
  if (!audio) return
  if (playing && audio.paused) {
    audio.play().catch(() => { isPlaying.value = false })
  } else if (!playing && !audio.paused) {
    audio.pause()
  }
})
</script>

<template>
  <!-- Audio element -->
  <audio ref="audioRef" :src="musicUrl" loop preload="auto" />

  <!-- In preview mode: show card in page flow -->
  <section
    v-if="isPreview"
    class="px-4 py-10"
    :style="{ backgroundColor: theme.background_color, color: theme.text_color }"
  >
    <div
      class="mx-auto max-w-sm rounded-2xl border p-6 text-center shadow-sm"
      :style="{ borderColor: theme.primary_color + '40', background: theme.background_color }"
    >
      <div 
        class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-2xl shadow-inner"
        :style="{ backgroundColor: theme.primary_color + '15', color: theme.primary_color }"
        :class="isPlaying ? 'animate-spin-slow' : ''"
      >
        🎵
      </div>
      <p class="font-bold tracking-tight" :style="{ color: theme.primary_color }">{{ trackName || 'Chưa chọn nhạc' }}</p>
      <p class="mt-2 text-xs opacity-60">
        {{ musicUrl ? 'Đang phát bản xem trước' : 'Chọn bài hát từ danh sách nhạc' }}
      </p>
      
      <button
        v-if="musicUrl"
        class="mt-4 rounded-lg px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
        :style="{ backgroundColor: theme.primary_color }"
        @click="toggle"
      >
        {{ isPlaying ? 'Dừng nghe thử' : 'Nghe thử lại' }}
      </button>
    </div>
  </section>

  <!-- On public page: floating button -->
  <template v-else-if="musicUrl">
    <button
      class="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95"
      :style="{ backgroundColor: theme.primary_color }"
      :title="isPlaying ? 'Dừng nhạc' : 'Phát nhạc'"
      @click="toggle"
    >
      <svg v-if="isPlaying" class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
      </svg>
      <svg v-else class="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
      </svg>
    </button>
  </template>
</template>

<style scoped>
.animate-spin-slow {
  animation: spin 8s linear infinite;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
