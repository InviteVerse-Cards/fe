<script setup lang="ts">
import { ref, watch } from 'vue'
import { useEditorStore } from '@/stores/editor.store'
import type { TimelineConfig, TimelineEvent } from '@/types/section.types'
import AppInput from '@/components/common/AppInput.vue'

const props = defineProps<{ config: Record<string, unknown>; sectionType: string }>()
const editorStore = useEditorStore()
const defaultForm: TimelineConfig = { events: [] }
const form = ref<TimelineConfig>(Object.assign({}, defaultForm, props.config as unknown as Partial<TimelineConfig>))

watch(() => props.config, (v) => {
  form.value = Object.assign({}, defaultForm, v as unknown as Partial<TimelineConfig>)
}, { deep: true })
function sync() { editorStore.updateSectionConfig('timeline', { ...form.value }) }

function addEvent() {
  form.value.events.push({ date: '', title: '', description: '' })
  sync()
}
function removeEvent(i: number) { form.value.events.splice(i, 1); sync() }
function updateEvent(i: number, field: keyof TimelineEvent, value: string) {
  (form.value.events[i] as any)[field] = value
  sync()
}
</script>

<template>
  <div class="space-y-4">
    <div class="mb-2 flex justify-between">
      <label class="text-sm font-medium text-gray-700">Các mốc</label>
      <button class="text-xs text-indigo-600 hover:underline" @click="addEvent">+ Thêm mốc</button>
    </div>
    <div v-for="(ev, i) in form.events" :key="i" class="rounded-lg border border-gray-200 p-3 space-y-2">
      <div class="flex justify-between">
        <span class="text-xs text-gray-500">Mốc {{ i + 1 }}</span>
        <button class="text-xs text-red-500" @click="removeEvent(i)">Xóa</button>
      </div>
      <AppInput label="Ngày" type="date" :model-value="ev.date" @update:model-value="updateEvent(i, 'date', $event)" />
      <AppInput label="Tiêu đề" :model-value="ev.title" placeholder="Lần đầu gặp nhau" @update:model-value="updateEvent(i, 'title', $event)" />
      <AppInput label="Mô tả" :model-value="ev.description ?? ''" placeholder="Chúng tôi gặp nhau tại..." @update:model-value="updateEvent(i, 'description', $event)" />
    </div>
  </div>
</template>
