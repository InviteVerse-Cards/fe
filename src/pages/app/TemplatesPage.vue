<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuery } from '@tanstack/vue-query'
import { useTemplates } from '@/composables/useTemplate'
import { useCreateInvitation } from '@/composables/useInvitation'
import TemplateCard from '@/components/template/TemplateCard.vue'
import AppSpinner from '@/components/common/AppSpinner.vue'
import { CATEGORY_LABELS } from '@/constants/categorySections'
import { getActiveCategories } from '@/services/template.service'
import type { Template } from '@/types/template.types'

const CATEGORY_ICONS: Record<string, string> = {
  wedding:     '💍',
  birthday:    '🎂',
  baby_shower: '🍼',
  housewarming:'🏠',
  house_warming:'🏠',
  corporate:   '🏢',
}

const router = useRouter()

// Fetch active categories từ API (admin điều khiển)
const { data: apiCategories } = useQuery({
  queryKey: ['template-categories'],
  queryFn: getActiveCategories,
  staleTime: 60_000,
})

const selectedCategory = ref<string>('wedding')
const { data: templates, isPending } = useTemplates(selectedCategory)
const { mutate: createInvitation, isPending: isCreating } = useCreateInvitation()

// Khi categories load xong, chọn cái đầu tiên
watch(apiCategories, (cats) => {
  if (cats && cats.length > 0 && !cats.find(c => c.slug === selectedCategory.value)) {
    selectedCategory.value = cats[0].slug
  }
}, { immediate: true })

function handleSelectTemplate(template: Template) {
  const label = CATEGORY_LABELS[template.category] ?? 'Thiệp'
  createInvitation(
    { template_id: template.id, title: `${label} - ${new Date().toLocaleDateString('vi-VN')}`, category: template.category },
    {
      onSuccess: (invitation) => {
        router.push({ name: 'Editor', params: { uuid: invitation.uuid } })
      },
    }
  )
}

function handlePreviewTemplate(template: Template) {
  router.push(`/templates/${template.slug}`)
}

function handleBlankInvitation() {
  createInvitation(
    { title: `Thiệp - ${new Date().toLocaleDateString('vi-VN')}`, category: selectedCategory.value || 'wedding' },
    {
      onSuccess: (invitation) => {
        router.push({ name: 'Editor', params: { uuid: invitation.uuid } })
      },
    }
  )
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6">

      <!-- Header -->
      <div class="mb-10 text-center">
        <h1 class="text-4xl font-bold text-gray-900">Chọn mẫu thiệp</h1>
        <p class="mt-3 text-base text-gray-500">Bắt đầu từ mẫu có sẵn hoặc tự thiết kế từ đầu</p>
      </div>

      <!-- Category filter — từ API, chỉ hiển thị categories admin bật -->
      <div class="mb-8 flex flex-wrap justify-center gap-3">
        <button
          v-for="cat in (apiCategories ?? [])"
          :key="cat.slug"
          class="rounded-full px-6 py-2.5 text-sm font-semibold transition-all"
          :class="selectedCategory === cat.slug
            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
            : 'bg-white text-gray-600 border border-gray-200 hover:border-indigo-300 hover:text-indigo-600'"
          @click="selectedCategory = cat.slug"
        >
          {{ CATEGORY_ICONS[cat.slug] ?? '' }} {{ cat.name }}
        </button>
      </div>

      <!-- Loading -->
      <div v-if="isPending" class="flex justify-center py-20">
        <AppSpinner class="h-10 w-10 text-indigo-600" />
      </div>

      <template v-else>
        <!-- Templates grid -->
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <!-- Blank card -->
          <div class="flex flex-col">
            <button
              class="group relative aspect-[3/5] cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-white transition-all duration-300 hover:border-indigo-400 hover:shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="isCreating"
              @click="handleBlankInvitation"
            >
              <div class="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
                <div class="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl transition-colors group-hover:bg-indigo-100">
                  ✨
                </div>
                <div>
                  <p class="font-semibold text-gray-700 transition-colors group-hover:text-indigo-700">Tạo từ đầu</p>
                  <p class="mt-1 text-xs text-gray-400 group-hover:text-indigo-500">Tự thiết kế theo phong cách riêng</p>
                </div>
              </div>
            </button>
            <div class="mt-2.5 px-0.5">
              <p class="text-sm font-semibold text-gray-800">Thiệp trắng</p>
              <p class="mt-0.5 text-xs text-gray-400">Tự do sáng tạo</p>
            </div>
          </div>

          <!-- Template cards -->
          <TemplateCard
            v-for="template in (templates ?? [])"
            :key="template.id"
            :template="template"
            :is-selecting="isCreating"
            @select="handleSelectTemplate"
            @preview="handlePreviewTemplate"
          />
        </div>

        <div v-if="!templates?.length" class="mt-12 py-8 text-center">
          <p class="text-4xl">🎨</p>
          <p class="mt-3 text-sm text-gray-500">Không có mẫu nào trong danh mục này</p>
        </div>
      </template>

    </div>
  </div>
</template>
