<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { ThemeConfig } from '@/types/section.types'
import FloralDecoration from '@/components/invitation/FloralDecoration.vue'

const props = defineProps<{
  config: Record<string, unknown>
  theme: ThemeConfig
  isPreview?: boolean
  category?: string
  slug?: string
}>()

const title = computed(() => (props.config.title as string | undefined) || 'Lời chúc')

const PREVIEW_WISHES_WEDDING = [
  { name: 'Nguyễn Thị Hương', message: 'Chúc hai bạn trăm năm hạnh phúc, mãi mãi yêu thương nhau! Hy vọng cuộc sống hôn nhân sẽ luôn tràn đầy niềm vui và bình an.', time: '2 giờ trước' },
  { name: 'Trần Văn Minh', message: 'Xin chúc mừng ngày trọng đại! Chúc đôi uyên ương luôn hòa thuận, hạnh phúc bên nhau đến đầu bạc răng long.', time: '5 giờ trước' },
  { name: 'Lê Thu Phương', message: 'Chúc mừng hạnh phúc! Một tình yêu đẹp xứng đáng có một ngày lễ thật đặc biệt. Chúc hai bạn mãi mãi bên nhau!', time: '1 ngày trước' },
]

const PREVIEW_WISHES_BIRTHDAY = [
  { name: 'Nguyễn Thị Hương', message: 'Chúc mừng sinh nhật! Chúc bạn luôn vui vẻ, mạnh khỏe và đạt được mọi điều mình mong muốn trong năm mới này.', time: '2 giờ trước' },
  { name: 'Trần Văn Minh', message: 'Happy Birthday! Chúc bạn ngày càng trẻ đẹp, thành công và có thật nhiều niềm vui bên gia đình và bạn bè.', time: '5 giờ trước' },
  { name: 'Lê Thu Phương', message: 'Sinh nhật vui vẻ nha! Chúc bạn có một bữa tiệc thật tuyệt vời và luôn giữ mãi nụ cười rạng rỡ như hôm nay!', time: '1 ngày trước' },
]

const PREVIEW_WISHES_BABY_SHOWER = [
  { name: 'Nguyễn Thị Hương', message: 'Chúc bé yêu mau ăn chóng lớn, thật khỏe mạnh và hay cười! Chúc gia đình luôn hạnh phúc và tràn đầy tiếng cười.', time: '2 giờ trước' },
  { name: 'Trần Văn Minh', message: 'Chúc mừng bé tròn 1 tuổi! Chúc bé ngoan ngoãn, thông minh và khỏe mạnh. Chúc bố mẹ luôn bình an bên con.', time: '5 giờ trước' },
  { name: 'Lê Thu Phương', message: 'Bé thật đáng yêu! Chúc bé lớn lên khỏe mạnh, học giỏi và luôn được yêu thương bởi mọi người xung quanh.', time: '1 ngày trước' },
]

const PREVIEW_WISHES_HOUSE_WARMING = [
  { name: 'Nguyễn Thị Hương', message: 'Chúc mừng tân gia! Chúc gia đình luôn hạnh phúc, bình an và mọi điều tốt đẹp sẽ đến trong ngôi nhà mới.', time: '2 giờ trước' },
  { name: 'Trần Văn Minh', message: 'An khang thịnh vượng! Chúc gia đình vạn sự như ý trong ngôi nhà mới, cuộc sống ngày càng sung túc và viên mãn.', time: '5 giờ trước' },
  { name: 'Lê Thu Phương', message: 'Nhà mới phước mới! Chúc gia đình luôn ấm áp, hòa thuận và ngôi nhà mãi là tổ ấm hạnh phúc của mọi người.', time: '1 ngày trước' },
]

const previewWishes = computed(() => {
  if (props.category === 'birthday') return PREVIEW_WISHES_BIRTHDAY
  if (props.category === 'baby_shower') return PREVIEW_WISHES_BABY_SHOWER
  if (props.category === 'house_warming' || props.category === 'housewarming') return PREVIEW_WISHES_HOUSE_WARMING
  return PREVIEW_WISHES_WEDDING
})

interface WishItem { name: string; message: string; time: string }

const realWishes = ref<WishItem[]>([])
const isLoading = ref(false)

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60_000)
  if (minutes < 1) return 'Vừa xong'
  if (minutes < 60) return `${minutes} phút trước`
  const hours = Math.floor(diff / 3_600_000)
  if (hours < 24) return `${hours} giờ trước`
  const days = Math.floor(diff / 86_400_000)
  return `${days} ngày trước`
}

onMounted(async () => {
  if (!props.slug) return
  isLoading.value = true
  try {
    const baseUrl = (import.meta.env.VITE_API_BASE_URL as string) || '/api/v1'
    const res = await fetch(`${baseUrl}/public/invitations/${props.slug}/wishes`)
    if (res.ok) {
      const json = await res.json()
      const rows = (json.data ?? []) as Array<{ name: string; rsvp_note: string; rsvp_at: string }>
      realWishes.value = rows.map(r => ({
        name: r.name,
        message: r.rsvp_note,
        time: timeAgo(r.rsvp_at),
      }))
    }
  } catch { /* silent */ } finally {
    isLoading.value = false
  }
})

const displayWishes = computed<WishItem[]>(() =>
  props.slug ? realWishes.value : previewWishes.value
)

const isPublicMode = computed(() => !!props.slug)

function initials(name: string) {
  return name
    .split(' ')
    .map(w => w[0])
    .slice(-2)
    .join('')
    .toUpperCase()
}

const AVATAR_BG = ['#F9A8D4', '#A5B4FC', '#86EFAC', '#FDE68A', '#C4B5FD']
function avatarBg(index: number) { return AVATAR_BG[index % AVATAR_BG.length] }
</script>

<template>
  <section
    data-reveal
    class="py-20 px-4"
    :style="{ backgroundColor: theme.background_color, color: theme.text_color }"
  >
    <div class="mx-auto max-w-2xl">
      <!-- Heading -->
      <div class="mb-12 flex flex-col items-center gap-4 text-center">
        <FloralDecoration variant="divider" :color="theme.primary_color" :opacity="0.5" :size="220" />
        <h2
          class="text-3xl font-semibold"
          :style="{ fontFamily: `'${theme.font_heading}', serif`, color: theme.primary_color }"
        >
          {{ title }}
        </h2>
        <p
          class="text-sm opacity-60"
          :style="{ fontFamily: `'${theme.font_body}', sans-serif` }"
        >
          Những lời yêu thương từ người thân và bạn bè
        </p>
        <FloralDecoration variant="divider" :color="theme.primary_color" :opacity="0.5" :size="220" />
      </div>

      <!-- Loading -->
      <div v-if="isPublicMode && isLoading" class="flex justify-center py-8">
        <div class="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" :style="{ borderColor: theme.primary_color, borderTopColor: 'transparent' }" />
      </div>

      <!-- Empty state (public, no wishes yet) -->
      <div
        v-else-if="isPublicMode && displayWishes.length === 0"
        class="py-12 text-center text-sm opacity-50"
        :style="{ fontFamily: `'${theme.font_body}', sans-serif` }"
      >
        Chưa có lời chúc nào. Hãy là người đầu tiên gửi lời chúc!
      </div>

      <!-- Wish cards -->
      <div v-else class="space-y-5">
        <div
          v-for="(wish, i) in displayWishes"
          :key="i"
          class="flex gap-4 rounded-2xl p-5 shadow-sm transition-shadow hover:shadow-md"
          :style="{ backgroundColor: theme.primary_color + '0D', border: `1px solid ${theme.primary_color}22` }"
        >
          <!-- Avatar -->
          <div
            class="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
            :style="{ backgroundColor: avatarBg(i) }"
          >
            {{ initials(wish.name) }}
          </div>

          <!-- Content -->
          <div class="min-w-0 flex-1">
            <div class="mb-1 flex items-center justify-between gap-2">
              <p class="text-sm font-semibold" :style="{ color: theme.text_color }">{{ wish.name }}</p>
              <p class="shrink-0 text-xs opacity-40" :style="{ fontFamily: `'${theme.font_body}', sans-serif` }">
                {{ wish.time }}
              </p>
            </div>
            <p
              class="text-sm leading-relaxed opacity-80"
              :style="{ fontFamily: `'${theme.font_body}', sans-serif`, color: theme.text_color }"
            >
              {{ wish.message }}
            </p>
          </div>
        </div>
      </div>

      <!-- Note in editor preview mode only -->
      <p
        v-if="!isPublicMode"
        class="mt-8 text-center text-xs opacity-40"
        :style="{ fontFamily: `'${theme.font_body}', sans-serif` }"
      >
        * Lời chúc thật từ khách sẽ xuất hiện ở đây sau khi xuất bản
      </p>
    </div>
  </section>
</template>
