<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useTemplates } from '@/composables/useTemplate'
import AppButton from '@/components/common/AppButton.vue'

const auth = useAuthStore()
const router = useRouter()
const { data: templates } = useTemplates(ref('wedding'))

function goCreate() {
  if (auth.isLoggedIn) {
    router.push({ name: 'Templates' })
  } else {
    router.push({ name: 'Register' })
  }
}

function goTemplates() {
  router.push({ name: 'Templates' })
}
</script>

<template>
  <div>
    <!-- ── HERO ─────────────────────────────────────────────────────── -->
    <section class="relative overflow-hidden bg-gradient-to-br from-rose-50 via-white to-indigo-50 px-4 py-24 sm:py-32">
      <!-- Decorative blobs -->
      <div class="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-100 opacity-40 blur-3xl" />
      <div class="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-rose-100 opacity-50 blur-3xl" />

      <div class="mx-auto max-w-6xl">
        <div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <!-- Left: Copy -->
          <div>
            <span class="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-semibold text-indigo-700">
              🎉 Thiệp online đẹp nhất cho ngày đặc biệt
            </span>
            <h1 class="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Tạo thiệp cưới<br>
              <span class="text-indigo-600">đẹp trong 5 phút</span>
            </h1>
            <p class="mx-auto mt-6 max-w-xl text-lg text-gray-600">
              Thiết kế thiệp cưới, thiệp sinh nhật online từ hàng chục mẫu đẹp.
              Chia sẻ qua Zalo, Facebook hoặc QR code. Hoàn toàn miễn phí.
            </p>
            <div class="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <AppButton variant="primary" size="lg" @click="goCreate">
                Tạo thiệp ngay — Miễn phí
              </AppButton>
              <button
                class="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors underline-offset-4 hover:underline"
                @click="goTemplates"
              >
                Xem mẫu thiệp →
              </button>
            </div>
            <!-- Trust signals -->
            <div class="mt-10 flex items-center gap-6 text-xs text-gray-500">
              <span class="flex items-center gap-1.5">
                <span class="h-1.5 w-1.5 rounded-full bg-green-400" />
                Không cần cài đặt
              </span>
              <span class="flex items-center gap-1.5">
                <span class="h-1.5 w-1.5 rounded-full bg-green-400" />
                Miễn phí bắt đầu
              </span>
              <span class="flex items-center gap-1.5">
                <span class="h-1.5 w-1.5 rounded-full bg-green-400" />
                1,200+ cặp đôi tin tưởng
              </span>
            </div>
          </div>

          <!-- Right: Template preview cards (stacked) -->
          <div class="relative mx-auto hidden h-[480px] w-[320px] lg:block">
            <!-- Card 3 (back) -->
            <div
              class="absolute left-10 top-10 h-64 w-44 rotate-6 overflow-hidden rounded-2xl shadow-lg"
              style="background: linear-gradient(135deg, #c084fc, #a855f7);"
            >
              <div class="flex h-full items-center justify-center text-center text-white">
                <div>
                  <p class="text-xs tracking-widest opacity-70">Cô Dâu & Chú Rể</p>
                  <p class="mt-1 font-serif text-xl font-bold">Thiệp Cưới</p>
                </div>
              </div>
            </div>
            <!-- Card 2 (mid) -->
            <div
              class="absolute left-16 top-6 h-72 w-48 -rotate-2 overflow-hidden rounded-2xl shadow-xl"
              style="background: linear-gradient(135deg, #fb7185, #e11d48);"
            >
              <div class="flex h-full items-center justify-center text-center text-white">
                <div>
                  <p class="text-xs tracking-widest opacity-70">Cô Dâu & Chú Rể</p>
                  <p class="mt-1 font-serif text-xl font-bold">Thiệp Cưới</p>
                </div>
              </div>
            </div>
            <!-- Card 1 (front) -->
            <div
              class="absolute left-24 top-2 h-80 w-52 rotate-1 overflow-hidden rounded-2xl shadow-2xl"
              style="background: linear-gradient(135deg, #6366f1, #4f46e5);"
            >
              <div class="flex h-full items-center justify-center text-center text-white">
                <div>
                  <p class="text-xs tracking-widest opacity-70">Cô Dâu & Chú Rể</p>
                  <p class="mt-2 font-serif text-2xl font-bold leading-tight">Thiệp Cưới<br>Online</p>
                  <div class="mx-auto mt-4 h-0.5 w-16 bg-white/40" />
                  <p class="mt-3 text-xs opacity-70">InviteVerse</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── TEMPLATE SHOWCASE ────────────────────────────────────────── -->
    <section class="px-4 py-20">
      <div class="mx-auto max-w-7xl">
        <div class="mb-10 flex items-end justify-between">
          <div>
            <h2 class="text-3xl font-bold text-gray-900">Mẫu thiệp đẹp</h2>
            <p class="mt-2 text-gray-500">Hàng chục mẫu được thiết kế chuyên nghiệp</p>
          </div>
          <button
            class="hidden text-sm font-medium text-indigo-600 hover:underline sm:block"
            @click="goTemplates"
          >
            Xem tất cả →
          </button>
        </div>

        <!-- Template preview cards (4 col) -->
        <div v-if="templates?.length" class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <RouterLink
            v-for="template in templates.slice(0, 4)"
            :key="template.id"
            :to="`/templates/${template.slug}`"
            class="group block"
          >
            <div class="relative aspect-[3/5] overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
              <div
                class="absolute inset-0"
                :style="{ background: `linear-gradient(135deg, ${template.theme_preview?.primary_color ?? '#6366F1'}dd, ${template.theme_preview?.secondary_color ?? '#A5B4FC'}99)` }"
              />
              <img
                v-if="template.thumbnail_url"
                :src="template.thumbnail_url"
                :alt="template.name"
                class="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-b from-black/0 via-black/5 to-black/50" />
              <div
                class="absolute inset-0 flex items-center justify-center"
                :style="{ fontFamily: `'${template.theme_preview?.font_heading ?? 'serif'}', serif` }"
              >
                <div class="text-center drop-shadow-lg">
                  <p class="text-xs font-light tracking-widest text-white/70 uppercase">Cô Dâu & Chú Rể</p>
                  <p class="mt-2 text-xl font-bold text-white">Thiệp Cưới</p>
                </div>
              </div>
              <!-- Hover overlay -->
              <div class="absolute inset-0 flex items-end justify-center pb-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-black/40">
                <span class="rounded-xl border border-white/50 bg-white/15 px-4 py-2 text-xs font-semibold text-white backdrop-blur-sm">
                  Xem demo →
                </span>
              </div>
            </div>
            <p class="mt-2 text-sm font-medium text-gray-800">{{ template.name }}</p>
          </RouterLink>
        </div>

        <!-- Placeholder skeleton cards -->
        <div v-else class="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          <div v-for="i in 4" :key="i" class="aspect-[3/5] animate-pulse rounded-2xl bg-gray-200" />
        </div>

        <div class="mt-6 text-center sm:hidden">
          <button
            class="rounded-xl border border-indigo-200 bg-white px-5 py-2.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50"
            @click="goTemplates"
          >
            Xem tất cả mẫu →
          </button>
        </div>
      </div>
    </section>

    <!-- ── HOW IT WORKS (3 Steps) ──────────────────────────────────── -->
    <section class="bg-gray-50 px-4 py-20">
      <div class="mx-auto max-w-5xl">
        <div class="mb-12 text-center">
          <h2 class="text-3xl font-bold text-gray-900">Chỉ 3 bước đơn giản</h2>
          <p class="mt-3 text-gray-500">Tạo thiệp đẹp nhanh hơn bạn nghĩ</p>
        </div>
        <div class="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div v-for="(step, i) in steps" :key="i" class="relative text-center">
            <!-- Step number -->
            <div class="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-100 text-3xl">
              {{ step.icon }}
            </div>
            <!-- Connector line -->
            <div
              v-if="i < steps.length - 1"
              class="absolute left-full top-8 hidden h-0.5 w-full -translate-x-8 bg-indigo-100 sm:block"
              style="width: calc(100% - 48px);"
            />
            <h3 class="mb-2 font-bold text-gray-900">{{ step.title }}</h3>
            <p class="text-sm text-gray-500 leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
        <div class="mt-12 text-center">
          <AppButton variant="primary" size="lg" @click="goCreate">
            Bắt đầu miễn phí ngay
          </AppButton>
        </div>
      </div>
    </section>

    <!-- ── FEATURES ─────────────────────────────────────────────────── -->
    <section class="px-4 py-20">
      <div class="mx-auto max-w-6xl">
        <div class="mb-12 text-center">
          <h2 class="text-3xl font-bold text-gray-900">Tại sao chọn InviteVerse?</h2>
          <p class="mt-3 text-gray-500">Tất cả những gì bạn cần cho thiệp mời hoàn hảo</p>
        </div>
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="feat in features"
            :key="feat.title"
            class="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:border-indigo-200 hover:shadow-md transition-all"
          >
            <div class="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-2xl">
              {{ feat.icon }}
            </div>
            <h3 class="mb-2 font-semibold text-gray-900">{{ feat.title }}</h3>
            <p class="text-sm text-gray-500 leading-relaxed">{{ feat.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ── SOCIAL PROOF ──────────────────────────────────────────────── -->
    <section class="bg-gray-50 px-4 py-16">
      <div class="mx-auto max-w-5xl">
        <p class="mb-8 text-center text-sm font-semibold uppercase tracking-widest text-gray-400">
          Được tin tưởng bởi hàng nghìn cặp đôi
        </p>
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div
            v-for="review in reviews"
            :key="review.name"
            class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div class="mb-3 text-amber-400 text-sm tracking-wide">★★★★★</div>
            <p class="text-sm text-gray-600 leading-relaxed italic">"{{ review.text }}"</p>
            <div class="mt-4 flex items-center gap-3">
              <div
                class="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                :style="{ backgroundColor: review.color }"
              >
                {{ review.name[0] }}
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ review.name }}</p>
                <p class="text-xs text-gray-400">{{ review.role }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ── BOTTOM CTA ────────────────────────────────────────────────── -->
    <section class="bg-indigo-600 px-4 py-16 text-center text-white">
      <div class="mx-auto max-w-xl">
        <h2 class="text-3xl font-bold">Bắt đầu tạo thiệp ngay hôm nay</h2>
        <p class="mt-3 text-indigo-200">Miễn phí, không cần cài đặt. Chỉ cần vài phút.</p>
        <AppButton variant="secondary" size="lg" class="mt-8" @click="goCreate">
          Tạo thiệp của tôi →
        </AppButton>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
const steps = [
  {
    icon: '🎨',
    title: 'Chọn mẫu thiệp',
    desc: 'Hàng chục mẫu cưới, sinh nhật đẹp được thiết kế chuyên nghiệp. Click để xem demo.',
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
    title: 'Mở phong bì animation',
    desc: 'Khách mời thấy hiệu ứng mở phong bì đẹp khi xem thiệp lần đầu tiên.',
  },
  {
    icon: '🤖',
    title: 'AI gợi ý lời thiệp',
    desc: 'Trí tuệ nhân tạo viết lời mời đẹp, lãng mạn và phù hợp từng dịp đặc biệt.',
  },
  {
    icon: '✅',
    title: 'RSVP tự động',
    desc: 'Khách xác nhận tham dự online. Bạn nhận thông báo ngay khi có phản hồi.',
  },
  {
    icon: '🔗',
    title: 'Link cá nhân hóa',
    desc: 'Gửi link riêng có tên khách: Kính mời Anh Tuấn — ấm áp và chu đáo hơn.',
  },
  {
    icon: '🏦',
    title: 'QR chuyển khoản',
    desc: 'Thêm QR VietQR ngay trong thiệp. Khách mừng cưới tiện lợi không cần nhập số.',
  },
  {
    icon: '⚡',
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
