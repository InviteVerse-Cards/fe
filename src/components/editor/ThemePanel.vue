<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useEditorStore } from '@/stores/editor.store'
import type { ThemeConfig } from '@/types/section.types'

const editorStore = useEditorStore()
const { themeConfig } = storeToRefs(editorStore)

const colorFields: Array<{ key: keyof ThemeConfig; label: string }> = [
  { key: 'primary_color', label: 'Màu chính' },
  { key: 'secondary_color', label: 'Màu phụ' },
  { key: 'background_color', label: 'Màu nền' },
  { key: 'text_color', label: 'Màu chữ' },
  { key: 'accent_color', label: 'Màu nhấn' },
]

const headingFonts = ['Playfair Display', 'Cormorant Garamond', 'Cinzel', 'DM Serif Display', 'EB Garamond']
const bodyFonts = ['Inter', 'Lato', 'Nunito', 'Raleway', 'Poppins']
const borderRadiusOptions: Array<{ value: ThemeConfig['border_radius']; label: string }> = [
  { value: 'none', label: 'Vuông' },
  { value: 'sm', label: 'Nhỏ' },
  { value: 'md', label: 'Vừa' },
  { value: 'lg', label: 'Lớn' },
]
</script>

<template>
  <div class="space-y-5 p-4">
    <div>
      <h3 class="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Màu sắc</h3>
      <div class="space-y-3">
        <div v-for="field in colorFields" :key="field.key" class="flex items-center justify-between gap-3">
          <label class="text-sm text-gray-700">{{ field.label }}</label>
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-500">{{ themeConfig[field.key] as string }}</span>
            <input
              type="color"
              :value="themeConfig[field.key] as string"
              class="h-8 w-10 cursor-pointer rounded border border-gray-200 p-0.5"
              @input="editorStore.updateTheme({ [field.key]: ($event.target as HTMLInputElement).value })"
            />
          </div>
        </div>
      </div>
    </div>

    <div>
      <h3 class="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Font chữ</h3>
      <div class="space-y-3">
        <div>
          <label class="mb-1 block text-sm text-gray-700">Tiêu đề</label>
          <select
            :value="themeConfig.font_heading"
            class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            @change="editorStore.updateTheme({ font_heading: ($event.target as HTMLSelectElement).value })"
          >
            <option v-for="font in headingFonts" :key="font" :value="font">{{ font }}</option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-sm text-gray-700">Nội dung</label>
          <select
            :value="themeConfig.font_body"
            class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
            @change="editorStore.updateTheme({ font_body: ($event.target as HTMLSelectElement).value })"
          >
            <option v-for="font in bodyFonts" :key="font" :value="font">{{ font }}</option>
          </select>
        </div>
      </div>
    </div>

    <div>
      <h3 class="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Bo góc</h3>
      <div class="grid grid-cols-4 gap-2">
        <button
          v-for="opt in borderRadiusOptions"
          :key="opt.value"
          class="rounded-lg py-2 text-xs font-medium transition-colors"
          :class="themeConfig.border_radius === opt.value
            ? 'bg-indigo-100 text-indigo-700'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'"
          @click="editorStore.updateTheme({ border_radius: opt.value })"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>
  </div>
</template>
