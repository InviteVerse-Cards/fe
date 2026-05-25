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
import type { InvitationCategory } from '@/types/invitation.types'
import type { Template } from '@/types/template.types'

const CATEGORY_ICONS: Record<string, string> = {
  wedding:      '💍',
  birthday:     '🎂',
  baby_shower:  '🍼',
  housewarming: '🏠',
  house_warming:'🏠',
  corporate:    '🏢',
}

const router = useRouter()

const { data: apiCategories } = useQuery({
  queryKey: ['template-categories'],
  queryFn: getActiveCategories,
  staleTime: 60_000,
})

const selectedCategory = ref<string>('wedding')
const { data: templates, isPending } = useTemplates(selectedCategory)
const { mutate: createInvitation, isPending: isCreating } = useCreateInvitation()

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
    { title: `Thiệp - ${new Date().toLocaleDateString('vi-VN')}`, category: (selectedCategory.value || 'wedding') as InvitationCategory },
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

    <!-- ── PAGE HEADER ─────────────────────────────────────────────── -->
    <div class="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 px-4 py-14 sm:py-16">
      <!-- Dot grid overlay -->
      <div class="pointer-events-none absolute inset-0 opacity-10"
        style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 28px 28px;" />
      <!-- Orb decorations -->
      <div class="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white opacity-5 blur-3xl" />
      <div class="pointer-events-none absolute -bottom-10 left-1/3 h-48 w-48 rounded-full bg-rose-400 opacity-10 blur-2xl" />

      <div class="relative z-10 mx-auto max-w-4xl text-center">
        <span class="inline-block rounded-full border border-white/25 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm">
          Thư viện mẫu thiệp
        </span>
        <h1 class="mt-4 text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
          Chọn mẫu thiệp của bạn
        </h1>
        <p class="mx-auto mt-3 max-w-xl text-base text-indigo-100/75">
          Bắt đầu từ mẫu có sẵn hoặc tự thiết kế từ đầu.
          Hàng chục mẫu đẹp được tạo ra bởi designer chuyên nghiệp.
        </p>
      </div>
    </div>

    <!-- ── CATEGORY FILTER ─────────────────────────────────────────── -->
    <div class="sticky top-[57px] z-30 bg-white/95 shadow-sm backdrop-blur-sm">
      <div class="mx-auto max-w-7xl overflow-x-auto px-4 py-3 sm:px-6">
        <div class="flex gap-2 sm:justify-center">
          <button
            v-for="cat in (apiCategories ?? [])"
            :key="cat.slug"
            class="flex-shrink-0 inline-flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200"
            :class="selectedCategory === cat.slug
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'"
            @click="selectedCategory = cat.slug"
          >
            <span class="text-base leading-none">{{ CATEGORY_ICONS[cat.slug] ?? '' }}</span>
            {{ cat.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- ── TEMPLATE GRID ────────────────────────────────────────────── -->
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6">

      <!-- Loading -->
      <div v-if="isPending" class="flex justify-center py-20">
        <AppSpinner class="h-10 w-10 text-indigo-600" />
      </div>

      <template v-else>
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

          <!-- Blank card -->
          <div v-if="selectedCategory === 'wedding'" class="flex flex-col">
            <button
              class="group relative aspect-[3/5] cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed border-gray-200 bg-white transition-all duration-300 hover:border-indigo-400 hover:shadow-lg hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="isCreating"
              @click="handleBlankInvitation"
            >
              <div class="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
                <div class="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-2xl transition-all duration-300 group-hover:bg-indigo-100 group-hover:scale-110">
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

        <!-- Empty state -->
        <div v-if="!templates?.length" class="mt-12 rounded-3xl border border-dashed border-gray-200 bg-white py-16 text-center">
          <p class="text-5xl">🎨</p>
          <p class="mt-4 font-semibold text-gray-700">Chưa có mẫu nào trong danh mục này</p>
          <p class="mt-2 text-sm text-gray-400">Hãy thử danh mục khác hoặc tạo thiệp từ đầu</p>
          <button
            class="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            @click="handleBlankInvitation"
          >
            Tạo thiệp trống
          </button>
        </div>
      </template>

    </div>
  </div>
</template>
