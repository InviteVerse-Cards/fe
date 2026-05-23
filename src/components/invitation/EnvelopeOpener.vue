<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  primaryColor?: string
  coupleName?: string
}>()

const emit = defineEmits<{ (e: 'opened'): void }>()

const phase = ref<'idle' | 'opening' | 'rising' | 'done'>('idle')

function openEnvelope() {
  if (phase.value !== 'idle') return
  phase.value = 'opening'
  setTimeout(() => { phase.value = 'rising' }, 700)
  setTimeout(() => { phase.value = 'done' }, 1400)
  setTimeout(() => { emit('opened') }, 1600)
}

const envColor = props.primaryColor ?? '#6366F1'
</script>

<template>
  <Transition name="envelope-scene" appear>
    <div
      v-if="phase !== 'done'"
      class="fixed inset-0 z-50 flex flex-col items-center justify-center"
      :style="{ background: `linear-gradient(135deg, ${envColor}22 0%, #ffffff 60%, ${envColor}11 100%)` }"
    >
      <!-- Envelope wrapper -->
      <div class="relative flex flex-col items-center">

        <!-- Envelope body (3D perspective container) -->
        <div
          class="envelope-wrap relative"
          :class="phase === 'idle' ? 'envelope-breathe' : ''"
          style="width: 280px; height: 190px;"
        >
          <!-- SVG envelope body + side flaps + bottom flap -->
          <svg
            viewBox="0 0 280 190"
            class="absolute inset-0 w-full h-full"
            style="overflow: visible;"
          >
            <!-- Body background -->
            <rect x="0" y="0" width="280" height="190" rx="8"
              :fill="envColor + '22'" :stroke="envColor + '66'" stroke-width="1.5"
            />
            <!-- Bottom flap (triangle pointing up) -->
            <polygon points="0,190 140,110 280,190"
              :fill="envColor + '33'"
            />
            <!-- Left side flap -->
            <polygon points="0,0 0,190 105,95"
              :fill="envColor + '22'"
            />
            <!-- Right side flap -->
            <polygon points="280,0 280,190 175,95"
              :fill="envColor + '22'"
            />
            <!-- Center heart / seal -->
            <circle cx="140" cy="140" r="16"
              :fill="envColor" opacity="0.15"
            />
            <text x="140" y="145" text-anchor="middle" font-size="14" :fill="envColor" opacity="0.6">❤</text>
          </svg>

          <!-- Top flap (animated, perspective = flip open) -->
          <div
            class="absolute left-0 top-0 w-full origin-top transition-transform"
            :style="{
              transformStyle: 'preserve-3d',
              perspective: '600px',
              transitionDuration: phase === 'opening' ? '700ms' : '0ms',
              transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
              transform: phase === 'opening' || phase === 'rising' ? 'rotateX(-180deg)' : 'rotateX(0deg)',
            }"
          >
            <svg viewBox="0 0 280 100" class="w-full" style="height: 100px; display: block;">
              <!-- Top flap (diamond/triangle pointing down) -->
              <polygon points="0,0 280,0 140,90"
                :fill="envColor + '55'" :stroke="envColor + '88'" stroke-width="1.5"
                stroke-linejoin="round"
              />
            </svg>
          </div>

          <!-- Mini invitation card rising from inside -->
          <div
            class="absolute left-1/2 -translate-x-1/2 transition-all duration-700"
            :style="{
              bottom: phase === 'rising' ? '100%' : '10px',
              opacity: phase === 'rising' ? 1 : 0,
              transitionDelay: phase === 'rising' ? '100ms' : '0ms',
              width: '180px',
            }"
          >
            <div
              class="rounded-xl shadow-2xl flex flex-col items-center justify-center py-6 px-4 text-center"
              :style="{ background: `linear-gradient(135deg, ${envColor}dd, ${envColor}99)` }"
            >
              <p class="text-xs font-light text-white/70 tracking-widest uppercase">Thiệp mời</p>
              <p class="mt-1 text-base font-bold text-white leading-tight">
                {{ coupleName || 'Kim Chi & Anh Tú' }}
              </p>
            </div>
          </div>
        </div>

        <!-- Couple name -->
        <div class="mt-8 text-center">
          <p class="text-xs uppercase tracking-[0.25em] opacity-50" :style="{ color: envColor }">Thiệp mời</p>
          <p
            v-if="coupleName"
            class="mt-2 text-2xl font-bold"
            :style="{ color: envColor }"
          >
            {{ coupleName }}
          </p>
        </div>

        <!-- Open button -->
        <button
          v-if="phase === 'idle'"
          class="mt-10 flex items-center gap-2 rounded-2xl px-8 py-4 text-sm font-bold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
          :style="{ backgroundColor: envColor }"
          @click="openEnvelope"
        >
          <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          Mở thiệp
        </button>

        <!-- Loading indicator during opening -->
        <div v-else class="mt-10 h-10 flex items-center">
          <div class="flex gap-1.5">
            <span class="h-2 w-2 rounded-full animate-bounce" :style="{ backgroundColor: envColor, animationDelay: '0ms' }" />
            <span class="h-2 w-2 rounded-full animate-bounce" :style="{ backgroundColor: envColor, animationDelay: '150ms' }" />
            <span class="h-2 w-2 rounded-full animate-bounce" :style="{ backgroundColor: envColor, animationDelay: '300ms' }" />
          </div>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
.envelope-breathe {
  animation: breathe 2.5s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { transform: scale(1) translateY(0); }
  50% { transform: scale(1.015) translateY(-4px); }
}

.envelope-scene-enter-active {
  transition: opacity 0.4s ease;
}
.envelope-scene-leave-active {
  transition: opacity 0.5s ease;
}
.envelope-scene-enter-from,
.envelope-scene-leave-to {
  opacity: 0;
}
</style>
