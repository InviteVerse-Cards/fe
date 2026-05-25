<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, ref } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useEditorStore } from '@/stores/editor.store'
import { useUIStore } from '@/stores/ui'
import { getTemplates } from '@/services/template.service'
import type { Template } from '@/types/template.types'
import * as invitationService from '@/services/invitation.service'
import EditorFormContainer from '@/components/editor/EditorFormContainer.vue'
import PreviewPane from '@/components/editor/PreviewPane.vue'
import AppSpinner from '@/components/common/AppSpinner.vue'
import PublishModal from '@/components/invitation/PublishModal.vue'

const route = useRoute()
const router = useRouter()
const editorStore = useEditorStore()
const ui = useUIStore()
const { invitation, isDirty, isSaving, editorMode } = storeToRefs(editorStore)

const isLoading = ref(true)
const showPublishModal = ref(false)

// Template Change Dropdown State
const templates = ref<Template[]>([])
const isTemplatesLoading = ref(false)
const showTemplateDropdown = ref(false)
const templateDropdownRef = ref<HTMLElement | null>(null)

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

// Close template selector dropdown on click outside
function handleClickOutside(e: MouseEvent) {
  if (showTemplateDropdown.value && templateDropdownRef.value && !templateDropdownRef.value.contains(e.target as Node)) {
    showTemplateDropdown.value = false
  }
}

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
  window.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
  window.removeEventListener('click', handleClickOutside)
  if (saveTimer) clearTimeout(saveTimer)
})

function goBack() {
  router.push('/app/invitations')
}

async function toggleTemplateDropdown(e: MouseEvent) {
  e.stopPropagation()
  showTemplateDropdown.value = !showTemplateDropdown.value
  if (showTemplateDropdown.value && templates.value.length === 0 && invitation.value?.category) {
    isTemplatesLoading.value = true
    try {
      templates.value = await getTemplates({ category: invitation.value.category })
    } catch (err) {
      console.error('Không tải được danh sách mẫu', err)
      ui.toast.error('Không tải được danh sách mẫu thiết kế')
    } finally {
      isTemplatesLoading.value = false
    }
  }
}

async function handleSelectTemplate(template: Template) {
  showTemplateDropdown.value = false
  if (!invitation.value) return

  const confirmMsg = `Bạn có chắc chắn muốn đổi sang mẫu "${template.name}"?
Hành động này sẽ xóa các phần nội dung tùy chỉnh hiện tại và áp đặt lại giao diện mẫu mới về mặc định.`
  if (!confirm(confirmMsg)) return

  isLoading.value = true
  try {
    await invitationService.update(invitation.value.uuid, {
      template_id: template.id
    })
    
    // Reload state
    await editorStore.loadInvitation(invitation.value.uuid)
    ui.toast.success(`Đổi sang mẫu "${template.name}" thành công!`)
  } catch (err) {
    console.error('Đổi mẫu thất bại:', err)
    ui.toast.error('Có lỗi xảy ra khi đổi mẫu thiết kế')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden bg-gray-50">
    <!-- ─── Top toolbar (giống chungdoi.com) ─── -->
    <header class="flex items-center justify-between border-b border-gray-200 bg-white px-2.5 sm:px-4 py-2.5 shadow-sm">
      <!-- Left: Back + Template selector dropdown -->
      <div class="flex items-center gap-1.5 sm:gap-3">
        <button
          class="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors p-1"
          @click="goBack"
        >
          <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <!-- Template selector chip dropdown -->
        <div ref="templateDropdownRef" class="relative">
          <button
            class="flex items-center gap-1 sm:gap-2 rounded-full bg-rose-500 px-3 py-1.5 text-xs sm:text-sm font-medium text-white hover:bg-rose-600 transition-colors"
            @click="toggleTemplateDropdown"
          >
            <span class="max-w-[90px] sm:max-w-[140px] truncate">{{ invitation?.title || 'Chọn mẫu' }}</span>
            <svg class="h-3 w-3 sm:h-3.5 sm:w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Template Dropdown Menu -->
          <div
            v-if="showTemplateDropdown"
            class="absolute left-0 mt-2 z-50 w-72 origin-top-left rounded-xl bg-white p-2 shadow-2xl ring-1 ring-black/5 focus:outline-none border border-gray-100"
          >
            <div class="px-3 py-2 text-[10px] sm:text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 mb-1">
              Đổi mẫu thiết kế thiệp
            </div>
            
            <div v-if="isTemplatesLoading" class="flex justify-center items-center py-6">
              <AppSpinner class="h-6 w-6 text-rose-500" />
            </div>
            
            <div v-else-if="templates.length === 0" class="px-3 py-4 text-xs sm:text-sm text-gray-500 text-center">
              Không có mẫu thiết kế nào khả dụng.
            </div>
            
            <div v-else class="max-h-80 overflow-y-auto space-y-1">
              <button
                v-for="item in templates"
                :key="item.uuid"
                type="button"
                @click="handleSelectTemplate(item)"
                class="flex items-center gap-3 w-full text-left px-2 py-1.5 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <!-- Mini Thumbnail -->
                <div class="h-12 w-12 rounded-md bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0">
                  <img
                    v-if="item.thumbnail_url"
                    :src="item.thumbnail_url"
                    alt="Thumbnail"
                    class="h-full w-full object-cover"
                  />
                  <div v-else class="h-full w-full flex items-center justify-center text-gray-400 bg-rose-50">
                    <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-xs sm:text-sm font-semibold text-gray-800 truncate">{{ item.name }}</p>
                  <p class="text-[10px] sm:text-xs text-rose-500 font-medium capitalize">{{ item.plan_required }}</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Center: Edit / Preview tabs (Chỉ hiện Icon trên mobile) -->
      <div class="flex items-center rounded-lg border border-gray-200 bg-gray-50 p-0.5">
        <button
          class="flex items-center gap-1 rounded-md px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium transition-all"
          :class="editorMode === 'edit'
            ? 'bg-white text-gray-800 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'"
          @click="editorMode = 'edit'"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <span class="hidden sm:inline">Chỉnh sửa</span>
        </button>
        <button
          class="flex items-center gap-1 rounded-md px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium transition-all"
          :class="editorMode === 'preview'
            ? 'bg-white text-gray-800 shadow-sm'
            : 'text-gray-500 hover:text-gray-700'"
          @click="editorMode = 'preview'"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span class="hidden sm:inline">Xem trước</span>
        </button>
      </div>

      <!-- Right: Save status + Publish (Chỉ hiện Dot + Icon trên mobile) -->
      <div class="flex items-center gap-1.5 sm:gap-3">
        <!-- Save status indicator -->
        <div class="flex items-center gap-1.5 text-xs text-gray-500">
          <template v-if="isSaving">
            <AppSpinner class="h-3 w-3" />
            <span class="hidden sm:inline">Đang lưu...</span>
          </template>
          <template v-else-if="isDirty">
            <span class="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
            <span class="hidden sm:inline">Chưa lưu</span>
          </template>
          <template v-else>
            <span class="h-2 w-2 rounded-full bg-green-400" />
            <span class="hidden sm:inline">Đã lưu</span>
          </template>
        </div>

        <!-- Publish button -->
        <button
          class="flex items-center gap-1.5 rounded-full bg-rose-500 px-3 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-rose-600 transition-colors"
          @click="showPublishModal = true"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5 3l14 9-14 9V3z" />
          </svg>
          <span class="hidden sm:inline">{{ invitation?.status === 'published' ? 'Đã xuất bản' : 'Xuất bản' }}</span>
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
