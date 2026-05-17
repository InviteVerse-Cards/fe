<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}>()
</script>

<template>
  <button
    :type="type ?? 'button'"
    :disabled="disabled || loading"
    :class="[
      'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
      {
        'px-3 py-1.5 text-sm': size === 'sm',
        'px-5 py-2.5 text-sm': !size || size === 'md',
        'px-8 py-3.5 text-base': size === 'lg',
      },
      {
        'bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2':
          !variant || variant === 'primary',
        'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2':
          variant === 'secondary',
        'text-gray-600 hover:text-gray-900 hover:bg-gray-100':
          variant === 'ghost',
        'bg-red-600 text-white hover:bg-red-500':
          variant === 'danger',
      },
    ]"
  >
    <span v-if="loading" class="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
    <slot />
  </button>
</template>
