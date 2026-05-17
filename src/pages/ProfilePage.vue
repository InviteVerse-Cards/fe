<script setup lang="ts">
import { ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { userService } from '@/services/user.service'
import { useUIStore } from '@/stores/ui'
import AppInput from '@/components/common/AppInput.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppModal from '@/components/common/AppModal.vue'

const auth = useAuthStore()
const ui = useUIStore()
const { user } = storeToRefs(auth)

// Profile form
const profileForm = reactive({
  full_name: user.value?.full_name ?? '',
  phone: user.value?.phone ?? '',
})
const isSavingProfile = ref(false)

async function saveProfile() {
  if (!profileForm.full_name.trim()) {
    ui.toast.error('Vui lòng nhập họ tên')
    return
  }
  isSavingProfile.value = true
  try {
    const updated = await userService.updateProfile({
      full_name: profileForm.full_name,
      phone: profileForm.phone || undefined,
    })
    auth.setUser(updated)
    ui.toast.success('Đã cập nhật thông tin')
  } catch (err: unknown) {
    const msg = (err as { message?: string })?.message
    ui.toast.error(msg || 'Cập nhật thất bại')
  } finally {
    isSavingProfile.value = false
  }
}

// Change password form
const pwForm = reactive({ current: '', next: '', confirm: '' })
const pwErrors = reactive({ current: '', next: '', confirm: '' })
const isSavingPw = ref(false)

function validatePw() {
  pwErrors.current = ''
  pwErrors.next = ''
  pwErrors.confirm = ''
  if (!pwForm.current) pwErrors.current = 'Nhập mật khẩu hiện tại'
  if (pwForm.next.length < 8) pwErrors.next = 'Tối thiểu 8 ký tự'
  if (pwForm.next !== pwForm.confirm) pwErrors.confirm = 'Không khớp'
  return !pwErrors.current && !pwErrors.next && !pwErrors.confirm
}

async function savePassword() {
  if (!validatePw()) return
  isSavingPw.value = true
  try {
    await userService.changePassword({ current_password: pwForm.current, new_password: pwForm.next })
    pwForm.current = ''
    pwForm.next = ''
    pwForm.confirm = ''
    ui.toast.success('Đã đổi mật khẩu thành công')
  } catch (err: unknown) {
    const msg = (err as { message?: string })?.message
    ui.toast.error(msg || 'Đổi mật khẩu thất bại')
  } finally {
    isSavingPw.value = false
  }
}

// Delete account
const deleteModal = ref(false)
const deletePassword = ref('')
const isDeleting = ref(false)

async function doDelete() {
  if (!deletePassword.value) {
    ui.toast.error('Vui lòng nhập mật khẩu xác nhận')
    return
  }
  isDeleting.value = true
  try {
    await userService.deleteAccount(deletePassword.value)
    auth.clearUser()
    window.location.href = '/'
  } catch (err: unknown) {
    const msg = (err as { message?: string })?.message
    ui.toast.error(msg || 'Xoá tài khoản thất bại')
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <div class="mx-auto max-w-2xl px-4 py-10">
    <h1 class="mb-8 text-2xl font-bold text-gray-900">Hồ sơ cá nhân</h1>

    <!-- Profile Info -->
    <div class="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 class="mb-5 font-semibold text-gray-900">Thông tin cá nhân</h2>
      <div class="space-y-4">
        <AppInput v-model="profileForm.full_name" label="Họ và tên" placeholder="Nguyễn Văn A" required />
        <AppInput v-model="profileForm.phone" label="Số điện thoại" placeholder="0900 000 000" type="tel" />
        <div>
          <p class="mb-1.5 block text-sm font-medium text-gray-700">Email</p>
          <p class="rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-500">
            {{ user?.email }} <span class="ml-1 text-xs text-gray-400">(không thể thay đổi)</span>
          </p>
        </div>
      </div>
      <div class="mt-5 flex justify-end">
        <AppButton variant="primary" :loading="isSavingProfile" @click="saveProfile">Lưu thay đổi</AppButton>
      </div>
    </div>

    <!-- Change Password -->
    <div class="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 class="mb-5 font-semibold text-gray-900">Đổi mật khẩu</h2>
      <div class="space-y-4">
        <AppInput v-model="pwForm.current" label="Mật khẩu hiện tại" type="password" :error="pwErrors.current" />
        <AppInput v-model="pwForm.next" label="Mật khẩu mới" type="password" placeholder="Tối thiểu 8 ký tự" :error="pwErrors.next" />
        <AppInput v-model="pwForm.confirm" label="Xác nhận mật khẩu mới" type="password" :error="pwErrors.confirm" />
      </div>
      <div class="mt-5 flex justify-end">
        <AppButton variant="primary" :loading="isSavingPw" @click="savePassword">Đổi mật khẩu</AppButton>
      </div>
    </div>

    <!-- Danger Zone -->
    <div class="rounded-2xl border border-red-200 bg-red-50 p-6">
      <h2 class="mb-2 font-semibold text-red-800">Vùng nguy hiểm</h2>
      <p class="mb-4 text-sm text-red-700">Xoá tài khoản sẽ xoá toàn bộ dữ liệu và không thể khôi phục.</p>
      <AppButton variant="danger" @click="deleteModal = true">Xoá tài khoản</AppButton>
    </div>

    <!-- Delete Confirm Modal -->
    <AppModal :show="deleteModal" title="Xoá tài khoản" size="sm" @close="deleteModal = false">
      <p class="mb-4 text-sm text-gray-600">
        Nhập mật khẩu để xác nhận xoá tài khoản. Hành động này không thể hoàn tác.
      </p>
      <AppInput v-model="deletePassword" label="Mật khẩu xác nhận" type="password" placeholder="••••••••" />
      <div class="mt-5 flex justify-end gap-3">
        <AppButton variant="ghost" @click="deleteModal = false">Huỷ</AppButton>
        <AppButton variant="danger" :loading="isDeleting" @click="doDelete">Xoá vĩnh viễn</AppButton>
      </div>
    </AppModal>
  </div>
</template>
