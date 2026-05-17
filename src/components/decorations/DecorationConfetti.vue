<script setup lang="ts">
defineProps<{
  color?: string
  accentColor?: string
  opacity?: number
  size?: number
  animated?: boolean
}>()
</script>

<template>
  <svg
    :width="size ?? 100"
    :height="size ?? 100"
    viewBox="0 0 100 100"
    fill="none"
    :style="{ opacity: opacity ?? 1 }"
  >
    <!-- Circles -->
    <circle cx="15" cy="20" r="5" :fill="color ?? 'currentColor'" opacity="0.85"/>
    <circle cx="75" cy="12" r="4" :fill="accentColor ?? color ?? 'currentColor'" opacity="0.7"/>
    <circle cx="88" cy="45" r="6" :fill="color ?? 'currentColor'" opacity="0.75"/>
    <circle cx="8" cy="65" r="4" :fill="accentColor ?? color ?? 'currentColor'" opacity="0.65"/>
    <circle cx="50" cy="90" r="5" :fill="color ?? 'currentColor'" opacity="0.7"/>

    <!-- Rectangles (tumbling) -->
    <rect x="30" y="8" width="10" height="6" rx="1" :fill="accentColor ?? color ?? 'currentColor'" opacity="0.8" transform="rotate(25 35 11)"/>
    <rect x="60" y="30" width="8" height="5" rx="1" :fill="color ?? 'currentColor'" opacity="0.65" transform="rotate(-35 64 32)"/>
    <rect x="18" y="45" width="10" height="6" rx="1" :fill="accentColor ?? color ?? 'currentColor'" opacity="0.7" transform="rotate(15 23 48)"/>
    <rect x="70" y="70" width="9" height="5" rx="1" :fill="color ?? 'currentColor'" opacity="0.6" transform="rotate(-20 74 72)"/>
    <rect x="40" y="55" width="8" height="5" rx="1" :fill="accentColor ?? color ?? 'currentColor'" opacity="0.55" transform="rotate(45 44 57)"/>

    <!-- Triangles -->
    <polygon points="55,18 62,8 68,18" :fill="color ?? 'currentColor'" opacity="0.75" transform="rotate(-10 61 13)"/>
    <polygon points="22,30 29,20 36,30" :fill="accentColor ?? color ?? 'currentColor'" opacity="0.6" transform="rotate(30 29 25)"/>
    <polygon points="80,55 87,45 94,55" :fill="color ?? 'currentColor'" opacity="0.65" transform="rotate(-25 87 50)"/>
    <polygon points="40,75 47,65 54,75" :fill="accentColor ?? color ?? 'currentColor'" opacity="0.55" transform="rotate(15 47 70)"/>

    <!-- Ribbons / squiggles -->
    <path d="M5 35 C10 30 15 40 20 35" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.65"/>
    <path d="M65 80 C70 75 75 85 80 80" :stroke="accentColor ?? 'currentColor'" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.6"/>
    <path d="M45 5 C50 0 55 10 60 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.5"/>
  </svg>
</template>
