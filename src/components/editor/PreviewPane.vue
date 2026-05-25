<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useEditorStore } from '@/stores/editor.store'
import InvitationRenderer from './InvitationRenderer.vue'

const editorStore = useEditorStore()
const { previewMode, enabledSections, themeConfig } = storeToRefs(editorStore)

const widths = { mobile: '375px', desktop: '100%' }
</script>

<template>
  <div class="flex flex-col items-center bg-gray-100 min-h-full">
    <!-- Device toggle bar (Ẩn trên mobile) -->
    <div class="sticky top-0 z-10 hidden sm:flex w-full items-center justify-center gap-2 border-b border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-2.5">
      <button
        v-for="mode in (['mobile', 'desktop'] as const)"
        :key="mode"
        class="rounded-lg px-4 py-2 text-sm font-medium transition-all"
        :class="previewMode === mode
          ? 'bg-rose-50 text-rose-600 shadow-sm'
          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'"
        @click="editorStore.previewMode = mode"
      >
        {{ mode === 'mobile' ? '📱 Mobile' : '🖥️ Desktop' }}
      </button>
    </div>

    <!-- Preview container -->
    <div class="flex-1 w-full flex justify-center p-4 sm:p-6">
      <div
        class="overflow-hidden rounded-2xl shadow-2xl transition-all duration-300 bg-white w-full"
        :style="{
          maxWidth: previewMode === 'mobile' ? '375px' : '100%',
          minHeight: '600px',
          transform: 'translateZ(0)',
        }"
      >
        <InvitationRenderer
          :sections="enabledSections"
          :theme="themeConfig"
        />
      </div>
    </div>
  </div>
</template>
