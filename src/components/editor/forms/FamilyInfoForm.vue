<script setup lang="ts">
import { ref, watch } from 'vue'
import { useEditorStore } from '@/stores/editor.store'
import type { FamilyInfoConfig } from '@/types/section.types'
import AppInput from '@/components/common/AppInput.vue'

const props = defineProps<{ config: Record<string, unknown>; sectionType: string }>()
const editorStore = useEditorStore()

const form = ref<FamilyInfoConfig>(JSON.parse(JSON.stringify(props.config as unknown as FamilyInfoConfig)) || {
  title: '',
  groom_family: { family_name: 'Nhà Trai', father: { title: 'Ông', name: '' }, mother: { title: 'Bà', name: '' } },
  bride_family: { family_name: 'Nhà Gái', father: { title: 'Ông', name: '' }, mother: { title: 'Bà', name: '' } },
})

watch(() => props.config, (newCfg) => {
  form.value = JSON.parse(JSON.stringify(newCfg as unknown as FamilyInfoConfig))
}, { deep: true })

function update() {
  editorStore.updateSectionConfig(props.sectionType, form.value as unknown as Record<string, unknown>)
}
</script>

<template>
  <div class="space-y-6">

    <AppInput
      label="Tiêu đề"
      :model-value="form.title ?? ''"
      placeholder="Thông báo hôn lễ"
      @update:model-value="form.title = $event; update()"
    />

    <!-- Nhà Trai -->
    <div class="space-y-3 rounded-xl border border-gray-200 p-4">
      <p class="text-sm font-semibold text-gray-700">Nhà Trai</p>
      <AppInput
        label="Tên nhà trai"
        :model-value="form.groom_family.family_name"
        placeholder="Nhà Trai"
        @update:model-value="form.groom_family.family_name = $event; update()"
      />
      <div class="grid grid-cols-[80px_1fr] gap-2">
        <AppInput
          label="Danh xưng"
          :model-value="form.groom_family.father.title"
          placeholder="Ông"
          @update:model-value="form.groom_family.father.title = $event; update()"
        />
        <AppInput
          label="Tên bố chú rể"
          :model-value="form.groom_family.father.name"
          placeholder="Nguyễn Văn A"
          @update:model-value="form.groom_family.father.name = $event; update()"
        />
      </div>
      <div class="grid grid-cols-[80px_1fr] gap-2">
        <AppInput
          label="Danh xưng"
          :model-value="form.groom_family.mother.title"
          placeholder="Bà"
          @update:model-value="form.groom_family.mother.title = $event; update()"
        />
        <AppInput
          label="Tên mẹ chú rể"
          :model-value="form.groom_family.mother.name"
          placeholder="Trần Thị B"
          @update:model-value="form.groom_family.mother.name = $event; update()"
        />
      </div>
      <AppInput
        label="Lời ghi chú (tùy chọn)"
        :model-value="form.groom_family.note ?? ''"
        placeholder="Trân trọng thông báo"
        @update:model-value="form.groom_family.note = $event; update()"
      />
    </div>

    <!-- Nhà Gái -->
    <div class="space-y-3 rounded-xl border border-gray-200 p-4">
      <p class="text-sm font-semibold text-gray-700">Nhà Gái</p>
      <AppInput
        label="Tên nhà gái"
        :model-value="form.bride_family.family_name"
        placeholder="Nhà Gái"
        @update:model-value="form.bride_family.family_name = $event; update()"
      />
      <div class="grid grid-cols-[80px_1fr] gap-2">
        <AppInput
          label="Danh xưng"
          :model-value="form.bride_family.father.title"
          placeholder="Ông"
          @update:model-value="form.bride_family.father.title = $event; update()"
        />
        <AppInput
          label="Tên bố cô dâu"
          :model-value="form.bride_family.father.name"
          placeholder="Lê Văn C"
          @update:model-value="form.bride_family.father.name = $event; update()"
        />
      </div>
      <div class="grid grid-cols-[80px_1fr] gap-2">
        <AppInput
          label="Danh xưng"
          :model-value="form.bride_family.mother.title"
          placeholder="Bà"
          @update:model-value="form.bride_family.mother.title = $event; update()"
        />
        <AppInput
          label="Tên mẹ cô dâu"
          :model-value="form.bride_family.mother.name"
          placeholder="Phạm Thị D"
          @update:model-value="form.bride_family.mother.name = $event; update()"
        />
      </div>
      <AppInput
        label="Lời ghi chú (tùy chọn)"
        :model-value="form.bride_family.note ?? ''"
        placeholder="Trân trọng thông báo"
        @update:model-value="form.bride_family.note = $event; update()"
      />
    </div>
  </div>
</template>
