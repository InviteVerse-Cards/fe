# [SK-FE-01] Vue 3 Components & TypeScript

> Trigger: Tạo hoặc sửa bất kỳ Vue component nào.

---

## Component Template chuẩn

```vue
<!-- components/invitation/InvitationCard.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import type { Invitation } from '@/types/invitation.types'
import AppBadge from '@/components/common/AppBadge.vue'

const props = defineProps<{
  invitation: Invitation
  compact?: boolean
}>()

const emit = defineEmits<{
  (e: 'edit', uuid: string): void
  (e: 'delete', uuid: string): void
  (e: 'publish', uuid: string): void
}>()

const statusLabel = computed(() => ({
  draft: 'Bản nháp',
  published: 'Đã xuất bản',
  archived: 'Lưu trữ',
}[props.invitation.status] ?? 'Không xác định'))

function handleEdit() {
  emit('edit', props.invitation.uuid)
}
</script>

<template>
  <div class="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0 flex-1">
        <h3 class="truncate font-semibold text-gray-900">{{ invitation.title }}</h3>
        <p class="mt-1 text-sm text-gray-500">{{ invitation.view_count }} lượt xem</p>
      </div>
      <AppBadge :status="invitation.status">{{ statusLabel }}</AppBadge>
    </div>

    <div v-if="!compact" class="mt-4 flex gap-2">
      <button
        class="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700"
        @click="handleEdit"
      >
        Chỉnh sửa
      </button>
    </div>
  </div>
</template>
```

---

## Props & Emits

```typescript
// Props: LUÔN dùng TypeScript generic form
const props = defineProps<{
  modelValue: string          // v-model
  placeholder?: string        // optional có ?
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'  // union type cho variants
}>()

// Với defaults
const props = withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}>(), {
  size: 'md',
  loading: false,
})

// Emits
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void  // v-model
  (e: 'submit', data: FormData): void
  (e: 'cancel'): void
}>()
```

---

## v-model Pattern

```vue
<!-- AppInput.vue — reusable input với v-model -->
<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  label?: string
  error?: string
}>()
const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()
</script>

<template>
  <div class="space-y-1">
    <label v-if="label" class="block text-sm font-medium text-gray-700">{{ label }}</label>
    <input
      :value="modelValue"
      class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      :class="{ 'border-red-500': error }"
      v-bind="$attrs"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <p v-if="error" class="text-xs text-red-600">{{ error }}</p>
  </div>
</template>
```

---

## Async trong setup

```vue
<script setup lang="ts">
// Dùng Suspense hoặc loading state — không async setup trực tiếp (gây warning)
const { data, isPending, error } = useQuery({ ... })  // Vue Query handle async

// Hoặc dùng ref + onMounted
const data = ref<SomeType | null>(null)
const isLoading = ref(false)

onMounted(async () => {
  isLoading.value = true
  try {
    data.value = await fetchSomething()
  } finally {
    isLoading.value = false
  }
})
</script>
```

---

## Computed & Watch

```typescript
// Computed — cho derived state
const fullName = computed(() => `${props.firstName} ${props.lastName}`)
const isPublished = computed(() => props.invitation.status === 'published')
const sortedSections = computed(() =>
  [...editorStore.sections]
    .filter(s => s.is_enabled)
    .sort((a, b) => a.sort_order - b.sort_order)
)

// Watch — cho side effects
watch(
  () => props.modelValue,
  (newVal) => { localValue.value = newVal },
  { immediate: true }
)

// WatchEffect — run immediately + auto-track deps
watchEffect(() => {
  document.title = `${invitation.value?.title} - InviteVerse`
})
```

---

## Dynamic Component

```vue
<script setup lang="ts">
import type { SectionType } from '@/types/invitation.types'
import HeroSection from '@/components/editor/sections/HeroSection.vue'
import GallerySection from '@/components/editor/sections/GallerySection.vue'
// ...

const sectionMap: Record<SectionType, Component> = {
  hero: HeroSection,
  gallery: GallerySection,
  event_info: EventInfoSection,
  timeline: TimelineSection,
  countdown: CountdownSection,
  rsvp: RSVPSection,
  map: MapSection,
  music: MusicSection,
  wishes: WishesSection,
}
</script>

<template>
  <component
    :is="sectionMap[section.section_type]"
    :config="section.config"
    :theme="themeConfig"
  />
</template>
```

---

## Teleport & Modal Pattern

```vue
<!-- AppModal.vue -->
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-center justify-center">
        <div class="absolute inset-0 bg-black/50" @click="emit('update:modelValue', false)" />
        <div class="relative z-10 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
```

---

## Component Naming Conventions

| Loại | Convention | Ví dụ |
|---|---|---|
| Common/reusable | `App` prefix | `AppButton.vue`, `AppInput.vue` |
| Page component | `Page` suffix | `DashboardPage.vue` |
| Layout | `Layout` suffix | `AppLayout.vue` |
| Feature component | Descriptive | `InvitationCard.vue`, `TemplateGrid.vue` |
| Section (preview) | `Section` suffix | `HeroSection.vue` |
| Form (editor) | `Form` suffix | `HeroForm.vue` |

---

## Anti-patterns (không làm)

```typescript
// ❌ Options API
export default { data() {...}, methods: {...} }

// ❌ any type
const user = ref<any>(null)

// ❌ Mutate props trực tiếp
props.invitation.title = 'new'  // lỗi TypeScript + Vue warning

// ❌ v-html với user content chưa sanitize
<div v-html="userContent" />

// ❌ Quên .value khi dùng ref trong script
const count = ref(0)
count = 5  // sai, phải count.value = 5
```
