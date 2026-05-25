<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authService } from '@/services/auth.service'
import { useUIStore } from '@/stores/ui'
import AppButton from '@/components/common/AppButton.vue'
import AppSpinner from '@/components/common/AppSpinner.vue'
import AuthLeftPanel from '@/components/common/AuthLeftPanel.vue'

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
  <div class="flex min-h-screen bg-slate-50">
    <!-- Left Column: Elegant Visual Showcase -->
    <AuthLeftPanel
      title="Xác thực tài khoản"
      subtitle="Chỉ còn một bước cuối cùng để chính thức bắt đầu trải nghiệm dịch vụ tạo thiệp cưới và thiệp sự kiện hàng đầu Việt Nam."
    />

    <!-- Right Column: Verification States -->
    <div class="flex w-full flex-col justify-center px-6 py-12 lg:w-1/2 lg:px-16 bg-white relative">
      <!-- Mobile Logo Header -->
      <div class="mb-10 text-center lg:hidden">
        <RouterLink to="/" class="inline-flex items-center gap-2.5 text-3xl font-black tracking-wider text-indigo-600">
          <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md text-xl">
            💌
          </span>
          InviteVerse
        </RouterLink>
      </div>

      <div class="mx-auto w-full max-w-sm text-center">
        <!-- Verifying State -->
        <div v-if="status === 'verifying'" class="space-y-4 py-8">
          <AppSpinner size="lg" class="mx-auto h-12 w-12 text-indigo-600" />
          <h2 class="text-xl font-bold text-gray-800">Đang xác thực email</h2>
          <p class="text-sm text-gray-500 leading-relaxed">
            Hệ thống đang kiểm tra chữ ký xác thực. Quá trình này sẽ mất một vài giây...
          </p>
        </div>

        <!-- Success State -->
        <div v-else-if="status === 'success'" class="rounded-3xl border border-emerald-100 bg-emerald-50/50 p-8 shadow-xl shadow-emerald-50">
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-3xl">
            🎉
          </div>
          <h2 class="text-2xl font-black text-emerald-800">Xác thực thành công!</h2>
          <p class="mt-3 text-sm text-emerald-700 leading-relaxed">
            Email của bạn đã được xác minh thành công. Bây giờ bạn đã có quyền truy cập đầy đủ các tính năng của InviteVerse.
          </p>
          <AppButton variant="primary" class="mt-6 w-full py-3 font-semibold shadow-md shadow-indigo-200" @click="router.push({ name: 'Login' })">
            Đăng nhập ngay
          </AppButton>
        </div>

        <!-- Error State -->
        <div v-else class="rounded-3xl border border-rose-100 bg-rose-50/50 p-8 shadow-xl shadow-rose-50">
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-3xl">
            ❌
          </div>
          <h2 class="text-2xl font-black text-rose-800">Liên kết không hợp lệ</h2>
          <p class="mt-3 text-sm text-rose-700 leading-relaxed">
            Đường dẫn xác minh email đã hết hạn hoặc không chính xác. Bạn có thể yêu cầu gửi lại email mới.
          </p>
          <div class="mt-6 space-y-4">
            <AppButton variant="primary" class="w-full py-3 font-semibold shadow-md shadow-indigo-200" :loading="isResending" @click="resend">
              Gửi lại email xác nhận
            </AppButton>
            <RouterLink :to="{ name: 'Login' }" class="block text-sm font-semibold text-gray-500 hover:text-gray-700 hover:underline transition-colors">
              Quay lại đăng nhập
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
