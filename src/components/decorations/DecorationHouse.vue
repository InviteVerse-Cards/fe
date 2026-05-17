<script setup lang="ts">
defineProps<{
  color?: string
  opacity?: number
  size?: number
}>()
</script>

<template>
  <svg
    :width="size ?? 120"
    :height="size ?? 100"
    viewBox="0 0 120 100"
    fill="none"
    :style="{ color: color ?? 'currentColor', opacity: opacity ?? 1 }"
  >
    <!-- House body -->
    <rect x="25" y="45" width="70" height="50" rx="2" fill="currentColor" opacity="0.7"/>
    <!-- Roof -->
    <polygon points="20,48 60,10 100,48" fill="currentColor" opacity="0.85"/>
    <!-- Chimney -->
    <rect x="70" y="18" width="10" height="22" rx="1" fill="currentColor" opacity="0.75"/>
    <!-- Smoke puffs -->
    <circle cx="75" cy="12" r="5" fill="currentColor" opacity="0.3"/>
    <circle cx="78" cy="6" r="4" fill="currentColor" opacity="0.2"/>
    <circle cx="73" cy="2" r="3" fill="currentColor" opacity="0.15"/>
    <!-- Door -->
    <rect x="48" y="65" width="24" height="30" rx="3" fill="currentColor" opacity="0.35"/>
    <circle cx="68" cy="81" r="2" fill="currentColor" opacity="0.5"/>
    <!-- Windows -->
    <rect x="30" y="55" width="16" height="14" rx="2" fill="currentColor" opacity="0.3"/>
    <rect x="74" y="55" width="16" height="14" rx="2" fill="currentColor" opacity="0.3"/>
    <!-- Window cross -->
    <path d="M38 55 L38 69 M30 62 L46 62" stroke="currentColor" stroke-width="1" opacity="0.25"/>
    <path d="M82 55 L82 69 M74 62 L90 62" stroke="currentColor" stroke-width="1" opacity="0.25"/>
    <!-- Left plant -->
    <rect x="5" y="70" width="8" height="25" rx="4" fill="currentColor" opacity="0.5"/>
    <ellipse cx="9" cy="60" rx="10" ry="14" fill="currentColor" opacity="0.4"/>
    <ellipse cx="4" cy="68" rx="7" ry="10" fill="currentColor" opacity="0.35"/>
    <ellipse cx="14" cy="65" rx="7" ry="10" fill="currentColor" opacity="0.35"/>
    <!-- Right plant -->
    <rect x="107" y="70" width="8" height="25" rx="4" fill="currentColor" opacity="0.5"/>
    <ellipse cx="111" cy="60" rx="10" ry="14" fill="currentColor" opacity="0.4"/>
    <ellipse cx="106" cy="65" rx="7" ry="10" fill="currentColor" opacity="0.35"/>
    <ellipse cx="116" cy="68" rx="7" ry="10" fill="currentColor" opacity="0.35"/>
  </svg>
</template>
