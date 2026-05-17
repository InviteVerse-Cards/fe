<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { authService } from '@/services/auth.service'
import { useUIStore } from '@/stores/ui'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'

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
    const msg = (err as { message?: string })?.message
    ui.toast.error(msg || 'Đặt lại mật khẩu thất bại. Link có thể đã hết hạn.')
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
        <p class="mt-2 text-sm text-gray-500">Tạo mật khẩu mới</p>
      </div>

      <div v-if="done" class="rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
        <div class="mb-3 text-4xl">✅</div>
        <h2 class="text-lg font-semibold text-green-800">Mật khẩu đã được cập nhật!</h2>
        <p class="mt-2 text-sm text-green-700">Bạn có thể đăng nhập bằng mật khẩu mới.</p>
        <RouterLink :to="{ name: 'Login' }" class="mt-5 inline-block text-sm text-indigo-600 hover:underline">
          Đăng nhập ngay →
        </RouterLink>
      </div>

      <div v-else class="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
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
            placeholder="Nhập lại mật khẩu"
            :error="errors.confirm"
            required
          />
          <AppButton type="submit" variant="primary" class="w-full" :loading="isLoading">
            Đặt lại mật khẩu
          </AppButton>
        </form>
      </div>
    </div>
  </div>
</template>
