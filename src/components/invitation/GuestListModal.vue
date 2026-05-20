<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGuestList } from '@/composables/useInvitation'
import type { GuestRow } from '@/types/invitation.types'
import AppSpinner from '@/components/common/AppSpinner.vue'

const props = defineProps<{
  modelValue: boolean
  uuid: string
  title: string
}>()

const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

function close() { emit('update:modelValue', false) }

const isOpen = computed(() => props.modelValue)
const uuidRef = computed(() => props.uuid)

const { data: guests, isPending } = useGuestList(uuidRef, isOpen)

const stats = computed(() => {
  const list = guests.value ?? []
  return {
    total: list.length,
    attending: list.filter(g => g.rsvp_status === 'attending').length,
    not_attending: list.filter(g => g.rsvp_status === 'not_attending').length,
    maybe: list.filter(g => g.rsvp_status === 'maybe').length,
  }
})

const STATUS_LABEL: Record<GuestRow['rsvp_status'], string> = {
  attending: 'Sẽ đến',
  not_attending: 'Không đến',
  maybe: 'Chưa rõ',
}
const STATUS_CLS: Record<GuestRow['rsvp_status'], string> = {
  attending: 'bg-green-100 text-green-700',
  not_attending: 'bg-red-100 text-red-600',
  maybe: 'bg-yellow-100 text-yellow-700',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('vi-VN', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

// Search filter
const search = ref('')
const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return guests.value ?? []
  return (guests.value ?? []).filter(g =>
    g.name.toLowerCase().includes(q) ||
    (g.phone ?? '').includes(q) ||
    (g.rsvp_note ?? '').toLowerCase().includes(q)
  )
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="modelValue" class="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto px-4 py-8">
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/50 backdrop-blur-sm" @click="close" />

        <!-- Panel -->
        <div class="relative z-10 w-full max-w-4xl rounded-2xl bg-white shadow-2xl">
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-gray-100 px-6 py-4">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Danh sách khách RSVP</h2>
              <p class="mt-0.5 truncate text-sm text-gray-500">{{ title }}</p>
            </div>
            <button
              class="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              @click="close"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div class="p-6">
            <!-- Loading -->
            <div v-if="isPending" class="flex justify-center py-16">
              <AppSpinner class="h-8 w-8 text-indigo-600" />
            </div>

            <template v-else>
              <!-- Stats -->
              <div class="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div class="rounded-xl bg-gray-50 p-4 text-center">
                  <p class="text-2xl font-bold text-gray-900">{{ stats.total }}</p>
                  <p class="mt-0.5 text-xs text-gray-500">Tổng phản hồi</p>
                </div>
                <div class="rounded-xl bg-green-50 p-4 text-center">
                  <p class="text-2xl font-bold text-green-700">{{ stats.attending }}</p>
                  <p class="mt-0.5 text-xs text-green-600">Sẽ đến</p>
                </div>
                <div class="rounded-xl bg-red-50 p-4 text-center">
                  <p class="text-2xl font-bold text-red-600">{{ stats.not_attending }}</p>
                  <p class="mt-0.5 text-xs text-red-500">Không đến</p>
                </div>
                <div class="rounded-xl bg-yellow-50 p-4 text-center">
                  <p class="text-2xl font-bold text-yellow-700">{{ stats.maybe }}</p>
                  <p class="mt-0.5 text-xs text-yellow-600">Chưa rõ</p>
                </div>
              </div>

              <!-- Empty -->
              <div v-if="stats.total === 0" class="py-16 text-center">
                <p class="text-4xl">📭</p>
                <p class="mt-3 font-medium text-gray-700">Chưa có khách nào xác nhận</p>
                <p class="mt-1 text-sm text-gray-400">Chia sẻ thiệp để nhận phản hồi từ khách mời</p>
              </div>

              <template v-else>
                <!-- Search -->
                <div class="mb-4">
                  <input
                    v-model="search"
                    type="text"
                    placeholder="Tìm theo tên, SĐT, lời nhắn..."
                    class="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  />
                </div>

                <!-- Table (desktop) -->
                <div class="hidden overflow-hidden rounded-xl border border-gray-100 sm:block">
                  <table class="w-full text-sm">
                    <thead class="bg-gray-50">
                      <tr>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Tên</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">SĐT</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Trạng thái</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Lời nhắn</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Thời gian</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-50">
                      <tr v-for="g in filtered" :key="g.id" class="hover:bg-gray-50 transition-colors">
                        <td class="px-4 py-3 font-medium text-gray-900">{{ g.name }}</td>
                        <td class="px-4 py-3 text-gray-500">{{ g.phone || '—' }}</td>
                        <td class="px-4 py-3">
                          <span
                            class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                            :class="STATUS_CLS[g.rsvp_status]"
                          >
                            {{ STATUS_LABEL[g.rsvp_status] }}
                          </span>
                        </td>
                        <td class="max-w-[220px] px-4 py-3 text-gray-500">
                          <span class="line-clamp-2">{{ g.rsvp_note || '—' }}</span>
                        </td>
                        <td class="whitespace-nowrap px-4 py-3 text-xs text-gray-400">{{ formatDate(g.rsvp_at) }}</td>
                      </tr>
                    </tbody>
                  </table>
                  <p v-if="filtered.length === 0" class="py-8 text-center text-sm text-gray-400">
                    Không tìm thấy kết quả
                  </p>
                </div>

                <!-- Cards (mobile) -->
                <div class="space-y-3 sm:hidden">
                  <div
                    v-for="g in filtered"
                    :key="g.id"
                    class="rounded-xl border border-gray-100 p-4"
                  >
                    <div class="flex items-start justify-between gap-2">
                      <p class="font-semibold text-gray-900">{{ g.name }}</p>
                      <span
                        class="shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium"
                        :class="STATUS_CLS[g.rsvp_status]"
                      >
                        {{ STATUS_LABEL[g.rsvp_status] }}
                      </span>
                    </div>
                    <p v-if="g.phone" class="mt-1 text-sm text-gray-500">📞 {{ g.phone }}</p>
                    <p v-if="g.rsvp_note" class="mt-2 text-sm text-gray-600 italic">"{{ g.rsvp_note }}"</p>
                    <p class="mt-2 text-xs text-gray-400">{{ formatDate(g.rsvp_at) }}</p>
                  </div>
                  <p v-if="filtered.length === 0" class="py-4 text-center text-sm text-gray-400">
                    Không tìm thấy kết quả
                  </p>
                </div>
              </template>
            </template>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
