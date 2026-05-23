<script setup lang="ts">
import { computed, onMounted, watch, type Component } from 'vue'
import type { PublicInvitation } from '@/types/invitation.types'
import type { SectionType } from '@/types/section.types'
import { useScrollReveal } from '@/composables/useScrollReveal'
import { loadThemeFonts } from '@/utils/fontLoader'
import HeroSection from '@/components/editor/sections/HeroSection.vue'
import EventInfoSection from '@/components/editor/sections/EventInfoSection.vue'
import FamilyInfoSection from '@/components/editor/sections/FamilyInfoSection.vue'
import GallerySection from '@/components/editor/sections/GallerySection.vue'
import CountdownSection from '@/components/editor/sections/CountdownSection.vue'
import WishesSection from '@/components/editor/sections/WishesSection.vue'
import TimelineSection from '@/components/editor/sections/TimelineSection.vue'
import MapSection from '@/components/editor/sections/MapSection.vue'
import MusicSection from '@/components/editor/sections/MusicSection.vue'
import BankTransferSection from '@/components/editor/sections/BankTransferSection.vue'
import CoupleImagesSection from '@/components/editor/sections/CoupleImagesSection.vue'
import PublicRSVPForm from './PublicRSVPForm.vue'
import { getOptimizedUrl } from '@/utils/cloudinaryUrl'

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

const props = defineProps<{ invitation: PublicInvitation; guestName?: string }>()

const SECTION_MAP: Record<SectionType, Component> = {
  hero: HeroSection,
  couple_images: CoupleImagesSection,
  event_info: EventInfoSection,
  family_info: FamilyInfoSection,
  gallery: GallerySection,
  timeline: TimelineSection,
  countdown: CountdownSection,
  map: MapSection,
  rsvp: PublicRSVPForm,
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

const visibleSections = computed(() =>
  [...props.invitation.sections]
    .filter(s => s.is_enabled)
    .sort((a, b) => a.sort_order - b.sort_order)
)

const layoutType = computed<string>(() => {
  const heroSection = props.invitation.sections.find(s => s.section_type === 'hero')
  return (
    (heroSection?.config as Record<string, unknown>)?.layout_type as string
    ?? (heroSection?.config as Record<string, unknown>)?.layout_variant as string
    ?? 'botanical'
  )
})

useScrollReveal()

onMounted(() => {
  // Load theme fonts
  loadThemeFonts(props.invitation.theme_config.font_heading, props.invitation.theme_config.font_body)

  // Preload hero image
  const heroSection = props.invitation.sections.find(s => s.section_type === 'hero')
  const bgUrl = (heroSection?.config as Record<string, unknown>)?.background_url as string | undefined
  if (bgUrl) {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'image'
    link.href = getOptimizedUrl(bgUrl, 1200)
    document.head.appendChild(link)
  }
})

watch(() => props.invitation.theme_config, (theme) => {
  loadThemeFonts(theme.font_heading, theme.font_body)
}, { deep: true })
</script>

<template>
  <component :is="LAYOUT_MAP[layoutType] || LayoutBotanical" :theme="invitation.theme_config">
    <component
      :is="SECTION_MAP[section.section_type as SectionType] || WishesSection"
      v-for="section in visibleSections"
      :key="section.section_type"
      :config="section.config"
      :theme="invitation.theme_config"
      :slug="invitation.slug"
      :category="invitation.category"
      :guest-name="section.section_type === 'hero' ? guestName : undefined"
    />
  </component>
</template>
