import type { SectionType } from '@/types/section.types'

export const CATEGORY_LABELS: Record<string, string> = {
  wedding:     'Thiệp cưới',
  birthday:    'Sinh nhật',
  baby_shower: 'Thôi nôi',
  housewarming:'Tân gia',
  house_warming:'Tân gia',
  corporate:   'Doanh nghiệp',
}

export const CATEGORY_OPTIONS = [
  { value: 'wedding',      label: 'Thiệp cưới' },
  { value: 'birthday',     label: 'Sinh nhật' },
  { value: 'baby_shower',  label: 'Thôi nôi' },
  { value: 'housewarming', label: 'Tân gia' },
  { value: 'corporate',    label: 'Doanh nghiệp' },
]

export const CATEGORY_COLORS: Record<string, string> = {
  wedding:     'bg-rose-100 text-rose-700',
  birthday:    'bg-amber-100 text-amber-700',
  baby_shower: 'bg-pink-100 text-pink-700',
  housewarming:'bg-green-100 text-green-700',
  house_warming:'bg-green-100 text-green-700',
  corporate:   'bg-blue-100 text-blue-700',
}

export const CATEGORY_SECTIONS: Record<string, SectionType[]> = {
  wedding: [
    'hero', 'couple_images', 'family_info', 'event_info', 'gallery',
    'timeline', 'countdown', 'rsvp', 'bank_transfer', 'music', 'wishes',
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
    'hero', 'event_info', 'gallery', 'countdown', 'rsvp', 'bank_transfer', 'music', 'wishes',
  ],
}

export function getAllowedSections(category: string): SectionType[] {
  return CATEGORY_SECTIONS[category] ?? CATEGORY_SECTIONS['wedding']
}
