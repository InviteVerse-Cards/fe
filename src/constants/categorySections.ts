import type { SectionType } from '@/types/section.types'

export const CATEGORY_SECTIONS: Record<string, SectionType[]> = {
  wedding: [
    'hero', 'couple_images', 'family_info', 'event_info', 'gallery',
    'timeline', 'countdown', 'rsvp', 'map', 'bank_transfer', 'music', 'wishes',
  ],
  birthday: [
    'hero', 'event_info', 'gallery', 'countdown', 'rsvp', 'bank_transfer', 'music', 'wishes',
  ],
  baby_shower: [
    'hero', 'event_info', 'gallery', 'countdown', 'rsvp', 'bank_transfer', 'music', 'wishes',
  ],
  house_warming: [
    'hero', 'event_info', 'gallery', 'rsvp', 'bank_transfer', 'music', 'wishes',
  ],
  housewarming: [
    'hero', 'event_info', 'gallery', 'rsvp', 'bank_transfer', 'music', 'wishes',
  ],
  corporate: [
    'hero', 'event_info', 'gallery', 'countdown', 'rsvp', 'map', 'bank_transfer', 'music', 'wishes',
  ],
}

export function getAllowedSections(category: string): SectionType[] {
  return CATEGORY_SECTIONS[category] ?? CATEGORY_SECTIONS['wedding']
}
