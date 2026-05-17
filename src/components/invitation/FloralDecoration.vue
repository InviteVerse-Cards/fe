<script setup lang="ts">
const props = defineProps<{
  variant: 'corner-tl' | 'corner-tr' | 'corner-bl' | 'corner-br' | 'divider'
  color?: string
  opacity?: number
  size?: number
}>()
</script>

<template>
  <!-- Top-left botanical corner -->
  <svg
    v-if="variant === 'corner-tl'"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :width="size ?? 200"
    :height="size ?? 200"
    :style="{ color: color ?? 'currentColor', opacity: opacity ?? 0.18 }"
    aria-hidden="true"
  >
    <path d="M 10 190 C 50 140, 140 50, 190 10" stroke="currentColor" stroke-width="1.3" fill="none" opacity="0.7"/>
    <!-- Leaf cluster 1 -->
    <path d="M 50 148 C 28 142, 12 125, 18 112 C 30 108, 48 128, 50 148 Z" fill="currentColor" opacity="0.55"/>
    <path d="M 50 148 C 72 140, 86 150, 78 168 C 62 172, 50 160, 50 148 Z" fill="currentColor" opacity="0.45"/>
    <path d="M 50 148 C 35 132, 22 118, 18 112" stroke="currentColor" stroke-width="0.7" opacity="0.4"/>
    <!-- Leaf cluster 2 -->
    <path d="M 100 98 C 76 90, 62 70, 72 58 C 88 58, 104 80, 100 98 Z" fill="currentColor" opacity="0.55"/>
    <path d="M 100 98 C 124 90, 140 98, 132 116 C 114 120, 100 108, 100 98 Z" fill="currentColor" opacity="0.45"/>
    <path d="M 100 98 C 84 80, 74 64, 72 58" stroke="currentColor" stroke-width="0.7" opacity="0.4"/>
    <!-- Leaf cluster 3 -->
    <path d="M 155 45 C 136 36, 126 18, 138 12 C 152 14, 162 32, 155 45 Z" fill="currentColor" opacity="0.55"/>
    <path d="M 155 45 C 170 36, 180 44, 174 62 C 158 65, 153 55, 155 45 Z" fill="currentColor" opacity="0.45"/>
    <path d="M 155 45 C 144 30, 136 18, 138 12" stroke="currentColor" stroke-width="0.7" opacity="0.4"/>
    <!-- Berries -->
    <circle cx="72" cy="125" r="2.8" fill="currentColor" opacity="0.5"/>
    <circle cx="125" cy="74" r="2.2" fill="currentColor" opacity="0.45"/>
    <circle cx="175" cy="24" r="1.8" fill="currentColor" opacity="0.45"/>
    <!-- Small 5-petal flower at tip -->
    <g transform="translate(188,12)" opacity="0.5">
      <ellipse rx="3" ry="6" transform="rotate(0)" fill="currentColor"/>
      <ellipse rx="3" ry="6" transform="rotate(72)" fill="currentColor"/>
      <ellipse rx="3" ry="6" transform="rotate(144)" fill="currentColor"/>
      <ellipse rx="3" ry="6" transform="rotate(216)" fill="currentColor"/>
      <ellipse rx="3" ry="6" transform="rotate(288)" fill="currentColor"/>
      <circle r="2.5" fill="currentColor"/>
    </g>
  </svg>

  <!-- Top-right botanical corner (mirror of TL) -->
  <svg
    v-else-if="variant === 'corner-tr'"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :width="size ?? 200"
    :height="size ?? 200"
    :style="{ color: color ?? 'currentColor', opacity: opacity ?? 0.18 }"
    aria-hidden="true"
  >
    <g transform="scale(-1,1) translate(-200,0)">
      <path d="M 10 190 C 50 140, 140 50, 190 10" stroke="currentColor" stroke-width="1.3" fill="none" opacity="0.7"/>
      <path d="M 50 148 C 28 142, 12 125, 18 112 C 30 108, 48 128, 50 148 Z" fill="currentColor" opacity="0.55"/>
      <path d="M 50 148 C 72 140, 86 150, 78 168 C 62 172, 50 160, 50 148 Z" fill="currentColor" opacity="0.45"/>
      <path d="M 50 148 C 35 132, 22 118, 18 112" stroke="currentColor" stroke-width="0.7" opacity="0.4"/>
      <path d="M 100 98 C 76 90, 62 70, 72 58 C 88 58, 104 80, 100 98 Z" fill="currentColor" opacity="0.55"/>
      <path d="M 100 98 C 124 90, 140 98, 132 116 C 114 120, 100 108, 100 98 Z" fill="currentColor" opacity="0.45"/>
      <path d="M 100 98 C 84 80, 74 64, 72 58" stroke="currentColor" stroke-width="0.7" opacity="0.4"/>
      <path d="M 155 45 C 136 36, 126 18, 138 12 C 152 14, 162 32, 155 45 Z" fill="currentColor" opacity="0.55"/>
      <path d="M 155 45 C 170 36, 180 44, 174 62 C 158 65, 153 55, 155 45 Z" fill="currentColor" opacity="0.45"/>
      <path d="M 155 45 C 144 30, 136 18, 138 12" stroke="currentColor" stroke-width="0.7" opacity="0.4"/>
      <circle cx="72" cy="125" r="2.8" fill="currentColor" opacity="0.5"/>
      <circle cx="125" cy="74" r="2.2" fill="currentColor" opacity="0.45"/>
      <circle cx="175" cy="24" r="1.8" fill="currentColor" opacity="0.45"/>
      <g transform="translate(188,12)" opacity="0.5">
        <ellipse rx="3" ry="6" transform="rotate(0)" fill="currentColor"/>
        <ellipse rx="3" ry="6" transform="rotate(72)" fill="currentColor"/>
        <ellipse rx="3" ry="6" transform="rotate(144)" fill="currentColor"/>
        <ellipse rx="3" ry="6" transform="rotate(216)" fill="currentColor"/>
        <ellipse rx="3" ry="6" transform="rotate(288)" fill="currentColor"/>
        <circle r="2.5" fill="currentColor"/>
      </g>
    </g>
  </svg>

  <!-- Bottom-right (rotate 180 of TL) -->
  <svg
    v-else-if="variant === 'corner-br'"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :width="size ?? 200"
    :height="size ?? 200"
    :style="{ color: color ?? 'currentColor', opacity: opacity ?? 0.18 }"
    aria-hidden="true"
  >
    <g transform="rotate(180,100,100)">
      <path d="M 10 190 C 50 140, 140 50, 190 10" stroke="currentColor" stroke-width="1.3" fill="none" opacity="0.7"/>
      <path d="M 50 148 C 28 142, 12 125, 18 112 C 30 108, 48 128, 50 148 Z" fill="currentColor" opacity="0.55"/>
      <path d="M 50 148 C 72 140, 86 150, 78 168 C 62 172, 50 160, 50 148 Z" fill="currentColor" opacity="0.45"/>
      <path d="M 50 148 C 35 132, 22 118, 18 112" stroke="currentColor" stroke-width="0.7" opacity="0.4"/>
      <path d="M 100 98 C 76 90, 62 70, 72 58 C 88 58, 104 80, 100 98 Z" fill="currentColor" opacity="0.55"/>
      <path d="M 100 98 C 124 90, 140 98, 132 116 C 114 120, 100 108, 100 98 Z" fill="currentColor" opacity="0.45"/>
      <path d="M 100 98 C 84 80, 74 64, 72 58" stroke="currentColor" stroke-width="0.7" opacity="0.4"/>
      <path d="M 155 45 C 136 36, 126 18, 138 12 C 152 14, 162 32, 155 45 Z" fill="currentColor" opacity="0.55"/>
      <path d="M 155 45 C 170 36, 180 44, 174 62 C 158 65, 153 55, 155 45 Z" fill="currentColor" opacity="0.45"/>
      <path d="M 155 45 C 144 30, 136 18, 138 12" stroke="currentColor" stroke-width="0.7" opacity="0.4"/>
      <circle cx="72" cy="125" r="2.8" fill="currentColor" opacity="0.5"/>
      <circle cx="125" cy="74" r="2.2" fill="currentColor" opacity="0.45"/>
      <circle cx="175" cy="24" r="1.8" fill="currentColor" opacity="0.45"/>
      <g transform="translate(188,12)" opacity="0.5">
        <ellipse rx="3" ry="6" transform="rotate(0)" fill="currentColor"/>
        <ellipse rx="3" ry="6" transform="rotate(72)" fill="currentColor"/>
        <ellipse rx="3" ry="6" transform="rotate(144)" fill="currentColor"/>
        <ellipse rx="3" ry="6" transform="rotate(216)" fill="currentColor"/>
        <ellipse rx="3" ry="6" transform="rotate(288)" fill="currentColor"/>
        <circle r="2.5" fill="currentColor"/>
      </g>
    </g>
  </svg>

  <!-- Bottom-left (mirror + rotate) -->
  <svg
    v-else-if="variant === 'corner-bl'"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :width="size ?? 200"
    :height="size ?? 200"
    :style="{ color: color ?? 'currentColor', opacity: opacity ?? 0.18 }"
    aria-hidden="true"
  >
    <g transform="scale(1,-1) translate(0,-200)">
      <path d="M 10 190 C 50 140, 140 50, 190 10" stroke="currentColor" stroke-width="1.3" fill="none" opacity="0.7"/>
      <path d="M 50 148 C 28 142, 12 125, 18 112 C 30 108, 48 128, 50 148 Z" fill="currentColor" opacity="0.55"/>
      <path d="M 50 148 C 72 140, 86 150, 78 168 C 62 172, 50 160, 50 148 Z" fill="currentColor" opacity="0.45"/>
      <path d="M 50 148 C 35 132, 22 118, 18 112" stroke="currentColor" stroke-width="0.7" opacity="0.4"/>
      <path d="M 100 98 C 76 90, 62 70, 72 58 C 88 58, 104 80, 100 98 Z" fill="currentColor" opacity="0.55"/>
      <path d="M 100 98 C 124 90, 140 98, 132 116 C 114 120, 100 108, 100 98 Z" fill="currentColor" opacity="0.45"/>
      <circle cx="125" cy="74" r="2.2" fill="currentColor" opacity="0.45"/>
      <path d="M 155 45 C 136 36, 126 18, 138 12 C 152 14, 162 32, 155 45 Z" fill="currentColor" opacity="0.55"/>
      <circle cx="72" cy="125" r="2.8" fill="currentColor" opacity="0.5"/>
    </g>
  </svg>

  <!-- Horizontal floral divider -->
  <svg
    v-else-if="variant === 'divider'"
    viewBox="0 0 400 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    :width="size ?? 320"
    height="32"
    :style="{ color: color ?? 'currentColor', opacity: opacity ?? 0.35 }"
    aria-hidden="true"
  >
    <!-- Left line -->
    <path d="M 0 20 L 158 20" stroke="currentColor" stroke-width="0.8" opacity="0.6"/>
    <!-- Right line -->
    <path d="M 242 20 L 400 20" stroke="currentColor" stroke-width="0.8" opacity="0.6"/>
    <!-- Center diamond + dots -->
    <path d="M 200 8 L 208 20 L 200 32 L 192 20 Z" fill="currentColor" opacity="0.8"/>
    <circle cx="178" cy="20" r="2.5" fill="currentColor" opacity="0.7"/>
    <circle cx="165" cy="20" r="1.8" fill="currentColor" opacity="0.5"/>
    <circle cx="222" cy="20" r="2.5" fill="currentColor" opacity="0.7"/>
    <circle cx="235" cy="20" r="1.8" fill="currentColor" opacity="0.5"/>
    <!-- Small leaf accents -->
    <path d="M 185 14 C 178 10, 170 12, 172 18 C 178 20, 185 18, 185 14 Z" fill="currentColor" opacity="0.55"/>
    <path d="M 185 26 C 178 30, 170 28, 172 22 C 178 20, 185 22, 185 26 Z" fill="currentColor" opacity="0.45"/>
    <path d="M 215 14 C 222 10, 230 12, 228 18 C 222 20, 215 18, 215 14 Z" fill="currentColor" opacity="0.55"/>
    <path d="M 215 26 C 222 30, 230 28, 228 22 C 222 20, 215 22, 215 26 Z" fill="currentColor" opacity="0.45"/>
  </svg>
</template>
