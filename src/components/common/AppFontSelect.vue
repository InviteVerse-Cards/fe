<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { loadGoogleFont } from '@/utils/fontLoader'

interface FontOption {
  label: string
  value: string
}

const props = withDefaults(
  defineProps<{
    modelValue: string
    options: (string | FontOption)[]
    placeholder?: string
    demoText?: string
    buttonClass?: string
  }>(),
  {
    placeholder: 'Chọn font chữ...',
    demoText: 'Thương nhau trọn đời',
    buttonClass: 'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400'
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'change', value: string): void
}>()

const isOpen = ref(false)
const searchQuery = ref('')
const dropdownRef = ref<HTMLElement | null>(null)

// Chuẩn hóa danh sách tùy chọn font thành mảng { label, value }
const normalizedOptions = computed<FontOption[]>(() => {
  return props.options.map((opt) => {
    if (typeof opt === 'string') {
      return { label: opt, value: opt }
    }
    return opt
  })
})

// Bộ lọc tìm kiếm font chữ
const filteredOptions = computed(() => {
  if (!searchQuery.value.trim()) return normalizedOptions.value
  const query = searchQuery.value.toLowerCase()
  return normalizedOptions.value.filter(
    (opt) =>
      opt.label.toLowerCase().includes(query) ||
      opt.value.toLowerCase().includes(query)
  )
})

// Lựa chọn hiện tại
const selectedItem = computed(() => {
  return normalizedOptions.value.find((opt) => opt.value === props.modelValue)
})

function toggleDropdown() {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    searchQuery.value = ''
  }
}

function selectOption(value: string) {
  emit('update:modelValue', value)
  emit('change', value)
  isOpen.value = false
}

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  
  // Tải trước các font chữ để đảm bảo hiển thị đúng giao diện demo ngay từ đầu
  normalizedOptions.value.forEach((opt) => {
    if (opt.value) {
      loadGoogleFont(opt.value)
    }
  })
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div ref="dropdownRef" class="relative w-full">
    <!-- Nút Trigger điều hướng mở/đóng dropdown -->
    <button
      type="button"
      @click="toggleDropdown"
      :class="[
        'flex items-center justify-between cursor-pointer transition-colors text-left',
        buttonClass
      ]"
    >
      <span :style="{ fontFamily: modelValue || 'inherit' }" class="truncate">
        {{ selectedItem?.label || placeholder }}
      </span>
      <svg
        class="h-4 w-4 text-gray-400 transition-transform duration-200 flex-shrink-0 ml-2"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="2"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Khung Danh sách Options Dropdown -->
    <div
      v-if="isOpen"
      class="absolute left-0 mt-1 z-[9999] w-full min-w-[240px] rounded-xl bg-white border border-gray-200 shadow-2xl overflow-hidden focus:outline-none"
    >
      <!-- Ô tìm kiếm bộ lọc nhanh font chữ -->
      <div v-if="normalizedOptions.length > 5" class="border-b border-gray-100 p-2 bg-gray-50/50">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm font chữ..."
            class="w-full rounded-lg border border-gray-200 bg-white pl-8 pr-3 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
            @click.stop
          />
          <span class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400">
            <svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <button
            v-if="searchQuery"
            @click.stop="searchQuery = ''"
            type="button"
            class="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            ✕
          </button>
        </div>
      </div>

      <!-- Danh sách font hiển thị kèm Demo cụ thể -->
      <ul class="max-h-64 overflow-y-auto divide-y divide-gray-50 py-1">
        <li v-if="filteredOptions.length === 0" class="px-4 py-3 text-center text-xs text-gray-400 font-sans">
          Không tìm thấy font chữ nào
        </li>
        <li
          v-for="opt in filteredOptions"
          :key="opt.value"
          @click="selectOption(opt.value)"
          :class="[
            'px-4 py-2.5 cursor-pointer flex flex-col items-start transition-colors',
            modelValue === opt.value
              ? 'bg-indigo-50/70 hover:bg-indigo-50'
              : 'hover:bg-gray-50'
          ]"
        >
          <div class="flex items-center justify-between w-full">
            <span class="text-[11px] font-medium text-gray-400 font-sans">
              {{ opt.label }}
            </span>
            <span v-if="modelValue === opt.value" class="text-indigo-600">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
          </div>
          
          <!-- Đoạn demo text thể hiện chính xác font chữ và dấu tiếng Việt -->
          <div
            :style="{ fontFamily: opt.value || 'inherit' }"
            class="text-[15px] text-gray-800 mt-1 leading-normal w-full truncate"
          >
            <template v-if="opt.value">
              {{ demoText }}
            </template>
            <template v-else>
              Mặc định của giao diện
            </template>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
