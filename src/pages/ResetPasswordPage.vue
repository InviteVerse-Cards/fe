<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authService } from '@/services/auth.service'
import { useUIStore } from '@/stores/ui'
import { getAuthErrorMessage } from '@/utils/authError'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import AuthLeftPanel from '@/components/common/AuthLeftPanel.vue'

const route = useRoute()
const router = useRouter()
const ui = useUIStore()

const token = ref('')
const form = reactive({ password: '', confirm: '' })
const errors = reactive({ password: '', confirm: '' })
const isLoading = ref(false)
const done = ref(false)

onMounted(() => {
  token.value = (route.query.token as string) || ''
  if (!token.value) {
    ui.toast.error('Link không hợp lệ hoặc đã hết hạn')
    router.push({ name: 'Login' })
  }
})

function validate() {
  errors.password = ''
  errors.confirm = ''
  if (form.password.length < 8) errors.password = 'Mật khẩu tối thiểu 8 ký tự'
  if (form.password !== form.confirm) errors.confirm = 'Mật khẩu xác nhận không khớp'
  return !errors.password && !errors.confirm
}

async function submit() {
  if (!validate()) return
  isLoading.value = true
  try {
    await authService.resetPassword(token.value, form.password)
    done.value = true
  } catch (err: unknown) {
    ui.toast.error(getAuthErrorMessage(err, 'Đặt lại mật khẩu thất bại. Link có thể đã hết hạn.'))
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen bg-slate-50">
    <!-- Left Column: Elegant Visual Showcase -->
    <AuthLeftPanel
      title="Cài đặt mật khẩu mới"
      subtitle="Thiết lập mật khẩu bảo mật cao để bảo vệ những mẫu thiết kế thiệp cưới và dữ liệu khách mời quý giá của bạn."
    />

    <!-- Right Column: Reset Password Form -->
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
        <div v-if="done" class="rounded-3xl border border-emerald-100 bg-emerald-50/50 p-8 text-center shadow-xl shadow-emerald-50">
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-3xl">
            ✅
          </div>
          <h2 class="text-2xl font-black text-emerald-800">Đặt lại thành công!</h2>
          <p class="mt-3 text-sm text-emerald-700 leading-relaxed">
            Mật khẩu tài khoản của bạn đã được cập nhật thành công. Bạn đã có thể đăng nhập bằng mật khẩu mới này.
          </p>
          <RouterLink :to="{ name: 'Login' }" class="mt-6 inline-block font-bold text-sm text-indigo-600 hover:text-indigo-500 hover:underline transition-colors">
            Đăng nhập ngay →
          </RouterLink>
        </div>

        <!-- Reset Form -->
        <div v-else>
          <div class="mb-8">
            <h2 class="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">Cài lại mật khẩu</h2>
            <p class="mt-2 text-sm text-gray-500 leading-relaxed">
              Vui lòng nhập mật khẩu mới và xác nhận để đặt lại quyền truy cập.
            </p>
          </div>

          <form class="space-y-5" @submit.prevent="submit">
            <AppInput
              v-model="form.password"
              label="Mật khẩu mới"
              type="password"
              placeholder="Tối thiểu 8 ký tự"
              :error="errors.password"
              required
            />
            <AppInput
              v-model="form.confirm"
              label="Xác nhận mật khẩu"
              type="password"
              placeholder="Nhập lại mật khẩu mới"
              :error="errors.confirm"
              required
            />
            <AppButton type="submit" variant="primary" class="w-full py-3 font-semibold shadow-md shadow-indigo-200" :loading="isLoading">
              Đặt lại mật khẩu
            </AppButton>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
