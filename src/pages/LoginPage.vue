<script setup lang="ts">
import { ref, reactive } from 'vue'

declare const __APP_VERSION__: string
const appVersion = __APP_VERSION__
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/auth.service'
import { useUIStore } from '@/stores/ui'
import { getAuthErrorMessage } from '@/utils/authError'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import AuthLeftPanel from '@/components/common/AuthLeftPanel.vue'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const ui = useUIStore()

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: '', password: '' })
const isLoading = ref(false)

function validate() {
  errors.email = ''
  errors.password = ''
  if (!form.email) errors.email = 'Vui lòng nhập email'
  if (!form.password) errors.password = 'Vui lòng nhập mật khẩu'
  return !errors.email && !errors.password
}

async function submit() {
  if (!validate()) return
  isLoading.value = true
  try {
    const user = await authService.login({ email: form.email, password: form.password })
    auth.setUser(user)
    const redirect = (route.query.redirect as string) || '/'
    router.push(redirect)
  } catch (err: unknown) {
    ui.toast.error(getAuthErrorMessage(err, 'Email hoặc mật khẩu không đúng'))
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen bg-slate-50">
    <!-- Left Column: Elegant Visual Showcase -->
    <AuthLeftPanel
      title="Chào mừng bạn quay trở lại"
      subtitle="Đăng nhập để quản lý các mẫu thiệp mời, xem thống kê số khách mời RSVP và tiếp tục sáng tạo các dấu ấn độc đáo của riêng bạn."
    />

    <!-- Right Column: Login Form -->
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

      <!-- Version badge -->
      <span class="absolute bottom-3 right-3 font-mono text-[11px] text-gray-300 select-none">v{{ appVersion }}</span>

      <!-- Main Login Card Area -->
      <div class="mx-auto w-full max-w-sm">
        <div class="mb-8">
          <h2 class="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">Đăng nhập</h2>
          <p class="mt-2 text-sm text-gray-500 leading-relaxed">
            Vui lòng điền thông tin tài khoản của bạn để truy cập hệ thống.
          </p>
        </div>

        <form class="space-y-5" @submit.prevent="submit">
          <AppInput
            v-model="form.email"
            label="Email"
            type="email"
            placeholder="example@gmail.com"
            :error="errors.email"
            required
          />
          <AppInput
            v-model="form.password"
            label="Mật khẩu"
            type="password"
            placeholder="Nhập mật khẩu của bạn"
            :error="errors.password"
            required
          />

          <div class="flex items-center justify-end">
            <RouterLink :to="{ name: 'ForgotPassword' }" class="text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-colors hover:underline">
              Quên mật khẩu?
            </RouterLink>
          </div>

          <AppButton type="submit" variant="primary" class="w-full py-3 font-semibold shadow-md shadow-indigo-200" :loading="isLoading">
            Đăng nhập
          </AppButton>
        </form>

        <!-- Footer actions -->
        <p class="mt-8 text-center text-sm text-gray-500">
          Chưa có tài khoản?
          <RouterLink :to="{ name: 'Register' }" class="font-bold text-indigo-600 hover:text-indigo-500 hover:underline transition-colors ml-1">
            Đăng ký miễn phí
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
