<script setup lang="ts">
defineProps<{ size?: 'sm' | 'md' | 'lg' }>()
</script>

<template>
  <div class="flex items-center justify-center">
    <div
      class="animate-spin rounded-full border-indigo-200 border-t-indigo-600"
      :class="{
        'h-4 w-4 border-2': size === 'sm',
        'h-8 w-8 border-2': !size || size === 'md',
        'h-12 w-12 border-[3px]': size === 'lg',
      }"
    />
  </div>
</template>
