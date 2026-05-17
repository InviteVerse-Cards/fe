<script setup lang="ts">
defineProps<{
  variant?: 'full' | 'half' | 'bud'
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
    <!-- Bud variant -->
    <template v-if="variant === 'bud'">
      <ellipse cx="40" cy="35" rx="10" ry="18" fill="currentColor" opacity="0.8"/>
      <ellipse cx="30" cy="42" rx="8" ry="14" fill="currentColor" opacity="0.6" transform="rotate(-20 30 42)"/>
      <ellipse cx="50" cy="42" rx="8" ry="14" fill="currentColor" opacity="0.6" transform="rotate(20 50 42)"/>
      <path d="M28 62 Q40 58 52 62 Q46 70 40 72 Q34 70 28 62Z" fill="currentColor" opacity="0.5"/>
    </template>

    <!-- Half variant (facing up, like divider) -->
    <template v-else-if="variant === 'half'">
      <path d="M40 55 C25 55 12 48 10 36 C18 38 28 42 40 42 C52 42 62 38 70 36 C68 48 55 55 40 55Z" fill="currentColor" opacity="0.7"/>
      <ellipse cx="40" cy="30" rx="12" ry="20" fill="currentColor" opacity="0.85"/>
      <ellipse cx="22" cy="40" rx="9" ry="15" fill="currentColor" opacity="0.6" transform="rotate(-25 22 40)"/>
      <ellipse cx="58" cy="40" rx="9" ry="15" fill="currentColor" opacity="0.6" transform="rotate(25 58 40)"/>
      <path d="M20 58 Q40 62 60 58" stroke="currentColor" stroke-width="2" fill="none" opacity="0.4"/>
    </template>

    <!-- Full lotus (default) -->
    <template v-else>
      <!-- Water / base leaves -->
      <path d="M10 60 Q40 50 70 60 Q55 72 40 74 Q25 72 10 60Z" fill="currentColor" opacity="0.35"/>
      <!-- Outer petals bottom layer -->
      <ellipse cx="16" cy="42" rx="9" ry="16" fill="currentColor" opacity="0.5" transform="rotate(-35 16 42)"/>
      <ellipse cx="64" cy="42" rx="9" ry="16" fill="currentColor" opacity="0.5" transform="rotate(35 64 42)"/>
      <ellipse cx="40" cy="55" rx="9" ry="16" fill="currentColor" opacity="0.45" transform="rotate(0 40 55)"/>
      <!-- Middle petals -->
      <ellipse cx="24" cy="32" rx="9" ry="18" fill="currentColor" opacity="0.65" transform="rotate(-18 24 32)"/>
      <ellipse cx="56" cy="32" rx="9" ry="18" fill="currentColor" opacity="0.65" transform="rotate(18 56 32)"/>
      <!-- Center petal (tallest) -->
      <ellipse cx="40" cy="26" rx="11" ry="22" fill="currentColor" opacity="0.85"/>
      <!-- Stamen -->
      <circle cx="40" cy="40" r="5" fill="currentColor" opacity="0.9"/>
      <circle cx="40" cy="40" r="2.5" fill="currentColor" opacity="0.4"/>
    </template>
  </svg>
</template>
