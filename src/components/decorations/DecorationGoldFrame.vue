<script setup lang="ts">
defineProps<{
  color?: string
  opacity?: number
  width?: number
  height?: number
  inset?: number
}>()
</script>

<template>
  <svg
    class="absolute pointer-events-none"
    :width="width ?? 400"
    :height="height ?? 600"
    :viewBox="`0 0 ${width ?? 400} ${height ?? 600}`"
    fill="none"
    :style="{ color: color ?? 'currentColor', opacity: opacity ?? 1 }"
  >
    <!-- Outer border rectangle -->
    <rect
      :x="(inset ?? 8)"
      :y="(inset ?? 8)"
      :width="(width ?? 400) - (inset ?? 8) * 2"
      :height="(height ?? 600) - (inset ?? 8) * 2"
      stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.8"
    />
    <!-- Inner border rectangle -->
    <rect
      :x="(inset ?? 8) + 6"
      :y="(inset ?? 8) + 6"
      :width="(width ?? 400) - ((inset ?? 8) + 6) * 2"
      :height="(height ?? 600) - ((inset ?? 8) + 6) * 2"
      stroke="currentColor" stroke-width="0.8" fill="none" opacity="0.5"
    />

    <!-- Corner ornament: top-left -->
    <g :transform="`translate(${inset ?? 8}, ${inset ?? 8})`" opacity="0.9">
      <circle cx="0" cy="0" r="5" fill="currentColor"/>
      <path d="M8 0 L30 0" stroke="currentColor" stroke-width="1.2"/>
      <path d="M0 8 L0 30" stroke="currentColor" stroke-width="1.2"/>
      <path d="M5 5 L18 5 L18 18 L5 18 Z" stroke="currentColor" stroke-width="0.8" fill="none" opacity="0.5"/>
      <circle cx="11" cy="11" r="3" fill="currentColor" opacity="0.6"/>
    </g>

    <!-- Corner ornament: top-right -->
    <g :transform="`translate(${(width ?? 400) - (inset ?? 8)}, ${inset ?? 8}) scale(-1, 1)`" opacity="0.9">
      <circle cx="0" cy="0" r="5" fill="currentColor"/>
      <path d="M8 0 L30 0" stroke="currentColor" stroke-width="1.2"/>
      <path d="M0 8 L0 30" stroke="currentColor" stroke-width="1.2"/>
      <path d="M5 5 L18 5 L18 18 L5 18 Z" stroke="currentColor" stroke-width="0.8" fill="none" opacity="0.5"/>
      <circle cx="11" cy="11" r="3" fill="currentColor" opacity="0.6"/>
    </g>

    <!-- Corner ornament: bottom-left -->
    <g :transform="`translate(${inset ?? 8}, ${(height ?? 600) - (inset ?? 8)}) scale(1, -1)`" opacity="0.9">
      <circle cx="0" cy="0" r="5" fill="currentColor"/>
      <path d="M8 0 L30 0" stroke="currentColor" stroke-width="1.2"/>
      <path d="M0 8 L0 30" stroke="currentColor" stroke-width="1.2"/>
      <path d="M5 5 L18 5 L18 18 L5 18 Z" stroke="currentColor" stroke-width="0.8" fill="none" opacity="0.5"/>
      <circle cx="11" cy="11" r="3" fill="currentColor" opacity="0.6"/>
    </g>

    <!-- Corner ornament: bottom-right -->
    <g :transform="`translate(${(width ?? 400) - (inset ?? 8)}, ${(height ?? 600) - (inset ?? 8)}) scale(-1, -1)`" opacity="0.9">
      <circle cx="0" cy="0" r="5" fill="currentColor"/>
      <path d="M8 0 L30 0" stroke="currentColor" stroke-width="1.2"/>
      <path d="M0 8 L0 30" stroke="currentColor" stroke-width="1.2"/>
      <path d="M5 5 L18 5 L18 18 L5 18 Z" stroke="currentColor" stroke-width="0.8" fill="none" opacity="0.5"/>
      <circle cx="11" cy="11" r="3" fill="currentColor" opacity="0.6"/>
    </g>

    <!-- Center top ornament -->
    <g :transform="`translate(${(width ?? 400) / 2}, ${inset ?? 8})`" opacity="0.7">
      <path d="M-20 0 L-6 0" stroke="currentColor" stroke-width="1"/>
      <diamond transform="translate(0, 0)">
        <polygon points="0,-5 5,0 0,5 -5,0" fill="currentColor"/>
      </diamond>
      <polygon points="0,-5 5,0 0,5 -5,0" fill="currentColor"/>
      <path d="M6 0 L20 0" stroke="currentColor" stroke-width="1"/>
    </g>

    <!-- Center bottom ornament -->
    <g :transform="`translate(${(width ?? 400) / 2}, ${(height ?? 600) - (inset ?? 8)})`" opacity="0.7">
      <path d="M-20 0 L-6 0" stroke="currentColor" stroke-width="1"/>
      <polygon points="0,-5 5,0 0,5 -5,0" fill="currentColor"/>
      <path d="M6 0 L20 0" stroke="currentColor" stroke-width="1"/>
    </g>
  </svg>
</template>
