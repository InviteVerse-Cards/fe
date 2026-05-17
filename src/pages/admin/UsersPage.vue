<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { adminService } from '@/services/admin.service'
import type { AdminUser } from '@/services/admin.service'
import type { PaginatedData } from '@/types/api.types'
import { useUIStore } from '@/stores/ui'
import { formatDate } from '@/utils/format'
import AppSpinner from '@/components/common/AppSpinner.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppModal from '@/components/common/AppModal.vue'

const ui = useUIStore()
const router = useRouter()

const result = ref<PaginatedData<AdminUser> | null>(null)
const isLoading = ref(false)
const searchQuery = ref('')
const activeFilter = ref<'all' | 'active' | 'locked'>('all')
const page = ref(1)
const limit = 10

// Confirm modal
const confirmModal = ref(false)
const confirmTarget = ref<AdminUser | null>(null)
const confirmAction = ref<'lock' | 'unlock'>('lock')
const isConfirming = ref(false)

let debounceTimer: ReturnType<typeof setTimeout> | null = null

function creditsStatusVariant(status: string): 'success' | 'warning' | 'danger' | 'default' {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
    active: 'success', frozen: 'warning', empty: 'danger',
  }
  return map[status] ?? 'default'
}

function onSearchInput(val: string) {
  searchQuery.value = val
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    page.value = 1
    loadUsers()
  }, 400)
}

function onFilterChange(f: 'all' | 'active' | 'locked') {
  activeFilter.value = f
  page.value = 1
  loadUsers()
}

async function loadUsers() {
  isLoading.value = true
  try {
    const params: Record<string, unknown> = { page: page.value, limit }
    if (searchQuery.value) params.search = searchQuery.value
    if (activeFilter.value === 'active') params.is_verified = 1
    if (activeFilter.value === 'locked') params.is_verified = 0
    result.value = await adminService.getUsers(params)
  } catch {
    ui.toast.error('Không thể tải danh sách người dùng')
  } finally {
    isLoading.value = false
  }
}

function openConfirm(user: AdminUser, action: 'lock' | 'unlock') {
  confirmTarget.value = user
  confirmAction.value = action
  confirmModal.value = true
}

async function doConfirm() {
  if (!confirmTarget.value) return
  isConfirming.value = true
  try {
    const is_verified = confirmAction.value === 'unlock' ? 1 : 0
    await adminService.updateUser(confirmTarget.value.id, { is_verified })
    ui.toast.success(confirmAction.value === 'unlock' ? 'Đã mở khoá tài khoản' : 'Đã khoá tài khoản')
    confirmModal.value = false
    loadUsers()
  } catch {
    ui.toast.error('Thao tác thất bại')
  } finally {
    isConfirming.value = false
  }
}

function goToDetail(user: AdminUser) {
  router.push({ name: 'AdminUserDetail', params: { id: user.id } })
}

function goPage(p: number) {
  page.value = p
  loadUsers()
}

onMounted(loadUsers)
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-1">Người dùng</h1>
      <p class="text-gray-500 text-sm">Quản lý tài khoản người dùng</p>
    </div>

    <!-- Toolbar -->
    <div class="flex flex-wrap items-center gap-3 mb-5">
      <div class="flex-1 min-w-48">
        <input
          :value="searchQuery"
          placeholder="Tìm theo tên, email..."
          class="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none transition-colors"
          @input="onSearchInput(($event.target as HTMLInputElement).value)"
        />
      </div>
      <div class="flex gap-2">
        <button
          v-for="f in [['all','Tất cả'],['active','Hoạt động'],['locked','Đã khoá']] as const"
          :key="f[0]"
          :class="[
            'px-4 py-2 rounded-xl text-sm font-medium transition-all',
            activeFilter === f[0]
              ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
              : 'text-gray-600 border border-gray-300 hover:bg-gray-50'
          ]"
          @click="onFilterChange(f[0])"
        >
          {{ f[1] }}
        </button>
      </div>
    </div>

    <!-- Table -->
    <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <div v-if="isLoading" class="flex justify-center py-16">
        <AppSpinner size="lg" />
      </div>

      <template v-else-if="result">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left px-4 py-3 text-gray-500 font-medium">ID</th>
                <th class="text-left px-4 py-3 text-gray-500 font-medium">Họ tên</th>
                <th class="text-left px-4 py-3 text-gray-500 font-medium">Email</th>
                <th class="text-right px-4 py-3 text-gray-500 font-medium">Số lượt</th>
                <th class="text-left px-4 py-3 text-gray-500 font-medium">Trạng thái lượt</th>
                <th class="text-left px-4 py-3 text-gray-500 font-medium">Trạng thái TK</th>
                <th class="text-left px-4 py-3 text-gray-500 font-medium">Ngày tạo</th>
                <th class="text-left px-4 py-3 text-gray-500 font-medium">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="user in result.items"
                :key="user.id"
                class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td class="px-4 py-3 text-gray-500 font-mono text-xs">#{{ user.id }}</td>
                <td class="px-4 py-3 text-gray-900 font-medium">{{ user.full_name }}</td>
                <td class="px-4 py-3 text-gray-600">{{ user.email }}</td>
                <td class="px-4 py-3 text-right text-indigo-600 font-semibold">{{ user.credits_balance }}</td>
                <td class="px-4 py-3">
                  <AppBadge :variant="creditsStatusVariant(user.credits_status)" size="sm">
                    {{ user.credits_status === 'active' ? 'Còn hạn' : user.credits_status === 'frozen' ? 'Đóng băng' : 'Hết lượt' }}
                  </AppBadge>
                </td>
                <td class="px-4 py-3">
                  <AppBadge :variant="user.is_verified ? 'success' : 'danger'" size="sm">
                    {{ user.is_verified ? 'Hoạt động' : 'Đã khoá' }}
                  </AppBadge>
                </td>
                <td class="px-4 py-3 text-gray-500 text-xs">{{ formatDate(user.created_at) }}</td>
                <td class="px-4 py-3">
                  <div class="flex items-center gap-2">
                    <AppButton variant="ghost" size="sm" @click="goToDetail(user)">Xem</AppButton>
                    <AppButton
                      :variant="user.is_verified ? 'danger' : 'secondary'"
                      size="sm"
                      @click="openConfirm(user, user.is_verified ? 'lock' : 'unlock')"
                    >
                      {{ user.is_verified ? 'Khoá' : 'Mở khoá' }}
                    </AppButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="result.totalPages > 1" class="flex items-center justify-between px-4 py-3 border-t border-gray-200">
          <p class="text-xs text-gray-500">
            Trang {{ result.page }} / {{ result.totalPages }} — {{ result.total }} người dùng
          </p>
          <div class="flex gap-2">
            <AppButton variant="ghost" size="sm" :disabled="page <= 1" @click="goPage(page - 1)">← Trước</AppButton>
            <AppButton variant="ghost" size="sm" :disabled="page >= result.totalPages" @click="goPage(page + 1)">Tiếp →</AppButton>
          </div>
        </div>
      </template>

      <div v-else class="py-16 text-center text-gray-500">Không có dữ liệu</div>
    </div>

    <!-- Confirm lock/unlock modal -->
    <AppModal :show="confirmModal" :title="confirmAction === 'lock' ? 'Khoá tài khoản' : 'Mở khoá tài khoản'" @close="confirmModal = false">
      <p class="text-gray-600 mb-5">
        Bạn có chắc muốn
        <strong class="text-gray-900">{{ confirmAction === 'lock' ? 'khoá' : 'mở khoá' }}</strong>
        tài khoản <strong class="text-indigo-600">{{ confirmTarget?.full_name }}</strong>?
      </p>
      <div class="flex justify-end gap-3">
        <AppButton variant="ghost" @click="confirmModal = false">Huỷ</AppButton>
        <AppButton
          :variant="confirmAction === 'lock' ? 'danger' : 'primary'"
          :loading="isConfirming"
          @click="doConfirm"
        >
          {{ confirmAction === 'lock' ? 'Khoá' : 'Mở khoá' }}
        </AppButton>
      </div>
    </AppModal>
  </div>
</template>
