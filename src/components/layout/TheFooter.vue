<template>
  <footer class="border-t border-gray-100 bg-white">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

      <!-- Top section: Brand + Links -->
      <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

        <!-- Brand -->
        <div class="lg:col-span-2">
          <div class="flex items-center gap-2.5">
            <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600">
              <svg class="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span class="text-lg font-extrabold tracking-tight text-gray-900">
              Invite<span class="text-indigo-600">Verse</span>
            </span>
          </div>
          <p class="mt-4 max-w-sm text-sm leading-relaxed text-gray-500">
            Nền tảng tạo thiệp cưới, thiệp sinh nhật online đẹp nhất Việt Nam.
            Chia sẻ qua Zalo, Facebook — không cần cài app.
          </p>
          <div class="mt-5 flex gap-0.5 text-amber-400 text-sm">
            <span v-for="i in 5" :key="i">★</span>
            <span class="ml-2 text-xs text-gray-500">4.9/5 từ 1,200+ đánh giá</span>
          </div>
        </div>

        <!-- Links: Sản phẩm -->
        <div>
          <h4 class="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">Sản phẩm</h4>
          <ul class="space-y-3">
            <li v-for="link in productLinks" :key="link.label">
              <RouterLink :to="link.to" class="text-sm text-gray-600 transition-colors hover:text-indigo-600">
                {{ link.label }}
              </RouterLink>
            </li>
          </ul>
        </div>

        <!-- Links: Hỗ trợ -->
        <div>
          <h4 class="mb-4 text-xs font-bold uppercase tracking-widest text-gray-400">Hỗ trợ</h4>
          <ul class="space-y-3">
            <li v-for="link in supportLinks" :key="link.label">
              <a :href="link.href" class="text-sm text-gray-600 transition-colors hover:text-indigo-600">
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Divider -->
      <div class="mt-10 border-t border-gray-100 pt-6">
        <div class="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p class="text-xs text-gray-400">© {{ new Date().getFullYear() }} InviteVerse. All rights reserved.</p>
          <div class="flex items-center gap-1 text-xs text-gray-400">
            <span>Made with</span>
            <span class="text-rose-400">♥</span>
            <span>for Vietnam</span>
          </div>
        </div>
      </div>

    </div>
  </footer>
</template>

<script setup lang="ts">
const productLinks = [
  { label: 'Mẫu thiệp cưới', to: '/app/templates' },
  { label: 'Mẫu sinh nhật', to: '/app/templates' },
  { label: 'Tạo thiệp mới', to: '/app/templates' },
  { label: 'Thiệp của tôi', to: '/app/invitations' },
]

const supportLinks = [
  { label: 'Điều khoản sử dụng', href: '#' },
  { label: 'Chính sách bảo mật', href: '#' },
  { label: 'Liên hệ hỗ trợ', href: '#' },
  { label: 'Câu hỏi thường gặp', href: '#' },
]
</script>
