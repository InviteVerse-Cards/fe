<script setup lang="ts">
import type { Toast } from '@/stores/ui'
import { useUIStore } from '@/stores/ui'

defineProps<{ toast: Toast }>()
const uiStore = useUIStore()

const icons: Record<string, string> = {
  success: '✓',
  error:   '✕',
  warning: '⚠',
  info:    'ℹ',
}

const colors: Record<string, string> = {
  success: 'border-green-200 bg-green-50 text-green-800',
  error:   'border-red-200 bg-red-50 text-red-800',
  warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
  info:    'border-blue-200 bg-blue-50 text-blue-800',
}
</script>

<template>
  <div
    class="flex items-start gap-3 rounded-xl border px-4 py-3 shadow-md"
    :class="colors[toast.type]"
  >
    <span class="mt-0.5 text-sm font-bold">{{ icons[toast.type] }}</span>
    <p class="flex-1 text-sm">{{ toast.message }}</p>
    <button
      class="opacity-60 transition-opacity hover:opacity-100"
      @click="uiStore.removeToast(toast.id)"
    >
      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
      </svg>
    </button>
  </div>
</template>
