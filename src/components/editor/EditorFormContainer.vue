<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useEditorStore } from '@/stores/editor.store'
import { SECTION_LABELS, SECTION_ICONS } from '@/types/section.types'
import type { SectionType } from '@/types/section.types'
import AccordionPanel from './AccordionPanel.vue'

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

// Sections that are expanded by default on load
const defaultOpenSections: SectionType[] = ['hero', 'event_info']
</script>

<template>
  <div class="mx-auto w-full max-w-2xl px-4 py-8 space-y-4">
    <AccordionPanel
      v-for="section in [...sections].sort((a, b) => a.sort_order - b.sort_order)"
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
      />
      <div v-else class="py-4 text-center text-sm text-gray-400">
        Chưa có form cho section này
      </div>
    </AccordionPanel>
  </div>
</template>
