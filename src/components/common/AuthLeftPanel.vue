<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  subtitle?: string
}>(), {
  title: 'Tạo thiệp trực tuyến cao cấp',
  subtitle: 'InviteVerse giúp bạn dễ dàng tạo và gửi những bức thiệp điện tử tinh tế, chuyên nghiệp và đầy ý nghĩa tới khách mời chỉ trong vài phút.'
})
</script>

<template>
  <div class="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-700 via-purple-600 to-rose-500 p-12 text-white lg:flex select-none">
    <!-- Ambient Light Effects -->
    <div class="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-white/10 blur-3xl"></div>
    <div class="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-white/10 blur-3xl"></div>
    <div class="absolute top-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-rose-400/20 blur-3xl"></div>

    <!-- Header / Logo -->
    <div class="relative z-10 flex items-center gap-2">
      <RouterLink to="/" class="flex items-center gap-2 text-2xl font-black tracking-wider text-white">
        <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-md text-xl">
          💌
        </span>
        InviteVerse
      </RouterLink>
    </div>

    <!-- Interactive CSS Mockup Card (Centered) -->
    <div class="relative z-10 my-auto flex flex-col items-center justify-center">
      <div class="group relative w-full max-w-[340px] transform rounded-3xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-md transition-all duration-700 hover:-translate-y-2 hover:rotate-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
        <!-- Shiny overlay element -->
        <div class="absolute inset-0 rounded-3xl bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-0 transition-opacity duration-700 group-hover:opacity-100"></div>
        
        <!-- Invitation Border Frame -->
        <div class="relative rounded-2xl border border-amber-300/30 p-5 text-center">
          <!-- Decorative Top Icon -->
          <div class="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-amber-300/10 text-amber-300 text-sm">
            ✨
          </div>

          <p class="font-serif text-[10px] uppercase tracking-[0.2em] text-amber-200">Save The Date</p>
          
          <!-- Couple Names -->
          <div class="my-4 space-y-1">
            <h4 class="font-serif text-2xl font-bold tracking-wide text-white">Hoàng Thịnh</h4>
            <p class="font-serif text-sm italic text-amber-200/80">&</p>
            <h4 class="font-serif text-2xl font-bold tracking-wide text-white">Thu Trang</h4>
          </div>

          <!-- Divider line -->
          <div class="mx-auto my-3 h-[1px] w-12 bg-amber-300/30"></div>

          <!-- Date & Location -->
          <div class="space-y-1 text-xs text-white/90">
            <p class="font-sans font-medium uppercase tracking-wider text-amber-100">Thứ Bảy, 25 Tháng 12, 2026</p>
            <p class="text-[10px] text-white/70">InviteVerse Palace • Hà Nội</p>
          </div>
          
          <!-- Decorative Bottom Corners -->
          <div class="absolute bottom-2 left-2 text-[8px] text-amber-300/20">✦</div>
          <div class="absolute bottom-2 right-2 text-[8px] text-amber-300/20">✦</div>
          <div class="absolute top-2 left-2 text-[8px] text-amber-300/20">✦</div>
          <div class="absolute top-2 right-2 text-[8px] text-amber-300/20">✦</div>
        </div>
      </div>
      
      <!-- Floating Accent Badge -->
      <div class="mt-8 flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/80 backdrop-blur-sm">
        <span class="flex h-2 w-2 rounded-full bg-green-400"></span>
        Hơn 10,000+ thiệp mời đã được gửi đi
      </div>
    </div>

    <!-- Slogan & Intro text -->
    <div class="relative z-10 mt-auto">
      <h3 class="text-xl font-bold tracking-wide">{{ title }}</h3>
      <p class="mt-2 text-sm leading-relaxed text-white/80">
        {{ subtitle }}
      </p>
    </div>
  </div>
</template>
