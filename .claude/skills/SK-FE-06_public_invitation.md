# [SK-FE-06] Public Invitation Page

> Trigger: Trang /i/:slug — public page, không cần auth, mobile-first, WOW effect.

---

## InvitationViewPage

```vue
<!-- pages/public/InvitationViewPage.vue -->
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import { usePublicInvitation } from '@/composables/useInvitation'

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const passwordInput = ref('')
const showPasswordForm = ref(false)

const { data: invitation, isPending, isError, error, refetch } = usePublicInvitation(slug)

// Set meta tags động
useHead(computed(() => ({
  title: invitation.value?.meta?.title || invitation.value?.title || 'InviteVerse',
  meta: [
    { name: 'description', content: invitation.value?.meta?.description || '' },
    { property: 'og:title', content: invitation.value?.meta?.title || '' },
    { property: 'og:description', content: invitation.value?.meta?.description || '' },
    { property: 'og:image', content: invitation.value?.meta?.og_image || '' },
    { property: 'og:type', content: 'website' },
    // Zalo meta
    { name: 'zalo-platform-site-verification', content: '' },
  ],
})))

// Password protection
const isPasswordProtected = computed(() =>
  isError.value && error.value?.response?.data?.error?.code === 'PASSWORD_REQUIRED'
)

async function submitPassword() {
  await refetch()  // refetch với password trong query string
}

// Track view từ source
onMounted(() => {
  const source = route.query.ref as string | undefined
  if (source && ['facebook', 'zalo', 'qr'].includes(source)) {
    fetch(`/api/v1/public/invitations/${slug.value}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source }),
    }).catch(() => {})  // Fire and forget
  }
})
</script>

<template>
  <div class="min-h-screen">
    <!-- Loading -->
    <div v-if="isPending" class="flex min-h-screen items-center justify-center">
      <div class="space-y-4 text-center">
        <div class="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600" />
        <p class="text-sm text-gray-500">Đang tải thiệp...</p>
      </div>
    </div>

    <!-- Password required -->
    <div v-else-if="isPasswordProtected" class="flex min-h-screen items-center justify-center px-4">
      <div class="w-full max-w-sm rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-lg">
        <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100 text-2xl">
          🔒
        </div>
        <h2 class="mb-2 text-lg font-semibold text-gray-900">Thiệp được bảo vệ</h2>
        <p class="mb-6 text-sm text-gray-500">Nhập mật khẩu để xem thiệp</p>
        <input
          v-model="passwordInput"
          type="password"
          class="mb-4 block w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-sm focus:border-indigo-500 focus:outline-none"
          placeholder="Nhập mật khẩu"
          @keyup.enter="submitPassword"
        />
        <button
          class="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
          @click="submitPassword"
        >
          Xem thiệp
        </button>
      </div>
    </div>

    <!-- Not found / error -->
    <div v-else-if="isError" class="flex min-h-screen items-center justify-center px-4">
      <div class="text-center">
        <p class="text-6xl">😢</p>
        <h2 class="mt-4 text-xl font-semibold text-gray-900">Không tìm thấy thiệp</h2>
        <p class="mt-2 text-sm text-gray-500">Thiệp không tồn tại hoặc đã bị xóa</p>
        <a href="/" class="mt-6 inline-block text-sm text-indigo-600 hover:underline">
          Tạo thiệp của bạn →
        </a>
      </div>
    </div>

    <!-- Invitation content -->
    <template v-else-if="invitation">
      <!-- Music player (nếu có) -->
      <MusicPlayer
        v-if="invitation.theme_config"
        :sections="invitation.sections"
      />

      <!-- Render sections -->
      <PublicInvitationRenderer
        :invitation="invitation"
      />

      <!-- Watermark (free plan) -->
      <div
        v-if="invitation.watermark"
        class="fixed bottom-4 right-4 z-50"
      >
        <a
          href="/"
          class="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-600 shadow-md backdrop-blur-sm hover:bg-white"
          target="_blank"
        >
          Tạo bởi <span class="font-bold text-indigo-600">InviteVerse</span>
        </a>
      </div>
    </template>
  </div>
</template>
```

---

## PublicInvitationRenderer

```vue
<!-- components/invitation/PublicInvitationRenderer.vue -->
<script setup lang="ts">
import type { PublicInvitation } from '@/types/invitation.types'
import { computed } from 'vue'

const props = defineProps<{ invitation: PublicInvitation }>()

// Chỉ render sections enabled, sort theo sort_order
const visibleSections = computed(() =>
  [...props.invitation.sections]
    .filter(s => s.is_enabled)
    .sort((a, b) => a.sort_order - b.sort_order)
)
</script>

<template>
  <div
    class="invitation-root"
    :style="{
      '--color-primary': invitation.theme_config.primary_color,
      '--color-secondary': invitation.theme_config.secondary_color,
      '--color-bg': invitation.theme_config.background_color,
      '--color-text': invitation.theme_config.text_color,
      '--color-accent': invitation.theme_config.accent_color,
      '--font-heading': `'${invitation.theme_config.font_heading}', serif`,
      '--font-body': `'${invitation.theme_config.font_body}', sans-serif`,
      backgroundColor: invitation.theme_config.background_color,
      color: invitation.theme_config.text_color,
    }"
  >
    <component
      :is="SECTION_MAP[section.section_type]"
      v-for="section in visibleSections"
      :key="section.section_type"
      :config="section.config"
      :theme="invitation.theme_config"
    />
  </div>
</template>
```

---

## RSVP Form Component

```vue
<!-- components/invitation/RSVPForm.vue -->
<script setup lang="ts">
import { ref } from 'vue'
import { useMutation } from '@tanstack/vue-query'
import * as publicService from '@/services/publicService'

const props = defineProps<{
  slug: string
  config: RSVPConfig
}>()

const form = ref({ name: '', phone: '', status: 'attending' as RSVPStatus, note: '' })
const submitted = ref(false)

const { mutate: submitRSVP, isPending } = useMutation({
  mutationFn: () => publicService.submitRSVP(props.slug, form.value),
  onSuccess: () => { submitted.value = true },
})
</script>

<template>
  <section class="px-4 py-16">
    <div class="mx-auto max-w-md">
      <h2 class="mb-2 text-center text-2xl font-bold" style="font-family: var(--font-heading)">
        {{ config.title || 'Xác nhận tham dự' }}
      </h2>
      <p class="mb-8 text-center text-sm opacity-70">{{ config.subtitle }}</p>

      <!-- Success state -->
      <div v-if="submitted" class="rounded-2xl bg-green-50 p-8 text-center">
        <p class="text-4xl">🎉</p>
        <p class="mt-3 font-semibold text-green-800">Đã xác nhận thành công!</p>
        <p class="mt-1 text-sm text-green-600">Cảm ơn bạn đã phản hồi</p>
      </div>

      <!-- Form -->
      <form v-else class="space-y-4" @submit.prevent="submitRSVP()">
        <div>
          <label class="mb-1 block text-sm font-medium">Tên của bạn *</label>
          <input
            v-model="form.name"
            required
            type="text"
            class="w-full rounded-lg border px-4 py-3 text-base focus:outline-none focus:ring-2"
            style="border-color: var(--color-primary); focus-ring-color: var(--color-primary)"
            placeholder="Nguyễn Văn A"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium">Bạn có đến không? *</label>
          <div class="flex gap-3">
            <label
              v-for="opt in [{ v: 'attending', l: '✅ Có, tôi sẽ đến' }, { v: 'not_attending', l: '❌ Không thể đến' }]"
              :key="opt.v"
              class="flex flex-1 cursor-pointer items-center justify-center rounded-lg border-2 p-3 text-sm font-medium transition-colors"
              :class="form.status === opt.v ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200'"
            >
              <input v-model="form.status" type="radio" :value="opt.v" class="sr-only" />
              {{ opt.l }}
            </label>
          </div>
        </div>

        <button
          type="submit"
          :disabled="isPending || !form.name"
          class="w-full rounded-lg py-3 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
          :style="{ backgroundColor: 'var(--color-primary)' }"
        >
          {{ isPending ? 'Đang gửi...' : 'Xác nhận' }}
        </button>
      </form>
    </div>
  </section>
</template>
```

---

## Scroll Animation (Intersection Observer)

```typescript
// composables/useScrollReveal.ts
export function useScrollReveal() {
  onMounted(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('[data-reveal]').forEach(el => observer.observe(el))

    onUnmounted(() => observer.disconnect())
  })
}

// Dùng trong sections:
// <div data-reveal class="opacity-0 translate-y-4 transition-all duration-700 [&.revealed]:opacity-100 [&.revealed]:translate-y-0">
```

---

## Share Links

```typescript
// utils/shareLinks.ts
export function buildShareLinks(publicUrl: string, title: string) {
  const encoded = encodeURIComponent(publicUrl)
  const text = encodeURIComponent(`${title} - Xem thiệp online: ${publicUrl}`)

  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
    zalo: `https://zalo.me/share?url=${encoded}&title=${encodeURIComponent(title)}`,
    copy: publicUrl,
  }
}
```
