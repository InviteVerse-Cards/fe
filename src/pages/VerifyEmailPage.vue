<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authService } from '@/services/auth.service'
import { useUIStore } from '@/stores/ui'
import AppButton from '@/components/common/AppButton.vue'
import AppSpinner from '@/components/common/AppSpinner.vue'

const route = useRoute()
const router = useRouter()
const ui = useUIStore()

const status = ref<'verifying' | 'success' | 'error'>('verifying')
const isResending = ref(false)
const resendEmail = ref((route.query.email as string) || '')

onMounted(async () => {
  const token = route.query.token as string
  if (!token) {
    status.value = 'error'
    return
  }
  try {
    await authService.verifyEmail(token)
    status.value = 'success'
  } catch {
    status.value = 'error'
  }
})

async function resend() {
  if (!resendEmail.value) {
    ui.toast.error('Không có địa chỉ email để gửi lại')
    return
  }
  isResending.value = true
  try {
    await authService.resendVerification(resendEmail.value)
    ui.toast.success('Đã gửi lại email xác nhận')
  } catch {
    ui.toast.error('Gửi lại thất bại. Vui lòng thử lại.')
  } finally {
    isResending.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center px-4 py-12">
    <div class="w-full max-w-sm text-center">
      <!-- Verifying -->
      <div v-if="status === 'verifying'" class="space-y-4">
        <AppSpinner size="lg" />
        <p class="text-gray-500">Đang xác nhận email...</p>
      </div>

      <!-- Success -->
      <div v-else-if="status === 'success'" class="rounded-2xl border border-green-200 bg-green-50 p-8">
        <div class="mb-3 text-5xl">🎉</div>
        <h2 class="text-xl font-bold text-green-800">Xác nhận thành công!</h2>
        <p class="mt-2 text-sm text-green-700">Email của bạn đã được xác nhận. Bạn có thể đăng nhập ngay bây giờ.</p>
        <AppButton variant="primary" class="mt-6 w-full" @click="router.push({ name: 'Login' })">
          Đăng nhập
        </AppButton>
      </div>

      <!-- Error -->
      <div v-else class="rounded-2xl border border-red-200 bg-red-50 p-8">
        <div class="mb-3 text-5xl">❌</div>
        <h2 class="text-xl font-bold text-red-800">Link không hợp lệ</h2>
        <p class="mt-2 text-sm text-red-700">Link xác nhận đã hết hạn hoặc không hợp lệ.</p>
        <div class="mt-6 space-y-3">
          <AppButton variant="primary" class="w-full" :loading="isResending" @click="resend">
            Gửi lại email xác nhận
          </AppButton>
          <RouterLink :to="{ name: 'Login' }" class="block text-sm text-gray-500 hover:underline">
            Quay lại đăng nhập
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
