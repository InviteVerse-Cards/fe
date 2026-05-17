<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { adminService, type MusicTrack } from '@/services/admin.service'
import { useUIStore } from '@/stores/ui'
import AppSpinner from '@/components/common/AppSpinner.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppModal from '@/components/common/AppModal.vue'
import AppBadge from '@/components/common/AppBadge.vue'

const ui = useUIStore()
const tracks = ref<MusicTrack[]>([])
const isLoading = ref(false)

const formModal = ref(false)
const editingTrack = ref<MusicTrack | null>(null)
const isSaving = ref(false)

const formDefault = () => ({ name: '', url: '', is_active: true })
const form = reactive(formDefault())

const fileInput = ref<HTMLInputElement | null>(null)
const isUploading = ref(false)

const deleteModal = ref(false)
const deleteTarget = ref<MusicTrack | null>(null)
const isDeleting = ref(false)
const isSettingDefault = ref<number | null>(null)

// Preview audio
const audioRef = ref<HTMLAudioElement | null>(null)
const currentPreviewId = ref<number | null>(null)

async function loadTracks() {
  isLoading.value = true
  try {
    tracks.value = await adminService.getMusicTracks()
  } catch {
    ui.toast.error('Không thể tải danh sách nhạc')
  } finally {
    isLoading.value = false
  }
}

function openCreate() {
  editingTrack.value = null
  Object.assign(form, formDefault())
  formModal.value = true
}

function openEdit(track: MusicTrack) {
  editingTrack.value = track
  Object.assign(form, {
    name: track.name,
    url: track.url,
    is_active: track.is_active,
  })
  formModal.value = true
}

async function handleFileUpload(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  if (file.size > 20 * 1024 * 1024) {
    ui.toast.error('File quá lớn (tối đa 20MB)')
    return
  }

  isUploading.value = true
  try {
    const { url } = await adminService.uploadMusicTrack(file)
    form.url = url
    if (!form.name) {
      form.name = file.name.replace(/\.[^/.]+$/, "") // Remove extension
    }
    ui.toast.success('Tải lên thành công')
  } catch {
    ui.toast.error('Tải lên thất bại')
  } finally {
    isUploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

async function doSave() {
  if (!form.name.trim() || !form.url.trim()) {
    ui.toast.error('Vui lòng nhập đầy đủ tên và URL hoặc tải lên file')
    return
  }
  isSaving.value = true
  try {
    const dto = { name: form.name, url: form.url, is_active: form.is_active }
    if (editingTrack.value) {
      await adminService.updateMusicTrack(editingTrack.value.id, dto)
      ui.toast.success('Đã cập nhật bản nhạc')
    } else {
      await adminService.createMusicTrack(dto)
      ui.toast.success('Đã thêm bản nhạc mới')
    }
    formModal.value = false
    loadTracks()
  } catch {
    ui.toast.error('Lưu thất bại')
  } finally {
    isSaving.value = false
  }
}

function openDelete(track: MusicTrack) {
  deleteTarget.value = track
  deleteModal.value = true
}

async function doDelete() {
  if (!deleteTarget.value) return
  isDeleting.value = true
  try {
    await adminService.deleteMusicTrack(deleteTarget.value.id)
    ui.toast.success('Đã xoá bản nhạc')
    deleteModal.value = false
    loadTracks()
  } catch {
    ui.toast.error('Xoá thất bại')
  } finally {
    isDeleting.value = false
  }
}

async function setDefault(track: MusicTrack) {
  isSettingDefault.value = track.id
  try {
    await adminService.setDefaultMusicTrack(track.id)
    ui.toast.success(`Đã đặt "${track.name}" làm nhạc mặc định`)
    loadTracks()
  } catch {
    ui.toast.error('Không thể đặt nhạc mặc định')
  } finally {
    isSettingDefault.value = null
  }
}

function togglePreview(track: MusicTrack) {
  if (currentPreviewId.value === track.id) {
    audioRef.value?.pause()
    currentPreviewId.value = null
  } else {
    currentPreviewId.value = track.id
    if (audioRef.value) {
      audioRef.value.src = track.url
      audioRef.value.play().catch(() => {
        ui.toast.error('Không thể phát bản nhạc này')
        currentPreviewId.value = null
      })
    }
  }
}

onMounted(loadTracks)
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Quản lý nhạc nền</h1>
        <p class="mt-1 text-sm text-gray-500">Danh sách các bài hát cho người dùng chọn làm nhạc nền</p>
      </div>
      <AppButton variant="primary" @click="openCreate">+ Thêm nhạc</AppButton>
    </div>

    <audio ref="audioRef" @ended="currentPreviewId = null" />

    <div v-if="isLoading" class="flex justify-center py-20">
      <AppSpinner size="lg" />
    </div>

    <div v-else class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Tên bài hát</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Trạng thái</th>
            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Ngày tạo</th>
            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Hành động</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 bg-white">
          <tr v-for="track in tracks" :key="track.id" class="hover:bg-gray-50">
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <button 
                  @click="togglePreview(track)"
                  class="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 hover:bg-indigo-100"
                >
                  <span v-if="currentPreviewId === track.id">⏸</span>
                  <span v-else>▶</span>
                </button>
                <div>
                  <div class="text-sm font-medium text-gray-900">{{ track.name }}</div>
                  <div class="max-w-xs truncate text-xs text-gray-500">{{ track.url }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-1.5">
                <AppBadge :variant="track.is_active ? 'success' : 'default'" size="sm">
                  {{ track.is_active ? 'Hoạt động' : 'Tắt' }}
                </AppBadge>
                <AppBadge v-if="track.is_default" variant="warning" size="sm">
                  Mặc định
                </AppBadge>
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ new Date(track.created_at).toLocaleDateString('vi-VN') }}
            </td>
            <td class="px-6 py-4 text-right text-sm font-medium">
              <div class="flex justify-end gap-2">
                <AppButton
                  variant="ghost"
                  size="sm"
                  :disabled="track.is_default || isSettingDefault !== null"
                  :loading="isSettingDefault === track.id"
                  @click="setDefault(track)"
                >
                  {{ track.is_default ? 'Mặc định' : 'Đặt mặc định' }}
                </AppButton>
                <AppButton variant="ghost" size="sm" @click="openEdit(track)">Sửa</AppButton>
                <AppButton variant="danger" size="sm" @click="openDelete(track)">Xoá</AppButton>
              </div>
            </td>
          </tr>
          <tr v-if="tracks.length === 0">
            <td colspan="4" class="py-10 text-center text-gray-500">
              Chưa có bản nhạc nào
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Form modal -->
    <AppModal :show="formModal" :title="editingTrack ? 'Sửa nhạc' : 'Thêm nhạc mới'" @close="formModal = false">
      <div class="space-y-4">
        <div>
          <label class="mb-1.5 block text-sm text-gray-700">Tên bài hát <span class="text-red-500">*</span></label>
          <input v-model="form.name" placeholder="VD: Đường Về Hai Thôn" class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none" />
        </div>

        <div>
          <label class="mb-1.5 block text-sm text-gray-700">File nhạc (.mp3) <span class="text-red-500">*</span></label>
          <div class="flex gap-2">
            <input v-model="form.url" placeholder="https://example.com/music.mp3" class="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none" />
            <input ref="fileInput" type="file" accept="audio/mpeg,audio/mp3" class="hidden" @change="handleFileUpload" />
            <AppButton variant="secondary" size="sm" :loading="isUploading" @click="fileInput?.click()">
              {{ isUploading ? 'Đang tải...' : 'Tải lên MP3' }}
            </AppButton>
          </div>
          <p class="mt-1 text-[10px] text-gray-400">Bạn có thể dán link trực tiếp hoặc nhấn "Tải lên" để chọn file từ máy tính.</p>
        </div>
        
        <label class="flex cursor-pointer items-center gap-2">
          <input v-model="form.is_active" type="checkbox" class="rounded" />
          <span class="text-sm text-gray-700">Hoạt động (hiện cho người dùng)</span>
        </label>

        <div class="flex justify-end gap-3 pt-2">
          <AppButton variant="ghost" @click="formModal = false">Huỷ</AppButton>
          <AppButton variant="primary" :loading="isSaving" @click="doSave">
            {{ editingTrack ? 'Lưu thay đổi' : 'Thêm nhạc' }}
          </AppButton>
        </div>
      </div>
    </AppModal>

    <!-- Delete modal -->
    <AppModal :show="deleteModal" title="Xoá nhạc" size="sm" @close="deleteModal = false">
      <p class="mb-5 text-gray-600">
        Bạn có chắc muốn xoá bản nhạc <strong class="text-gray-900">{{ deleteTarget?.name }}</strong>?
      </p>
      <div class="flex justify-end gap-3">
        <AppButton variant="ghost" @click="deleteModal = false">Huỷ</AppButton>
        <AppButton variant="danger" :loading="isDeleting" @click="doDelete">Xoá</AppButton>
      </div>
    </AppModal>
  </div>
</template>
