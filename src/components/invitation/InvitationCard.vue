<script setup lang="ts">
import { computed } from 'vue'
import type { Invitation } from '@/types/invitation.types'

const props = defineProps<{ invitation: Invitation }>()
const emit = defineEmits<{
  (e: 'edit', uuid: string): void
  (e: 'delete', uuid: string): void
  (e: 'guests', uuid: string): void
  (e: 'share', uuid: string): void
}>()

const statusConfig = computed(() => ({
  draft:     { label: 'Bản nháp',    cls: 'bg-yellow-100 text-yellow-800' },
  published: { label: 'Đã xuất bản', cls: 'bg-green-100 text-green-800' },
  archived:  { label: 'Lưu trữ',    cls: 'bg-gray-100 text-gray-600' },
}[props.invitation.status]))

const publicUrl = computed(() =>
  props.invitation.status === 'published'
    ? `${import.meta.env.VITE_PUBLIC_BASE_URL}/i/${props.invitation.slug}`
    : null
)
</script>

<template>
  <div class="flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
    <!-- Color strip -->
    <div
      class="h-2 rounded-t-xl"
      :style="{ backgroundColor: (invitation.theme_config as any)?.primary_color || '#6366F1' }"
    />

    <div class="flex-1 p-4">
      <div class="mb-3 flex items-start justify-between gap-2">
        <h3 class="flex-1 truncate font-semibold text-gray-900">{{ invitation.title }}</h3>
        <span
          class="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
          :class="statusConfig?.cls"
        >
          {{ statusConfig?.label }}
        </span>
      </div>

      <div class="space-y-1 text-xs text-gray-500">
        <p>👁 {{ invitation.view_count.toLocaleString() }} lượt xem</p>
        <p v-if="invitation.published_at">
          📅 Xuất bản {{ new Date(invitation.published_at).toLocaleDateString('vi-VN') }}
        </p>
      </div>

      <div v-if="publicUrl" class="mt-3">
        <a
          :href="publicUrl"
          target="_blank"
          class="block truncate text-xs text-indigo-500 hover:underline"
        >
          🔗 {{ publicUrl }}
        </a>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex flex-col border-t border-gray-100 p-3 gap-2">
      <div class="flex gap-2">
        <button
          class="flex-1 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-100 transition-colors"
          @click="emit('edit', invitation.uuid)"
        >
          Chỉnh sửa
        </button>
        <button
          class="rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
          @click="emit('delete', invitation.uuid)"
        >
          Xóa
        </button>
      </div>
      <template v-if="invitation.status === 'published'">
        <div class="grid grid-cols-2 gap-2">
          <button
            class="flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            @click="emit('guests', invitation.uuid)"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Khách RSVP
          </button>
          <button
            class="flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
            @click="emit('share', invitation.uuid)"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            Chia sẻ / QR
          </button>
        </div>
      </template>
    </div>
  </div>
</template>
