<script setup lang="ts">
import { ref } from 'vue'
import { usePublishInvitation } from '@/composables/useInvitation'
import type { Invitation } from '@/types/invitation.types'
import AppModal from '@/components/common/AppModal.vue'
import AppInput from '@/components/common/AppInput.vue'
import ShareModal from './ShareModal.vue'

const props = defineProps<{
  show: boolean
  invitation: Invitation
}>()
const emit = defineEmits<{ (e: 'close'): void }>()

const customSlug = ref('')
const password = ref('')
const expiresAt = ref('')

const { mutate: publish, isPending } = usePublishInvitation()
const publishResult = ref<{ public_url: string; qr_code_url: string; slug: string } | null>(null)
const showShareModal = ref(false)

function handlePublish() {
  publish(
    {
      uuid: props.invitation.uuid,
      payload: {
        custom_slug: customSlug.value || undefined,
        password: password.value || undefined,
        expires_at: expiresAt.value || undefined,
      },
    },
    {
      onSuccess: (data) => {
        publishResult.value = data
        emit('close')
        showShareModal.value = true
      },
    }
  )
}

const baseUrl = import.meta.env.VITE_PUBLIC_BASE_URL || 'yourdomain.com'
</script>

<template>
  <AppModal :show="show" title="Xuất bản thiệp" @close="emit('close')">
    <div class="space-y-5">
      <div class="rounded-xl bg-indigo-50 p-4 text-sm text-indigo-700">
        <p class="font-medium">Sau khi xuất bản:</p>
        <ul class="mt-1 list-inside list-disc space-y-0.5 opacity-80">
          <li>Thiệp sẽ có link public để chia sẻ</li>
          <li>QR code được tạo tự động</li>
          <li>Khách có thể xem và RSVP</li>
        </ul>
      </div>

      <div>
        <AppInput
          label="Tùy chỉnh đường dẫn (tùy chọn)"
          v-model="customSlug"
          placeholder="dam-cuoi-nam-linh-2025"
        />
        <p class="mt-1 text-xs text-gray-400">
          {{ baseUrl }}/i/{{ customSlug || invitation.slug }}
        </p>
      </div>

      <AppInput
        label="Mật khẩu bảo vệ (tùy chọn)"
        v-model="password"
        type="password"
        placeholder="Để trống nếu không cần"
      />

      <AppInput
        label="Hết hạn vào (tùy chọn)"
        v-model="expiresAt"
        type="datetime-local"
      />

      <div class="flex gap-3 pt-2">
        <button
          class="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50"
          @click="emit('close')"
        >
          Hủy
        </button>
        <button
          class="flex-1 rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          :disabled="isPending"
          @click="handlePublish"
        >
          {{ isPending ? 'Đang xuất bản...' : '🚀 Xuất bản ngay' }}
        </button>
      </div>
    </div>
  </AppModal>

  <ShareModal
    v-if="showShareModal && publishResult"
    :show="showShareModal"
    :public-url="publishResult.public_url"
    :qr-code-url="publishResult.qr_code_url"
    :title="invitation.title"
    @close="showShareModal = false"
  />
</template>
