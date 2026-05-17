<script setup lang="ts">
import { ref, watch } from 'vue'
import { useEditorStore } from '@/stores/editor.store'
import type { MapConfig } from '@/types/section.types'
import AppInput from '@/components/common/AppInput.vue'

const props = defineProps<{ config: Record<string, unknown>; sectionType: string }>()
const editorStore = useEditorStore()
const form = ref<MapConfig>({ ...(props.config as MapConfig) })

watch(() => props.config, (v) => { form.value = { ...(v as MapConfig) } }, { deep: true })
function update(field: keyof MapConfig, value: string) {
  (form.value as any)[field] = value
  editorStore.updateSectionConfig('map', { [field]: value })
}
</script>

<template>
  <div class="space-y-4">
    <AppInput label="Tên địa điểm" :model-value="form.venue_name ?? ''" placeholder="Nhà hàng Tiệc Cưới" @update:model-value="update('venue_name', $event)" />
    <AppInput label="Địa chỉ" :model-value="form.address ?? ''" placeholder="123 đường ABC, Q.1, TP.HCM" @update:model-value="update('address', $event)" />
    <div class="space-y-1">
      <label class="block text-sm font-medium text-gray-700">Google Maps Embed URL</label>
      <textarea
        :value="form.embed_url ?? ''"
        rows="3"
        class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        placeholder="https://maps.google.com/maps?..."
        @input="update('embed_url', ($event.target as HTMLTextAreaElement).value)"
      />
    </div>
  </div>
</template>
