<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  modelValue: string
  defaultHex?: string
  label?: string
  emptyLabel?: string
}>()

const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

function hexToRgba(hex: string, opacity: number): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${(opacity / 100).toFixed(2)})`
}

function parseColor(value: string): { hex: string; opacity: number } {
  if (!value) return { hex: props.defaultHex ?? '#000000', opacity: 100 }
  const m = value.match(/rgba?\(\s*(\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\s*\)/)
  if (m) {
    const hex = '#' + [m[1], m[2], m[3]].map(n => parseInt(n).toString(16).padStart(2, '0')).join('')
    return { hex, opacity: m[4] !== undefined ? Math.round(parseFloat(m[4]) * 100) : 100 }
  }
  if (value.startsWith('#')) return { hex: value, opacity: 100 }
  return { hex: props.defaultHex ?? '#000000', opacity: 100 }
}

const parsed = computed(() => parseColor(props.modelValue))

function onColor(e: Event) {
  emit('update:modelValue', hexToRgba((e.target as HTMLInputElement).value, parsed.value.opacity))
}

function onOpacity(e: Event) {
  emit('update:modelValue', hexToRgba(parsed.value.hex, Number((e.target as HTMLInputElement).value)))
}
</script>

<template>
  <div>
    <div v-if="label" class="mb-1.5 flex items-center justify-between">
      <label class="text-xs font-medium text-gray-600">{{ label }}</label>
      <span v-if="!modelValue && emptyLabel" class="text-xs text-gray-400 italic">{{ emptyLabel }}</span>
    </div>
    <div class="flex items-center gap-2">
      <input
        type="color"
        :value="parsed.hex"
        class="h-9 w-12 flex-shrink-0 cursor-pointer rounded-lg border border-gray-200 p-1"
        @input="onColor"
      />
      <div class="flex min-w-0 flex-1 flex-col gap-1">
        <input
          type="range"
          min="0"
          max="100"
          :value="parsed.opacity"
          class="w-full accent-indigo-500"
          @input="onOpacity"
        />
        <div class="flex justify-between text-xs text-gray-400">
          <span class="truncate">{{ parsed.hex }}</span>
          <span class="flex-shrink-0">{{ parsed.opacity }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>
