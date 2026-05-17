<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useHead } from '@vueuse/head'
import { usePublicInvitation } from '@/composables/usePublicInvitation'
import PublicInvitationRenderer from '@/components/invitation/PublicInvitationRenderer.vue'
import EnvelopeOpener from '@/components/invitation/EnvelopeOpener.vue'
import AppSpinner from '@/components/common/AppSpinner.vue'

const route = useRoute()
const slug = computed(() => route.params.slug as string)
const guestName = computed(() => route.query.guest as string | undefined)
const passwordInput = ref('')
const submittedPassword = ref<string | undefined>(undefined)
const envelopeOpened = ref(false)

const { data: invitation, isPending, isError, error } = usePublicInvitation(slug, submittedPassword)

const isPasswordProtected = computed(() => {
  const code = (error.value as { response?: { data?: { error?: { code?: string } } } })?.response?.data?.error?.code
  return isError.value && code === 'PASSWORD_REQUIRED'
})

const isNotFound = computed(() => {
  const code = (error.value as { response?: { data?: { error?: { code?: string } } } })?.response?.data?.error?.code
  return isError.value && (code === 'NOT_FOUND' || code === 'EXPIRED')
})

const coupleName = computed(() => {
  if (!invitation.value) return undefined
  const hero = invitation.value.sections.find(s => s.section_type === 'hero')
  if (!hero) return undefined
  const cfg = hero.config as Record<string, unknown>
  const bride = cfg.bride_name as string | undefined
  const groom = cfg.groom_name as string | undefined
  if (bride && groom) return `${bride} & ${groom}`
  return undefined
})

const storageKey = computed(() => `iv-opened-${slug.value}`)

function submitPassword() {
  submittedPassword.value = passwordInput.value
}

function onEnvelopeOpened() {
  envelopeOpened.value = true
  try { localStorage.setItem(storageKey.value, '1') } catch { /* ignore */ }
}

onMounted(() => {
  // Skip envelope if already opened in this browser
  try {
    if (localStorage.getItem(storageKey.value)) {
      envelopeOpened.value = true
    }
  } catch { /* ignore */ }

  // Track referral source
  const source = route.query.ref as string | undefined
  if (source && ['facebook', 'zalo', 'qr'].includes(source)) {
    fetch(`/api/v1/public/invitations/${slug.value}/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ source }),
    }).catch(() => {})
  }
})

useHead(computed(() => ({
  title: `${invitation.value?.meta?.title || invitation.value?.title || 'Thiệp mời'} - InviteVerse`,
  meta: [
    { name: 'description', content: invitation.value?.meta?.description || '' },
    { property: 'og:title', content: invitation.value?.meta?.title || invitation.value?.title || 'Thiệp mời' },
    { property: 'og:description', content: invitation.value?.meta?.description || '' },
    { property: 'og:image', content: invitation.value?.meta?.og_image || '' },
    { property: 'og:type', content: 'website' },
  ],
})))
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Loading -->
    <div v-if="isPending" class="flex min-h-screen items-center justify-center">
      <div class="space-y-4 text-center">
        <AppSpinner class="mx-auto h-12 w-12 text-indigo-600" />
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
          class="mb-4 block w-full rounded-lg border border-gray-300 px-4 py-3 text-center text-base focus:border-indigo-500 focus:outline-none"
          placeholder="Nhập mật khẩu"
          @keyup.enter="submitPassword"
        />
        <button
          class="w-full rounded-lg bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          @click="submitPassword"
        >
          Xem thiệp
        </button>
      </div>
    </div>

    <!-- Not found / expired -->
    <div v-else-if="isNotFound" class="flex min-h-screen items-center justify-center px-4">
      <div class="text-center">
        <p class="text-6xl">😢</p>
        <h2 class="mt-4 text-xl font-semibold text-gray-900">Không tìm thấy thiệp</h2>
        <p class="mt-2 text-sm text-gray-500">Thiệp không tồn tại, đã bị xóa hoặc đã hết hạn</p>
        <a href="/" class="mt-6 inline-block text-sm text-indigo-600 hover:underline">
          Tạo thiệp của bạn →
        </a>
      </div>
    </div>

    <!-- Invitation -->
    <template v-else-if="invitation">
      <!-- Envelope opener (shown on first visit, hidden if already opened) -->
      <EnvelopeOpener
        v-if="!envelopeOpened"
        :primary-color="invitation.theme_config.primary_color"
        :couple-name="coupleName"
        @opened="onEnvelopeOpened"
      />

      <!-- Actual invitation content -->
      <PublicInvitationRenderer :invitation="invitation" :guest-name="guestName" />

      <!-- Watermark -->
      <div v-if="invitation.watermark" class="fixed bottom-4 right-4 z-40">
        <a
          href="/"
          class="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-600 shadow-md backdrop-blur-sm hover:bg-white"
        >
          Tạo bởi <span class="font-bold text-indigo-600">InviteVerse</span>
        </a>
      </div>
    </template>
  </div>
</template>
