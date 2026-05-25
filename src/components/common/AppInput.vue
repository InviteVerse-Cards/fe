<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{
  modelValue?: string
  label?: string
  placeholder?: string
  type?: string
  error?: string
  disabled?: boolean
  required?: boolean
}>()

defineEmits<{ (e: 'update:modelValue', val: string): void }>()

const showPassword = ref(false)

function togglePasswordVisibility() {
  showPassword.value = !showPassword.value
}

const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type ?? 'text'
})
</script>

<template>
  <div class="space-y-1.5">
    <label v-if="label" class="block text-sm font-medium text-gray-700">
      {{ label }}
      <span v-if="required" class="ml-0.5 text-red-500">*</span>
    </label>
    <div class="relative w-full">
      <input
        :value="modelValue"
        :type="inputType"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        class="w-full rounded-lg border bg-white pl-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors focus:outline-none focus:ring-1"
        :class="[
          error
            ? 'border-red-400 focus:border-red-500 focus:ring-red-300'
            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-300',
          disabled && 'cursor-not-allowed opacity-50',
          type === 'password' ? 'pr-10' : 'pr-4',
        ]"
        @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
      
      <!-- Nút bật/tắt hiển thị mật khẩu bằng biểu tượng con mắt -->
      <button
        v-if="type === 'password'"
        type="button"
        @click="togglePasswordVisibility"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer flex items-center justify-center p-1"
        title="Hiển thị/Ẩn mật khẩu"
      >
        <!-- Icon ẩn mật khẩu (khi mật khẩu đang hiện) -->
        <svg
          v-if="showPassword"
          class="h-4.5 w-4.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
        </svg>
        
        <!-- Icon hiển thị mật khẩu (khi mật khẩu đang ẩn) -->
        <svg
          v-else
          class="h-4.5 w-4.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      </button>
    </div>
    
    <p v-if="error" class="flex items-center gap-1 text-xs text-red-500">
      <span>⚠</span> {{ error }}
    </p>
  </div>
</template>
