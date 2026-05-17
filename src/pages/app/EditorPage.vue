<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, ref } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useEditorStore } from '@/stores/editor.store'
import EditorFormContainer from '@/components/editor/EditorFormContainer.vue'
import PreviewPane from '@/components/editor/PreviewPane.vue'
import AppSpinner from '@/components/common/AppSpinner.vue'
import PublishModal from '@/components/invitation/PublishModal.vue'

const route = useRoute()
const router = useRouter()
const editorStore = useEditorStore()
const { invitation, isDirty, isSaving, editorMode } = storeToRefs(editorStore)

const isLoading = ref(true)
const showPublishModal = ref(false)

onMounted(async () => {
  const uuid = route.params.uuid as string
  try {
    await editorStore.loadInvitation(uuid)
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

function goBack() {
  router.push('/app/invitations')
}

function changeTemplate() {
  router.push('/app/templates')
}
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden bg-gray-50">
    <!-- ─── Top toolbar (giống chungdoi.com) ─── -->
    <header class="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2.5 shadow-sm">
      <!-- Left: Back + Template name -->
      <div class="flex items-center gap-3">
        <button
          class="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
          @click="goBack"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Template selector chip -->
        <button
          class="flex items-center gap-2 rounded-full bg-rose-500 px-4 py-1.5 text-sm font-medium text-white hover:bg-rose-600 transition-colors"
          @click="changeTemplate"
        >
          <span class="max-w-[140px] truncate">{{ invitation?.title || 'Chọn mẫu' }}</span>
          <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      <!-- Center: Edit / Preview tabs -->
      <div class="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-0.5">
        <button
          class="flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-all"
          :class="editorMode === 'edit'
            ? 'bg-white text-gray-800 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'"
          @click="editorMode = 'edit'"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Chỉnh sửa
        </button>
        <button
          class="flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-all"
          :class="editorMode === 'preview'
            ? 'bg-white text-gray-800 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'"
          @click="editorMode = 'preview'"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Xem trước
        </button>
      </div>

      <!-- Right: Save status + Publish -->
      <div class="flex items-center gap-3">
        <!-- Save status indicator -->
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

        <!-- Publish button -->
        <button
          class="flex items-center gap-1.5 rounded-full bg-rose-500 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-rose-600 transition-colors"
          @click="showPublishModal = true"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 3l14 9-14 9V3z" />
          </svg>
          {{ invitation?.status === 'published' ? 'Đã xuất bản' : 'Xuất bản' }}
        </button>
      </div>
    </header>

    <!-- ─── Loading ─── -->
    <div v-if="isLoading" class="flex flex-1 items-center justify-center">
      <div class="text-center">
        <AppSpinner class="mx-auto h-10 w-10 text-rose-500" />
        <p class="mt-3 text-sm text-gray-500">Đang tải editor...</p>
      </div>
    </div>

    <!-- ─── Editor body ─── -->
    <div v-else class="flex-1 overflow-y-auto">
      <!-- Edit mode: Accordion form -->
      <EditorFormContainer v-if="editorMode === 'edit'" />

      <!-- Preview mode: Full preview -->
      <PreviewPane v-else />
    </div>

    <!-- ─── Publish modal ─── -->
    <PublishModal
      v-if="invitation"
      :show="showPublishModal"
      :invitation="invitation"
      @close="showPublishModal = false"
    />
  </div>
</template>
