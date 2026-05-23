<script setup lang="ts">
import { ref, reactive } from 'vue'
import { authService } from '@/services/auth.service'
import { useUIStore } from '@/stores/ui'
import { getAuthErrorMessage } from '@/utils/authError'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'

const ui = useUIStore()

const form = reactive({ full_name: '', email: '', password: '', confirm: '' })
const errors = reactive({ full_name: '', email: '', password: '', confirm: '' })
const isLoading = ref(false)
const registered = ref(false)

function validate() {
  errors.full_name = ''
  errors.email = ''
  errors.password = ''
  errors.confirm = ''
  if (!form.full_name.trim()) errors.full_name = 'Vui lòng nhập họ tên'
  if (!form.email) errors.email = 'Vui lòng nhập email'
  if (form.password.length < 8) errors.password = 'Mật khẩu tối thiểu 8 ký tự'
  if (form.password !== form.confirm) errors.confirm = 'Mật khẩu xác nhận không khớp'
  return !errors.full_name && !errors.email && !errors.password && !errors.confirm
}

async function submit() {
  if (!validate()) return
  isLoading.value = true
  try {
    await authService.register({ full_name: form.full_name, email: form.email, password: form.password })
    registered.value = true
  } catch (err: unknown) {
    ui.toast.error(getAuthErrorMessage(err, 'Đăng ký thất bại'))
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center px-4 py-12">
    <div class="w-full max-w-sm">
      <div class="mb-8 text-center">
        <RouterLink to="/" class="text-3xl font-bold text-indigo-600">InviteVerse</RouterLink>
        <p class="mt-2 text-sm text-gray-500">Tạo tài khoản miễn phí</p>
      </div>

      <!-- Success state -->
      <div v-if="registered" class="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div class="mb-3 text-4xl">📬</div>
        <h2 class="text-lg font-semibold text-green-800">Kiểm tra email của bạn</h2>
        <p class="mt-2 text-sm text-green-700">
          Chúng tôi đã gửi link xác nhận đến <strong>{{ form.email }}</strong>.
          Vui lòng kiểm tra hộp thư và xác nhận tài khoản.
        </p>
        <RouterLink :to="{ name: 'Login' }" class="mt-5 inline-block text-sm text-indigo-600 hover:underline">
          Quay lại đăng nhập →
        </RouterLink>
      </div>

      <div v-else class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <form class="space-y-4" @submit.prevent="submit">
          <AppInput
            v-model="form.full_name"
            label="Họ và tên"
            placeholder="Nguyễn Văn A"
            :error="errors.full_name"
            required
          />
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
            placeholder="Tối thiểu 8 ký tự"
            :error="errors.password"
            required
          />
          <AppInput
            v-model="form.confirm"
            label="Xác nhận mật khẩu"
            type="password"
            placeholder="Nhập lại mật khẩu"
            :error="errors.confirm"
            required
          />

          <AppButton type="submit" variant="primary" class="w-full" :loading="isLoading">
            Tạo tài khoản
          </AppButton>
        </form>

        <p class="mt-6 text-center text-sm text-gray-500">
          Đã có tài khoản?
          <RouterLink :to="{ name: 'Login' }" class="font-medium text-indigo-600 hover:underline">
            Đăng nhập
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
