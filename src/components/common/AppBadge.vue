<script setup lang="ts">
defineProps<{
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'default' | 'primary'
  size?: 'sm' | 'md'
}>()
</script>

<template>
  <span
    class="inline-flex items-center gap-1 rounded-full font-medium"
    :class="[
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs',
      {
        'bg-green-100 text-green-800':   !variant || variant === 'success',
        'bg-yellow-100 text-yellow-800': variant === 'warning',
        'bg-red-100 text-red-700':       variant === 'danger',
        'bg-blue-100 text-blue-700':     variant === 'info',
        'bg-gray-100 text-gray-600':     variant === 'default',
        'bg-indigo-100 text-indigo-700': variant === 'primary',
      },
    ]"
  >
    <slot />
  </span>
</template>
