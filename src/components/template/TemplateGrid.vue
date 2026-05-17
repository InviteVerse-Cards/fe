<script setup lang="ts">
import type { Template } from '@/types/template.types'
import TemplateCard from './TemplateCard.vue'

defineProps<{ templates: Template[]; isSelecting?: boolean }>()
defineEmits<{
  (e: 'select', t: Template): void
  (e: 'preview', t: Template): void
}>()
</script>

<template>
  <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
    <TemplateCard
      v-for="template in templates"
      :key="template.id"
      :template="template"
      :is-selecting="isSelecting"
      @select="$emit('select', $event)"
      @preview="$emit('preview', $event)"
    />
  </div>

  <div v-if="templates.length === 0" class="py-16 text-center">
    <p class="text-4xl">🎨</p>
    <p class="mt-3 text-sm text-gray-500">Không có mẫu nào trong danh mục này</p>
  </div>
</template>
