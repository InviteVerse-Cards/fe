<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminService } from '@/services/admin.service'
import type { AdminStats } from '@/services/admin.service'
import { useUIStore } from '@/stores/ui'
import AppSpinner from '@/components/common/AppSpinner.vue'

const ui = useUIStore()
const stats = ref<AdminStats | null>(null)
const isLoading = ref(false)

async function loadStats() {
  isLoading.value = true
  try {
    stats.value = await adminService.getStats()
  } catch {
    ui.toast.error('Không thể tải thống kê')
  } finally {
    isLoading.value = false
  }
}

onMounted(loadStats)
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Tổng quan</h1>
      <p class="mt-1 text-sm text-gray-500">Thống kê hệ thống InviteVerse</p>
    </div>

    <div v-if="isLoading" class="flex justify-center py-20">
      <AppSpinner size="lg" />
    </div>

    <template v-else-if="stats">
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="card in statCards"
          :key="card.label"
          class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-500">{{ card.label }}</p>
              <p class="mt-1 text-3xl font-bold text-gray-900">
                {{ stats[card.key as keyof AdminStats]?.toLocaleString('vi-VN') ?? 0 }}
              </p>
            </div>
            <span class="text-3xl">{{ card.icon }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
const statCards = [
  { label: 'Tổng người dùng', key: 'total_users', icon: '👥' },
  { label: 'Người dùng hoạt động', key: 'active_users', icon: '✅' },
  { label: 'Tổng thiệp', key: 'total_invitations', icon: '💌' },
  { label: 'Thiệp đã xuất bản', key: 'published_invitations', icon: '🌐' },
  { label: 'Tổng đơn hàng', key: 'total_orders', icon: '🛒' },
  { label: 'Đơn đã thanh toán', key: 'paid_orders', icon: '💰' },
]
</script>
