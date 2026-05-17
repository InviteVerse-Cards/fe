<script setup lang="ts">
defineProps<{
  side: 'dragon' | 'phoenix'
  color?: string
  opacity?: number
  size?: number
}>()
</script>

<template>
  <!-- Dragon (left side) -->
  <svg
    v-if="side === 'dragon'"
    :width="size ?? 120"
    :height="size ?? 120"
    viewBox="0 0 120 120"
    fill="none"
    :style="{ color: color ?? 'currentColor', opacity: opacity ?? 1 }"
  >
    <!-- Body coil -->
    <path
      d="M20 100 C15 80 10 65 20 50 C30 35 50 30 60 20 C70 10 80 5 95 8"
      stroke="currentColor" stroke-width="6" stroke-linecap="round" fill="none" opacity="0.9"
    />
    <!-- Scales along body -->
    <path d="M30 85 Q35 80 40 85" stroke="currentColor" stroke-width="2" fill="none" opacity="0.7"/>
    <path d="M25 70 Q30 65 35 70" stroke="currentColor" stroke-width="2" fill="none" opacity="0.7"/>
    <path d="M30 55 Q37 50 44 55" stroke="currentColor" stroke-width="2" fill="none" opacity="0.7"/>
    <path d="M45 40 Q52 35 59 40" stroke="currentColor" stroke-width="2" fill="none" opacity="0.7"/>
    <path d="M65 25 Q72 20 79 25" stroke="currentColor" stroke-width="2" fill="none" opacity="0.7"/>
    <!-- Head -->
    <ellipse cx="95" cy="10" rx="10" ry="7" fill="currentColor" opacity="0.85"/>
    <circle cx="101" cy="7" r="2" fill="currentColor" opacity="0.4"/>
    <!-- Horns -->
    <path d="M92 4 L88 -2" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>
    <path d="M98 3 L97 -3" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" opacity="0.8"/>
    <!-- Whiskers -->
    <path d="M105 12 L115 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
    <path d="M105 14 L116 16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
    <!-- Claws -->
    <path d="M20 98 L14 106 M20 98 L17 108 M20 98 L22 108" stroke="currentColor" stroke-width="2" stroke-linecap="round" opacity="0.75"/>
    <!-- Tail flame -->
    <path d="M20 100 C10 108 5 112 8 118 C12 115 15 110 20 100Z" fill="currentColor" opacity="0.5"/>
    <!-- Wing suggestion -->
    <path d="M50 35 C40 25 30 20 25 28" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.55"/>
    <path d="M50 35 C55 22 60 15 68 18" stroke="currentColor" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.55"/>
  </svg>

  <!-- Phoenix (right side) -->
  <svg
    v-else
    :width="size ?? 120"
    :height="size ?? 120"
    viewBox="0 0 120 120"
    fill="none"
    :style="{ color: color ?? 'currentColor', opacity: opacity ?? 1 }"
  >
    <!-- Body -->
    <ellipse cx="60" cy="55" rx="16" ry="22" fill="currentColor" opacity="0.8"/>
    <!-- Head -->
    <circle cx="60" cy="28" r="12" fill="currentColor" opacity="0.9"/>
    <!-- Crest feathers -->
    <path d="M55 18 C52 8 55 2 60 6 C65 2 68 8 65 18" fill="currentColor" opacity="0.7"/>
    <path d="M50 20 C46 12 48 6 53 10" fill="currentColor" opacity="0.5"/>
    <path d="M70 20 C74 12 72 6 67 10" fill="currentColor" opacity="0.5"/>
    <!-- Beak -->
    <path d="M60 36 L55 42 L60 40 L65 42 Z" fill="currentColor" opacity="0.6"/>
    <!-- Left wing spread -->
    <path d="M44 50 C30 38 18 35 10 42 C20 45 28 52 38 58Z" fill="currentColor" opacity="0.65"/>
    <path d="M44 50 C26 42 14 45 8 55 C18 56 30 58 40 62Z" fill="currentColor" opacity="0.45"/>
    <!-- Right wing spread -->
    <path d="M76 50 C90 38 102 35 110 42 C100 45 92 52 82 58Z" fill="currentColor" opacity="0.65"/>
    <path d="M76 50 C94 42 106 45 112 55 C102 56 90 58 80 62Z" fill="currentColor" opacity="0.45"/>
    <!-- Tail feathers long -->
    <path d="M52 76 C48 90 42 100 35 115" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" fill="none" opacity="0.7"/>
    <path d="M60 78 C60 92 60 104 60 120" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" fill="none" opacity="0.8"/>
    <path d="M68 76 C72 90 78 100 85 115" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" fill="none" opacity="0.7"/>
    <path d="M56 77 C50 95 46 108 40 120" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.5"/>
    <path d="M64 77 C70 95 74 108 80 120" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.5"/>
    <!-- Flame aura -->
    <path d="M55 76 C50 85 46 92 50 98 C54 92 58 85 60 78Z" fill="currentColor" opacity="0.3"/>
    <path d="M65 76 C70 85 74 92 70 98 C66 92 62 85 60 78Z" fill="currentColor" opacity="0.3"/>
  </svg>
</template>
