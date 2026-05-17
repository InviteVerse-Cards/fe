<script setup lang="ts">
import { ref } from 'vue'
import AppModal from '@/components/common/AppModal.vue'
import { buildShareLinks, copyToClipboard } from '@/utils/shareLinks'
import { useUIStore } from '@/stores/ui'

const props = defineProps<{
  show: boolean
  publicUrl: string
  qrCodeUrl: string
  title: string
}>()
const emit = defineEmits<{ (e: 'close'): void }>()

const ui = useUIStore()
const links = buildShareLinks(props.publicUrl, props.title)
const copied = ref(false)

async function handleCopy() {
  const ok = await copyToClipboard(props.publicUrl)
  if (ok) {
    copied.value = true
    ui.toast.success('Đã sao chép link!')
    setTimeout(() => { copied.value = false }, 2000)
  }
}

function openZalo() {
  window.open(links.zalo, '_blank', 'noopener,noreferrer')
}

function openFacebook() {
  window.open(links.facebook, '_blank', 'noopener,noreferrer')
}
</script>

<template>
  <AppModal :show="show" @close="emit('close')">
    <div class="space-y-5">
      <div class="text-center">
        <div class="mb-2 text-4xl">🎉</div>
        <h2 class="text-xl font-bold text-gray-900">Thiệp đã được xuất bản!</h2>
        <p class="mt-1 text-sm text-gray-500">Chia sẻ thiệp của bạn ngay bây giờ</p>
      </div>

      <!-- QR Code -->
      <div v-if="qrCodeUrl" class="flex justify-center">
        <img :src="qrCodeUrl" alt="QR Code" class="h-40 w-40 rounded-xl border border-gray-200 p-2" />
      </div>

      <!-- Public URL -->
      <div class="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5">
        <span class="flex-1 truncate text-sm text-gray-700">{{ publicUrl }}</span>
        <button
          class="rounded-md px-3 py-1.5 text-xs font-medium transition-colors"
          :class="copied ? 'bg-green-100 text-green-700' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'"
          @click="handleCopy"
        >
          {{ copied ? 'Đã chép ✓' : 'Sao chép' }}
        </button>
      </div>

      <!-- Share buttons -->
      <div class="grid grid-cols-2 gap-3">
        <button
          class="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-blue-500 py-3.5 text-sm font-semibold text-white hover:bg-blue-600 transition-colors"
          @click="openZalo"
        >
          💬 Chia sẻ qua Zalo
        </button>

        <button
          class="flex items-center justify-center gap-2 rounded-xl bg-blue-700 py-3 text-sm font-semibold text-white hover:bg-blue-800 transition-colors"
          @click="openFacebook"
        >
          Facebook
        </button>

        <a
          :href="publicUrl"
          target="_blank"
          class="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Xem thiệp →
        </a>
      </div>

      <button class="w-full text-sm text-gray-400 hover:text-gray-600" @click="emit('close')">
        Đóng
      </button>
    </div>
  </AppModal>
</template>
