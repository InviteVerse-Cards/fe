<script setup lang="ts">
import { ref, watch } from 'vue'
import { useEditorStore } from '@/stores/editor.store'
import type { RSVPConfig } from '@/types/section.types'
import AppInput from '@/components/common/AppInput.vue'

const props = defineProps<{ config: Record<string, unknown>; sectionType: string }>()
const editorStore = useEditorStore()
const form = ref<RSVPConfig>({ ...(props.config as RSVPConfig) })

watch(() => props.config, (v) => { form.value = { ...(v as RSVPConfig) } }, { deep: true })
function update(field: keyof RSVPConfig, value: string) {
  (form.value as any)[field] = value
  editorStore.updateSectionConfig('rsvp', { [field]: value })
}
</script>

<template>
  <div class="space-y-4">
    <AppInput label="Tiêu đề" :model-value="form.title ?? ''" placeholder="Xác nhận tham dự" @update:model-value="update('title', $event)" />
    <AppInput label="Phụ đề" :model-value="form.subtitle ?? ''" placeholder="Vui lòng xác nhận trước ngày..." @update:model-value="update('subtitle', $event)" />
    <AppInput label="Hạn chót" type="date" :model-value="form.deadline ?? ''" @update:model-value="update('deadline', $event)" />
  </div>
</template>
