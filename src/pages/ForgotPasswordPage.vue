<script setup lang="ts">
import { ref } from 'vue'
import { authService } from '@/services/auth.service'
import { useUIStore } from '@/stores/ui'
import { getAuthErrorMessage } from '@/utils/authError'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import AuthLeftPanel from '@/components/common/AuthLeftPanel.vue'

const ui = useUIStore()
const email = ref('')
const isLoading = ref(false)
const sent = ref(false)

async function submit() {
  if (!email.value) {
    ui.toast.error('Vui lòng nhập email')
    return
  }
  isLoading.value = true
  try {
    await authService.forgotPassword(email.value)
    sent.value = true
  } catch (err: unknown) {
    ui.toast.error(getAuthErrorMessage(err, 'Không thể gửi email. Vui lòng thử lại.'))
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen bg-slate-50">
    <!-- Left Column: Elegant Visual Showcase -->
    <AuthLeftPanel
      title="Khôi phục quyền truy cập"
      subtitle="Nếu bạn quên mật khẩu, đừng lo lắng. Chúng tôi sẽ nhanh chóng gửi cho bạn liên kết đặt lại mật khẩu để bạn quay lại hành trình thiết kế thiệp mời."
    />

    <!-- Right Column: Forgot Password Form -->
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

      <div class="mx-auto w-full max-w-sm">
        <!-- Success State -->
        <div v-if="sent" class="rounded-3xl border border-emerald-100 bg-emerald-50/50 p-8 text-center shadow-xl shadow-emerald-50">
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-3xl">
            📬
          </div>
          <h2 class="text-2xl font-black text-emerald-800">Đã gửi email!</h2>
          <p class="mt-3 text-sm text-emerald-700 leading-relaxed">
            Chúng tôi đã gửi link đặt lại mật khẩu đến email <strong>{{ email }}</strong>. Vui lòng kiểm tra hộp thư của bạn.
          </p>
          <RouterLink :to="{ name: 'Login' }" class="mt-6 inline-block font-bold text-sm text-indigo-600 hover:text-indigo-500 hover:underline transition-colors">
            Quay lại đăng nhập →
          </RouterLink>
        </div>

        <!-- Forgot Password Form -->
        <div v-else>
          <div class="mb-8">
            <h2 class="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">Quên mật khẩu?</h2>
            <p class="mt-2 text-sm text-gray-500 leading-relaxed">
              Nhập email đã đăng ký của bạn dưới đây, chúng tôi sẽ gửi liên kết khôi phục tài khoản.
            </p>
          </div>

          <form class="space-y-5" @submit.prevent="submit">
            <AppInput
              v-model="email"
              label="Email đã đăng ký"
              type="email"
              placeholder="example@gmail.com"
              required
            />
            <AppButton type="submit" variant="primary" class="w-full py-3 font-semibold shadow-md shadow-indigo-200" :loading="isLoading">
              Gửi liên kết khôi phục
            </AppButton>
          </form>

          <!-- Footer actions -->
          <p class="mt-8 text-center text-sm text-gray-500">
            <RouterLink :to="{ name: 'Login' }" class="font-bold text-indigo-600 hover:text-indigo-500 transition-colors">
              ← Quay lại đăng nhập
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
