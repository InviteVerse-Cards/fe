<script setup lang="ts">
import { ref, watch } from 'vue'
import { useEditorStore } from '@/stores/editor.store'
import type { EventInfoConfig, Ceremony } from '@/types/section.types'
import AppInput from '@/components/common/AppInput.vue'

const props = defineProps<{ config: Record<string, unknown>; sectionType: string; category?: string }>()
const editorStore = useEditorStore()
const defaultForm: EventInfoConfig = { ceremonies: [] }
const form = ref<EventInfoConfig>(Object.assign({}, defaultForm, props.config as unknown as Partial<EventInfoConfig>))

watch(() => props.config, (v) => {
  form.value = Object.assign({}, defaultForm, v as unknown as Partial<EventInfoConfig>)
}, { deep: true })

const ceremonyLabel = {
  section: {
    birthday: 'Các buổi tiệc',
    baby_shower: 'Các buổi tiệc',
    house_warming: 'Các buổi tiệc',
    housewarming: 'Các buổi tiệc',
    corporate: 'Các buổi / sự kiện',
  } as Record<string, string>,
  add: {
    birthday: '+ Thêm buổi tiệc',
    baby_shower: '+ Thêm buổi tiệc',
    house_warming: '+ Thêm buổi tiệc',
    housewarming: '+ Thêm buổi tiệc',
    corporate: '+ Thêm sự kiện',
  } as Record<string, string>,
  default: {
    birthday: 'Tiệc sinh nhật',
    baby_shower: 'Tiệc thôi nôi',
    house_warming: 'Tân gia',
    housewarming: 'Tân gia',
    corporate: 'Sự kiện',
  } as Record<string, string>,
}

function sectionTitle() { return ceremonyLabel.section[props.category ?? ''] ?? 'Các buổi lễ' }
function addLabel()     { return ceremonyLabel.add[props.category ?? ''] ?? '+ Thêm buổi lễ' }
function defaultName()  { return ceremonyLabel.default[props.category ?? ''] ?? 'Lễ cưới' }

function sync() {
  editorStore.updateSectionConfig('event_info', {
    ceremonies: form.value.ceremonies,
    invitation_message: form.value.invitation_message,
  })
}

function addCeremony() {
  form.value.ceremonies.push({ name: defaultName(), date: '', time: '', venue: '', address: '' })
  sync()
}

function removeCeremony(i: number) {
  form.value.ceremonies.splice(i, 1)
  sync()
}

function updateCeremony(i: number, field: keyof Ceremony, value: string) {
  form.value.ceremonies[i][field] = value
  sync()
}
</script>

<template>
  <div class="space-y-4">

    <div class="space-y-1">
      <label class="block text-sm font-medium text-gray-700">Lời mời</label>
      <textarea
        :value="form.invitation_message ?? ''"
        rows="3"
        class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        placeholder="Trân trọng kính mời..."
        @input="form.invitation_message = ($event.target as HTMLTextAreaElement).value; sync()"
      />
    </div>

    <div>
      <div class="mb-2 flex items-center justify-between">
        <label class="text-sm font-medium text-gray-700">{{ sectionTitle() }}</label>
        <button
          class="text-xs text-indigo-600 hover:underline"
          @click="addCeremony"
        >{{ addLabel() }}</button>
      </div>

      <div v-for="(c, i) in form.ceremonies" :key="i" class="mb-3 rounded-lg border border-gray-200 p-3">
        <div class="mb-2 flex items-center justify-between">
          <span class="text-xs font-medium text-gray-500">Buổi lễ {{ i + 1 }}</span>
          <button class="text-xs text-red-500 hover:underline" @click="removeCeremony(i)">Xóa</button>
        </div>
        <div class="space-y-2">
          <AppInput label="Tên buổi lễ" :model-value="c.name" placeholder="Lễ cưới" @update:model-value="updateCeremony(i, 'name', $event)" />
          <AppInput label="Ngày" type="date" :model-value="c.date" @update:model-value="updateCeremony(i, 'date', $event)" />
          <AppInput label="Giờ" type="time" :model-value="c.time" @update:model-value="updateCeremony(i, 'time', $event)" />
          <AppInput label="Địa điểm" :model-value="c.venue" placeholder="Nhà hàng ABC" @update:model-value="updateCeremony(i, 'venue', $event)" />
          <AppInput label="Địa chỉ" :model-value="c.address" placeholder="123 đường XYZ..." @update:model-value="updateCeremony(i, 'address', $event)" />
        </div>
      </div>

      <div v-if="form.ceremonies.length === 0" class="rounded-lg border border-dashed border-gray-200 p-4 text-center text-sm text-gray-400">
        Chưa có buổi lễ nào. Nhấn "Thêm buổi lễ" để thêm.
      </div>
    </div>
  </div>
</template>
