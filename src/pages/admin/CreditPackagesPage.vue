<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { adminService } from '@/services/admin.service'
import type { CreditPackage } from '@/services/admin.service'
import { useUIStore } from '@/stores/ui'
import { formatCurrency } from '@/utils/format'
import AppSpinner from '@/components/common/AppSpinner.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppModal from '@/components/common/AppModal.vue'
import AppBadge from '@/components/common/AppBadge.vue'

const ui = useUIStore()
const packages = ref<CreditPackage[]>([])
const isLoading = ref(false)

const formModal = ref(false)
const editingPkg = ref<CreditPackage | null>(null)
const isSaving = ref(false)

const formDefault = () => ({ name: '', credits: 10, price: 0, description: '', is_active: true })
const form = reactive(formDefault())

const deleteModal = ref(false)
const deleteTarget = ref<CreditPackage | null>(null)
const isDeleting = ref(false)

async function loadPackages() {
  isLoading.value = true
  try {
    packages.value = await adminService.getPackages()
  } catch {
    ui.toast.error('Không thể tải danh sách gói')
  } finally {
    isLoading.value = false
  }
}

function openCreate() {
  editingPkg.value = null
  Object.assign(form, formDefault())
  formModal.value = true
}

function openEdit(pkg: CreditPackage) {
  editingPkg.value = pkg
  Object.assign(form, {
    name: pkg.name,
    credits: pkg.credits,
    price: pkg.price,
    description: pkg.description || '',
    is_active: pkg.is_active,
  })
  formModal.value = true
}

async function doSave() {
  if (!form.name.trim() || form.credits <= 0 || form.price < 0) {
    ui.toast.error('Vui lòng nhập đầy đủ thông tin hợp lệ')
    return
  }
  isSaving.value = true
  try {
    const dto = { name: form.name, credits: form.credits, price: form.price, description: form.description, is_active: form.is_active }
    if (editingPkg.value) {
      await adminService.updatePackage(editingPkg.value.id, dto)
      ui.toast.success('Đã cập nhật gói')
    } else {
      await adminService.createPackage(dto)
      ui.toast.success('Đã tạo gói mới')
    }
    formModal.value = false
    loadPackages()
  } catch {
    ui.toast.error('Lưu thất bại')
  } finally {
    isSaving.value = false
  }
}

function openDelete(pkg: CreditPackage) {
  deleteTarget.value = pkg
  deleteModal.value = true
}

async function doDelete() {
  if (!deleteTarget.value) return
  isDeleting.value = true
  try {
    await adminService.deletePackage(deleteTarget.value.id)
    ui.toast.success('Đã xoá gói')
    deleteModal.value = false
    loadPackages()
  } catch {
    ui.toast.error('Xoá thất bại')
  } finally {
    isDeleting.value = false
  }
}

onMounted(loadPackages)
</script>

<template>
  <div>
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Gói lượt</h1>
        <p class="mt-1 text-sm text-gray-500">Quản lý các gói lượt bán cho người dùng</p>
      </div>
      <AppButton variant="primary" @click="openCreate">+ Thêm gói</AppButton>
    </div>

    <div v-if="isLoading" class="flex justify-center py-20">
      <AppSpinner size="lg" />
    </div>

    <div v-else class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="pkg in packages"
        :key="pkg.id"
        class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
      >
        <div class="mb-4 flex items-start justify-between">
          <div>
            <h3 class="font-semibold text-gray-900">{{ pkg.name }}</h3>
            <p v-if="pkg.description" class="mt-1 text-xs text-gray-500">{{ pkg.description }}</p>
          </div>
          <AppBadge :variant="pkg.is_active ? 'success' : 'default'" size="sm">
            {{ pkg.is_active ? 'Đang bán' : 'Tắt' }}
          </AppBadge>
        </div>

        <div class="mb-4 space-y-2">
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500">Số lượt</span>
            <span class="font-semibold text-indigo-600">{{ pkg.credits }} lượt</span>
          </div>
          <div class="flex items-center justify-between text-sm">
            <span class="text-gray-500">Giá</span>
            <span class="font-semibold text-gray-900">{{ formatCurrency(pkg.price) }}</span>
          </div>
        </div>

        <div class="flex gap-2">
          <AppButton variant="secondary" size="sm" class="flex-1" @click="openEdit(pkg)">Sửa</AppButton>
          <AppButton variant="danger" size="sm" @click="openDelete(pkg)">Xoá</AppButton>
        </div>
      </div>

      <div v-if="packages.length === 0" class="col-span-full py-16 text-center text-gray-500">
        Chưa có gói nào
      </div>
    </div>

    <!-- Form modal -->
    <AppModal :show="formModal" :title="editingPkg ? 'Sửa gói' : 'Thêm gói'" @close="formModal = false">
      <div class="space-y-4">
        <div>
          <label class="mb-1.5 block text-sm text-gray-700">Tên gói <span class="text-red-500">*</span></label>
          <input v-model="form.name" placeholder="VD: Gói Tiêu Chuẩn" class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none" />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-1.5 block text-sm text-gray-700">Số lượt <span class="text-red-500">*</span></label>
            <input v-model.number="form.credits" type="number" min="1" class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none" />
          </div>
          <div>
            <label class="mb-1.5 block text-sm text-gray-700">Giá (VND) <span class="text-red-500">*</span></label>
            <input v-model.number="form.price" type="number" min="0" class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none" />
          </div>
        </div>
        <div>
          <label class="mb-1.5 block text-sm text-gray-700">Mô tả</label>
          <textarea v-model="form.description" rows="2" placeholder="Mô tả ngắn..." class="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none" />
        </div>
        <label class="flex cursor-pointer items-center gap-2">
          <input v-model="form.is_active" type="checkbox" class="rounded" />
          <span class="text-sm text-gray-700">Đang bán (hiện cho người dùng)</span>
        </label>
        <div class="flex justify-end gap-3 pt-2">
          <AppButton variant="ghost" @click="formModal = false">Huỷ</AppButton>
          <AppButton variant="primary" :loading="isSaving" @click="doSave">
            {{ editingPkg ? 'Lưu thay đổi' : 'Tạo gói' }}
          </AppButton>
        </div>
      </div>
    </AppModal>

    <!-- Delete modal -->
    <AppModal :show="deleteModal" title="Xoá gói" size="sm" @close="deleteModal = false">
      <p class="mb-5 text-gray-600">
        Bạn có chắc muốn xoá gói <strong class="text-gray-900">{{ deleteTarget?.name }}</strong>?
      </p>
      <div class="flex justify-end gap-3">
        <AppButton variant="ghost" @click="deleteModal = false">Huỷ</AppButton>
        <AppButton variant="danger" :loading="isDeleting" @click="doDelete">Xoá</AppButton>
      </div>
    </AppModal>
  </div>
</template>
