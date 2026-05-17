<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/auth.service'
import { useUIStore } from '@/stores/ui'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'

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
    const msg = (err as { message?: string })?.message
    ui.toast.error(msg || 'Email hoặc mật khẩu không đúng')
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
        <p class="mt-2 text-sm text-gray-500">Đăng nhập vào tài khoản của bạn</p>
      </div>

      <div class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <form class="space-y-5" @submit.prevent="submit">
          <AppInput
            v-model="form.email"
            label="Email"
            type="email"
            placeholder="ten@email.com"
            :error="errors.email"
            required
          />
          <AppInput
            v-model="form.password"
            label="Mật khẩu"
            type="password"
            placeholder="••••••••"
            :error="errors.password"
            required
          />

          <div class="flex items-center justify-end">
            <RouterLink :to="{ name: 'ForgotPassword' }" class="text-sm text-indigo-600 hover:underline">
              Quên mật khẩu?
            </RouterLink>
          </div>

          <AppButton type="submit" variant="primary" class="w-full" :loading="isLoading">
            Đăng nhập
          </AppButton>
        </form>

        <p class="mt-6 text-center text-sm text-gray-500">
          Chưa có tài khoản?
          <RouterLink :to="{ name: 'Register' }" class="font-medium text-indigo-600 hover:underline">
            Đăng ký miễn phí
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
