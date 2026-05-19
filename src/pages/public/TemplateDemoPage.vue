<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { getTemplateDemo } from '@/services/template.service'
import api from '@/services/api'
import { useCreateInvitation } from '@/composables/useInvitation'
import PublicInvitationRenderer from '@/components/invitation/PublicInvitationRenderer.vue'
import EnvelopeOpener from '@/components/invitation/EnvelopeOpener.vue'
import AppSpinner from '@/components/common/AppSpinner.vue'
import type { PublicInvitation } from '@/types/invitation.types'
import type { Section } from '@/types/section.types'
import type { TemplateDemo } from '@/services/template.service'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const isLoading = ref(true)
const error = ref(false)
const templateData = ref<TemplateDemo | null>(null)
const envelopeOpened = ref(false)
const defaultTrack = ref<{ id: number; name: string; url: string } | null>(null)

const { mutate: createInvitation, isPending: isCreating } = useCreateInvitation()

const sampleDate = (() => {
  const d = new Date()
  d.setMonth(d.getMonth() + 6)
  return d.toISOString().split('T')[0]
})()

const isBirthday = computed(() => templateData.value?.category === 'birthday')
const isBaby = computed(() => templateData.value?.category === 'baby_shower')
const isHouseWarming = computed(() => templateData.value?.category === 'house_warming')

const envelopeCoupleName = computed(() => {
  if (isBirthday.value) return 'Bảo Ngọc'
  if (isBaby.value) return 'Bé Minh Khang'
  if (isHouseWarming.value) return 'Gia Đình Anh Tú'
  return 'Kim Chi & Anh Tú'
})

// Build a fake PublicInvitation from the template's sections + theme_config + sample data
const demoInvitation = computed<PublicInvitation | null>(() => {
  if (!templateData.value) return null

  const sections: Section[] = (templateData.value.sections as Section[])
    .map(s => {
      // Patch date to sampleDate so the countdown works and ceremonies have a future date
      let config = { ...s.config as Record<string, unknown> }
      
      if (s.section_type === 'hero' && config.event_date !== undefined) {
        config.event_date = sampleDate
      }
      if (s.section_type === 'countdown' && config.event_date !== undefined) {
        config.event_date = sampleDate
      }
      if (s.section_type === 'event_info' && config.ceremonies && Array.isArray(config.ceremonies)) {
        config.ceremonies = config.ceremonies.map((c: any) => ({
          ...c,
          date: sampleDate
        }))
      }
      if (s.section_type === 'timeline' && config.events && Array.isArray(config.events)) {
        config.events = config.events.map((e: any) => ({
          ...e,
          date: sampleDate
        }))
      }
      if (s.section_type === 'music') {
        config.enabled = true
        config.autoplay = true
        const track = defaultTrack.value ?? templateData.value!.default_music_track
        if (track) {
          config.track_name = track.name
          config.track_url = track.url
        }
      }

      return {
        ...s,
        is_enabled: s.section_type === 'music' ? true : s.is_enabled,
        config
      }
    })

  return {
    id: 0,
    uuid: 'demo',
    slug: `demo-${templateData.value.slug}`,
    title: templateData.value.name,
    category: isBirthday.value ? 'birthday' : isBaby.value ? 'baby_shower' : isHouseWarming.value ? 'house_warming' : 'wedding',
    status: 'published',
    theme_config: templateData.value.theme_config,
    sections,
    watermark: false,
    view_count: 0,
    qr_code_url: null,
    published_at: new Date().toISOString(),
    meta: {
      title: `Demo: ${templateData.value.name}`,
      description: templateData.value.description,
      og_image: templateData.value.thumbnail_url,
    },
  }
})

onMounted(async () => {
  try {
    const slug = route.params.slug as string
    const [template, trackRes] = await Promise.all([
      getTemplateDemo(slug),
      api.get('/public/music/default').catch(() => null),
    ])
    templateData.value = template
    if (trackRes?.data?.data) defaultTrack.value = trackRes.data.data
  } catch {
    error.value = true
  } finally {
    isLoading.value = false
  }
})

function useThisTemplate() {
  if (!auth.isLoggedIn) {
    router.push(`/register?redirect=/templates/${route.params.slug}`)
    return
  }
  if (!templateData.value) return
  createInvitation(
    {
      template_id: templateData.value.id,
      title: `${isBirthday.value ? 'Thiệp sinh nhật' : isBaby.value ? 'Thiệp thôi nôi' : isHouseWarming.value ? 'Thiệp tân gia' : 'Thiệp cưới'} - ${new Date().toLocaleDateString('vi-VN')}`,
      category: isBirthday.value ? 'birthday' : isBaby.value ? 'baby_shower' : isHouseWarming.value ? 'house_warming' : 'wedding',
    },
    {
      onSuccess: (invitation) => {
        router.push({ name: 'Editor', params: { uuid: invitation.uuid } })
      },
    }
  )
}
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Sticky top bar -->
    <div class="sticky top-0 z-50 flex items-center gap-4 border-b border-gray-200 bg-white px-4 py-3 shadow-sm">
      <button
        class="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        @click="router.push({ name: 'Templates' })"
      >
        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Chọn mẫu khác
      </button>

      <div class="min-w-0 flex-1 text-center">
        <p v-if="templateData" class="truncate text-sm font-semibold text-gray-800">
          {{ templateData.name }}
        </p>
        <p v-else class="h-4 w-32 mx-auto animate-pulse rounded bg-gray-200" />
      </div>

      <button
        class="flex-shrink-0 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60 transition-colors"
        :disabled="isCreating || isLoading"
        @click="useThisTemplate"
      >
        {{ isCreating ? 'Đang tạo...' : 'Dùng mẫu này' }}
      </button>
    </div>

    <!-- Content -->
    <div v-if="isLoading" class="flex min-h-[60vh] items-center justify-center">
      <div class="text-center">
        <AppSpinner class="mx-auto h-10 w-10 text-indigo-600" />
        <p class="mt-3 text-sm text-gray-500">Đang tải mẫu thiệp...</p>
      </div>
    </div>

    <div v-else-if="error" class="flex min-h-[60vh] items-center justify-center px-4">
      <div class="text-center">
        <p class="text-5xl">😢</p>
        <h2 class="mt-4 text-xl font-semibold text-gray-900">Không tìm thấy mẫu thiệp</h2>
        <p class="mt-2 text-sm text-gray-500">Mẫu không tồn tại hoặc đã bị xóa</p>
        <button
          class="mt-6 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          @click="router.push({ name: 'Templates' })"
        >
          Xem mẫu thiệp khác
        </button>
      </div>
    </div>

    <!-- Invitation render -->
    <div v-if="demoInvitation" class="pb-24">
      <!-- Envelope opener -->
      <EnvelopeOpener
        v-if="!envelopeOpened"
        :primary-color="demoInvitation.theme_config.primary_color"
        :couple-name="envelopeCoupleName"
        @opened="envelopeOpened = true"
      />

      <!-- Demo badge -->
      <div v-if="envelopeOpened" class="flex justify-center pt-4 pb-2">
        <span class="rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
          Xem trước mẫu thiệp — Nội dung mẫu
        </span>
      </div>

      <!-- Invitation render -->
      <div v-if="envelopeOpened" class="mx-auto max-w-2xl overflow-hidden rounded-2xl shadow-2xl">
        <PublicInvitationRenderer :invitation="demoInvitation" />
      </div>
    </div>

    <!-- Bottom sticky CTA -->
    <div
      v-if="!isLoading && !error && demoInvitation"
      class="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 px-4 py-4 backdrop-blur-sm"
    >
      <div class="mx-auto flex max-w-lg items-center gap-3">
        <div class="min-w-0 flex-1">
          <p class="text-sm font-semibold text-gray-900">{{ templateData?.name }}</p>
          <p class="text-xs text-gray-500">
            {{ templateData?.plan_required === 'pro' ? '⭐ Gói Pro' : '✅ Miễn phí' }}
          </p>
        </div>
        <button
          class="flex-shrink-0 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-700 disabled:opacity-60 transition-colors"
          :disabled="isCreating"
          @click="useThisTemplate"
        >
          {{ isCreating ? 'Đang tạo...' : auth.isLoggedIn ? 'Dùng mẫu này →' : 'Đăng ký & dùng miễn phí →' }}
        </button>
      </div>
    </div>
  </div>
</template>
