<script setup lang="ts">
defineProps<{
  modelValue?: string
  label?: string
  placeholder?: string
  type?: string
  error?: string
  disabled?: boolean
  required?: boolean
}>()

defineEmits<{ (e: 'update:modelValue', val: string): void }>()
</script>

<template>
  <div class="space-y-1.5">
    <label v-if="label" class="block text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="ml-0.5 text-red-500">*</span>
    </label>
    <input
      :value="modelValue"
      :type="type ?? 'text'"
      :placeholder="placeholder"
      :disabled="disabled"
      :required="required"
      class="w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-1"
      :class="[
        error
          ? 'border-red-400 focus:border-red-500 focus:ring-red-300'
          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-300',
        disabled && 'cursor-not-allowed opacity-50',
      ]"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="flex items-center gap-1 text-xs text-red-500">
      <span>⚠</span> {{ error }}
    </p>
  </div>
</template>
