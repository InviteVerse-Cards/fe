<script setup lang="ts">
defineProps<{
  color?: string
  opacity?: number
  size?: number
  flipped?: boolean
}>()
</script>

<template>
  <svg
    :width="size ?? 160"
    :height="size ?? 160"
    viewBox="0 0 160 160"
    fill="none"
    :style="{ color: color ?? 'currentColor', opacity: opacity ?? 1, transform: flipped ? 'scaleX(-1)' : undefined }"
  >
    <!-- Main branch -->
    <path
      d="M10 150 C30 120 45 90 70 60 C85 45 100 35 120 20"
      stroke="currentColor" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.6"
    />
    <!-- Sub branch 1 -->
    <path
      d="M70 60 C85 55 95 48 110 50"
      stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.55"
    />
    <!-- Sub branch 2 -->
    <path
      d="M45 90 C55 82 65 78 78 80"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.5"
    />
    <!-- Sub branch 3 -->
    <path
      d="M100 38 C108 32 118 28 130 32"
      stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.5"
    />

    <!-- Blossom 1 — branch tip -->
    <g transform="translate(120, 20)">
      <circle r="3" fill="currentColor" opacity="0.6"/>
      <ellipse cx="0" cy="-7" rx="4" ry="6" fill="currentColor" opacity="0.7"/>
      <ellipse cx="0" cy="-7" rx="4" ry="6" fill="currentColor" opacity="0.7" transform="rotate(72 0 0)"/>
      <ellipse cx="0" cy="-7" rx="4" ry="6" fill="currentColor" opacity="0.7" transform="rotate(144 0 0)"/>
      <ellipse cx="0" cy="-7" rx="4" ry="6" fill="currentColor" opacity="0.7" transform="rotate(216 0 0)"/>
      <ellipse cx="0" cy="-7" rx="4" ry="6" fill="currentColor" opacity="0.7" transform="rotate(288 0 0)"/>
    </g>

    <!-- Blossom 2 -->
    <g transform="translate(110, 50) rotate(15)">
      <circle r="2.5" fill="currentColor" opacity="0.55"/>
      <ellipse cx="0" cy="-6" rx="3.5" ry="5.5" fill="currentColor" opacity="0.65"/>
      <ellipse cx="0" cy="-6" rx="3.5" ry="5.5" fill="currentColor" opacity="0.65" transform="rotate(72 0 0)"/>
      <ellipse cx="0" cy="-6" rx="3.5" ry="5.5" fill="currentColor" opacity="0.65" transform="rotate(144 0 0)"/>
      <ellipse cx="0" cy="-6" rx="3.5" ry="5.5" fill="currentColor" opacity="0.65" transform="rotate(216 0 0)"/>
      <ellipse cx="0" cy="-6" rx="3.5" ry="5.5" fill="currentColor" opacity="0.65" transform="rotate(288 0 0)"/>
    </g>

    <!-- Blossom 3 -->
    <g transform="translate(70, 60) rotate(-10)">
      <circle r="3" fill="currentColor" opacity="0.6"/>
      <ellipse cx="0" cy="-7" rx="4" ry="6" fill="currentColor" opacity="0.7"/>
      <ellipse cx="0" cy="-7" rx="4" ry="6" fill="currentColor" opacity="0.7" transform="rotate(72 0 0)"/>
      <ellipse cx="0" cy="-7" rx="4" ry="6" fill="currentColor" opacity="0.7" transform="rotate(144 0 0)"/>
      <ellipse cx="0" cy="-7" rx="4" ry="6" fill="currentColor" opacity="0.7" transform="rotate(216 0 0)"/>
      <ellipse cx="0" cy="-7" rx="4" ry="6" fill="currentColor" opacity="0.7" transform="rotate(288 0 0)"/>
    </g>

    <!-- Blossom 4 (smaller) -->
    <g transform="translate(78, 80) rotate(20)">
      <circle r="2" fill="currentColor" opacity="0.5"/>
      <ellipse cx="0" cy="-5" rx="3" ry="4.5" fill="currentColor" opacity="0.6"/>
      <ellipse cx="0" cy="-5" rx="3" ry="4.5" fill="currentColor" opacity="0.6" transform="rotate(72 0 0)"/>
      <ellipse cx="0" cy="-5" rx="3" ry="4.5" fill="currentColor" opacity="0.6" transform="rotate(144 0 0)"/>
      <ellipse cx="0" cy="-5" rx="3" ry="4.5" fill="currentColor" opacity="0.6" transform="rotate(216 0 0)"/>
      <ellipse cx="0" cy="-5" rx="3" ry="4.5" fill="currentColor" opacity="0.6" transform="rotate(288 0 0)"/>
    </g>

    <!-- Blossom 5 -->
    <g transform="translate(130, 32) rotate(-5)">
      <circle r="2.5" fill="currentColor" opacity="0.55"/>
      <ellipse cx="0" cy="-6" rx="3.5" ry="5" fill="currentColor" opacity="0.65"/>
      <ellipse cx="0" cy="-6" rx="3.5" ry="5" fill="currentColor" opacity="0.65" transform="rotate(72 0 0)"/>
      <ellipse cx="0" cy="-6" rx="3.5" ry="5" fill="currentColor" opacity="0.65" transform="rotate(144 0 0)"/>
      <ellipse cx="0" cy="-6" rx="3.5" ry="5" fill="currentColor" opacity="0.65" transform="rotate(216 0 0)"/>
      <ellipse cx="0" cy="-6" rx="3.5" ry="5" fill="currentColor" opacity="0.65" transform="rotate(288 0 0)"/>
    </g>

    <!-- Falling petals -->
    <ellipse cx="50" cy="120" rx="4" ry="6" fill="currentColor" opacity="0.35" transform="rotate(-30 50 120)"/>
    <ellipse cx="90" cy="110" rx="3.5" ry="5.5" fill="currentColor" opacity="0.3" transform="rotate(20 90 110)"/>
    <ellipse cx="140" cy="80" rx="3" ry="5" fill="currentColor" opacity="0.25" transform="rotate(-15 140 80)"/>
  </svg>
</template>
