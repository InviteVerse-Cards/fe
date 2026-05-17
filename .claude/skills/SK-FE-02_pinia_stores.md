# [SK-FE-02] Pinia State Management

> Trigger: Tạo store mới, dùng store trong component, quản lý global/shared state.

---

## Store Template chuẩn (Composition API)

```typescript
// stores/editor.store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Invitation, Section, ThemeConfig } from '@/types/invitation.types'
import * as invitationService from '@/services/invitationService'

export const useEditorStore = defineStore('editor', () => {
  // --- State ---
  const invitation = ref<Invitation | null>(null)
  const sections = ref<Section[]>([])
  const themeConfig = ref<ThemeConfig>(DEFAULT_THEME)
  const isDirty = ref(false)
  const isSaving = ref(false)
  const activeSection = ref<string | null>(null)
  const previewMode = ref<'mobile' | 'desktop'>('mobile')

  // --- Computed ---
  const enabledSections = computed(() =>
    [...sections.value]
      .filter(s => s.is_enabled)
      .sort((a, b) => a.sort_order - b.sort_order)
  )

  const hasUnsavedChanges = computed(() => isDirty.value)

  // --- Actions ---
  async function loadInvitation(uuid: string) {
    const data = await invitationService.getOne(uuid)
    invitation.value = data
    sections.value = data.sections
    themeConfig.value = data.theme_config
    isDirty.value = false
  }

  function updateSectionConfig(sectionId: number | undefined, sectionType: string, config: Record<string, unknown>) {
    const idx = sections.value.findIndex(s =>
      sectionId ? s.id === sectionId : s.section_type === sectionType
    )
    if (idx !== -1) {
      sections.value[idx] = { ...sections.value[idx], config: { ...sections.value[idx].config, ...config } }
      isDirty.value = true
    }
  }

  function toggleSection(sectionType: string) {
    const section = sections.value.find(s => s.section_type === sectionType)
    if (section) {
      section.is_enabled = !section.is_enabled
      isDirty.value = true
    }
  }

  function updateTheme(patch: Partial<ThemeConfig>) {
    themeConfig.value = { ...themeConfig.value, ...patch }
    isDirty.value = true
  }

  async function save() {
    if (!invitation.value || !isDirty.value) return
    isSaving.value = true
    try {
      await invitationService.update(invitation.value.uuid, {
        theme_config: themeConfig.value,
        sections: sections.value,
      })
      isDirty.value = false
    } finally {
      isSaving.value = false
    }
  }

  function reset() {
    invitation.value = null
    sections.value = []
    themeConfig.value = DEFAULT_THEME
    isDirty.value = false
    isSaving.value = false
    activeSection.value = null
  }

  return {
    // State
    invitation, sections, themeConfig, isDirty, isSaving, activeSection, previewMode,
    // Computed
    enabledSections, hasUnsavedChanges,
    // Actions
    loadInvitation, updateSectionConfig, toggleSection, updateTheme, save, reset,
  }
})
```

---

## Auth Store

```typescript
// stores/auth.store.ts
export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoading = ref(false)

  const isLoggedIn = computed(() => !!user.value)
  const isPro = computed(() => user.value?.plan === 'pro')
  const creditsBalance = computed(() => user.value?.credits_balance ?? 0)

  async function fetchMe() {
    isLoading.value = true
    try {
      const data = await authService.getMe()
      user.value = data
    } catch {
      user.value = null
    } finally {
      isLoading.value = false
    }
  }

  function setUser(u: User) { user.value = u }
  function clearUser() { user.value = null }

  function updateCredits(newBalance: number) {
    if (user.value) user.value.credits_balance = newBalance
  }

  return { user, isLoading, isLoggedIn, isPro, creditsBalance, fetchMe, setUser, clearUser, updateCredits }
})
```

---

## UI Store

```typescript
// stores/ui.store.ts
export const useUIStore = defineStore('ui', () => {
  const toasts = ref<Toast[]>([])
  const globalLoading = ref(false)
  const sidebarOpen = ref(true)

  function addToast(toast: Omit<Toast, 'id'>) {
    const id = Date.now().toString()
    toasts.value.push({ ...toast, id })
    setTimeout(() => removeToast(id), toast.duration ?? 4000)
  }

  function removeToast(id: string) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  function toast(message: string, type: 'success' | 'error' | 'info' = 'info') {
    addToast({ message, type })
  }

  return { toasts, globalLoading, sidebarOpen, toast, removeToast }
})
```

---

## Khi nào dùng Store vs Composable vs Local Ref

| Trường hợp | Dùng |
|---|---|
| State dùng ở nhiều component khác nhau | Store (Pinia) |
| Logic tái sử dụng + local state | Composable |
| State chỉ trong 1 component | Local `ref`/`reactive` |
| Server state (API data) | Vue Query (`useQuery`) |
| Auth user, editor state, UI state | Store |
| Form state trong 1 page | Local ref hoặc `reactive` |

---

## Dùng Store trong Component

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useEditorStore } from '@/stores/editor.store'

const editorStore = useEditorStore()

// Dùng storeToRefs để preserve reactivity khi destructure
const { invitation, sections, themeConfig, isDirty, isSaving } = storeToRefs(editorStore)

// Actions không cần storeToRefs
const { updateTheme, save, toggleSection } = editorStore
</script>
```

---

## Store Reset khi Route Change

```typescript
// EditorPage.vue
onBeforeRouteLeave(async (to, from, next) => {
  if (editorStore.isDirty) {
    await editorStore.save()
  }
  editorStore.reset()
  next()
})
```

---

## Default Theme Constant

```typescript
// constants/theme.ts
export const DEFAULT_THEME: ThemeConfig = {
  primary_color: '#6366F1',
  secondary_color: '#A5B4FC',
  background_color: '#FFFFFF',
  text_color: '#1F2937',
  accent_color: '#F59E0B',
  font_heading: 'Playfair Display',
  font_body: 'Inter',
  border_radius: 'md',
  animation: 'fade',
}

export const DEFAULT_SECTIONS: Section[] = [
  { section_type: 'hero', sort_order: 1, is_enabled: true, config: {} },
  { section_type: 'event_info', sort_order: 2, is_enabled: true, config: { ceremonies: [] } },
  { section_type: 'gallery', sort_order: 3, is_enabled: false, config: { images: [], layout: 'grid' } },
  { section_type: 'countdown', sort_order: 4, is_enabled: true, config: {} },
  { section_type: 'rsvp', sort_order: 5, is_enabled: true, config: {} },
  { section_type: 'map', sort_order: 6, is_enabled: false, config: {} },
  { section_type: 'music', sort_order: 7, is_enabled: false, config: { enabled: false, autoplay: false } },
]
```
