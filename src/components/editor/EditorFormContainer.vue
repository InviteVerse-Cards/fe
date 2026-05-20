<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useEditorStore } from '@/stores/editor.store'
import { SECTION_LABELS, SECTION_ICONS } from '@/types/section.types'
import type { SectionType, SectionStyle } from '@/types/section.types'
import AccordionPanel from './AccordionPanel.vue'
import SectionStyleEditor from './SectionStyleEditor.vue'

// Form components
import HeroForm from './forms/HeroForm.vue'
import EventInfoForm from './forms/EventInfoForm.vue'
import GalleryForm from './forms/GalleryForm.vue'
import CountdownForm from './forms/CountdownForm.vue'
import RSVPForm from './forms/RSVPForm.vue'
import MapForm from './forms/MapForm.vue'
import MusicForm from './forms/MusicForm.vue'
import WishesForm from './forms/WishesForm.vue'
import TimelineForm from './forms/TimelineForm.vue'
import FamilyInfoForm from './forms/FamilyInfoForm.vue'
import BankTransferForm from './forms/BankTransferForm.vue'
import CoupleImagesForm from './forms/CoupleImagesForm.vue'

const props = defineProps<{
  allowedSections?: SectionType[]
  category?: string
}>()

const editorStore = useEditorStore()
const { sections } = storeToRefs(editorStore)

const formComponents: Record<string, unknown> = {
  hero: HeroForm,
  couple_images: CoupleImagesForm,
  event_info: EventInfoForm,
  family_info: FamilyInfoForm,
  gallery: GalleryForm,
  countdown: CountdownForm,
  rsvp: RSVPForm,
  bank_transfer: BankTransferForm,
  map: MapForm,
  music: MusicForm,
  wishes: WishesForm,
  timeline: TimelineForm,
}

const defaultOpenSections: SectionType[] = ['hero', 'event_info']

const visibleSections = computed(() => {
  const sorted = [...sections.value].sort((a, b) => a.sort_order - b.sort_order)
  if (!props.allowedSections) return sorted
  return sorted.filter(s => props.allowedSections!.includes(s.section_type as SectionType))
})
</script>

<template>
  <div class="mx-auto w-full max-w-2xl space-y-4 px-4 py-8">
    <AccordionPanel
      v-for="section in visibleSections"
      :key="section.section_type"
      :title="SECTION_LABELS[section.section_type as SectionType] || section.section_type"
      :icon="SECTION_ICONS[section.section_type as SectionType] || '📌'"
      :is-enabled="section.is_enabled"
      :default-open="defaultOpenSections.includes(section.section_type as SectionType)"
      @toggle-enabled="editorStore.toggleSection(section.section_type)"
    >
      <component
        :is="formComponents[section.section_type]"
        v-if="formComponents[section.section_type]"
        :config="section.config"
        :section-type="section.section_type"
        :category="category"
      />
      <div v-else class="py-4 text-center text-sm text-gray-400">
        Chưa có form cho section này
      </div>

      <div class="my-4 border-t border-gray-100" />

      <SectionStyleEditor
        :section-type="section.section_type"
        :style="(section.config.style as SectionStyle) ?? {}"
      />
    </AccordionPanel>
  </div>
</template>
