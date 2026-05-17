# [SK-FE-05] Editor System (Form + Live Preview)

> Trigger: Tính năng editor: form, section, live preview, theme, autosave.

---

## Kiến trúc Editor

```
EditorPage
├── EditorSidebar (left, w-80, overflow-y-auto)
│   ├── TabBar: "Sections" | "Theme"
│   ├── [Sections Tab]
│   │   ├── SectionList (toggle + drag-reorder)
│   │   │   └── SectionItem (bật/tắt, click để mở form)
│   │   └── ActiveSectionForm (dynamic, dựa vào activeSection)
│   │       ├── HeroForm
│   │       ├── EventInfoForm
│   │       └── ... (các form khác)
│   └── [Theme Tab]
│       └── ThemePanel (màu, font, border radius)
└── PreviewPane (right, flex-1)
    ├── DeviceToggle (mobile 375px / desktop 1280px)
    └── PreviewContainer (scale/iframe sim)
        └── InvitationRenderer
            └── SectionRenderer (v-for enabled sections)
```

---

## EditorPage Setup

```vue
<!-- pages/app/EditorPage.vue -->
<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute, onBeforeRouteLeave } from 'vue-router'
import { useDebounceFn } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useEditorStore } from '@/stores/editor.store'

const route = useRoute()
const editorStore = useEditorStore()
const { invitation, isDirty, isSaving } = storeToRefs(editorStore)

// Load invitation khi mount
onMounted(async () => {
  const uuid = route.params.uuid as string
  if (uuid && uuid !== 'new') {
    await editorStore.loadInvitation(uuid)
  }
})

// Autosave sau 1.5s idle
const autoSave = useDebounceFn(async () => {
  if (isDirty.value && invitation.value) {
    await editorStore.save()
  }
}, 1500)

watch(isDirty, (dirty) => {
  if (dirty) autoSave()
})

// Cleanup khi rời trang
onBeforeRouteLeave(async (to, from, next) => {
  if (isDirty.value) await editorStore.save()
  editorStore.reset()
  next()
})

// Warn khi reload với unsaved changes
onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload)
})
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload)
})
function handleBeforeUnload(e: BeforeUnloadEvent) {
  if (isDirty.value) {
    e.preventDefault()
    e.returnValue = ''
  }
}
</script>
```

---

## Section Form Pattern

```vue
<!-- components/editor/forms/HeroForm.vue -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useEditorStore } from '@/stores/editor.store'
import type { HeroConfig } from '@/types/section.types'
import AppInput from '@/components/common/AppInput.vue'
import ImageUploader from '@/components/editor/ImageUploader.vue'

const props = defineProps<{
  sectionId?: number
  config: HeroConfig
}>()

const editorStore = useEditorStore()

// Local form state — sync từ store, update store khi thay đổi
const form = ref<HeroConfig>({ ...props.config })

// Sync từ props (khi store cập nhật từ bên ngoài)
watch(() => props.config, (newConfig) => {
  form.value = { ...newConfig }
}, { deep: true })

// Update store khi form thay đổi (debounce trong store hoặc ở đây)
function update(field: keyof HeroConfig, value: unknown) {
  form.value[field] = value as never
  editorStore.updateSectionConfig(props.sectionId, 'hero', { [field]: value })
}
</script>

<template>
  <div class="space-y-4 p-4">
    <h3 class="font-semibold text-gray-800">Hero Section</h3>

    <AppInput
      label="Tên cô dâu"
      :model-value="form.bride_name ?? ''"
      placeholder="Nguyễn Thị Linh"
      @update:model-value="update('bride_name', $event)"
    />

    <AppInput
      label="Tên chú rể"
      :model-value="form.groom_name ?? ''"
      placeholder="Trần Văn Nam"
      @update:model-value="update('groom_name', $event)"
    />

    <AppInput
      label="Tagline"
      :model-value="form.tagline ?? ''"
      placeholder="Trọn đời bên nhau"
      @update:model-value="update('tagline', $event)"
    />

    <ImageUploader
      label="Ảnh nền"
      :url="form.background_url"
      purpose="background"
      @uploaded="(url) => update('background_url', url)"
    />

    <div class="flex items-center justify-between">
      <label class="text-sm font-medium text-gray-700">Hiện đếm ngược</label>
      <input
        type="checkbox"
        :checked="form.show_countdown"
        class="h-4 w-4 rounded border-gray-300 text-indigo-600"
        @change="update('show_countdown', ($event.target as HTMLInputElement).checked)"
      />
    </div>
  </div>
</template>
```

---

## Section Preview Component

```vue
<!-- components/editor/sections/HeroSection.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import type { HeroConfig, ThemeConfig } from '@/types/section.types'
import CountdownTimer from '@/components/invitation/CountdownTimer.vue'

const props = defineProps<{
  config: HeroConfig
  theme: ThemeConfig
  isPreview?: boolean
}>()

const overlayStyle = computed(() => ({
  backgroundColor: `rgba(0,0,0,${(props.config.background_overlay ?? 30) / 100})`,
}))
</script>

<template>
  <section
    class="relative flex min-h-screen items-center justify-center overflow-hidden"
    :style="{ fontFamily: `'${theme.font_heading}', serif` }"
  >
    <!-- Background -->
    <div
      v-if="config.background_url"
      class="absolute inset-0 bg-cover bg-center"
      :style="{ backgroundImage: `url('${config.background_url}')` }"
    />
    <div class="absolute inset-0" :style="overlayStyle" />

    <!-- Content -->
    <div class="relative z-10 px-6 text-center text-white">
      <p class="mb-2 text-lg opacity-80">{{ config.tagline || 'Trọn đời bên nhau' }}</p>
      <h1 class="text-5xl font-bold leading-tight md:text-7xl">
        {{ config.bride_name || 'Cô Dâu' }}
        <span class="block text-3xl opacity-70">&</span>
        {{ config.groom_name || 'Chú Rể' }}
      </h1>

      <CountdownTimer
        v-if="config.show_countdown && config.event_date"
        :target-date="config.event_date"
        class="mt-8"
      />
    </div>
  </section>
</template>
```

---

## SectionList (Toggle + Reorder)

```vue
<!-- components/editor/SectionList.vue -->
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useEditorStore } from '@/stores/editor.store'
// Vue Draggable (vuedraggable) cho reorder
import draggable from 'vuedraggable'

const editorStore = useEditorStore()
const { sections, activeSection } = storeToRefs(editorStore)

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero / Màn hình chào',
  event_info: 'Thông tin sự kiện',
  gallery: 'Bộ ảnh',
  timeline: 'Hành trình tình yêu',
  countdown: 'Đếm ngược',
  rsvp: 'Xác nhận tham dự',
  map: 'Bản đồ',
  music: 'Nhạc nền',
  wishes: 'Lời chúc',
}

function onReorder(event: { oldIndex: number; newIndex: number }) {
  // Cập nhật sort_order sau khi drag
  sections.value.forEach((s, i) => { s.sort_order = i })
  editorStore.isDirty = true  // Trigger autosave
}
</script>

<template>
  <div class="p-4">
    <h3 class="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">Các section</h3>
    <draggable
      v-model="sections"
      item-key="section_type"
      handle=".drag-handle"
      @end="onReorder"
    >
      <template #item="{ element: section }">
        <div
          class="mb-1 flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 transition-colors hover:bg-gray-100"
          :class="{ 'bg-indigo-50 text-indigo-700': activeSection === section.section_type }"
          @click="editorStore.activeSection = section.section_type"
        >
          <span class="drag-handle cursor-grab text-gray-400">⠿</span>
          <span class="flex-1 text-sm">{{ SECTION_LABELS[section.section_type] }}</span>
          <input
            type="checkbox"
            :checked="section.is_enabled"
            class="h-4 w-4"
            @change.stop="editorStore.toggleSection(section.section_type)"
          />
        </div>
      </template>
    </draggable>
  </div>
</template>
```

---

## Theme CSS Variables Injection

```typescript
// composables/useThemeInjection.ts
import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useEditorStore } from '@/stores/editor.store'

export function useThemeInjection(targetEl: Ref<HTMLElement | null>) {
  const { themeConfig } = storeToRefs(useEditorStore())

  function applyTheme(theme: ThemeConfig) {
    const el = targetEl.value
    if (!el) return
    el.style.setProperty('--color-primary', theme.primary_color)
    el.style.setProperty('--color-secondary', theme.secondary_color)
    el.style.setProperty('--color-background', theme.background_color)
    el.style.setProperty('--color-text', theme.text_color)
    el.style.setProperty('--color-accent', theme.accent_color)
    el.style.setProperty('--font-heading', `'${theme.font_heading}', serif`)
    el.style.setProperty('--font-body', `'${theme.font_body}', sans-serif`)
  }

  watch(themeConfig, applyTheme, { deep: true, immediate: true })
}
```

---

## PreviewPane với Device Toggle

```vue
<!-- components/editor/PreviewPane.vue -->
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useEditorStore } from '@/stores/editor.store'

const editorStore = useEditorStore()
const { previewMode, enabledSections, themeConfig } = storeToRefs(editorStore)

const previewWidths = { mobile: '375px', desktop: '1280px' }
</script>

<template>
  <div class="flex h-full flex-col bg-gray-100">
    <!-- Device toggle -->
    <div class="flex items-center justify-center gap-2 border-b border-gray-200 bg-white px-4 py-2">
      <button
        v-for="mode in ['mobile', 'desktop'] as const"
        :key="mode"
        class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
        :class="previewMode === mode ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'"
        @click="previewMode = mode"
      >
        {{ mode === 'mobile' ? '📱 Mobile' : '🖥️ Desktop' }}
      </button>
    </div>

    <!-- Preview container -->
    <div class="flex flex-1 items-start justify-center overflow-y-auto p-6">
      <div
        class="overflow-hidden rounded-2xl shadow-2xl transition-all duration-300"
        :style="{ width: previewWidths[previewMode], maxWidth: '100%' }"
      >
        <InvitationRenderer
          :sections="enabledSections"
          :theme="themeConfig"
        />
      </div>
    </div>
  </div>
</template>
```

---

## Autosave Status Indicator

```vue
<!-- Hiển thị trong header editor -->
<template>
  <div class="flex items-center gap-1.5 text-xs text-gray-500">
    <template v-if="isSaving">
      <AppSpinner class="h-3 w-3" />
      <span>Đang lưu...</span>
    </template>
    <template v-else-if="isDirty">
      <span class="h-2 w-2 rounded-full bg-yellow-400" />
      <span>Chưa lưu</span>
    </template>
    <template v-else>
      <span class="h-2 w-2 rounded-full bg-green-400" />
      <span>Đã lưu tự động</span>
    </template>
  </div>
</template>
```
