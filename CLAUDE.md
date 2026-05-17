# InviteVerse — Frontend

Vue 3 + TypeScript + Vite + Pinia + TailwindCSS. Đọc file này trước khi viết bất kỳ code nào.

> **Skills đang active cho session này:** Xem root CLAUDE.md để biết cách nạp skill.

---

## Stack & Tools

- **Framework**: Vue 3 (Composition API, `<script setup lang="ts">`)
- **State**: Pinia (composition API style)
- **Server State**: Vue Query (`@tanstack/vue-query`)
- **Router**: Vue Router 4
- **HTTP**: Axios với `withCredentials: true`
- **Styling**: TailwindCSS — **LIGHT MODE, mobile-first**
- **Build**: Vite
- **Types**: TypeScript strict
- **Path alias**: `@/` → `src/`

---

## Cấu trúc thư mục

```
src/
  assets/             # fonts, images, global.css
  components/
    common/           # AppButton, AppInput, AppModal, AppToast, AppLoader, EmptyState
    editor/           # EditorLayout, SectionSidebar, ThemePanel, PreviewPane, DeviceToggle
    editor/sections/  # HeroSection, GallerySection, TimelineSection, ... (render components)
    editor/forms/     # HeroForm, GalleryForm, ... (input forms)
    invitation/       # InvitationCard, PublishModal, ShareModal, QRCodeDisplay
    template/         # TemplateGrid, TemplateCard, CategoryFilter
    payment/          # PackageCard, QRPaymentModal, CreditHistory
    ai/               # AIGenerateModal, AIResultPreview
  composables/        # useAuth.ts, useInvitation.ts, useEditor.ts, useUpload.ts, useCredits.ts, useAI.ts
  layouts/            # AppLayout.vue, AuthLayout.vue, PublicLayout.vue, LandingLayout.vue
  pages/
    landing/          # HomePage.vue, TemplatesPage.vue
    auth/             # LoginPage.vue, RegisterPage.vue, ForgotPasswordPage.vue
    app/              # DashboardPage.vue, MyInvitationsPage.vue, EditorPage.vue, AccountPage.vue, CreditsPage.vue
    public/           # InvitationViewPage.vue (/i/:slug)
  router/             # index.ts
  services/           # api.ts, authService.ts, invitationService.ts, templateService.ts, uploadService.ts, aiService.ts, paymentService.ts
  stores/             # auth.store.ts, editor.store.ts, ui.store.ts
  types/              # invitation.types.ts, template.types.ts, user.types.ts, section.types.ts, api.types.ts
  utils/              # dateFormat.ts, slugify.ts, shareLinks.ts, fontLoader.ts
```

---

## Quy tắc bắt buộc khi viết code

### 1. Component — `<script setup lang="ts">` only

```vue
<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import type { Invitation } from '@/types/invitation.types'

const props = defineProps<{
  invitation: Invitation
  size?: 'sm' | 'md' | 'lg'
}>()

const emit = defineEmits<{
  (e: 'published', slug: string): void
  (e: 'deleted'): void
}>()
</script>
```

### 2. Pinia Store — Composition API style

```typescript
// stores/editor.store.ts
export const useEditorStore = defineStore('editor', () => {
  const invitation = ref<Invitation | null>(null)
  const sections = ref<Section[]>([])
  const themeConfig = ref<ThemeConfig>(DEFAULT_THEME)
  const isDirty = ref(false)
  const isSaving = ref(false)

  const enabledSections = computed(() =>
    sections.value
      .filter(s => s.is_enabled)
      .sort((a, b) => a.sort_order - b.sort_order)
  )

  return { invitation, sections, themeConfig, isDirty, isSaving, enabledSections }
})
```

### 3. Services — Axios, không try/catch trong service

```typescript
// services/invitationService.ts
import api from './api'
import type { Invitation } from '@/types/invitation.types'

export async function getMyInvitations(): Promise<Invitation[]> {
  const { data } = await api.get('/invitations')
  return data.data.items
}

export async function publishInvitation(uuid: string): Promise<{ slug: string; qr_code_url: string }> {
  const { data } = await api.post(`/invitations/${uuid}/publish`)
  return data.data
}
// Error xử lý bởi Vue Query hoặc caller
```

### 4. Vue Query — useQuery / useMutation

```typescript
// composables/useInvitation.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import * as invitationService from '@/services/invitationService'

export function useMyInvitations() {
  return useQuery({
    queryKey: ['invitations', 'mine'],
    queryFn: invitationService.getMyInvitations,
    staleTime: 30_000,
  })
}

export function usePublishInvitation() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (uuid: string) => invitationService.publishInvitation(uuid),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['invitations'] }),
  })
}
```

### 5. Auth — cookie-based, không localStorage

```typescript
// Axios instance tự gửi cookie httpOnly
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
})
// KHÔNG: localStorage.setItem('token', ...)
// KHÔNG: headers: { Authorization: `Bearer ...` }
```

### 6. Composable — cleanup timer/interval

```typescript
export function useCountdown(targetDate: Ref<string>) {
  let timer: ReturnType<typeof setInterval> | null = null

  onMounted(() => { timer = setInterval(tick, 1000) })
  onUnmounted(() => { if (timer) clearInterval(timer) })  // LUÔN cleanup
}
```

### 7. Router guards

```typescript
// Trong route definition
{ path: '/app/dashboard', meta: { requiresAuth: true } }
{ path: '/login', meta: { guest: true } }

// Guard tự động xử lý trong router/index.ts
```

---

## TypeScript Types chính

```typescript
// Invitation
interface Invitation {
  id: number; uuid: string; slug: string
  title: string; category: 'wedding' | 'birthday' | string
  status: 'draft' | 'published' | 'archived'
  theme_config: ThemeConfig
  sections: Section[]
  view_count: number
  qr_code_url: string | null
  published_at: string | null
  watermark: boolean
}

// Section
interface Section {
  id?: number
  section_type: SectionType
  sort_order: number
  is_enabled: boolean
  config: Record<string, unknown>
}

type SectionType = 'hero' | 'gallery' | 'timeline' | 'event_info' | 'rsvp' | 'map' | 'countdown' | 'music' | 'wishes'

// Theme
interface ThemeConfig {
  primary_color: string; secondary_color: string
  background_color: string; text_color: string; accent_color: string
  font_heading: string; font_body: string
  border_radius: 'none' | 'sm' | 'md' | 'lg'
  animation: 'none' | 'fade' | 'slide'
}

// User
interface User {
  id: number; uuid: string; email: string
  display_name: string | null; plan: 'free' | 'pro'
  credits_balance: number
}
```

---

## Khi viết tính năng mới

Chỉ cần mô tả bằng ngôn ngữ tự nhiên:

- "Tạo component InvitationCard" → SK-FE-01 + SK-FE-04 (light design system)
- "Thêm section HeroForm vào editor" → SK-FE-05 (editor system)
- "Viết trang public invitation /i/:slug" → SK-FE-06 + SK-FE-07
- "Fix hiển thị countdown timer" → SK-FE-06 (cleanup interval)

---

## Slash Commands

- `/scaffold-page <PageName>` — page mới với route + store + service
- `/scaffold-component <Name>` — component có props + emits + slots
- `/scaffold-section <type>` — Section component + Form component cho editor
- `/add-store <storeName>` — Pinia store mới
- `/add-composable <useXxx>` — composable mới
- `/add-service <name>` — API service file
- `/review-component <Name>` — review component hiện tại

---

## @imports Skill Files

@.claude/skills/SK-FE-01_vue3_components.md
@.claude/skills/SK-FE-02_pinia_stores.md
@.claude/skills/SK-FE-03_vue_query.md
@.claude/skills/SK-FE-04_design_system.md
@.claude/skills/SK-FE-05_editor_system.md
@.claude/skills/SK-FE-06_public_invitation.md
@.claude/skills/SK-FE-07_performance.md

---

## Biến môi trường

```env
VITE_API_BASE_URL=https://yourdomain.com/api/v1
VITE_APP_NAME=InviteVerse
VITE_PUBLIC_BASE_URL=https://yourdomain.com
```

## Scripts

```bash
npm run dev        # Vite dev server
npm run build      # vue-tsc --noEmit && vite build
npm run typecheck  # vue-tsc --noEmit
npm run lint       # eslint src
```
