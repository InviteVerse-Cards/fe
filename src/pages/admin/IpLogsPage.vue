<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminService, type AdminIpLog } from '@/services/admin.service'
import { useUIStore } from '@/stores/ui'
import { formatDateTime } from '@/utils/format'
import AppSpinner from '@/components/common/AppSpinner.vue'
import AppModal from '@/components/common/AppModal.vue'
import AppButton from '@/components/common/AppButton.vue'

const ui = useUIStore()

const isLoading = ref(false)
const ipLogs = ref<AdminIpLog[]>([])
const page = ref(1)
const totalPages = ref(1)
const totalCount = ref(0)
const searchQuery = ref('')

// Cleanup Modal state
const isCleanupModalOpen = ref(false)
const cleanupDays = ref(30)
const isCleaning = ref(false)

async function fetchLogs() {
  isLoading.value = true
  try {
    const res = await adminService.getIpLogs({
      page: page.value,
      limit: 15,
      q: searchQuery.value || undefined,
    })
    ipLogs.value = (res as any).data || (res as any).items || []
    totalPages.value = (res as any).meta?.total_pages || (res as any).totalPages || 1
    totalCount.value = (res as any).meta?.total || (res as any).total || 0
  } catch (err) {
    ui.toast.error('Không thể tải danh sách nhật ký IP')
  } finally {
    isLoading.value = false
  }
}

let searchTimeout: any = null
function onSearchChange() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    page.value = 1
    fetchLogs()
  }, 350)
}

function prevPage() {
  if (page.value > 1) {
    page.value--
    fetchLogs()
  }
}

function nextPage() {
  if (page.value < totalPages.value) {
    page.value++
    fetchLogs()
  }
}

async function handleCleanup() {
  isCleaning.value = true
  try {
    const res = await adminService.cleanupLogs(cleanupDays.value)
    ui.toast.success(`Đã xóa ${res.deleted_page_views + res.deleted_feature_events} bản ghi log cũ hơn ${res.days_retained} ngày!`)
    isCleanupModalOpen.value = false
    fetchLogs()
  } catch (err) {
    ui.toast.error('Có lỗi xảy ra khi dọn dẹp log')
  } finally {
    isCleaning.value = false
  }
}

onMounted(() => {
  fetchLogs()
})
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">Quản lý IP & Nhật ký</h1>
        <p class="text-sm text-gray-500 mt-1">Giám sát các địa chỉ IP truy cập nhiều nhất & dọn dẹp bộ nhớ database</p>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="fetchLogs"
          class="p-2.5 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
          title="Tải lại"
        >
          🔄
        </button>

        <button
          @click="isCleanupModalOpen = true"
          class="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-50 text-rose-700 font-semibold text-sm rounded-xl border border-rose-200 hover:bg-rose-100 transition-all shadow-sm"
        >
          <span>🧹</span>
          Dọn dẹp log (Cleanup DB)
        </button>
      </div>
    </div>

    <!-- Search bar & Summary -->
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
      <div class="relative flex-1 max-w-md">
        <input
          v-model="searchQuery"
          @input="onSearchChange"
          type="text"
          placeholder="Tìm theo IP, Tỉnh/Thành phố, Email..."
          class="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
        />
        <span class="absolute left-3 top-2.5 text-gray-400">🔍</span>
      </div>

      <div class="text-xs text-gray-500 font-medium">
        Tổng số IP ghi nhận: <span class="font-bold text-gray-900">{{ totalCount.toLocaleString('vi-VN') }}</span> IP
      </div>
    </div>

    <!-- IP Table -->
    <div class="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <AppSpinner size="lg" />
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm text-left">
          <thead>
            <tr class="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <th class="px-6 py-3.5 font-semibold">Địa chỉ IP</th>
              <th class="px-6 py-3.5 font-semibold">Vị trí địa lý</th>
              <th class="px-6 py-3.5 font-semibold">Tài khoản tương ứng</th>
              <th class="px-6 py-3.5 font-semibold text-right">Tổng lượt xem</th>
              <th class="px-6 py-3.5 font-semibold text-right">Lần cuối hoạt động</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 bg-white">
            <tr
              v-for="log in ipLogs"
              :key="log.ip_address"
              class="hover:bg-gray-50/80 transition-colors"
            >
              <td class="px-6 py-4 font-mono font-bold text-gray-900">
                <span class="inline-flex items-center gap-1.5">
                  <span class="h-2 w-2 rounded-full bg-emerald-500"></span>
                  {{ log.ip_address }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <span class="text-base">📍</span>
                  <div>
                    <p class="font-medium text-gray-900">{{ log.city || 'Chưa xác định' }}</p>
                    <p class="text-xs text-gray-400 uppercase font-mono">{{ log.country || 'VN' }}</p>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4">
                <p class="text-xs text-gray-700 max-w-xs truncate" :title="log.users_associated || 'Ẩn danh'">
                  {{ log.users_associated || 'Khách ẩn danh' }}
                </p>
              </td>
              <td class="px-6 py-4 text-right">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700">
                  {{ log.total_views.toLocaleString('vi-VN') }} lượt xem
                </span>
              </td>
              <td class="px-6 py-4 text-right text-xs text-gray-500">
                {{ formatDateTime(log.last_active) }}
              </td>
            </tr>

            <tr v-if="!ipLogs.length">
              <td colspan="5" class="px-6 py-12 text-center text-sm text-gray-400 italic">
                Chưa có dữ liệu nhật ký IP nào
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div v-if="totalPages > 1" class="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
        <button
          @click="prevPage"
          :disabled="page === 1"
          class="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          ← Trang trước
        </button>

        <span class="text-xs text-gray-600 font-medium">
          Trang <span class="font-bold text-gray-900">{{ page }}</span> / {{ totalPages }}
        </span>

        <button
          @click="nextPage"
          :disabled="page === totalPages"
          class="px-3.5 py-1.5 text-xs font-medium rounded-lg border border-gray-200 bg-white text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          Trang sau →
        </button>
      </div>
    </div>

    <!-- Modal Cleanup Logs -->
    <AppModal
      :show="isCleanupModalOpen"
      title="🧹 Dọn dẹp nhật ký hệ thống"
      @close="isCleanupModalOpen = false"
    >
      <div class="space-y-4">
        <p class="text-sm text-gray-600">
          Chức năng này giúp dọn dẹp bớt các bản ghi xem trang và sự kiện cũ để **giải phóng dung lượng đĩa cứng Database**.
        </p>

        <div>
          <label class="block text-xs font-bold text-gray-700 mb-2">Chọn khoảng thời gian giữ lại log:</label>
          <div class="grid grid-cols-3 gap-3">
            <button
              @click="cleanupDays = 30"
              class="py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all text-center"
              :class="cleanupDays === 30 ? 'border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-500/20' : 'border-gray-200 text-gray-700 hover:bg-gray-50'"
            >
              Giữ 30 ngày gần đây
              <span class="block text-[10px] font-normal text-gray-500 mt-0.5">(Xóa log > 30 ngày)</span>
            </button>

            <button
              @click="cleanupDays = 60"
              class="py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all text-center"
              :class="cleanupDays === 60 ? 'border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-500/20' : 'border-gray-200 text-gray-700 hover:bg-gray-50'"
            >
              Giữ 60 ngày gần đây
              <span class="block text-[10px] font-normal text-gray-500 mt-0.5">(Xóa log > 60 ngày)</span>
            </button>

            <button
              @click="cleanupDays = 90"
              class="py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all text-center"
              :class="cleanupDays === 90 ? 'border-rose-500 bg-rose-50 text-rose-700 ring-2 ring-rose-500/20' : 'border-gray-200 text-gray-700 hover:bg-gray-50'"
            >
              Giữ 90 ngày gần đây
              <span class="block text-[10px] font-normal text-gray-500 mt-0.5">(Xóa log > 90 ngày)</span>
            </button>
          </div>
        </div>

        <div class="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-800">
          ⚠️ <strong>Lưu ý:</strong> Hành động này sẽ xóa vĩnh viễn các dòng nhật ký lượt xem trang cũ hơn <strong>{{ cleanupDays }} ngày</strong>. Thống kê tổng quan chung (như số thiệp, doanh thu) sẽ không bị ảnh hưởng.
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-end gap-3">
          <AppButton variant="secondary" @click="isCleanupModalOpen = false">Hủy bỏ</AppButton>
          <AppButton variant="danger" :loading="isCleaning" @click="handleCleanup">
            Xác nhận dọn dẹp
          </AppButton>
        </div>
      </template>
    </AppModal>
  </div>
</template>
