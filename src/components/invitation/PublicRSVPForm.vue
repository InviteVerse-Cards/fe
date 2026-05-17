<script setup lang="ts">
import { ref } from 'vue'
import { useSubmitRSVP } from '@/composables/usePublicInvitation'
import type { RSVPConfig, ThemeConfig } from '@/types/section.types'
import { computed } from 'vue'

const props = defineProps<{
  config: Record<string, unknown>
  theme: ThemeConfig
  slug: string
}>()

const cfg = computed(() => props.config as RSVPConfig)
const slugRef = computed(() => props.slug)
const form = ref({ name: '', phone: '', status: 'attending' as 'attending' | 'not_attending', note: '' })
const submitted = ref(false)

const { mutate: submitRSVP, isPending } = useSubmitRSVP(slugRef)

function handleSubmit() {
  if (!form.value.name) return
  submitRSVP(
    { name: form.value.name, phone: form.value.phone || undefined, status: form.value.status, note: form.value.note || undefined },
    { onSuccess: () => { submitted.value = true } }
  )
}
</script>

<template>
  <section class="px-6 py-16" data-reveal :style="{ backgroundColor: theme.background_color, color: theme.text_color }">
    <div class="mx-auto max-w-md">
      <h2
        class="mb-2 text-center text-2xl font-bold"
        :style="{ fontFamily: `'${theme.font_heading}', serif`, color: theme.primary_color }"
      >
        {{ cfg.title || 'Xác nhận tham dự' }}
      </h2>
      <p
        v-if="cfg.subtitle"
        class="mb-8 text-center text-sm opacity-70"
        :style="{ fontFamily: `'${theme.font_body}', sans-serif` }"
      >
        {{ cfg.subtitle }}
      </p>

      <!-- Success -->
      <div v-if="submitted" class="rounded-2xl bg-green-50 p-8 text-center">
        <p class="text-4xl">🎉</p>
        <p class="mt-3 font-semibold text-green-800">Đã xác nhận thành công!</p>
        <p class="mt-1 text-sm text-green-600">Cảm ơn bạn đã phản hồi</p>
      </div>

      <!-- Form -->
      <form v-else class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="mb-1 block text-sm font-medium">Tên của bạn *</label>
          <input
            v-model="form.name"
            required
            type="text"
            class="w-full rounded-lg border px-4 py-3 text-base focus:outline-none focus:ring-2"
            :style="{ borderColor: theme.primary_color + '66', '--tw-ring-color': theme.primary_color }"
            placeholder="Nguyễn Văn A"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium">Số điện thoại</label>
          <input
            v-model="form.phone"
            type="tel"
            class="w-full rounded-lg border border-gray-200 px-4 py-3 text-base focus:outline-none"
            placeholder="0901234567"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium">Bạn có đến không? *</label>
          <div class="flex gap-3">
            <label
              v-for="opt in [{ v: 'attending', l: '✅ Có, tôi sẽ đến' }, { v: 'not_attending', l: '❌ Không thể đến' }]"
              :key="opt.v"
              class="flex flex-1 cursor-pointer items-center justify-center rounded-lg border-2 p-3 text-sm font-medium transition-colors"
              :class="form.status === opt.v ? 'border-current' : 'border-gray-200'"
              :style="form.status === opt.v ? { borderColor: theme.primary_color, color: theme.primary_color, backgroundColor: theme.primary_color + '11' } : {}"
            >
              <input v-model="form.status" type="radio" :value="opt.v" class="sr-only" />
              {{ opt.l }}
            </label>
          </div>
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium">Lời nhắn (tùy chọn)</label>
          <textarea
            v-model="form.note"
            rows="2"
            class="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm focus:outline-none"
            placeholder="Lời chúc đến cô dâu chú rể..."
          />
        </div>

        <button
          type="submit"
          :disabled="isPending || !form.name"
          class="w-full rounded-lg py-3.5 text-sm font-semibold text-white transition-opacity disabled:opacity-50"
          :style="{ backgroundColor: theme.primary_color }"
        >
          {{ isPending ? 'Đang gửi...' : 'Xác nhận' }}
        </button>
      </form>
    </div>
  </section>
</template>
