<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { loadThemeFonts } from '@/utils/fontLoader'
import { useEditorStore } from '@/stores/editor.store'
import type { Section, ThemeConfig, SectionType } from '@/types/section.types'
import type { LayoutType } from '@/types/template.types'
import type { Component } from 'vue'
import HeroSection from './sections/HeroSection.vue'
import EventInfoSection from './sections/EventInfoSection.vue'
import FamilyInfoSection from './sections/FamilyInfoSection.vue'
import GallerySection from './sections/GallerySection.vue'
import CountdownSection from './sections/CountdownSection.vue'
import RSVPSection from './sections/RSVPSection.vue'
import WishesSection from './sections/WishesSection.vue'
import TimelineSection from './sections/TimelineSection.vue'
import MapSection from './sections/MapSection.vue'
import MusicSection from './sections/MusicSection.vue'
import BankTransferSection from './sections/BankTransferSection.vue'
import CoupleImagesSection from './sections/CoupleImagesSection.vue'

// Import Layout Wrappers
import LayoutBotanical from '@/components/layouts/LayoutBotanical.vue'
import LayoutChineseRed from '@/components/layouts/LayoutChineseRed.vue'
import LayoutLuxuryDark from '@/components/layouts/LayoutLuxuryDark.vue'
import LayoutMinimalist from '@/components/layouts/LayoutMinimalist.vue'
import LayoutRomanticPhoto from '@/components/layouts/LayoutRomanticPhoto.vue'
import LayoutRustic from '@/components/layouts/LayoutRustic.vue'
import LayoutTraditionalViet from '@/components/layouts/LayoutTraditionalViet.vue'
import LayoutBirthdayPlayful from '@/components/layouts/LayoutBirthdayPlayful.vue'
import LayoutBirthdayElegant from '@/components/layouts/LayoutBirthdayElegant.vue'
import LayoutBabySoft from '@/components/layouts/LayoutBabySoft.vue'
import LayoutHouseWarm from '@/components/layouts/LayoutHouseWarm.vue'

const props = defineProps<{
  sections: Section[]
  theme: ThemeConfig
}>()

const editorStore = useEditorStore()

const SECTION_MAP: Record<SectionType, Component> = {
  hero: HeroSection,
  couple_images: CoupleImagesSection,
  event_info: EventInfoSection,
  family_info: FamilyInfoSection,
  gallery: GallerySection,
  timeline: TimelineSection,
  countdown: CountdownSection,
  map: MapSection,
  rsvp: RSVPSection,
  bank_transfer: BankTransferSection,
  music: MusicSection,
  wishes: WishesSection,
}

const LAYOUT_MAP: Record<string, Component> = {
  'botanical': LayoutBotanical,
  'chinese-red': LayoutChineseRed,
  'luxury-dark': LayoutLuxuryDark,
  'minimalist': LayoutMinimalist,
  'romantic-photo': LayoutRomanticPhoto,
  'rustic': LayoutRustic,
  'traditional-viet': LayoutTraditionalViet,
  'birthday-playful': LayoutBirthdayPlayful,
  'birthday-elegant': LayoutBirthdayElegant,
  'baby-soft': LayoutBabySoft,
  'house-warm': LayoutHouseWarm,
}

const layoutType = computed<string>(() => {
  const heroSection = props.sections.find(s => s.section_type === 'hero')
  return (
    (heroSection?.config as Record<string, unknown>)?.layout_type as string
    ?? (heroSection?.config as Record<string, unknown>)?.layout_variant as string
    ?? 'botanical'
  )
})

useScrollReveal()

onMounted(() => {
  loadThemeFonts(props.theme.font_heading, props.theme.font_body)
})

watch(() => props.theme, (newTheme) => {
  loadThemeFonts(newTheme.font_heading, newTheme.font_body)
}, { deep: true })
</script>

<template>
  <component :is="LAYOUT_MAP[layoutType] || LayoutBotanical" :theme="theme">
    <component
      :is="SECTION_MAP[section.section_type as SectionType] || WishesSection"
      v-for="section in sections"
      :key="section.section_type"
      :config="section.config"
      :theme="theme"
      :is-preview="true"
    />

    <div v-if="sections.length === 0" class="flex h-48 items-center justify-center text-sm text-gray-400">
      Bật các mục trong trang Chỉnh sửa để xem preview
    </div>
  </component>
</template>
