<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { adminService } from '@/services/admin.service'
import type { AdminTemplate, AdminCategory } from '@/services/admin.service'
import { CATEGORY_COLORS } from '@/constants/categorySections'
import { useUIStore } from '@/stores/ui'
import AppSpinner from '@/components/common/AppSpinner.vue'

const router = useRouter()
const ui = useUIStore()

// ─── State ────────────────────────────────────────────────────────────
const categories = ref<AdminCategory[]>([])
const templates = ref<AdminTemplate[]>([])
const isLoading = ref(true)
const activeSlug = ref('')
const updatingSlug = ref<string | null>(null)   // category toggle
const updatingUuid = ref<string | null>(null)   // template toggle
const isSavingOrder = ref(false)

// ─── Computed ─────────────────────────────────────────────────────────
const activeCat = computed(() => categories.value.find(c => c.slug === activeSlug.value))

const categoryTemplates = computed(() =>
  [...templates.value]
    .filter(t => t.category === activeSlug.value)
    .sort((a, b) => a.sort_order - b.sort_order)
)

// ─── Init ─────────────────────────────────────────────────────────────
async function load() {
  isLoading.value = true
  try {
    const [cats, tmpl] = await Promise.all([
      adminService.getCategories(),
      adminService.getTemplates(),
    ])
    categories.value = cats.sort((a, b) => a.sort_order - b.sort_order)
    templates.value = tmpl
    if (cats.length > 0) activeSlug.value = cats[0].slug
  } finally {
    isLoading.value = false
  }
}
load()

// ─── Category toggle ──────────────────────────────────────────────────
async function toggleCategory(cat: AdminCategory) {
  updatingSlug.value = cat.slug
  try {
    const result = await adminService.toggleCategory(cat.slug)
    cat.is_active = result.is_active
    ui.toast.success(result.is_active ? `Đã hiển thị danh mục "${cat.name}"` : `Đã ẩn danh mục "${cat.name}"`)
  } catch {
    ui.toast.error('Cập nhật thất bại')
  } finally {
    updatingSlug.value = null
  }
}

// ─── Template toggle ──────────────────────────────────────────────────
async function toggleTemplate(template: AdminTemplate) {
  updatingUuid.value = template.uuid
  try {
    await adminService.updateTemplate(template.uuid, { is_active: !template.is_active })
    const t = templates.value.find(x => x.uuid === template.uuid)
    if (t) {
      t.is_active = !t.is_active
      // sync category count
      const cat = categories.value.find(c => c.slug === t.category)
      if (cat) cat.active_templates += t.is_active ? 1 : -1
    }
    ui.toast.success(template.is_active ? 'Đã ẩn template' : 'Đã hiển thị template')
  } catch {
    ui.toast.error('Cập nhật thất bại')
  } finally {
    updatingUuid.value = null
  }
}

// ─── Drag-and-drop reorder templates ──────────────────────────────────
const dragIndex = ref<number | null>(null)

function onDragStart(index: number) {
  dragIndex.value = index
}

function onDragOver(e: DragEvent, index: number) {
  e.preventDefault()
  if (dragIndex.value === null || dragIndex.value === index) return

  const list = categoryTemplates.value
  const movedUuid = list[dragIndex.value].uuid

  const newOrder = [...list]
  newOrder.splice(dragIndex.value, 1)
  newOrder.splice(index, 0, list[dragIndex.value])

  newOrder.forEach((t, i) => {
    const item = templates.value.find(x => x.uuid === t.uuid)
    if (item) item.sort_order = i
  })

  // Also fix the sort_order of the moved item itself
  const moved = templates.value.find(x => x.uuid === movedUuid)
  if (moved) moved.sort_order = index

  dragIndex.value = index
}

async function onDragEnd() {
  dragIndex.value = null
  await saveTemplateOrder()
}

async function saveTemplateOrder() {
  isSavingOrder.value = true
  try {
    const items = categoryTemplates.value.map((t, i) => ({ uuid: t.uuid, sort_order: i }))
    await adminService.reorderTemplates(items)
  } catch {
    ui.toast.error('Lưu thứ tự thất bại')
  } finally {
    isSavingOrder.value = false
  }
}

// ─── Reset drag khi đổi tab ───────────────────────────────────────────
watch(activeSlug, () => { dragIndex.value = null })
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto max-w-6xl px-4 py-8 sm:px-6">

      <!-- Header -->
      <div class="mb-6 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Hiển thị cho người dùng</h1>
          <p class="mt-1 text-sm text-gray-500">
            Bật/tắt từng danh mục và sắp xếp thứ tự template hiển thị
          </p>
        </div>
        <button
          class="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          @click="router.push({ name: 'AdminTemplates' })"
        >
          Quản lý tất cả →
        </button>
      </div>

      <!-- Loading -->
      <div v-if="isLoading" class="flex justify-center py-20">
        <AppSpinner class="h-8 w-8 text-indigo-600" />
      </div>

      <template v-else>

        <!-- ── Phần 1: Quản lý danh mục ─────────────────────────── -->
        <div class="mb-6 rounded-2xl border border-gray-200 bg-white p-5">
          <h2 class="mb-4 text-sm font-semibold text-gray-700">Danh mục hiển thị cho người dùng</h2>
          <div class="flex flex-wrap gap-3">
            <div
              v-for="cat in categories"
              :key="cat.slug"
              class="flex items-center gap-2.5 rounded-xl border px-3 py-2 transition-colors"
              :class="cat.is_active ? 'border-indigo-200 bg-indigo-50' : 'border-gray-200 bg-gray-50'"
            >
              <!-- Toggle -->
              <button
                class="relative flex-shrink-0"
                :disabled="updatingSlug === cat.slug"
                @click="toggleCategory(cat)"
              >
                <AppSpinner v-if="updatingSlug === cat.slug" class="h-4 w-4 text-indigo-500" />
                <div v-else class="relative">
                  <div
                    class="h-5 w-9 rounded-full transition-colors"
                    :class="cat.is_active ? 'bg-indigo-500' : 'bg-gray-300'"
                  />
                  <div
                    class="absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform"
                    :class="cat.is_active ? 'translate-x-4.5' : 'translate-x-0.5'"
                  />
                </div>
              </button>

              <!-- Label -->
              <button
                class="text-sm font-medium transition-colors"
                :class="cat.is_active ? 'text-indigo-700' : 'text-gray-400'"
                @click="activeSlug = cat.slug"
              >
                {{ cat.name }}
              </button>

              <!-- Count badge -->
              <span
                class="rounded-full px-1.5 py-0.5 text-xs font-medium"
                :class="cat.is_active ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-400'"
              >
                {{ cat.active_templates }}/{{ cat.total_templates }}
              </span>
            </div>
          </div>
          <p class="mt-3 text-xs text-gray-400">
            Tắt danh mục → toàn bộ template trong danh mục đó ẩn khỏi trang chọn mẫu thiệp của user
          </p>
        </div>

        <!-- ── Phần 2: Tabs chọn danh mục để quản lý template ──── -->
        <div class="mb-4 flex gap-2 overflow-x-auto pb-1">
          <button
            v-for="cat in categories"
            :key="cat.slug"
            class="flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all"
            :class="activeSlug === cat.slug
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300'"
            @click="activeSlug = cat.slug"
          >
            <span :class="!cat.is_active ? 'opacity-50' : ''">{{ cat.name }}</span>
            <span
              v-if="!cat.is_active"
              class="rounded-full bg-red-100 px-1.5 py-0.5 text-xs font-semibold text-red-500"
            >ẩn</span>
            <span
              v-else
              class="rounded-full px-1.5 py-0.5 text-xs font-semibold"
              :class="activeSlug === cat.slug ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'"
            >
              {{ cat.active_templates }}/{{ cat.total_templates }}
            </span>
          </button>
        </div>

        <!-- Info bar -->
        <div v-if="activeCat" class="mb-4 flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-2.5">
          <div class="flex items-center gap-2">
            <span
              class="rounded-full px-2.5 py-0.5 text-xs font-semibold"
              :class="CATEGORY_COLORS[activeCat.slug] ?? 'bg-gray-100 text-gray-600'"
            >
              {{ activeCat.name }}
            </span>
            <span class="text-sm text-gray-500">
              {{ activeCat.active_templates }} hiển thị / {{ activeCat.total_templates }} tổng
            </span>
            <span
              v-if="!activeCat.is_active"
              class="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-600"
            >
              Danh mục đang ẩn với user
            </span>
          </div>
          <div class="flex items-center gap-1.5 text-xs text-gray-400">
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            Kéo thả để sắp xếp
            <AppSpinner v-if="isSavingOrder" class="h-3 w-3 text-indigo-500" />
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-if="categoryTemplates.length === 0"
          class="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 py-16 text-center"
        >
          <p class="text-4xl">🎨</p>
          <p class="mt-3 text-sm font-medium text-gray-500">Chưa có template nào trong danh mục này</p>
          <button
            class="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            @click="router.push({ name: 'AdminTemplates' })"
          >
            Tạo template mới
          </button>
        </div>

        <!-- Template cards (draggable) -->
        <div v-else class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          <div
            v-for="(template, index) in categoryTemplates"
            :key="template.uuid"
            draggable="true"
            class="group relative cursor-grab rounded-xl border bg-white shadow-sm transition-all duration-150 select-none"
            :class="[
              dragIndex === index
                ? 'scale-95 opacity-60 border-indigo-300 ring-2 ring-indigo-200'
                : 'border-gray-200 hover:border-indigo-200 hover:shadow-md',
              !template.is_active ? 'opacity-50' : '',
            ]"
            @dragstart="onDragStart(index)"
            @dragover="onDragOver($event, index)"
            @dragend="onDragEnd"
          >
            <!-- Sort order badge -->
            <div class="absolute left-2 top-2 z-10">
              <span class="flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-xs font-bold text-white">
                {{ index + 1 }}
              </span>
            </div>

            <!-- Thumbnail -->
            <div class="relative aspect-[3/4] overflow-hidden rounded-t-xl bg-gray-100">
              <img
                v-if="template.thumbnail_url"
                :src="template.thumbnail_url"
                :alt="template.name"
                class="h-full w-full object-cover"
                loading="lazy"
              />
              <div v-else class="flex h-full items-center justify-center text-4xl text-gray-300">🖼️</div>

              <!-- Pro badge -->
              <div v-if="template.plan_required === 'pro'" class="absolute right-2 top-2">
                <span class="rounded-full bg-amber-500 px-2 py-0.5 text-xs font-bold text-white">PRO</span>
              </div>

              <!-- Inactive overlay -->
              <div v-if="!template.is_active" class="absolute inset-0 flex items-center justify-center bg-white/70 rounded-t-xl">
                <span class="rounded-full bg-gray-600 px-2 py-0.5 text-xs font-medium text-white">Đang ẩn</span>
              </div>
            </div>

            <!-- Info -->
            <div class="px-2.5 pt-2">
              <p class="truncate text-xs font-semibold text-gray-800">{{ template.name }}</p>
              <p class="mt-0.5 text-xs text-gray-400">{{ template.use_count }} lượt dùng</p>
            </div>

            <!-- Actions -->
            <div class="flex items-center gap-1 border-t border-gray-100 px-2.5 py-2 mt-2">
              <button
                class="flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-medium transition-colors"
                :class="template.is_active
                  ? 'bg-green-50 text-green-700 hover:bg-red-50 hover:text-red-600'
                  : 'bg-gray-100 text-gray-500 hover:bg-green-50 hover:text-green-700'"
                :disabled="updatingUuid === template.uuid"
                @click.stop="toggleTemplate(template)"
              >
                <AppSpinner v-if="updatingUuid === template.uuid" class="h-3 w-3" />
                <span v-else>{{ template.is_active ? '👁 Hiện' : '🚫 Ẩn' }}</span>
              </button>

              <button
                class="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-indigo-50 hover:text-indigo-600"
                title="Chỉnh sửa"
                @click.stop="router.push({ name: 'AdminTemplateEditor', params: { uuid: template.uuid } })"
              >
                <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

      </template>
    </div>
  </div>
</template>
