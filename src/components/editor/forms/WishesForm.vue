<script setup lang="ts">
import { ref, watch } from 'vue'
import { useEditorStore } from '@/stores/editor.store'
import type { WishesConfig } from '@/types/section.types'
import AppInput from '@/components/common/AppInput.vue'

const props = defineProps<{ config: Record<string, unknown>; sectionType: string }>()
const editorStore = useEditorStore()
const form = ref<WishesConfig>({ ...(props.config as WishesConfig) })

watch(() => props.config, (v) => { form.value = { ...(v as WishesConfig) } }, { deep: true })
function update(field: keyof WishesConfig, value: string) {
  (form.value as any)[field] = value
  editorStore.updateSectionConfig('wishes', { [field]: value })
}
</script>

<template>
  <div class="space-y-4">
    <AppInput label="Tiêu đề" :model-value="form.title ?? ''" placeholder="Lời chúc từ bạn bè" @update:model-value="update('title', $event)" />
    <p class="text-xs text-gray-500">Lời chúc sẽ được hiển thị sau khi khách gửi qua form RSVP.</p>
  </div>
</template>
