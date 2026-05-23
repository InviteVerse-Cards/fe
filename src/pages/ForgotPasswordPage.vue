<script setup lang="ts">
import { ref } from 'vue'
import { authService } from '@/services/auth.service'
import { useUIStore } from '@/stores/ui'
import { getAuthErrorMessage } from '@/utils/authError'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'

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
  <div class="flex min-h-screen items-center justify-center px-4 py-12">
    <div class="w-full max-w-sm">
      <div class="mb-8 text-center">
        <h1 class="text-3xl font-bold text-indigo-600">InviteVerse</h1>
        <p class="mt-2 text-sm text-gray-500">Đặt lại mật khẩu</p>
      </div>

      <div v-if="sent" class="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div class="mb-3 text-4xl">📬</div>
        <h2 class="text-lg font-semibold text-green-800">Đã gửi email!</h2>
        <p class="mt-2 text-sm text-green-700">
          Kiểm tra hộp thư <strong>{{ email }}</strong> để tìm link đặt lại mật khẩu.
        </p>
        <RouterLink :to="{ name: 'Login' }" class="mt-5 inline-block text-sm text-indigo-600 hover:underline">
          Quay lại đăng nhập →
        </RouterLink>
      </div>

      <div v-else class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <p class="mb-5 text-sm text-gray-500">
          Nhập email đã đăng ký, chúng tôi sẽ gửi link đặt lại mật khẩu cho bạn.
        </p>
        <form class="space-y-5" @submit.prevent="submit">
          <AppInput
            v-model="email"
            label="Email"
            type="email"
            placeholder="ten@email.com"
            required
          />
          <AppButton type="submit" variant="primary" class="w-full" :loading="isLoading">
            Gửi link đặt lại
          </AppButton>
        </form>

        <p class="mt-6 text-center text-sm text-gray-500">
          <RouterLink :to="{ name: 'Login' }" class="text-indigo-600 hover:underline">
            ← Quay lại đăng nhập
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
