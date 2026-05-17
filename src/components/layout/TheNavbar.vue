<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const { user, isLoggedIn } = storeToRefs(authStore)

const isActive = (path: string) => route.path.startsWith(path)
</script>

<template>
  <nav class="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur-sm">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2">
        <span class="text-xl font-bold text-indigo-600">InviteVerse</span>
      </RouterLink>

      <!-- Nav links -->
      <div class="hidden items-center gap-1 sm:flex">
        <RouterLink
          to="/app/templates"
          class="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          :class="isActive('/app/templates') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'"
        >
          Mẫu thiệp
        </RouterLink>
        <RouterLink
          v-if="isLoggedIn"
          to="/app/invitations"
          class="rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          :class="isActive('/app/invitations') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'"
        >
          Thiệp của tôi
        </RouterLink>
      </div>

      <!-- Auth -->
      <div class="flex items-center gap-2">
        <template v-if="isLoggedIn">
          <RouterLink
            to="/profile"
            class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            <span class="hidden sm:inline">{{ user?.display_name || user?.email }}</span>
          </RouterLink>
        </template>
        <template v-else>
          <RouterLink
            to="/login"
            class="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            Đăng nhập
          </RouterLink>
          <RouterLink
            to="/register"
            class="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Bắt đầu miễn phí
          </RouterLink>
        </template>
      </div>
    </div>
  </nav>
</template>
