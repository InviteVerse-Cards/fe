<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { adminService } from '@/services/admin.service'
import type { AdminUser } from '@/services/admin.service'
import { useUIStore } from '@/stores/ui'
import { formatDate } from '@/utils/format'
import AppSpinner from '@/components/common/AppSpinner.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppModal from '@/components/common/AppModal.vue'

const route = useRoute()
const router = useRouter()
const ui = useUIStore()

const user = ref<AdminUser | null>(null)
const isLoading = ref(false)

// Grant credits modal
const grantModal = ref(false)
const grantCredits = ref(0)
const grantReason = ref('')
const isGranting = ref(false)

// Lock/unlock modal
const lockModal = ref(false)
const isLocking = ref(false)

// Delete modal
const deleteModal = ref(false)
const isDeleting = ref(false)

const userId = Number(route.params.id)

function creditsStatusVariant(status: string): 'success' | 'warning' | 'danger' | 'default' {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
    active: 'success', frozen: 'warning', empty: 'danger',
  }
  return map[status] ?? 'default'
}

async function loadUser() {
  isLoading.value = true
  try {
    user.value = await adminService.getUserDetail(userId)
  } catch {
    ui.toast.error('Không thể tải thông tin người dùng')
    router.push({ name: 'AdminUsers' })
  } finally {
    isLoading.value = false
  }
}

async function doGrantCredits() {
  if (!grantCredits.value || !grantReason.value.trim()) {
    ui.toast.error('Vui lòng nhập đủ thông tin')
    return
  }
  isGranting.value = true
  try {
    await adminService.grantCredits(userId, { credits: grantCredits.value, reason: grantReason.value.trim() })
    ui.toast.success('Đã cập nhật lượt thành công')
    grantModal.value = false
    grantCredits.value = 0
    grantReason.value = ''
    loadUser()
  } catch {
    ui.toast.error('Thao tác thất bại')
  } finally {
    isGranting.value = false
  }
}

async function doLockToggle() {
  if (!user.value) return
  isLocking.value = true
  try {
    const is_verified = user.value.is_verified ? 0 : 1
    await adminService.updateUser(userId, { is_verified })
    ui.toast.success(is_verified ? 'Đã mở khoá tài khoản' : 'Đã khoá tài khoản')
    lockModal.value = false
    loadUser()
  } catch {
    ui.toast.error('Thao tác thất bại')
  } finally {
    isLocking.value = false
  }
}

async function doDelete() {
  isDeleting.value = true
  try {
    await adminService.deleteUser(userId)
    ui.toast.success('Đã xoá tài khoản')
    router.push({ name: 'AdminUsers' })
  } catch {
    ui.toast.error('Không thể xoá tài khoản')
  } finally {
    isDeleting.value = false
  }
}

onMounted(loadUser)
</script>

<template>
  <div>
    <div class="mb-6 flex items-center gap-4">
      <button class="text-gray-500 hover:text-gray-900 transition-colors" @click="router.push({ name: 'AdminUsers' })">
        ← Quay lại
      </button>
      <div>
        <h1 class="text-2xl font-bold text-gray-900 mb-0.5">Chi tiết người dùng</h1>
        <p class="text-gray-500 text-sm">ID: #{{ userId }}</p>
      </div>
    </div>

    <div v-if="isLoading" class="flex justify-center py-20">
      <AppSpinner size="lg" />
    </div>

    <template v-else-if="user">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <!-- Left: User Info -->
        <div class="lg:col-span-2 space-y-5">
          <!-- Profile card -->
          <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div class="flex items-start gap-5 mb-6">
              <div class="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-2xl font-bold font-serif flex-shrink-0">
                {{ user.full_name.charAt(0).toUpperCase() }}
              </div>
              <div class="flex-1">
                <h2 class="text-xl font-semibold text-gray-900">{{ user.full_name }}</h2>
                <p class="text-gray-600 text-sm">{{ user.email }}</p>
                <div class="flex flex-wrap gap-2 mt-2">
                  <AppBadge :variant="user.role === 'admin' ? 'info' : 'default'" size="sm">
                    {{ user.role === 'admin' ? '⚡ Admin' : '👤 User' }}
                  </AppBadge>
                  <AppBadge :variant="user.is_verified ? 'success' : 'danger'" size="sm">
                    {{ user.is_verified ? 'Hoạt động' : 'Đã khoá' }}
                  </AppBadge>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-xs text-gray-500 mb-1">Email</p>
                <p class="text-gray-900 text-sm">{{ user.email }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Số điện thoại</p>
                <p class="text-gray-900 text-sm">{{ user.phone || '—' }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Vai trò</p>
                <p class="text-gray-900 text-sm capitalize">{{ user.role }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 mb-1">Ngày tham gia</p>
                <p class="text-gray-900 text-sm">{{ formatDate(user.created_at) }}</p>
              </div>
            </div>
          </div>

          <!-- Credits card -->
          <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <h3 class="text-gray-900 font-semibold mb-4">Thông tin lượt</h3>
            <div class="grid grid-cols-3 gap-4">
              <div class="text-center">
                <p class="text-3xl font-bold text-indigo-600">{{ user.credits_balance }}</p>
                <p class="text-xs text-gray-500 mt-1">Số lượt còn lại</p>
              </div>
              <div class="text-center">
                <AppBadge :variant="creditsStatusVariant(user.credits_status)" size="md" class="mt-2">
                  {{ user.credits_status === 'active' ? 'Còn hạn' : user.credits_status === 'frozen' ? 'Đóng băng' : 'Hết lượt' }}
                </AppBadge>
                <p class="text-xs text-gray-500 mt-1">Trạng thái</p>
              </div>
              <div class="text-center">
                <p class="text-sm text-gray-600 mt-1">{{ formatDate(user.credits_expires_at) }}</p>
                <p class="text-xs text-gray-500 mt-1">Ngày hết hạn</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="space-y-4">
          <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <h3 class="text-gray-900 font-semibold mb-4">Hành động</h3>
            <div class="space-y-3">
              <AppButton variant="primary" class="w-full" @click="grantModal = true">
                💳 Cấp / Trừ lượt
              </AppButton>
              <AppButton
                :variant="user.is_verified ? 'danger' : 'secondary'"
                class="w-full"
                @click="lockModal = true"
              >
                {{ user.is_verified ? '🔒 Khoá tài khoản' : '🔓 Mở khoá tài khoản' }}
              </AppButton>
              <AppButton v-if="user.role !== 'admin'" variant="danger" class="w-full" @click="deleteModal = true">
                🗑️ Xoá tài khoản
              </AppButton>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- Grant credits modal -->
    <AppModal :show="grantModal" title="Cấp / Trừ lượt" @close="grantModal = false">
      <div class="space-y-4">
        <div>
          <label class="block text-sm text-gray-700 mb-1.5">Số lượt (âm để trừ)</label>
          <input
            v-model.number="grantCredits"
            type="number"
            placeholder="Ví dụ: 10 hoặc -5"
            class="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none transition-colors"
          />
        </div>
        <div>
          <label class="block text-sm text-gray-700 mb-1.5">Lý do</label>
          <textarea
            v-model="grantReason"
            placeholder="Nhập lý do..."
            rows="3"
            class="w-full bg-white border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none transition-colors resize-none"
          />
        </div>
        <div class="flex justify-end gap-3 pt-2">
          <AppButton variant="ghost" @click="grantModal = false">Huỷ</AppButton>
          <AppButton variant="primary" :loading="isGranting" @click="doGrantCredits">Xác nhận</AppButton>
        </div>
      </div>
    </AppModal>

    <!-- Lock/unlock modal -->
    <AppModal :show="lockModal" :title="user?.is_verified ? 'Khoá tài khoản' : 'Mở khoá tài khoản'" @close="lockModal = false">
      <p class="text-gray-600 mb-5">
        Bạn có chắc muốn
        <strong class="text-gray-900">{{ user?.is_verified ? 'khoá' : 'mở khoá' }}</strong>
        tài khoản <strong class="text-indigo-600">{{ user?.full_name }}</strong>?
      </p>
      <div class="flex justify-end gap-3">
        <AppButton variant="ghost" @click="lockModal = false">Huỷ</AppButton>
        <AppButton :variant="user?.is_verified ? 'danger' : 'primary'" :loading="isLocking" @click="doLockToggle">
          {{ user?.is_verified ? 'Khoá' : 'Mở khoá' }}
        </AppButton>
      </div>
    </AppModal>

    <!-- Delete modal -->
    <AppModal :show="deleteModal" title="Xoá tài khoản" @close="deleteModal = false">
      <p class="text-gray-600 mb-2">
        Bạn có chắc muốn <strong class="text-red-600">xoá vĩnh viễn</strong> tài khoản
        <strong class="text-indigo-600">{{ user?.full_name }}</strong>?
      </p>
      <p class="text-xs text-gray-500 mb-5">Hành động này không thể hoàn tác.</p>
      <div class="flex justify-end gap-3">
        <AppButton variant="ghost" @click="deleteModal = false">Huỷ</AppButton>
        <AppButton variant="danger" :loading="isDeleting" @click="doDelete">Xoá vĩnh viễn</AppButton>
      </div>
    </AppModal>
  </div>
</template>
