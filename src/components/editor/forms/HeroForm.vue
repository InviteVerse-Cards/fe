<script setup lang="ts">
import { ref, watch } from 'vue'
import { useEditorStore } from '@/stores/editor.store'
import type { HeroConfig } from '@/types/section.types'
import AppInput from '@/components/common/AppInput.vue'
import ImageUploader from '@/components/editor/ImageUploader.vue'

const props = defineProps<{ config: Record<string, unknown>; sectionType: string }>()
const editorStore = useEditorStore()
const form = ref<HeroConfig>({
  display_order: 'groom_first',
  ...(props.config as HeroConfig),
})

watch(() => props.config, (v) => {
  form.value = { display_order: 'groom_first', ...(v as HeroConfig) }
}, { deep: true })

function update(field: keyof HeroConfig, value: unknown) {
  form.value[field] = value as never
  editorStore.updateSectionConfig('hero', { [field]: value })
}
</script>

<template>
  <div class="space-y-6">
    <!-- Họ tên đầy đủ -->
    <div class="grid grid-cols-2 gap-4">
      <AppInput
        label="Họ tên chú rể"
        :model-value="form.groom_name ?? ''"
        placeholder="Đoàn Thanh Tuấn"
        @update:model-value="update('groom_name', $event)"
      />
      <AppInput
        label="Họ tên cô dâu"
        :model-value="form.bride_name ?? ''"
        placeholder="Ngô Thị Hằng Nga"
        @update:model-value="update('bride_name', $event)"
      />
    </div>

    <!-- Tên ngắn (auto-generated hint) -->
    <div class="grid grid-cols-2 gap-4">
      <AppInput
        label="Tên ngắn chú rể"
        :model-value="form.groom_short_name ?? ''"
        placeholder="Thanh Tuấn"
        @update:model-value="update('groom_short_name', $event)"
      />
      <AppInput
        label="Tên ngắn cô dâu"
        :model-value="form.bride_short_name ?? ''"
        placeholder="Hằng Nga"
        @update:model-value="update('bride_short_name', $event)"
      />
    </div>

    <!-- Danh xưng -->
    <div class="grid grid-cols-2 gap-4">
      <AppInput
        label="Danh xưng chú rể"
        :model-value="form.groom_title ?? ''"
        placeholder="Trưởng Nam"
        @update:model-value="update('groom_title', $event)"
      />
      <AppInput
        label="Danh xưng cô dâu"
        :model-value="form.bride_title ?? ''"
        placeholder="Út Nữ"
        @update:model-value="update('bride_title', $event)"
      />
    </div>

    <!-- Thứ tự hiển thị -->
    <div class="space-y-2">
      <p class="text-xs font-medium uppercase tracking-wide text-gray-400">Thứ tự hiển thị</p>
      <div class="grid grid-cols-2 gap-3">
        <button
          class="rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all"
          :class="form.display_order === 'groom_first'
            ? 'border-rose-400 bg-rose-50 text-rose-700'
            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'"
          @click="update('display_order', 'groom_first')"
        >
          Nhà trai trước
        </button>
        <button
          class="rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all"
          :class="form.display_order === 'bride_first'
            ? 'border-rose-400 bg-rose-50 text-rose-700'
            : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'"
          @click="update('display_order', 'bride_first')"
        >
          Nhà gái trước
        </button>
      </div>
      <p class="text-xs text-gray-400">
        Hiển thị tên {{ form.display_order === 'groom_first' ? 'chú rể và nhà trai' : 'cô dâu và nhà gái' }} trước trên thiệp
      </p>
    </div>

    <!-- Tagline -->
    <AppInput
      label="Lời chào / Tagline"
      :model-value="form.tagline ?? ''"
      placeholder="Trọn đời bên nhau"
      @update:model-value="update('tagline', $event)"
    />

    <!-- Ngày sự kiện -->
    <AppInput
      label="Ngày sự kiện (cho đếm ngược)"
      type="datetime-local"
      :model-value="form.event_date ?? ''"
      @update:model-value="update('event_date', $event)"
    />

    <!-- Countdown toggle -->
    <div class="flex items-center justify-between">
      <label class="text-sm font-medium text-gray-700">Hiện đếm ngược</label>
      <button
        class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none"
        :class="form.show_countdown ? 'bg-rose-500' : 'bg-gray-200'"
        @click="update('show_countdown', !form.show_countdown)"
      >
        <span
          class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition"
          :class="form.show_countdown ? 'translate-x-5' : 'translate-x-0'"
        />
      </button>
    </div>

    <!-- Ảnh đại diện/ảnh đôi -->
    <div class="space-y-3 border-t border-gray-100 pt-6">
      <p class="text-xs font-semibold uppercase tracking-wider text-gray-400">Ảnh đại diện thiệp (Nếu mẫu có hỗ trợ)</p>
      <div class="flex flex-col items-center gap-4 rounded-xl border border-dashed border-gray-200 bg-gray-50/50 p-6">
        <div class="relative group">
          <div 
            class="h-44 w-32 overflow-hidden rounded-[2rem] border-4 border-white shadow-lg transition-transform group-hover:scale-105"
            :class="!form.couple_photo_url ? 'bg-gray-100 flex items-center justify-center' : ''"
          >
            <img 
              v-if="form.couple_photo_url" 
              :src="form.couple_photo_url" 
              class="h-full w-full object-cover" 
            />
            <svg v-else class="h-16 w-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>
        </div>
        <ImageUploader 
          purpose="avatar" 
          @uploaded="update('couple_photo_url', $event)" 
        />
        <p class="text-[10px] text-gray-400">JPG, PNG, GIF, WebP, HEIC. Hiển thị dưới dạng khung dọc/oval ở đầu thiệp.</p>
      </div>
    </div>

  </div>
</template>
