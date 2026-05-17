<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useMyInvitations, useDeleteInvitation } from '@/composables/useInvitation'
import InvitationCard from '@/components/invitation/InvitationCard.vue'
import AppSpinner from '@/components/common/AppSpinner.vue'

const router = useRouter()
const auth = useAuthStore()
const { user } = storeToRefs(auth)

const page = ref(1)
const { data, isPending, isError } = useMyInvitations(page)
const { mutate: deleteInvitation, isPending: isDeleting } = useDeleteInvitation()

function goToTemplates() {
  router.push({ name: 'Templates' })
}

function goToEditor(uuid: string) {
  router.push({ name: 'Editor', params: { uuid } })
}

function handleDelete(uuid: string) {
  if (confirm('Bạn có chắc muốn xóa thiệp này? Hành động không thể hoàn tác.')) {
    deleteInvitation(uuid)
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <!-- Header -->
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Thiệp của tôi</h1>
          <p class="mt-1 text-sm text-gray-500">
            Xin chào, {{ user?.full_name }}! Quản lý tất cả thiệp của bạn tại đây.
          </p>
        </div>
        <button
          class="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          @click="goToTemplates"
        >
          + Tạo thiệp mới
        </button>
      </div>

      <!-- Loading -->
      <div v-if="isPending" class="flex justify-center py-20">
        <AppSpinner class="h-8 w-8 text-indigo-600" />
      </div>

      <!-- Error -->
      <div v-else-if="isError" class="rounded-xl bg-red-50 p-6 text-center text-red-600">
        Không thể tải danh sách thiệp. Vui lòng thử lại.
      </div>

      <!-- Empty -->
      <div
        v-else-if="!data?.items.length"
        class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 py-20 text-center"
      >
        <div class="mb-4 text-5xl">💌</div>
        <h3 class="text-lg font-semibold text-gray-900">Bạn chưa có thiệp nào</h3>
        <p class="mt-2 text-sm text-gray-500">Chọn một mẫu thiệp và bắt đầu tạo ngay!</p>
        <button
          class="mt-6 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          @click="goToTemplates"
        >
          Tạo thiệp đầu tiên
        </button>
      </div>

      <!-- List -->
      <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <InvitationCard
          v-for="inv in data.items"
          :key="inv.uuid"
          :invitation="inv"
          @edit="goToEditor"
          @delete="handleDelete"
        />
      </div>

      <!-- Pagination -->
      <div
        v-if="data && data.pagination.total_pages > 1"
        class="mt-8 flex justify-center gap-2"
      >
        <button
          v-for="p in data.pagination.total_pages"
          :key="p"
          class="min-w-[40px] rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          :class="page === p ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'"
          @click="page = p"
        >
          {{ p }}
        </button>
      </div>
    </div>
  </div>
</template>
