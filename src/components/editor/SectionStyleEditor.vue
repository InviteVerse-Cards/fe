<script setup lang="ts">
import { ref, watch } from 'vue'
import { useEditorStore } from '@/stores/editor.store'
import { FONT_OPTIONS } from '@/types/section.types'
import type { SectionStyle } from '@/types/section.types'
import { loadGoogleFont } from '@/utils/fontLoader'
import RgbaColorPicker from './RgbaColorPicker.vue'
import AppFontSelect from '@/components/common/AppFontSelect.vue'

const props = defineProps<{
  sectionType: string
  style: SectionStyle
}>()

const editorStore = useEditorStore()
const form = ref<SectionStyle>({ ...props.style })

watch(() => props.style, (val) => { form.value = { ...val } }, { deep: true })

function update(field: keyof SectionStyle, value: string) {
  form.value[field] = value
  editorStore.updateSectionConfig(props.sectionType, { style: { ...form.value } })
}

function onFontChange(value: string) {
  if (value) loadGoogleFont(value)
  update('font', value)
}
</script>

<template>
  <div class="space-y-3">
    <h4 class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
      <span>🎨</span> Phong cách riêng
    </h4>

    <!-- Font (tất cả section) -->
    <div>
      <label class="mb-1.5 block text-xs font-medium text-gray-600">Font chữ</label>
      <AppFontSelect
        :model-value="form.font ?? ''"
        :options="FONT_OPTIONS"
        button-class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        @update:model-value="onFontChange"
      />
    </div>

    <!-- Màu chữ + Màu nền: chỉ cho non-hero -->
    <template v-if="sectionType !== 'hero'">
      <div>
        <RgbaColorPicker
          label="Màu chữ"
          default-hex="#1F2937"
          empty-label="Theo chủ đạo"
          :model-value="form.text_color ?? ''"
          @update:model-value="update('text_color', $event)"
        />
        <button
          v-if="form.text_color"
          class="mt-1 text-xs text-gray-400 hover:text-gray-600"
          @click="update('text_color', '')"
        >
          ✕ Đặt lại
        </button>
      </div>

      <div>
        <RgbaColorPicker
          label="Màu nền vùng"
          default-hex="#ffffff"
          empty-label="Trong suốt"
          :model-value="form.background_color ?? ''"
          @update:model-value="update('background_color', $event)"
        />
        <button
          v-if="form.background_color"
          class="mt-1 text-xs text-gray-400 hover:text-gray-600"
          @click="update('background_color', '')"
        >
          ✕ Đặt lại
        </button>
      </div>
    </template>

    <!-- ⏳ Countdown — chỉ hero section -->
    <template v-if="sectionType === 'hero'">
      <div class="border-t border-gray-100 pt-2">
        <h5 class="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">
          <span>⏳</span> Đếm ngược
        </h5>

        <div class="space-y-3">
          <div>
            <RgbaColorPicker
              label="Màu số (04, 13…)"
              default-hex="#6366f1"
              empty-label="Theo chủ đạo"
              :model-value="form.countdown_text_color ?? ''"
              @update:model-value="update('countdown_text_color', $event)"
            />
            <button
              v-if="form.countdown_text_color"
              class="mt-1 text-xs text-gray-400 hover:text-gray-600"
              @click="update('countdown_text_color', '')"
            >✕ Đặt lại</button>
          </div>

          <div>
            <RgbaColorPicker
              label="Màu nhãn (Ngày, Giờ…)"
              default-hex="#ffffff"
              empty-label="Theo chủ đạo"
              :model-value="form.countdown_label_color ?? ''"
              @update:model-value="update('countdown_label_color', $event)"
            />
            <button
              v-if="form.countdown_label_color"
              class="mt-1 text-xs text-gray-400 hover:text-gray-600"
              @click="update('countdown_label_color', '')"
            >✕ Đặt lại</button>
          </div>

          <div>
            <RgbaColorPicker
              label="Màu nền ô"
              default-hex="#ffffff"
              empty-label="Theo chủ đạo"
              :model-value="form.countdown_bg ?? ''"
              @update:model-value="update('countdown_bg', $event)"
            />
            <button
              v-if="form.countdown_bg"
              class="mt-1 text-xs text-gray-400 hover:text-gray-600"
              @click="update('countdown_bg', '')"
            >✕ Đặt lại</button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
