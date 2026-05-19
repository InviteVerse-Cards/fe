<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { adminService } from '@/services/admin.service'
import type { AdminTemplate } from '@/services/admin.service'
import { useUIStore } from '@/stores/ui'
import AppSpinner from '@/components/common/AppSpinner.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppModal from '@/components/common/AppModal.vue'
import AppBadge from '@/components/common/AppBadge.vue'

const ui = useUIStore()
const router = useRouter()
const templates = ref<AdminTemplate[]>([])
const isLoading = ref(false)

const formModal = ref(false)
const editingTemplate = ref<AdminTemplate | null>(null)
const isSaving = ref(false)

const CATEGORIES = ['wedding', 'birthday', 'baby_shower', 'housewarming', 'corporate']

const formDefault = () => ({
  name: '',
  slug: '',
  description: '',
  category: 'wedding',
  plan_required: 'free' as 'free' | 'pro',
  thumbnail_url: '',
  preview_url: '',
  is_active: true,
})
const form = reactive(formDefault())

const deleteModal = ref(false)
const deleteTarget = ref<AdminTemplate | null>(null)
const isDeleting = ref(false)

async function loadTemplates() {
  isLoading.value = true
  try {
    templates.value = await adminService.getTemplates()
  } catch {
    ui.toast.error('Không thể tải danh sách template')
  } finally {
    isLoading.value = false
  }
}

function slugify(text: string) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 80)
}

function onNameInput() {
  if (!editingTemplate.value) {
    form.slug = slugify(form.name)
  }
}

function openCreate() {
  editingTemplate.value = null
  Object.assign(form, formDefault())
  formModal.value = true
}

function openEdit(t: AdminTemplate) {
  editingTemplate.value = t
  Object.assign(form, {
    name: t.name,
    slug: t.slug,
    description: t.description || '',
    category: t.category,
    plan_required: t.plan_required,
    thumbnail_url: t.thumbnail_url || '',
    preview_url: t.preview_url || '',
    is_active: t.is_active,
  })
  formModal.value = true
}

function openVisualEditor(t: AdminTemplate) {
  router.push(`/admin/templates/${t.uuid}/editor`)
}

async function doSave() {
  if (!form.name.trim()) {
    ui.toast.error('Tên template không được để trống')
    return
  }
  if (!editingTemplate.value && !form.slug.trim()) {
    ui.toast.error('Slug không được để trống')
    return
  }

  isSaving.value = true
  try {
    if (editingTemplate.value) {
      const dto: Record<string, unknown> = {
        name: form.name,
        description: form.description || null,
        thumbnail_url: form.thumbnail_url || null,
        preview_url: form.preview_url || null,
        plan_required: form.plan_required,
        is_active: form.is_active,
      }
      await adminService.updateTemplate(editingTemplate.value.uuid, dto)
      ui.toast.success('Đã cập nhật template')
    } else {
      const dto: Record<string, unknown> = {
        name: form.name,
        slug: form.slug,
        description: form.description || null,
        category: form.category,
        thumbnail_url: form.thumbnail_url || null,
        preview_url: form.preview_url || null,
        plan_required: form.plan_required,
        default_config: JSON.stringify({ theme: {}, sections: [] }),
      }
      await adminService.createTemplate(dto)
      ui.toast.success('Đã tạo template mới — dùng Visual Editor để thêm sections và theme')
    }
    formModal.value = false
    loadTemplates()
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Lưu thất bại'
    ui.toast.error(msg)
  } finally {
    isSaving.value = false
  }
}

function openDelete(t: AdminTemplate) {
  deleteTarget.value = t
  deleteModal.value = true
}

async function doDelete() {
  if (!deleteTarget.value) return
  isDeleting.value = true
  try {
    await adminService.deleteTemplate(deleteTarget.value.uuid)
    ui.toast.success('Đã xóa template')
    deleteModal.value = false
    loadTemplates()
  } catch {
    ui.toast.error('Xóa thất bại')
  } finally {
    isDeleting.value = false
  }
}

onMounted(loadTemplates)
</script>

<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Templates</h1>
        <p class="mt-1 text-sm text-gray-500">Quản lý thiệp mẫu cho người dùng</p>
      </div>
      <AppButton variant="primary" @click="openCreate">+ Thêm template</AppButton>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="flex justify-center py-20">
      <AppSpinner size="lg" />
    </div>

    <!-- Table -->
    <div v-else class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <table class="w-full text-sm">
        <thead class="border-b border-gray-200 bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Template</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Category</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Plan</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Trạng thái</th>
            <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Lượt dùng</th>
            <th class="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-for="t in templates" :key="t.uuid" class="hover:bg-gray-50 transition-colors">
            <!-- Name + slug -->
            <td class="px-4 py-3">
              <div class="flex items-center gap-3">
                <div
                  v-if="t.thumbnail_url"
                  class="h-12 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200"
                >
                  <img :src="t.thumbnail_url" :alt="t.name" class="h-full w-full object-cover" />
                </div>
                <div
                  v-else
                  class="flex h-12 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-indigo-50 text-lg"
                >
                  🎨
                </div>
                <div>
                  <p class="font-medium text-gray-900">{{ t.name }}</p>
                  <p class="text-xs text-gray-400">{{ t.slug }}</p>
                </div>
              </div>
            </td>
            <!-- Category -->
            <td class="px-4 py-3 text-gray-600 capitalize">{{ t.category }}</td>
            <!-- Plan -->
            <td class="px-4 py-3">
              <AppBadge :variant="t.plan_required === 'pro' ? 'primary' : 'default'" size="sm">
                {{ t.plan_required === 'pro' ? 'PRO' : 'Free' }}
              </AppBadge>
            </td>
            <!-- Status -->
            <td class="px-4 py-3">
              <AppBadge :variant="t.is_active ? 'success' : 'default'" size="sm">
                {{ t.is_active ? 'Hiện' : 'Ẩn' }}
              </AppBadge>
            </td>
            <!-- Use count -->
            <td class="px-4 py-3 text-gray-600">{{ t.use_count.toLocaleString() }}</td>
            <!-- Actions -->
            <td class="px-4 py-3">
              <div class="flex items-center justify-end gap-2">
                <AppButton variant="primary" size="sm" @click="openVisualEditor(t)">✏️ Visual</AppButton>
                <AppButton variant="secondary" size="sm" @click="openEdit(t)">Cài đặt</AppButton>
                <AppButton variant="danger" size="sm" @click="openDelete(t)">Xóa</AppButton>
              </div>
            </td>
          </tr>
          <tr v-if="templates.length === 0">
            <td colspan="6" class="px-4 py-16 text-center text-gray-500">Chưa có template nào</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Form Modal -->
    <AppModal
      :show="formModal"
      :title="editingTemplate ? 'Sửa template' : 'Thêm template'"
      size="lg"
      @close="formModal = false"
    >
      <div class="space-y-4">
        <!-- Name -->
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700">Tên template <span class="text-red-500">*</span></label>
          <input
            v-model="form.name"
            placeholder="VD: Hồng Blossom"
            class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            @input="onNameInput"
          />
        </div>

        <!-- Slug (chỉ hiện khi tạo mới) -->
        <div v-if="!editingTemplate">
          <label class="mb-1.5 block text-sm font-medium text-gray-700">Slug <span class="text-red-500">*</span></label>
          <input
            v-model="form.slug"
            placeholder="hong-blossom"
            class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 font-mono text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <p class="mt-1 text-xs text-gray-400">URL-friendly, chỉ dùng a-z 0-9 và dấu gạch ngang</p>
        </div>

        <!-- Description -->
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700">Mô tả</label>
          <textarea
            v-model="form.description"
            rows="2"
            placeholder="Thiệp phong cách hoa hồng lãng mạn..."
            class="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <!-- Category + Plan -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">Category</label>
            <select
              v-model="form.category"
              :disabled="!!editingTemplate"
              class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-gray-50 disabled:text-gray-500"
            >
              <option v-for="cat in CATEGORIES" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div>
            <label class="mb-1.5 block text-sm font-medium text-gray-700">Plan yêu cầu</label>
            <select
              v-model="form.plan_required"
              class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="free">Free</option>
              <option value="pro">Pro</option>
            </select>
          </div>
        </div>

        <!-- Thumbnail URL -->
        <div>
          <label class="mb-1.5 block text-sm font-medium text-gray-700">Thumbnail URL</label>
          <input
            v-model="form.thumbnail_url"
            placeholder="https://..."
            class="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        <!-- is_active toggle -->
        <label class="flex cursor-pointer items-center gap-3">
          <div class="relative">
            <input v-model="form.is_active" type="checkbox" class="peer sr-only" />
            <div class="h-6 w-11 rounded-full bg-gray-200 transition-colors peer-checked:bg-indigo-600" />
            <div class="absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-white shadow transition-transform peer-checked:translate-x-5" />
          </div>
          <span class="text-sm text-gray-700">Hiện template cho người dùng</span>
        </label>

        <!-- Visual editor hint (edit mode) -->
        <div v-if="editingTemplate" class="rounded-xl border border-indigo-100 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
          Dùng nút <strong>✏️ Visual</strong> trong danh sách để chỉnh sửa màu sắc, font, ảnh và sections.
        </div>

        <!-- Actions -->
        <div class="flex justify-end gap-3 pt-2">
          <AppButton variant="ghost" @click="formModal = false">Huỷ</AppButton>
          <AppButton variant="primary" :loading="isSaving" @click="doSave">
            {{ editingTemplate ? 'Lưu thay đổi' : 'Tạo template' }}
          </AppButton>
        </div>
      </div>
    </AppModal>

    <!-- Delete Modal -->
    <AppModal :show="deleteModal" title="Xóa template" size="sm" @close="deleteModal = false">
      <div>
        <p class="mb-2 text-gray-600">
          Bạn có chắc muốn xóa template
          <strong class="text-gray-900">{{ deleteTarget?.name }}</strong>?
        </p>
        <p v-if="(deleteTarget?.use_count ?? 0) > 0" class="mb-4 rounded-lg bg-yellow-50 px-3 py-2 text-sm text-yellow-800">
          ⚠️ Template này đã được dùng {{ deleteTarget?.use_count }} lần. Template sẽ bị ẩn nhưng các thiệp hiện có vẫn hoạt động.
        </p>
        <p v-else class="mb-4 text-sm text-gray-500">Hành động này sẽ ẩn template khỏi danh sách.</p>
        <div class="flex justify-end gap-3">
          <AppButton variant="ghost" @click="deleteModal = false">Huỷ</AppButton>
          <AppButton variant="danger" :loading="isDeleting" @click="doDelete">Xóa</AppButton>
        </div>
      </div>
    </AppModal>
  </div>
</template>
