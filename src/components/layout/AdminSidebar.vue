<script setup lang="ts">
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authService } from '@/services/auth.service'
const auth = useAuthStore()
const router = useRouter()

const navItems = [
  { icon: '📊', label: 'Tổng quan',   name: 'AdminDashboard' },
  { icon: '👥', label: 'Người dùng',  name: 'AdminUsers' },
  { icon: '💌', label: 'Quản lý thiệp', name: 'AdminInvitations' },
  { icon: '🌐', label: 'Quản lý IP & Log', name: 'AdminIpLogs' },
  { icon: '🎨', label: 'Templates',        name: 'AdminTemplates' },
  { icon: '📂', label: 'Hiển thị user',   name: 'AdminCategories' },
  { icon: '🎵', label: 'Quản lý nhạc',   name: 'AdminMusic' },
  { icon: '🤖', label: 'Mô hình AI',  name: 'AdminAIModels' },
]

async function logout() {
  try {
    await authService.logout()
  } catch {
    // ignore
  } finally {
    auth.clearUser()
    router.push('/')
  }
}
</script>

<template>
  <aside class="w-64 bg-white border-r border-gray-200 h-screen fixed top-0 left-0 flex flex-col z-40">
    <!-- Header -->
    <div class="px-5 py-6 border-b border-gray-200">
      <RouterLink :to="{ name: 'Home' }" class="flex items-center gap-2">
        <span class="font-semibold text-xl text-indigo-600">InviteVerse</span>
      </RouterLink>
      <p class="text-xs text-gray-500 mt-1">Trang quản trị</p>
    </div>

    <!-- Nav -->
    <nav class="flex-1 py-4 overflow-y-auto">
      <ul class="space-y-1">
        <li v-for="item in navItems" :key="item.name">
          <RouterLink
            :to="{ name: item.name }"
            class="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl mx-2 transition-all"
            :class="{ 'bg-indigo-50 !text-indigo-700 border-l-2 border-indigo-500': $route.name === item.name }"
          >
            <span class="text-lg leading-none">{{ item.icon }}</span>
            <span class="text-sm font-medium">{{ item.label }}</span>
          </RouterLink>
        </li>
      </ul>
    </nav>

    <!-- Bottom: user info + logout -->
    <div class="p-4 border-t border-gray-200">
      <div class="flex items-center gap-3 mb-3 px-2">
        <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-sm font-bold">
          {{ auth.user?.full_name?.charAt(0)?.toUpperCase() ?? 'A' }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-xs font-medium text-gray-900 truncate">{{ auth.user?.full_name }}</p>
          <p class="text-xs text-gray-500 truncate">{{ auth.user?.email }}</p>
        </div>
      </div>
      <button
        class="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
        @click="logout"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Đăng xuất
      </button>
    </div>
  </aside>
</template>
