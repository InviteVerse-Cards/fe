<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  title: string
  icon?: string
  isEnabled?: boolean
  collapsible?: boolean
  defaultOpen?: boolean
}>(), {
  icon: '',
  isEnabled: true,
  collapsible: true,
  defaultOpen: false,
})

const emit = defineEmits<{
  (e: 'toggle-enabled', value: boolean): void
}>()

const isOpen = ref(props.defaultOpen)

function togglePanel() {
  if (props.collapsible) {
    isOpen.value = !isOpen.value
  }
}
</script>

<template>
  <div class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
    <!-- Header -->
    <div
      class="flex cursor-pointer items-center justify-between px-5 py-4 select-none"
      @click="togglePanel"
    >
      <div class="flex items-center gap-3">
        <!-- Collapse arrow -->
        <svg
          v-if="collapsible"
          class="h-4 w-4 text-gray-400 transition-transform duration-200"
          :class="{ 'rotate-90': isOpen }"
          fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
        </svg>

        <!-- Icon -->
        <span v-if="icon" class="text-lg">{{ icon }}</span>

        <!-- Title -->
        <h3 class="text-sm font-semibold text-gray-800">{{ title }}</h3>
      </div>

      <!-- Enabled toggle -->
      <div class="flex items-center gap-2" @click.stop>
        <span class="text-xs text-gray-400">{{ isEnabled ? 'Hiện' : 'Ẩn' }}</span>
        <button
          class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none"
          :class="isEnabled ? 'bg-rose-500' : 'bg-gray-300'"
          @click="emit('toggle-enabled', !isEnabled)"
        >
          <span
            class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200"
            :class="isEnabled ? 'translate-x-5' : 'translate-x-0'"
          />
        </button>
      </div>
    </div>

    <!-- Body (collapsible) -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="max-h-0 opacity-0"
      enter-to-class="max-h-[2000px] opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="max-h-[2000px] opacity-100"
      leave-to-class="max-h-0 opacity-0"
    >
      <div v-show="isOpen" class="overflow-hidden">
        <div class="border-t border-gray-100 px-5 py-5">
          <slot />
        </div>
      </div>
    </Transition>
  </div>
</template>
