<script setup lang="ts">
import { ref, watch } from 'vue'
import { useEditorStore } from '@/stores/editor.store'
import type { CountdownConfig } from '@/types/section.types'
import AppInput from '@/components/common/AppInput.vue'

const props = defineProps<{ config: Record<string, unknown>; sectionType: string }>()
const editorStore = useEditorStore()
const form = ref<CountdownConfig>({ ...(props.config as CountdownConfig) })

watch(() => props.config, (v) => { form.value = { ...(v as CountdownConfig) } }, { deep: true })
function update(field: keyof CountdownConfig, value: string) {
  (form.value as any)[field] = value
  editorStore.updateSectionConfig('countdown', { [field]: value })
}
</script>

<template>
  <div class="space-y-4">
    <AppInput label="Ngày sự kiện" type="datetime-local" :model-value="form.target_date ?? ''" @update:model-value="update('target_date', $event)" />
    <AppInput label="Tiêu đề" :model-value="form.title ?? ''" placeholder="Đếm ngược đến ngày cưới" @update:model-value="update('title', $event)" />
    <AppInput label="Thông báo khi hết hạn" :model-value="form.expired_message ?? ''" placeholder="🎉 Hôm nay là ngày trọng đại!" @update:model-value="update('expired_message', $event)" />
  </div>
</template>
