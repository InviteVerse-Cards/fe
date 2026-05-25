<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminService } from '@/services/admin.service'
import type { AdminInvitation } from '@/services/admin.service'
import type { PaginatedData } from '@/types/api.types'
import { useUIStore } from '@/stores/ui'
import { formatDate } from '@/utils/format'
import AppSpinner from '@/components/common/AppSpinner.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppModal from '@/components/common/AppModal.vue'

const ui = useUIStore()

const result = ref<PaginatedData<AdminInvitation> | null>(null)
const isLoading = ref(false)
const searchQuery = ref('')
const selectedCategory = ref('')
const selectedStatus = ref('')
const page = ref(1)
const limit = 10

// Confirm delete modal
const deleteModalOpen = ref(false)
const targetInvitation = ref<AdminInvitation | null>(null)
const isDeleting = ref(false)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

const categories = [
  { value: '', label: 'Tất cả thể loại' },
  { value: 'wedding', label: 'Đám cưới' },
  { value: 'birthday', label: 'Sinh nhật' },
  { value: 'party', label: 'Tiệc tùng' },
  { value: 'anniversary', label: 'Kỷ niệm' },
  { value: 'event', label: 'Sự kiện khác' }
]

const statuses = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 'draft', label: 'Bản nháp' },
  { value: 'published', label: 'Đã xuất bản' },
  { value: 'archived', label: 'Đã lưu trữ' }
]

function getCategoryLabel(cat: string) {
  const map: Record<string, string> = {
    wedding: 'Đám cưới',
    birthday: 'Sinh nhật',
    party: 'Tiệc tùng',
    anniversary: 'Kỷ niệm',
    event: 'Sự kiện khác'
  }
  return map[cat] || cat
}

function getStatusBadgeVariant(status: string): 'success' | 'warning' | 'danger' | 'default' {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
    published: 'success',
    draft: 'warning',
    archived: 'danger'
  }
  return map[status] ?? 'default'
}

function getStatusLabel(status: string) {
  const map: Record<string, string> = {
    published: 'Đã xuất bản',
    draft: 'Bản nháp',
    archived: 'Đã lưu trữ'
  }
  return map[status] ?? status
}

function onSearchInput(val: string) {
  searchQuery.value = val
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    page.value = 1
    loadInvitations()
  }, 400)
}

function onFilterChange() {
  page.value = 1
  loadInvitations()
}

async function loadInvitations() {
  isLoading.value = true
  try {
    const params: Record<string, unknown> = { page: page.value, limit }
    if (searchQuery.value) params.search = searchQuery.value
    if (selectedCategory.value) params.category = selectedCategory.value
    if (selectedStatus.value) params.status = selectedStatus.value
    
    result.value = await adminService.getInvitations(params)
  } catch (err) {
    ui.toast.error('Không thể tải danh sách thiệp mời')
  } finally {
    isLoading.value = false
  }
}

function openDeleteModal(invitation: AdminInvitation) {
  targetInvitation.value = invitation
  deleteModalOpen.value = true
}

async function confirmDelete() {
  if (!targetInvitation.value) return
  isDeleting.value = true
  try {
    await adminService.deleteInvitation(targetInvitation.value.uuid)
    ui.toast.success(`Đã xoá thiệp "${targetInvitation.value.title}" thành công`)
    deleteModalOpen.value = false
    loadInvitations()
  } catch (err) {
    ui.toast.error('Xoá thiệp mời thất bại')
  } finally {
    isDeleting.value = false
  }
}

function goPage(p: number) {
  page.value = p
  loadInvitations()
}

onMounted(loadInvitations)
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-1">Quản lý thiệp mời</h1>
        <p class="text-gray-500 text-sm font-medium">Theo dõi và quản trị tất cả các thiệp mời trên hệ thống</p>
      </div>
    </div>

    <!-- Toolbar Filters -->
    <div class="flex flex-wrap items-center gap-3 mb-5">
      <!-- Search input -->
      <div class="flex-1 min-w-64">
        <div class="relative">
          <input
            :value="searchQuery"
            placeholder="Tìm theo tiêu đề, slug, người tạo..."
            class="w-full bg-white border border-gray-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none transition-colors"
            @input="onSearchInput(($event.target as HTMLInputElement).value)"
          />
          <span class="absolute left-3 top-3.5 text-gray-400">
            🔍
          </span>
        </div>
      </div>

      <!-- Category Filter -->
      <div class="min-w-40">
        <select
          v-model="selectedCategory"
          @change="onFilterChange"
          class="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none transition-colors"
        >
          <option v-for="cat in categories" :key="cat.value" :value="cat.value">
            {{ cat.label }}
          </option>
        </select>
      </div>

      <!-- Status Filter -->
      <div class="min-w-40">
        <select
          v-model="selectedStatus"
          @change="onFilterChange"
          class="w-full bg-white border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none transition-colors"
        >
          <option v-for="stat in statuses" :key="stat.value" :value="stat.value">
            {{ stat.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- Table Container -->
    <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <!-- Loading state -->
      <div v-if="isLoading" class="flex justify-center py-20">
        <AppSpinner size="lg" />
      </div>

      <!-- Table results -->
      <template v-else-if="result">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200 bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th class="px-6 py-3.5">Thiệp mời</th>
                <th class="px-6 py-3.5">Người tạo</th>
                <th class="px-6 py-3.5">Phân loại</th>
                <th class="px-6 py-3.5">Mẫu gốc</th>
                <th class="px-6 py-3.5 text-center">Trạng thái</th>
                <th class="px-6 py-3.5 text-right">Lượt xem</th>
                <th class="px-6 py-3.5 text-right">Khách mời</th>
                <th class="px-6 py-3.5">Ngày tạo</th>
                <th class="px-6 py-3.5 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 bg-white text-gray-900">
              <tr
                v-for="inv in result.items"
                :key="inv.id"
                class="hover:bg-gray-50/50 transition-colors"
              >
                <!-- Title & Slug -->
                <td class="px-6 py-4">
                  <p class="font-bold text-gray-900 leading-tight">{{ inv.title }}</p>
                  <p class="text-xs text-gray-500 font-mono mt-0.5">/i/{{ inv.slug }}</p>
                </td>

                <!-- Creator Details -->
                <td class="px-6 py-4">
                  <p class="font-semibold text-gray-800 leading-tight">{{ inv.user_name }}</p>
                  <p class="text-xs text-gray-500 mt-0.5">{{ inv.user_email }}</p>
                </td>

                <!-- Category -->
                <td class="px-6 py-4">
                  <span class="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                    {{ getCategoryLabel(inv.category) }}
                  </span>
                </td>

                <!-- Original template -->
                <td class="px-6 py-4">
                  <p class="text-xs text-gray-700 font-medium max-w-40 truncate">
                    {{ inv.template_name || 'Giao diện tùy chỉnh' }}
                  </p>
                </td>

                <!-- Status Badge -->
                <td class="px-6 py-4 text-center">
                  <AppBadge :variant="getStatusBadgeVariant(inv.status)" size="sm">
                    {{ getStatusLabel(inv.status) }}
                  </AppBadge>
                </td>

                <!-- View Count -->
                <td class="px-6 py-4 text-right font-semibold text-gray-700">
                  {{ inv.view_count?.toLocaleString() ?? 0 }}
                </td>

                <!-- Guest count -->
                <td class="px-6 py-4 text-right font-semibold text-indigo-600">
                  {{ inv.guest_count?.toLocaleString() ?? 0 }}
                </td>

                <!-- Created Date -->
                <td class="px-6 py-4 text-xs text-gray-500">
                  {{ formatDate(inv.created_at) }}
                </td>

                <!-- Actions -->
                <td class="px-6 py-4">
                  <div class="flex items-center justify-center gap-2">
                    <a
                      :href="`/i/${inv.slug}`"
                      target="_blank"
                      class="inline-flex items-center justify-center rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all"
                    >
                      Xem 🌐
                    </a>
                    <AppButton
                      variant="danger"
                      size="sm"
                      @click="openDeleteModal(inv)"
                    >
                      Xoá 🗑️
                    </AppButton>
                  </div>
                </td>
              </tr>
              <tr v-if="!result.items?.length">
                <td colspan="9" class="px-6 py-12 text-center text-gray-400 italic">
                  Không tìm thấy thiệp mời nào phù hợp với bộ lọc
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="result.totalPages > 1" class="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50/50">
          <p class="text-xs text-gray-500 font-medium">
            Trang {{ result.page }} / {{ result.totalPages }} — Tổng cộng {{ result.total }} thiệp mời
          </p>
          <div class="flex gap-2">
            <AppButton variant="ghost" size="sm" :disabled="page <= 1" @click="goPage(page - 1)">← Trước</AppButton>
            <AppButton variant="ghost" size="sm" :disabled="page >= result.totalPages" @click="goPage(page + 1)">Tiếp →</AppButton>
          </div>
        </div>
      </template>

      <div v-else class="py-16 text-center text-gray-400 italic">Không có dữ liệu thiệp mời</div>
    </div>

    <!-- Confirm delete modal -->
    <AppModal :show="deleteModalOpen" title="Xác nhận xoá thiệp mời" @close="deleteModalOpen = false">
      <div class="p-1">
        <p class="text-sm text-gray-600 mb-2">
          Bạn có chắc chắn muốn xoá thiệp mời có tiêu đề:
        </p>
        <p class="font-extrabold text-base text-gray-900 mb-4 bg-red-50 border-l-4 border-red-500 p-3 rounded-r-xl">
          "{{ targetInvitation?.title }}"
        </p>
        <p class="text-xs text-red-500 font-medium mb-5">
          ⚠️ Cảnh báo: Hành động này sẽ thực hiện xoá thiệp mời khỏi hệ thống của người dùng. Thiệp sẽ không thể truy cập công khai được nữa.
        </p>
        
        <div class="flex justify-end gap-3 border-t border-gray-100 pt-4">
          <AppButton variant="ghost" @click="deleteModalOpen = false">Huỷ bỏ</AppButton>
          <AppButton
            variant="danger"
            :loading="isDeleting"
            @click="confirmDelete"
          >
            Đồng ý xoá
          </AppButton>
        </div>
      </div>
    </AppModal>
  </div>
</template>
