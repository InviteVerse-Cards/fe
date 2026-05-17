<script setup lang="ts">
defineProps<{
  variant?: 'cloud' | 'star' | 'moon' | 'mixed'
  color?: string
  opacity?: number
  size?: number
}>()
</script>

<template>
  <svg
    :width="size ?? 80"
    :height="size ?? 80"
    viewBox="0 0 80 80"
    fill="none"
    :style="{ color: color ?? 'currentColor', opacity: opacity ?? 1 }"
  >
    <!-- Cloud -->
    <template v-if="variant === 'cloud' || variant === 'mixed' || !variant">
      <ellipse cx="40" cy="45" rx="28" ry="18" fill="currentColor" opacity="0.8"/>
      <circle cx="26" cy="40" r="13" fill="currentColor" opacity="0.9"/>
      <circle cx="40" cy="35" r="16" fill="currentColor" opacity="0.95"/>
      <circle cx="55" cy="40" r="12" fill="currentColor" opacity="0.9"/>
      <!-- Rain dots (for decoration) -->
      <circle cx="30" cy="68" r="2" fill="currentColor" opacity="0.4"/>
      <circle cx="40" cy="70" r="2" fill="currentColor" opacity="0.4"/>
      <circle cx="50" cy="68" r="2" fill="currentColor" opacity="0.4"/>
    </template>

    <!-- Star -->
    <template v-else-if="variant === 'star'">
      <polygon
        points="40,8 47,30 70,30 52,46 58,70 40,55 22,70 28,46 10,30 33,30"
        fill="currentColor" opacity="0.85"
      />
      <polygon
        points="40,18 45,32 58,32 48,41 51,55 40,47 29,55 32,41 22,32 35,32"
        fill="currentColor" opacity="0.3"
      />
    </template>

    <!-- Moon -->
    <template v-else-if="variant === 'moon'">
      <path
        d="M55 15 C35 18 20 32 20 50 C20 65 32 76 48 78 C28 75 12 60 12 42 C12 24 28 10 48 10 C50 10 52 10 55 15Z"
        fill="currentColor" opacity="0.85"
      />
      <!-- Stars around moon -->
      <circle cx="60" cy="25" r="3" fill="currentColor" opacity="0.6"/>
      <circle cx="68" cy="45" r="2" fill="currentColor" opacity="0.5"/>
      <circle cx="58" cy="60" r="2.5" fill="currentColor" opacity="0.55"/>
      <polygon points="70,15 72,20 77,20 73,23 75,28 70,25 65,28 67,23 63,20 68,20" fill="currentColor" opacity="0.5"/>
    </template>

    <!-- Mixed: cloud + small star -->
    <template v-if="variant === 'mixed'">
      <polygon
        transform="translate(55, 10) scale(0.5)"
        points="15,0 18,10 28,10 20,16 23,26 15,20 7,26 10,16 2,10 12,10"
        fill="currentColor" opacity="0.6"
      />
    </template>
  </svg>
</template>
