<script setup lang="ts">
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const { user, isLoggedIn } = storeToRefs(authStore)
const mobileMenuOpen = ref(false)

const isActive = (path: string) => route.path.startsWith(path)

function closeMobileMenu() {
  mobileMenuOpen.value = false
}
</script>

<template>
  <nav class="sticky top-0 z-40 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2.5" @click="closeMobileMenu">
        <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-sm shadow-indigo-200">
          <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <span class="text-lg font-extrabold tracking-tight text-gray-900">
          Invite<span class="text-indigo-600">Verse</span>
        </span>
      </RouterLink>

      <!-- Desktop nav links -->
      <div class="hidden items-center gap-1 sm:flex">
        <RouterLink
          to="/app/templates"
          class="rounded-xl px-3.5 py-2 text-sm font-medium transition-colors"
          :class="isActive('/app/templates') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
        >
          Mẫu thiệp
        </RouterLink>
        <RouterLink
          v-if="isLoggedIn"
          to="/app/invitations"
          class="rounded-xl px-3.5 py-2 text-sm font-medium transition-colors"
          :class="isActive('/app/invitations') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
        >
          Thiệp của tôi
        </RouterLink>
      </div>

      <!-- Desktop auth -->
      <div class="hidden items-center gap-2 sm:flex">
        <template v-if="isLoggedIn">
          <RouterLink
            to="/profile"
            class="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
          >
            <div class="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
              {{ (user?.display_name || user?.email || 'U')[0]?.toUpperCase() }}
            </div>
            <span class="hidden lg:inline">{{ user?.display_name || user?.email }}</span>
          </RouterLink>
        </template>
        <template v-else>
          <RouterLink
            to="/login"
            class="rounded-xl px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
          >
            Đăng nhập
          </RouterLink>
          <RouterLink
            to="/register"
            class="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm shadow-indigo-200 transition-all hover:-translate-y-px hover:shadow-md"
          >
            Bắt đầu miễn phí
          </RouterLink>
        </template>
      </div>

      <!-- Mobile hamburger -->
      <button
        class="flex h-9 w-9 items-center justify-center rounded-xl text-gray-600 hover:bg-gray-100 sm:hidden"
        @click="mobileMenuOpen = !mobileMenuOpen"
      >
        <svg v-if="!mobileMenuOpen" class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Mobile menu -->
    <Transition name="mobile-menu">
      <div v-if="mobileMenuOpen" class="border-t border-gray-100 bg-white px-4 py-4 sm:hidden">
        <div class="flex flex-col gap-1">
          <RouterLink
            to="/app/templates"
            class="rounded-xl px-4 py-3 text-sm font-medium transition-colors"
            :class="isActive('/app/templates') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'"
            @click="closeMobileMenu"
          >
            🎨 &nbsp;Mẫu thiệp
          </RouterLink>
          <RouterLink
            v-if="isLoggedIn"
            to="/app/invitations"
            class="rounded-xl px-4 py-3 text-sm font-medium transition-colors"
            :class="isActive('/app/invitations') ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-50'"
            @click="closeMobileMenu"
          >
            💌 &nbsp;Thiệp của tôi
          </RouterLink>
          <RouterLink
            v-if="isLoggedIn"
            to="/profile"
            class="rounded-xl px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            @click="closeMobileMenu"
          >
            👤 &nbsp;{{ user?.display_name || user?.email }}
          </RouterLink>

          <div v-if="!isLoggedIn" class="mt-3 flex flex-col gap-2 border-t border-gray-100 pt-3">
            <RouterLink
              to="/login"
              class="rounded-xl border border-gray-200 px-4 py-3 text-center text-sm font-semibold text-gray-700 hover:bg-gray-50"
              @click="closeMobileMenu"
            >
              Đăng nhập
            </RouterLink>
            <RouterLink
              to="/register"
              class="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-center text-sm font-bold text-white"
              @click="closeMobileMenu"
            >
              Bắt đầu miễn phí →
            </RouterLink>
          </div>
        </div>
      </div>
    </Transition>
  </nav>
</template>

<style scoped>
.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: all 0.2s ease;
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
