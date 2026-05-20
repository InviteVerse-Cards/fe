<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useTemplates } from '@/composables/useTemplate'

const auth = useAuthStore()
const router = useRouter()
const { data: templates } = useTemplates(ref('wedding'))

const marqueeItems = computed(() => {
  const list = templates.value ?? []
  if (!list.length) return []
  return [
    ...list.map((t, i) => ({ t, k: `a-${i}-${t.id}` })),
    ...list.map((t, i) => ({ t, k: `b-${i}-${t.id}` })),
  ]
})

function goCreate() {
  router.push(auth.isLoggedIn ? { name: 'Templates' } : { name: 'Register' })
}

function goTemplates() {
  router.push({ name: 'Templates' })
}

const trustSignals = [
  { icon: '✓', text: 'Không cần cài đặt' },
  { icon: '✓', text: 'Miễn phí bắt đầu' },
  { icon: '★', text: '4.9/5 đánh giá' },
]

const stats = [
  { value: '1,200+', label: 'Cặp đôi tin tưởng' },
  { value: '50+', label: 'Mẫu thiệp đẹp' },
  { value: '4.9★', label: 'Đánh giá trung bình' },
  { value: '5 phút', label: 'Để tạo xong thiệp' },
]

const stepGradients = [
  'linear-gradient(135deg, #6366f1, #818cf8)',
  'linear-gradient(135deg, #ec4899, #f472b6)',
  'linear-gradient(135deg, #10b981, #34d399)',
]
const stepColors = ['#6366f1', '#ec4899', '#10b981']

const steps = [
  {
    icon: '🎨',
    title: 'Chọn mẫu thiệp',
    desc: 'Hàng chục mẫu cưới, sinh nhật đẹp được thiết kế chuyên nghiệp. Click để xem demo ngay.',
  },
  {
    icon: '✏️',
    title: 'Điền nội dung',
    desc: 'Nhập tên, ngày, địa điểm. AI hỗ trợ gợi ý lời mời đẹp, lãng mạn phù hợp phong cách.',
  },
  {
    icon: '📱',
    title: 'Chia sẻ ngay',
    desc: 'Chia sẻ qua Zalo, Facebook hoặc in QR code. Khách xem thiệp không cần cài app.',
  },
]

const features = [
  {
    icon: '💌',
    bg: 'linear-gradient(135deg, #fce7f3, #fbcfe8)',
    title: 'Mở phong bì animation',
    desc: 'Khách mời thấy hiệu ứng mở phong bì lãng mạn khi xem thiệp lần đầu tiên.',
  },
  {
    icon: '🤖',
    bg: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
    title: 'AI gợi ý lời thiệp',
    desc: 'Trí tuệ nhân tạo viết lời mời đẹp, lãng mạn và phù hợp từng dịp đặc biệt.',
  },
  {
    icon: '✅',
    bg: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
    title: 'RSVP tự động',
    desc: 'Khách xác nhận tham dự online. Bạn nhận thông báo ngay khi có phản hồi.',
  },
  {
    icon: '🔗',
    bg: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
    title: 'Link cá nhân hóa',
    desc: 'Gửi link riêng có tên khách: Kính mời Anh Tuấn — ấm áp và chu đáo hơn.',
  },
  {
    icon: '🏦',
    bg: 'linear-gradient(135deg, #fef9c3, #fde68a)',
    title: 'QR chuyển khoản',
    desc: 'Thêm QR VietQR ngay trong thiệp. Khách mừng cưới tiện lợi không cần nhập số.',
  },
  {
    icon: '⚡',
    bg: 'linear-gradient(135deg, #e0f2fe, #bae6fd)',
    title: 'Nhanh & miễn phí',
    desc: 'Tạo xong thiệp trong 5 phút. Gói miễn phí đủ dùng cho một buổi tiệc.',
  },
]

const reviews = [
  {
    name: 'Nguyễn Thị Hoa',
    role: 'Cô dâu tháng 3/2025',
    color: '#6366f1',
    text: 'Thiệp đẹp hơn mình tưởng! Giao diện dễ dùng, chỉ 10 phút là xong. Khách của mình ai cũng khen.',
  },
  {
    name: 'Trần Văn Nam',
    role: 'Chú rể tháng 4/2025',
    color: '#e11d48',
    text: 'Hiệu ứng mở phong bì rất ấn tượng. Khách mời ai cũng hỏi làm thiệp ở đâu vậy!',
  },
  {
    name: 'Lê Thị Mai',
    role: 'Tổ chức tiệc sinh nhật',
    color: '#0284c7',
    text: 'Chia sẻ qua Zalo tiện cực kỳ. Không cần in thiệp, tiết kiệm chi phí mà vẫn chuyên nghiệp.',
  },
]
</script>

<template>
  <div class="overflow-x-hidden">

    <!-- ── HERO ─────────────────────────────────────────────────────── -->
    <section class="relative flex min-h-[92vh] items-center overflow-hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 px-4 py-20 sm:py-28">
      <!-- Mesh orbs -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden">
        <div class="absolute -left-48 -top-48 h-[700px] w-[700px] rounded-full bg-indigo-600 opacity-20 blur-[130px]" />
        <div class="absolute -right-32 bottom-0 h-[500px] w-[500px] rounded-full bg-violet-600 opacity-25 blur-[100px]" />
        <div class="absolute left-1/2 top-1/4 h-[350px] w-[350px] -translate-x-1/2 rounded-full bg-rose-500 opacity-10 blur-[80px]" />
      </div>

      <!-- Subtle dot grid -->
      <div class="pointer-events-none absolute inset-0 opacity-[0.06]" style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 32px 32px;" />

      <div class="relative z-10 mx-auto w-full max-w-7xl">
        <div class="grid grid-cols-1 items-center gap-14 lg:grid-cols-2">

          <!-- Left: Copy -->
          <div class="text-center lg:text-left">
            <div class="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 backdrop-blur-sm">
              <span class="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <span class="text-xs font-medium text-white/75">1,200+ cặp đôi tin tưởng mỗi tháng</span>
            </div>

            <h1 class="text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-[4.5rem]">
              Tạo thiệp mời<br>
              <span class="bg-gradient-to-r from-rose-300 via-pink-300 to-violet-300 bg-clip-text text-transparent">
                đẹp trong 5 phút
              </span>
            </h1>

            <p class="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg lg:mx-0">
              Thiết kế thiệp cưới, thiệp sinh nhật online từ hàng chục mẫu chuyên nghiệp.
              Chia sẻ qua Zalo, Facebook — khách xem không cần cài app.
            </p>

            <div class="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <button
                class="group inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-violet-600 px-8 py-4 text-base font-bold text-white shadow-lg shadow-indigo-900/50 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-800/60"
                @click="goCreate"
              >
                Tạo thiệp ngay — Miễn phí
                <svg class="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
              <button
                class="inline-flex items-center gap-2 rounded-2xl border border-white/20 bg-white/8 px-6 py-4 text-sm font-medium text-white/80 backdrop-blur-sm transition-all hover:bg-white/15 hover:text-white"
                @click="goTemplates"
              >
                Xem mẫu thiệp
                <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <!-- Trust signals -->
            <div class="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start">
              <span v-for="trust in trustSignals" :key="trust.text" class="flex items-center gap-1.5 text-xs text-white/45">
                <span class="text-sm">{{ trust.icon }}</span>
                {{ trust.text }}
              </span>
            </div>
          </div>

          <!-- Right: Floating invitation card mockups -->
          <div class="relative mx-auto h-[500px] w-full max-w-[380px] lg:mx-0 lg:ml-auto">
            <!-- Card 1: Dark luxury -->
            <div class="card-float-1 absolute left-4 top-10 h-[310px] w-[200px] overflow-hidden rounded-3xl shadow-2xl"
              style="background: linear-gradient(150deg, #1a0a2e, #16213e); border: 1px solid rgba(212,175,55,0.3);">
              <div class="absolute inset-4 rounded-2xl border border-amber-400/20" />
              <div class="flex h-full flex-col items-center justify-center gap-2 px-5 text-center">
                <div class="flex items-center gap-2 mb-1">
                  <div class="h-px w-10 bg-amber-400/40" />
                  <span class="text-xs text-amber-400/70">囍</span>
                  <div class="h-px w-10 bg-amber-400/40" />
                </div>
                <p class="font-serif text-lg font-bold leading-tight text-white">Thanh Vân</p>
                <p class="text-[10px] text-amber-400/60">&amp;</p>
                <p class="font-serif text-lg font-bold leading-tight text-white">Đức Long</p>
                <div class="mt-3 rounded-xl bg-amber-400/10 px-4 py-2 border border-amber-400/20">
                  <p class="text-[8px] font-semibold tracking-widest text-amber-300">LỄ THÀNH HÔN</p>
                  <p class="mt-0.5 text-[7px] text-white/40">18:00 · 25/01/2026</p>
                </div>
              </div>
            </div>

            <!-- Card 2: Botanical (front, center) -->
            <div class="card-float-2 absolute left-20 top-4 z-10 h-[350px] w-[220px] overflow-hidden rounded-3xl shadow-2xl"
              style="background: linear-gradient(150deg, #fff5f7, #fce7f3);">
              <div class="absolute inset-0 opacity-30" style="background-image: radial-gradient(ellipse at 80% 10%, #f9a8d4 0%, transparent 60%), radial-gradient(ellipse at 20% 90%, #c084fc 0%, transparent 60%);" />
              <div class="relative flex h-full flex-col items-center justify-center gap-2 px-5 text-center">
                <svg class="mb-1 h-8 w-8 text-rose-300 opacity-70" viewBox="0 0 80 80" fill="none">
                  <ellipse cx="15" cy="40" rx="22" ry="9" fill="currentColor" transform="rotate(-50 15 40)" />
                  <ellipse cx="30" cy="15" rx="22" ry="9" fill="currentColor" transform="rotate(-20 30 15)" />
                  <ellipse cx="8" cy="20" rx="16" ry="7" fill="currentColor" transform="rotate(-70 8 20)" />
                </svg>
                <p class="text-[8px] font-light tracking-[0.3em] text-rose-400/60 uppercase">The Wedding of</p>
                <p class="font-serif text-2xl font-bold leading-tight text-rose-700">Ngọc Linh</p>
                <p class="text-sm text-rose-300/60">&amp;</p>
                <p class="font-serif text-2xl font-bold leading-tight text-rose-700">Minh Khoa</p>
                <div class="mt-3 h-px w-20 bg-rose-200" />
                <p class="text-[9px] tracking-widest text-rose-400/50">12 · 12 · 2026</p>
              </div>
            </div>

            <!-- Card 3: Birthday colorful -->
            <div class="card-float-3 absolute right-2 top-16 h-[270px] w-[180px] overflow-hidden rounded-3xl shadow-xl"
              style="background: linear-gradient(135deg, #f472b6, #a855f7);">
              <div class="absolute inset-0 opacity-20" style="background-image: radial-gradient(white 10%, transparent 11%); background-size: 12px 12px;" />
              <div class="relative flex h-full flex-col items-center justify-center gap-2.5 px-4 text-center">
                <p class="text-2xl">🎂</p>
                <p class="text-[8px] font-light tracking-[0.25em] text-white/70 uppercase">Kính mời</p>
                <p class="font-serif text-lg font-bold text-white leading-tight">Bảo Ngọc</p>
                <p class="text-[9px] text-white/60">Mừng tuổi 30</p>
                <div class="mt-2 rounded-full bg-white/25 px-4 py-1.5">
                  <p class="text-[9px] font-bold text-white">Join the Party! 🎉</p>
                </div>
              </div>
            </div>

            <!-- Live notification badge -->
            <div class="card-float-2 absolute bottom-6 left-0 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 shadow-xl backdrop-blur-md">
              <div class="flex items-center gap-2.5">
                <div class="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-400/25">
                  <svg class="h-4 w-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs font-semibold text-white">Thiệp vừa được tạo</p>
                  <p class="text-[10px] text-white/50">Trần Thị Hoa • 2 phút trước</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Wave bottom transition -->
      <div class="absolute bottom-0 left-0 right-0 z-20">
        <svg viewBox="0 0 1440 72" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" class="block w-full h-14 sm:h-16">
          <path d="M0 72L1440 72L1440 28C1200 72 960 4 720 28C480 52 240 4 0 28L0 72Z" fill="rgb(249,250,251)" />
        </svg>
      </div>
    </section>

    <!-- ── STATS STRIP ─────────────────────────────────────────────── -->
    <section class="bg-gray-50 px-4 pb-12 pt-6">
      <div class="mx-auto max-w-4xl">
        <div class="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div v-for="stat in stats" :key="stat.label" class="rounded-2xl bg-white px-4 py-5 text-center shadow-sm ring-1 ring-gray-100">
            <p class="text-2xl font-extrabold text-gray-900 sm:text-3xl">{{ stat.value }}</p>
            <p class="mt-1 text-xs text-gray-500">{{ stat.label }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── TEMPLATE SHOWCASE (auto-scroll marquee) ─────────────────── -->
    <section class="overflow-hidden bg-gray-50 pb-20 pt-6">
      <div class="mb-10 px-4 text-center">
        <h2 class="text-3xl font-bold text-gray-900 sm:text-4xl">Mẫu thiệp đẹp nhất</h2>
        <p class="mt-3 text-gray-500">Hàng chục mẫu được thiết kế chuyên nghiệp cho mọi dịp</p>
      </div>

      <!-- Marquee track -->
      <div class="relative">
        <div v-if="marqueeItems.length" class="flex gap-4 marquee-track px-2">
          <RouterLink
            v-for="item in marqueeItems"
            :key="item.k"
            :to="`/templates/${item.t.slug}`"
            class="group flex-shrink-0"
          >
            <div class="relative h-[220px] w-[148px] overflow-hidden rounded-2xl bg-gray-200 shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
              <div
                class="absolute inset-0"
                :style="{ background: `linear-gradient(150deg, ${item.t.theme_preview?.primary_color ?? '#6366F1'}ee, ${item.t.theme_preview?.secondary_color ?? '#A5B4FC'}99)` }"
              />
              <img
                v-if="item.t.thumbnail_url"
                :src="item.t.thumbnail_url"
                :alt="item.t.name"
                class="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div class="absolute inset-x-0 bottom-0 p-3">
                <p class="text-[11px] font-semibold text-white line-clamp-1">{{ item.t.name }}</p>
              </div>
            </div>
          </RouterLink>
        </div>

        <!-- Skeleton placeholders while loading -->
        <div v-else class="flex gap-4 px-2">
          <div v-for="i in 8" :key="i" class="h-[220px] w-[148px] flex-shrink-0 animate-pulse rounded-2xl bg-gray-200" />
        </div>

        <!-- Fade edges -->
        <div class="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-gray-50 to-transparent z-10" />
        <div class="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-gray-50 to-transparent z-10" />
      </div>

      <div class="mt-10 text-center">
        <button
          class="inline-flex items-center gap-2 rounded-2xl border border-indigo-200 bg-white px-7 py-3.5 text-sm font-semibold text-indigo-600 shadow-sm transition-all hover:border-indigo-400 hover:shadow-md"
          @click="goTemplates"
        >
          Xem tất cả mẫu thiệp
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </section>

    <!-- ── HOW IT WORKS ─────────────────────────────────────────────── -->
    <section class="bg-white px-4 py-20">
      <div class="mx-auto max-w-5xl">
        <div class="mb-14 text-center">
          <span class="inline-block rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-indigo-600">Cách hoạt động</span>
          <h2 class="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">Chỉ 3 bước đơn giản</h2>
          <p class="mt-3 text-gray-500">Tạo thiệp đẹp nhanh hơn bạn nghĩ</p>
        </div>

        <div class="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div v-for="(step, i) in steps" :key="i" class="group relative flex flex-col items-center text-center">
            <!-- Step number badge on top -->
            <div class="relative mb-6 flex h-20 w-20 items-center justify-center rounded-3xl shadow-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl"
              :style="{ background: stepGradients[i] }">
              <span class="text-3xl">{{ step.icon }}</span>
              <div class="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white text-xs font-extrabold shadow-md"
                :style="{ color: stepColors[i] }">{{ i + 1 }}</div>
            </div>

            <!-- Connector line (desktop only) -->
            <div v-if="i < 2" class="absolute left-[calc(50%+2.5rem)] top-10 hidden h-0.5 bg-gradient-to-r from-gray-200 to-gray-100 sm:block" style="width: calc(100% - 5rem);" />

            <h3 class="mb-2 font-bold text-gray-900">{{ step.title }}</h3>
            <p class="text-sm leading-relaxed text-gray-500">{{ step.desc }}</p>
          </div>
        </div>

        <div class="mt-14 text-center">
          <button
            class="group inline-flex items-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-9 py-4 text-base font-bold text-white shadow-lg shadow-indigo-200 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-300"
            @click="goCreate"
          >
            Bắt đầu miễn phí ngay
            <svg class="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>

    <!-- ── FEATURES ─────────────────────────────────────────────────── -->
    <section class="bg-gradient-to-b from-gray-50 to-white px-4 py-20">
      <div class="mx-auto max-w-6xl">
        <div class="mb-14 text-center">
          <span class="inline-block rounded-full bg-rose-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-rose-600">Tính năng nổi bật</span>
          <h2 class="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">Tại sao chọn InviteVerse?</h2>
          <p class="mt-3 text-gray-500">Tất cả những gì bạn cần cho thiệp mời hoàn hảo</p>
        </div>

        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="feat in features"
            :key="feat.title"
            class="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-100 hover:shadow-lg"
          >
            <div class="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition-transform duration-300 group-hover:scale-110"
              :style="{ background: feat.bg }">
              {{ feat.icon }}
            </div>
            <h3 class="mb-2 font-bold text-gray-900">{{ feat.title }}</h3>
            <p class="text-sm leading-relaxed text-gray-500">{{ feat.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── TESTIMONIALS ─────────────────────────────────────────────── -->
    <section class="bg-white px-4 py-20">
      <div class="mx-auto max-w-5xl">
        <div class="mb-12 text-center">
          <div class="mb-3 flex justify-center">
            <span v-for="i in 5" :key="i" class="text-xl text-amber-400">★</span>
          </div>
          <h2 class="text-2xl font-bold text-gray-900">Khách hàng nói gì về chúng tôi</h2>
          <p class="mt-2 text-sm text-gray-500">Được tin tưởng bởi hàng nghìn gia đình Việt</p>
        </div>

        <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            v-for="review in reviews"
            :key="review.name"
            class="relative rounded-3xl border border-gray-100 bg-gray-50 p-6 transition-all hover:-translate-y-0.5 hover:shadow-md"
          >
            <div class="absolute right-5 top-4 font-serif text-6xl leading-none text-gray-200">"</div>
            <div class="mb-3 text-sm text-amber-400">★★★★★</div>
            <p class="text-sm leading-relaxed text-gray-600">"{{ review.text }}"</p>
            <div class="mt-5 flex items-center gap-3">
              <div class="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
                :style="{ background: `linear-gradient(135deg, ${review.color}, ${review.color}aa)` }">
                {{ review.name[0] }}
              </div>
              <div>
                <p class="text-sm font-semibold text-gray-900">{{ review.name }}</p>
                <p class="text-xs text-gray-400">{{ review.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── BOTTOM CTA ───────────────────────────────────────────────── -->
    <section class="relative overflow-hidden px-4 py-24">
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-600 via-violet-600 to-rose-500" />
      <div class="pointer-events-none absolute inset-0">
        <div class="absolute left-1/4 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white opacity-5 blur-3xl" />
        <div class="absolute right-1/4 bottom-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-white opacity-5 blur-3xl" />
        <div class="absolute inset-0 opacity-[0.04]" style="background-image: radial-gradient(circle, white 1px, transparent 1px); background-size: 28px 28px;" />
      </div>

      <div class="relative z-10 mx-auto max-w-2xl text-center">
        <p class="mb-4 text-sm font-semibold uppercase tracking-widest text-white/60">Bắt đầu ngay hôm nay</p>
        <h2 class="text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
          Thiệp mời đẹp<br>chỉ trong 5 phút
        </h2>
        <p class="mx-auto mt-5 max-w-lg text-base text-indigo-100/80">
          Miễn phí, không cần cài đặt. Hàng nghìn cặp đôi đã tin tưởng InviteVerse.
        </p>
        <div class="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <button
            class="group inline-flex items-center gap-2.5 rounded-2xl bg-white px-9 py-4 text-base font-bold text-indigo-700 shadow-xl transition-all hover:-translate-y-0.5 hover:shadow-2xl"
            @click="goCreate"
          >
            Tạo thiệp miễn phí
            <svg class="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
          <button
            class="inline-flex items-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-7 py-4 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            @click="goTemplates"
          >
            Xem mẫu thiệp
          </button>
        </div>
        <p class="mt-6 text-xs text-indigo-200/50">★★★★★ &nbsp;4.9/5 từ 1,200+ đánh giá</p>
      </div>
    </section>

  </div>
</template>

<style scoped>
.card-float-1 {
  animation: cardFloat1 6s ease-in-out infinite;
}
.card-float-2 {
  animation: cardFloat2 7s ease-in-out infinite 0.8s;
}
.card-float-3 {
  animation: cardFloat3 5.5s ease-in-out infinite 0.3s;
}

@keyframes cardFloat1 {
  0%, 100% { transform: rotate(-8deg) translateY(0px); }
  50% { transform: rotate(-8deg) translateY(-14px); }
}
@keyframes cardFloat2 {
  0%, 100% { transform: rotate(2deg) translateY(0px); }
  50% { transform: rotate(2deg) translateY(-10px); }
}
@keyframes cardFloat3 {
  0%, 100% { transform: rotate(7deg) translateY(0px); }
  50% { transform: rotate(7deg) translateY(-12px); }
}

.marquee-track {
  animation: marqueeScroll 28s linear infinite;
  width: max-content;
}
.marquee-track:hover {
  animation-play-state: paused;
}
@keyframes marqueeScroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
</style>

