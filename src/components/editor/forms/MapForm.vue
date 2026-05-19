<script setup lang="ts">
import { ref, watch } from 'vue'
import { useEditorStore } from '@/stores/editor.store'
import type { MapConfig } from '@/types/section.types'
import AppInput from '@/components/common/AppInput.vue'

const props = defineProps<{ config: Record<string, unknown>; sectionType: string }>()
const editorStore = useEditorStore()
const form = ref<MapConfig>({ ...(props.config as MapConfig) })

watch(() => props.config, (v) => { form.value = { ...(v as MapConfig) } }, { deep: true })
function extractEmbedUrl(raw: string): string {
  const match = raw.match(/src="([^"]+)"/i)
  return match ? match[1] : raw.trim()
}

function update(field: keyof MapConfig, value: string) {
  const resolved = field === 'embed_url' ? extractEmbedUrl(value) : value;
  (form.value as any)[field] = resolved
  editorStore.updateSectionConfig('map', { [field]: resolved })
}
</script>

<template>
  <div class="space-y-4">
    <AppInput label="Tên địa điểm" :model-value="form.venue_name ?? ''" placeholder="Nhà hàng Tiệc Cưới" @update:model-value="update('venue_name', $event)" />
    <div class="space-y-1">
      <label class="block text-sm font-medium text-gray-700">Google Maps Embed URL</label>
      <textarea
        :value="form.embed_url ?? ''"
        rows="3"
        class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
        placeholder="Dán thẻ <iframe> hoặc link embed từ Google Maps vào đây"
        @input="update('embed_url', ($event.target as HTMLTextAreaElement).value)"
      />
      <!-- How-to guide -->
      <div class="rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-700 space-y-1.5">
        <p class="font-semibold">Cách lấy mã nhúng bản đồ:</p>
        <ol class="list-decimal list-inside space-y-1 leading-relaxed">
          <li>Mở <span class="font-medium">Google Maps</span> và tìm địa điểm</li>
          <li>Nhấn nút <span class="font-medium">Chia sẻ</span> → chọn tab <span class="font-medium">"Nhúng bản đồ"</span></li>
          <li>Nhấn <span class="font-medium">"Sao chép HTML"</span></li>
          <li>Dán toàn bộ vào đây — hệ thống tự xử lý</li>
        </ol>
      </div>
    </div>
  </div>
</template>
