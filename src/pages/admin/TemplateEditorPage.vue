<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, ref, computed } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useEditorStore } from '@/stores/editor.store'
import { adminService } from '@/services/admin.service'
import type { MusicTrack } from '@/services/admin.service'
import { getAllowedSections, CATEGORY_LABELS, CATEGORY_COLORS } from '@/constants/categorySections'
import { FONT_OPTIONS } from '@/types/section.types'
import type { ThemeConfig } from '@/types/section.types'
import { loadGoogleFont } from '@/utils/fontLoader'
import AppFontSelect from '@/components/common/AppFontSelect.vue'
import EditorFormContainer from '@/components/editor/EditorFormContainer.vue'
import RgbaColorPicker from '@/components/editor/RgbaColorPicker.vue'
import ImageUploader from '@/components/editor/ImageUploader.vue'
import PreviewPane from '@/components/editor/PreviewPane.vue'
import AppSpinner from '@/components/common/AppSpinner.vue'
import { useUIStore } from '@/stores/ui'

const route = useRoute()
const router = useRouter()
const editorStore = useEditorStore()
const ui = useUIStore()
const { isDirty, isSaving, editorMode, templateCategory, templateName, themeConfig } = storeToRefs(editorStore)

const isLoading = ref(true)
const showSettings = ref(false)
const musicTracks = ref<MusicTrack[]>([])
const isSavingSettings = ref(false)

const settingsForm = ref({
  thumbnail_url: '',
  is_active: true,
  plan_required: 'free' as 'free' | 'pro',
  music_track_id: null as number | null,
})

const themeForm = ref<ThemeConfig>({ ...themeConfig.value })

watch(themeConfig, (val) => { themeForm.value = { ...val } }, { deep: true })

function applyTheme() {
  editorStore.updateTheme({ ...themeForm.value })
}

function onFontChange(field: 'font_heading' | 'font_body', value: string) {
  if (value) loadGoogleFont(value)
  themeForm.value[field] = value
  applyTheme()
}

function updateThemeColor(key: string, value: string) {
  ;(themeForm.value as Record<string, string>)[key] = value
  applyTheme()
}

const allowedSections = computed(() =>
  templateCategory.value ? getAllowedSections(templateCategory.value) : undefined
)


onMounted(async () => {
  const uuid = route.params.uuid as string
  try {
    const [data, tracks] = await Promise.all([
      adminService.getTemplateFull(uuid),
      adminService.getMusicTracks(),
    ])

    await editorStore.loadTemplate(uuid, data)
    musicTracks.value = tracks

    settingsForm.value = {
      thumbnail_url: data.thumbnail_url ?? '',
      is_active: data.is_active,
      plan_required: data.plan_required,
      music_track_id: data.default_music_track?.id ?? null,
    }
  } finally {
    isLoading.value = false
  }
})

// Autosave after 1.5s of inactivity
let saveTimer: ReturnType<typeof setTimeout> | null = null
watch(isDirty, (dirty) => {
  if (dirty) {
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => editorStore.save(), 1500)
  }
})

onBeforeRouteLeave(async (_to, _from, next) => {
  if (isDirty.value) await editorStore.save()
  editorStore.reset()
  next()
})

function handleBeforeUnload(e: BeforeUnloadEvent) {
  if (isDirty.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}

onMounted(() => window.addEventListener('beforeunload', handleBeforeUnload))
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
  if (saveTimer) clearTimeout(saveTimer)
})

async function saveSettings() {
  const uuid = route.params.uuid as string
  isSavingSettings.value = true
  try {
    await adminService.updateTemplate(uuid, {
      thumbnail_url: settingsForm.value.thumbnail_url || null,
      is_active: settingsForm.value.is_active,
      plan_required: settingsForm.value.plan_required,
    })
    await adminService.updateTemplateMusic(uuid, settingsForm.value.music_track_id)
    ui.toast.success('Đã lưu cài đặt')
  } catch {
    ui.toast.error('Lưu thất bại')
  } finally {
    isSavingSettings.value = false
  }
}
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden bg-gray-50">
    <!-- Header -->
    <header class="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2.5 shadow-sm">
      <!-- Left: Back + Template info -->
      <div class="flex items-center gap-3">
        <button
          class="flex items-center gap-1 text-gray-500 transition-colors hover:text-gray-700"
          @click="router.push('/admin/templates')"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div class="flex items-center gap-2">
          <span class="max-w-[180px] truncate text-sm font-semibold text-gray-800">
            {{ templateName || 'Template Editor' }}
          </span>
          <span
            v-if="templateCategory"
            class="rounded-full px-2 py-0.5 text-xs font-medium"
            :class="CATEGORY_COLORS[templateCategory] ?? 'bg-gray-100 text-gray-600'"
          >
            {{ CATEGORY_LABELS[templateCategory] ?? templateCategory }}
          </span>
        </div>
      </div>

      <!-- Center: Edit / Preview tabs -->
      <div class="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-0.5">
        <button
          class="flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-all"
          :class="editorMode === 'edit' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
          @click="editorMode = 'edit'"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Chỉnh sửa
        </button>
        <button
          class="flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-all"
          :class="editorMode === 'preview' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'"
          @click="editorMode = 'preview'"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Xem trước
        </button>
      </div>

      <!-- Right: Save status + Settings button -->
      <div class="flex items-center gap-3">
        <div class="flex items-center gap-1.5 text-xs text-gray-500">
          <template v-if="isSaving">
            <AppSpinner class="h-3 w-3" />
            <span>Đang lưu...</span>
          </template>
          <template v-else-if="isDirty">
            <span class="h-2 w-2 rounded-full bg-amber-400" />
            <span>Chưa lưu</span>
          </template>
          <template v-else>
            <span class="h-2 w-2 rounded-full bg-green-400" />
            <span>Đã lưu</span>
          </template>
        </div>

        <button
          class="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          @click="showSettings = true"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Cài đặt
        </button>
      </div>
    </header>

    <!-- Loading -->
    <div v-if="isLoading" class="flex flex-1 items-center justify-center">
      <div class="text-center">
        <AppSpinner class="mx-auto h-10 w-10 text-indigo-500" />
        <p class="mt-3 text-sm text-gray-500">Đang tải template...</p>
      </div>
    </div>

    <!-- Editor body -->
    <div v-else class="flex-1 overflow-y-auto">
      <EditorFormContainer
        v-if="editorMode === 'edit'"
        :allowed-sections="allowedSections"
        :category="templateCategory ?? undefined"
      />
      <PreviewPane v-else />
    </div>

    <!-- Settings drawer -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showSettings" class="fixed inset-0 z-50 flex items-start justify-end">
          <div class="absolute inset-0 bg-black/30" @click="showSettings = false" />
          <div class="relative z-10 h-full w-full max-w-sm overflow-y-auto bg-white shadow-2xl">
            <!-- Drawer header -->
            <div class="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 class="font-semibold text-gray-900">Cài đặt template</h2>
              <button
                class="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100"
                @click="showSettings = false"
              >
                <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Drawer body -->
            <div class="space-y-5 p-5">
              <!-- Thumbnail -->
              <ImageUploader
                label="Thumbnail template"
                :url="settingsForm.thumbnail_url"
                purpose="other"
                @uploaded="settingsForm.thumbnail_url = $event"
              />

              <!-- Plan required -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700">Gói yêu cầu</label>
                <select
                  v-model="settingsForm.plan_required"
                  class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="free">Free</option>
                  <option value="pro">Pro</option>
                </select>
              </div>

              <!-- is_active toggle -->
              <label class="flex cursor-pointer items-center gap-3">
                <div class="relative">
                  <input v-model="settingsForm.is_active" type="checkbox" class="peer sr-only" />
                  <div class="h-6 w-11 rounded-full bg-gray-200 transition-colors peer-checked:bg-indigo-600" />
                  <div class="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
                </div>
                <span class="text-sm text-gray-700">Hiện template cho người dùng</span>
              </label>

              <!-- Default music track -->
              <div>
                <label class="mb-1.5 block text-sm font-medium text-gray-700">Nhạc nền mặc định</label>
                <select
                  v-model="settingsForm.music_track_id"
                  class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option :value="null">— Không có nhạc —</option>
                  <option v-for="track in musicTracks" :key="track.id" :value="track.id">
                    {{ track.name }}
                  </option>
                </select>
                <p class="mt-1 text-xs text-gray-400">Nhạc này sẽ được áp dụng khi user tạo thiệp từ template</p>
              </div>

              <!-- Global font & colors -->
              <div class="border-t border-gray-100 pt-2">
                <h3 class="mb-3 flex items-center gap-1.5 text-sm font-semibold text-gray-700">
                  <span>🎨</span> Phong cách chung
                </h3>

                <!-- Font tiêu đề -->
                <div class="mb-3">
                  <label class="mb-1.5 block text-sm font-medium text-gray-700">Font tiêu đề</label>
                  <AppFontSelect
                    :model-value="themeForm.font_heading"
                    :options="FONT_OPTIONS.filter(o => o.value)"
                    button-class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    @update:model-value="onFontChange('font_heading', $event)"
                  />
                </div>

                <!-- Font nội dung -->
                <div class="mb-3">
                  <label class="mb-1.5 block text-sm font-medium text-gray-700">Font nội dung</label>
                  <AppFontSelect
                    :model-value="themeForm.font_body"
                    :options="FONT_OPTIONS.filter(o => o.value)"
                    button-class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    @update:model-value="onFontChange('font_body', $event)"
                  />
                </div>

                <!-- Colors -->
                <div class="space-y-3">
                  <RgbaColorPicker
                    label="Màu chủ đạo"
                    default-hex="#6366f1"
                    :model-value="themeForm.primary_color"
                    @update:model-value="updateThemeColor('primary_color', $event)"
                  />
                  <RgbaColorPicker
                    label="Màu nền"
                    default-hex="#ffffff"
                    :model-value="themeForm.background_color"
                    @update:model-value="updateThemeColor('background_color', $event)"
                  />
                  <RgbaColorPicker
                    label="Màu chữ"
                    default-hex="#1f2937"
                    :model-value="themeForm.text_color"
                    @update:model-value="updateThemeColor('text_color', $event)"
                  />
                  <RgbaColorPicker
                    label="Màu nhấn"
                    default-hex="#f59e0b"
                    :model-value="themeForm.accent_color"
                    @update:model-value="updateThemeColor('accent_color', $event)"
                  />
                </div>
                <p class="mt-2 text-xs text-gray-400">Thay đổi sẽ tự động lưu sau 1.5 giây</p>
              </div>

              <!-- Save settings button -->
              <button
                class="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
                :disabled="isSavingSettings"
                @click="saveSettings"
              >
                {{ isSavingSettings ? 'Đang lưu...' : 'Lưu cài đặt' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
