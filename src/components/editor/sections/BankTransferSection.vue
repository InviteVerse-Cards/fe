<script setup lang="ts">
import { computed } from 'vue'
import type { BankTransferConfig, ThemeConfig } from '@/types/section.types'
import FloralDecoration from '@/components/invitation/FloralDecoration.vue'

const props = defineProps<{ config: Record<string, unknown>; theme: ThemeConfig; isPreview?: boolean }>()
const cfg = computed(() => props.config as unknown as BankTransferConfig)

const vietQRUrl = computed(() => {
  if (!cfg.value.bank_id || !cfg.value.account_number) return null
  const base = `https://img.vietqr.io/image/${cfg.value.bank_id}-${cfg.value.account_number}-compact2.png`
  const params = new URLSearchParams()
  if (cfg.value.amount) params.set('amount', String(cfg.value.amount))
  if (cfg.value.transfer_message) params.set('addInfo', cfg.value.transfer_message)
  if (cfg.value.account_name) params.set('accountName', cfg.value.account_name)
  const query = params.toString()
  return query ? `${base}?${query}` : base
})

function copyAccount() {
  if (cfg.value.account_number) {
    navigator.clipboard.writeText(cfg.value.account_number).catch(() => {})
  }
}
</script>

<template>
  <section
    class="px-4 py-16 text-center"
    data-reveal
    :style="{ backgroundColor: theme.background_color, color: theme.text_color }"
  >
    <div class="mx-auto max-w-md">
      <!-- Heading -->
      <div class="mb-10 flex flex-col items-center gap-3">
        <FloralDecoration variant="divider" :color="theme.primary_color" :opacity="0.45" :size="220" />
        <h2
          class="text-3xl font-semibold"
          :style="{ fontFamily: `'${theme.font_heading}', serif`, color: theme.primary_color }"
        >
          {{ cfg.title || 'Mừng cưới' }}
        </h2>
        <FloralDecoration variant="divider" :color="theme.primary_color" :opacity="0.45" :size="220" />
      </div>

      <!-- Note text -->
      <p
        v-if="cfg.note"
        class="mb-8 text-sm italic opacity-70"
        :style="{ fontFamily: `'${theme.font_body}', sans-serif` }"
      >
        "{{ cfg.note }}"
      </p>

      <!-- QR + info card -->
      <div
        v-if="cfg.account_number"
        class="mx-auto overflow-hidden rounded-2xl border bg-white shadow-sm"
        :style="{ borderColor: theme.primary_color + '30', maxWidth: '300px' }"
      >
        <!-- VietQR image -->
        <div v-if="vietQRUrl" class="p-4 pb-0">
          <img
            :src="vietQRUrl"
            alt="QR chuyển khoản"
            class="mx-auto w-full max-w-[220px] rounded-xl"
            loading="lazy"
          />
        </div>

        <!-- Bank info -->
        <div
          class="space-y-1.5 p-4 text-sm"
          :style="{ fontFamily: `'${theme.font_body}', sans-serif`, color: theme.text_color }"
        >
          <div class="flex justify-between">
            <span class="opacity-60">Ngân hàng</span>
            <span class="font-semibold">{{ cfg.bank_id }}</span>
          </div>
          <div class="flex justify-between">
            <span class="opacity-60">Số tài khoản</span>
            <span class="font-semibold font-mono tracking-wider">{{ cfg.account_number }}</span>
          </div>
          <div v-if="cfg.account_name" class="flex justify-between">
            <span class="opacity-60">Chủ tài khoản</span>
            <span class="font-semibold uppercase">{{ cfg.account_name }}</span>
          </div>
          <div v-if="cfg.amount" class="flex justify-between">
            <span class="opacity-60">Số tiền gợi ý</span>
            <span class="font-semibold" :style="{ color: theme.primary_color }">
              {{ cfg.amount.toLocaleString('vi-VN') }}đ
            </span>
          </div>
          <div v-if="cfg.transfer_message" class="flex justify-between gap-3">
            <span class="opacity-60 flex-shrink-0">Nội dung CK</span>
            <span class="text-right font-medium">{{ cfg.transfer_message }}</span>
          </div>
        </div>

        <!-- Copy button -->
        <button
          v-if="!isPreview"
          class="w-full border-t py-3 text-sm font-semibold transition-colors hover:opacity-80"
          :style="{ borderColor: theme.primary_color + '30', color: theme.primary_color }"
          @click="copyAccount"
        >
          Sao chép số tài khoản
        </button>
      </div>

      <!-- Empty state -->
      <div v-else class="py-10 text-sm opacity-40" :style="{ color: theme.text_color }">
        Điền thông tin ngân hàng ở sidebar
      </div>
    </div>
  </section>
</template>
