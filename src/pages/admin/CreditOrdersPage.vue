<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminService } from '@/services/admin.service'
import type { CreditOrder } from '@/services/admin.service'
import type { PaginatedData } from '@/types/api.types'
import { useUIStore } from '@/stores/ui'
import { formatCurrency, formatDateTime } from '@/utils/format'
import AppSpinner from '@/components/common/AppSpinner.vue'
import AppBadge from '@/components/common/AppBadge.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppModal from '@/components/common/AppModal.vue'

const ui = useUIStore()
const result = ref<PaginatedData<CreditOrder> | null>(null)
const isLoading = ref(false)
const page = ref(1)
const limit = 15
const statusFilter = ref<string>('all')

const confirmModal = ref(false)
const confirmTarget = ref<CreditOrder | null>(null)
const confirmAction = ref<'fulfill' | 'cancel'>('fulfill')
const isConfirming = ref(false)

function orderVariant(status: string): 'success' | 'warning' | 'danger' | 'default' {
  const map: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
    paid: 'success', pending: 'warning', failed: 'danger', cancelled: 'default',
  }
  return map[status] ?? 'default'
}

function orderLabel(status: string) {
  return { paid: 'Đã thanh toán', pending: 'Chờ xử lý', failed: 'Thất bại', cancelled: 'Đã huỷ' }[status] ?? status
}

async function loadOrders() {
  isLoading.value = true
  try {
    const params: Record<string, unknown> = { page: page.value, limit }
    if (statusFilter.value !== 'all') params.status = statusFilter.value
    result.value = await adminService.getOrders(params)
  } catch {
    ui.toast.error('Không thể tải danh sách đơn')
  } finally {
    isLoading.value = false
  }
}

function onFilterChange(f: string) {
  statusFilter.value = f
  page.value = 1
  loadOrders()
}

function goPage(p: number) {
  page.value = p
  loadOrders()
}

function openConfirm(order: CreditOrder, action: 'fulfill' | 'cancel') {
  confirmTarget.value = order
  confirmAction.value = action
  confirmModal.value = true
}

async function doConfirm() {
  if (!confirmTarget.value) return
  isConfirming.value = true
  try {
    if (confirmAction.value === 'fulfill') {
      await adminService.fulfillOrder(confirmTarget.value.id)
      ui.toast.success('Đã xử lý đơn thành công')
    } else {
      await adminService.cancelOrder(confirmTarget.value.id)
      ui.toast.success('Đã huỷ đơn')
    }
    confirmModal.value = false
    loadOrders()
  } catch {
    ui.toast.error('Thao tác thất bại')
  } finally {
    isConfirming.value = false
  }
}

onMounted(loadOrders)
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Đơn hàng</h1>
      <p class="mt-1 text-sm text-gray-500">Quản lý đơn mua lượt</p>
    </div>

    <!-- Filter -->
    <div class="mb-5 flex flex-wrap gap-2">
      <button
        v-for="f in [['all','Tất cả'],['pending','Chờ xử lý'],['paid','Đã thanh toán'],['cancelled','Đã huỷ']] as const"
        :key="f[0]"
        :class="[
          'rounded-xl px-4 py-2 text-sm font-medium transition-all',
          statusFilter === f[0]
            ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
            : 'border border-gray-300 text-gray-600 hover:bg-gray-50'
        ]"
        @click="onFilterChange(f[0])"
      >
        {{ f[1] }}
      </button>
    </div>

    <!-- Table -->
    <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div v-if="isLoading" class="flex justify-center py-16">
        <AppSpinner size="lg" />
      </div>

      <template v-else-if="result">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="px-4 py-3 text-left text-gray-500 font-medium">ID</th>
                <th class="px-4 py-3 text-left text-gray-500 font-medium">Người dùng</th>
                <th class="px-4 py-3 text-left text-gray-500 font-medium">Gói</th>
                <th class="px-4 py-3 text-right text-gray-500 font-medium">Lượt</th>
                <th class="px-4 py-3 text-right text-gray-500 font-medium">Số tiền</th>
                <th class="px-4 py-3 text-left text-gray-500 font-medium">Trạng thái</th>
                <th class="px-4 py-3 text-left text-gray-500 font-medium">Thời gian</th>
                <th class="px-4 py-3 text-left text-gray-500 font-medium">Hành động</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="order in result.items"
                :key="order.id"
                class="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td class="px-4 py-3 font-mono text-xs text-gray-500">#{{ order.id }}</td>
                <td class="px-4 py-3">
                  <p class="font-medium text-gray-900">{{ order.user?.full_name ?? '—' }}</p>
                  <p class="text-xs text-gray-500">{{ order.user?.email }}</p>
                </td>
                <td class="px-4 py-3 text-gray-600">{{ order.package?.name ?? 'Tuỳ chỉnh' }}</td>
                <td class="px-4 py-3 text-right font-semibold text-indigo-600">{{ order.credits }}</td>
                <td class="px-4 py-3 text-right font-semibold text-gray-900">{{ formatCurrency(order.amount) }}</td>
                <td class="px-4 py-3">
                  <AppBadge :variant="orderVariant(order.status)" size="sm">{{ orderLabel(order.status) }}</AppBadge>
                </td>
                <td class="px-4 py-3 text-xs text-gray-500">{{ formatDateTime(order.created_at) }}</td>
                <td class="px-4 py-3">
                  <div class="flex gap-2">
                    <AppButton
                      v-if="order.status === 'pending'"
                      variant="primary"
                      size="sm"
                      @click="openConfirm(order, 'fulfill')"
                    >
                      Xử lý
                    </AppButton>
                    <AppButton
                      v-if="order.status === 'pending'"
                      variant="danger"
                      size="sm"
                      @click="openConfirm(order, 'cancel')"
                    >
                      Huỷ
                    </AppButton>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div v-if="result.totalPages > 1" class="flex items-center justify-between border-t border-gray-200 px-4 py-3">
          <p class="text-xs text-gray-500">
            Trang {{ result.page }} / {{ result.totalPages }} — {{ result.total }} đơn
          </p>
          <div class="flex gap-2">
            <AppButton variant="ghost" size="sm" :disabled="page <= 1" @click="goPage(page - 1)">← Trước</AppButton>
            <AppButton variant="ghost" size="sm" :disabled="page >= result.totalPages" @click="goPage(page + 1)">Tiếp →</AppButton>
          </div>
        </div>
      </template>

      <div v-else class="py-16 text-center text-gray-500">Không có dữ liệu</div>
    </div>

    <!-- Confirm modal -->
    <AppModal
      :show="confirmModal"
      :title="confirmAction === 'fulfill' ? 'Xử lý đơn hàng' : 'Huỷ đơn hàng'"
      size="sm"
      @close="confirmModal = false"
    >
      <p class="mb-5 text-gray-600">
        Bạn có chắc muốn
        <strong class="text-gray-900">{{ confirmAction === 'fulfill' ? 'xử lý (giao lượt)' : 'huỷ' }}</strong>
        đơn hàng <strong class="text-indigo-600">#{{ confirmTarget?.id }}</strong>?
      </p>
      <div class="flex justify-end gap-3">
        <AppButton variant="ghost" @click="confirmModal = false">Huỷ</AppButton>
        <AppButton
          :variant="confirmAction === 'fulfill' ? 'primary' : 'danger'"
          :loading="isConfirming"
          @click="doConfirm"
        >
          Xác nhận
        </AppButton>
      </div>
    </AppModal>
  </div>
</template>
