<script setup lang="ts">
import { ref, reactive } from 'vue'
import { authService } from '@/services/auth.service'
import { useUIStore } from '@/stores/ui'
import { getAuthErrorMessage } from '@/utils/authError'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import AuthLeftPanel from '@/components/common/AuthLeftPanel.vue'

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
  <div class="flex min-h-screen bg-slate-50">
    <!-- Left Column: Elegant Visual Showcase -->
    <AuthLeftPanel
      title="Tạo thiệp mời hoàn toàn miễn phí"
      subtitle="Khám phá kho giao diện thiệp cưới, sinh nhật, thôi nôi đa dạng, chỉnh sửa trực quan dễ dàng và xuất bản nhanh chóng trong nháy mắt."
    />

    <!-- Right Column: Registration Form -->
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
        <div v-if="registered" class="rounded-3xl border border-emerald-100 bg-emerald-50/50 p-8 text-center shadow-xl shadow-emerald-50">
          <div class="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-3xl">
            📬
          </div>
          <h2 class="text-2xl font-black text-emerald-800">Kiểm tra email của bạn</h2>
          <p class="mt-3 text-sm text-emerald-700 leading-relaxed">
            Chúng tôi đã gửi đường dẫn kích hoạt đến hộp thư <strong>{{ form.email }}</strong>. Vui lòng kiểm tra và xác nhận để bắt đầu sử dụng.
          </p>
          <RouterLink :to="{ name: 'Login' }" class="mt-6 inline-block font-bold text-sm text-indigo-600 hover:text-indigo-500 hover:underline transition-colors">
            Quay lại đăng nhập →
          </RouterLink>
        </div>

        <!-- Register Form -->
        <div v-else>
          <div class="mb-8">
            <h2 class="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">Đăng ký</h2>
            <p class="mt-2 text-sm text-gray-500 leading-relaxed">
              Bắt đầu tạo thiệp mời trực tuyến cao cấp hoàn toàn miễn phí.
            </p>
          </div>

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
              placeholder="example@gmail.com"
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

            <AppButton type="submit" variant="primary" class="w-full py-3 mt-2 font-semibold shadow-md shadow-indigo-200" :loading="isLoading">
              Tạo tài khoản
            </AppButton>
          </form>

          <!-- Footer actions -->
          <p class="mt-8 text-center text-sm text-gray-500">
            Đã có tài khoản?
            <RouterLink :to="{ name: 'Login' }" class="font-bold text-indigo-600 hover:text-indigo-500 hover:underline transition-colors ml-1">
              Đăng nhập
            </RouterLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
