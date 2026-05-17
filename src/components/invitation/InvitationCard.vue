<script setup lang="ts">
import { computed } from 'vue'
import type { Invitation } from '@/types/invitation.types'

const props = defineProps<{ invitation: Invitation }>()
const emit = defineEmits<{
  (e: 'edit', uuid: string): void
  (e: 'delete', uuid: string): void
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
    <div class="flex border-t border-gray-100 p-3 gap-2">
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
  </div>
</template>
