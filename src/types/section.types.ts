export type SectionType =
  | 'hero'
  | 'event_info'
  | 'family_info'
  | 'gallery'
  | 'timeline'
  | 'countdown'
  | 'map'
  | 'rsvp'
  | 'bank_transfer'
  | 'music'
  | 'wishes'
  | 'couple_images'

export interface Section {
  id?: number
  section_type: SectionType
  sort_order: number
  is_enabled: boolean
  config: Record<string, unknown>
}

export interface ThemeConfig {
  primary_color: string
  secondary_color: string
  background_color: string
  text_color: string
  accent_color: string
  font_heading: string
  font_body: string
  border_radius: 'none' | 'sm' | 'md' | 'lg'
  animation: 'none' | 'fade' | 'slide'
}

export interface SectionStyle {
  font?: string             // override font heading cho section ('' = dùng global)
  text_color?: string       // override màu chữ ('' = dùng global)
  background_color?: string // override màu nền section ('' = trong suốt)
  countdown_text_color?: string  // override màu số đếm ngược (hero only)
  countdown_label_color?: string // override màu nhãn Ngày/Giờ/Phút/Giây (hero only)
  countdown_bg?: string          // override màu nền ô đếm ngược, hỗ trợ rgba (hero only)
}

export const FONT_OPTIONS: { label: string; value: string }[] = [
  { label: '— Theo chủ đạo —', value: '' },
  { label: 'Great Vibes', value: 'Great Vibes' },
  { label: 'Dancing Script', value: 'Dancing Script' },
  { label: 'Parisienne', value: 'Parisienne' },
  { label: 'Alex Brush', value: 'Alex Brush' },
  { label: 'Pinyon Script', value: 'Pinyon Script' },
  { label: 'Playfair Display', value: 'Playfair Display' },
  { label: 'EB Garamond', value: 'EB Garamond' },
  { label: 'Cormorant Garamond', value: 'Cormorant Garamond' },
  { label: 'Lora', value: 'Lora' },
  { label: 'Lato', value: 'Lato' },
  { label: 'Montserrat', value: 'Montserrat' },
  { label: 'Raleway', value: 'Raleway' },
  { label: 'Nunito', value: 'Nunito' },
  { label: 'Open Sans', value: 'Open Sans' },
]

// Section-specific config interfaces
export interface HeroConfig {
  bride_name?: string
  groom_name?: string
  bride_short_name?: string     // tên ngắn cô dâu (vd: Linh)
  groom_short_name?: string     // tên ngắn chú rể (vd: Nam)
  bride_title?: string          // danh xưng cô dâu (vd: Út Nữ)
  groom_title?: string          // danh xưng chú rể (vd: Trưởng Nam)
  display_order?: 'groom_first' | 'bride_first'  // thứ tự hiển thị
  tagline?: string
  background_url?: string       // template design — NOT user-editable via form
  background_overlay?: number
  couple_photo_url?: string     // user's couple photo — displayed as oval inset
  groom_photo_url?: string      // ảnh riêng chú rể
  bride_photo_url?: string      // ảnh riêng cô dâu
  show_countdown?: boolean
  event_date?: string
  layout_variant?: string       // legacy — use layout_type instead
  layout_type?: string          // archetype system (botanical, luxury-dark, traditional-viet, ...)
}

export interface Ceremony {
  name: string
  date: string
  time: string
  venue: string
  address: string
  map_url?: string
}

export interface EventInfoConfig {
  ceremonies: Ceremony[]
  invitation_message?: string
}

export interface GalleryConfig {
  title?: string
  images: Array<{ url: string; caption?: string }>
  layout: 'grid' | 'masonry' | 'slider'
}

export interface TimelineEvent {
  date: string
  title: string
  description?: string
  image_url?: string
}

export interface TimelineConfig {
  events: TimelineEvent[]
  title?: string
}

export interface CountdownConfig {
  target_date?: string
  title?: string
  expired_message?: string
}

export interface MapConfig {
  embed_url?: string
  venue_name?: string
  address?: string
  place_id?: string
  lat?: number
  lng?: number
}

export interface RSVPConfig {
  title?: string
  subtitle?: string
  deadline?: string
}

export interface MusicConfig {
  enabled: boolean
  autoplay: boolean
  track_url?: string
  track_name?: string
}

export interface CoupleImagesConfig {
  groom_photo_url?: string
  bride_photo_url?: string
}

export interface WishesConfig {
  title?: string
}

export interface FamilyMember {
  title: string
  name: string
}

export interface FamilySide {
  family_name: string
  father: FamilyMember
  mother: FamilyMember
  note?: string
}

export interface FamilyInfoConfig {
  title?: string
  groom_family: FamilySide
  bride_family: FamilySide
}

export interface BankTransferConfig {
  title?: string
  bank_id: string
  account_number: string
  account_name: string
  amount?: number
  transfer_message?: string
  note?: string
}

export const SECTION_LABELS: Record<SectionType, string> = {
  hero: 'Thông tin cơ bản',
  event_info: 'Thông tin lễ cưới',
  family_info: 'Thông tin gia đình',
  gallery: 'Album ảnh',
  timeline: 'Hành trình tình yêu',
  countdown: 'Đếm ngược',
  map: 'Bản đồ',
  rsvp: 'Xác nhận tham dự',
  bank_transfer: 'Mừng cưới',
  music: 'Nhạc nền',
  wishes: 'Sổ lưu bút',
  couple_images: 'Ảnh đôi',
}

export const SECTION_ICONS: Record<SectionType, string> = {
  hero: '💕',
  event_info: '📋',
  family_info: '👨‍👩‍👧‍👦',
  gallery: '🖼️',
  timeline: '💑',
  countdown: '⏳',
  map: '📍',
  rsvp: '✉️',
  bank_transfer: '🎁',
  music: '🎵',
  wishes: '📝',
  couple_images: '👰🤵',
}

export const DEFAULT_THEME: ThemeConfig = {
  primary_color: '#6366F1',
  secondary_color: '#A5B4FC',
  background_color: '#FFFFFF',
  text_color: '#1F2937',
  accent_color: '#F59E0B',
  font_heading: 'Playfair Display',
  font_body: 'Inter',
  border_radius: 'md',
  animation: 'fade',
}

const DEFAULT_FAMILY_CONFIG: FamilyInfoConfig = {
  groom_family: {
    family_name: 'Nhà Trai',
    father: { title: 'Ông', name: '' },
    mother: { title: 'Bà', name: '' },
  },
  bride_family: {
    family_name: 'Nhà Gái',
    father: { title: 'Ông', name: '' },
    mother: { title: 'Bà', name: '' },
  },
}

export const DEFAULT_SECTIONS: Section[] = [
  { section_type: 'hero',          sort_order: 0,  is_enabled: true,  config: { bride_name: '', groom_name: '', tagline: 'Trọn đời bên nhau', show_countdown: true } },
  { section_type: 'couple_images', sort_order: 1,  is_enabled: true,  config: { groom_photo_url: '', bride_photo_url: '' } },
  { section_type: 'event_info',    sort_order: 2,  is_enabled: true,  config: { ceremonies: [] } },
  { section_type: 'family_info',   sort_order: 3,  is_enabled: false, config: DEFAULT_FAMILY_CONFIG as unknown as Record<string, unknown> },
  { section_type: 'gallery',       sort_order: 4,  is_enabled: false, config: { images: [], layout: 'grid' } },
  { section_type: 'timeline',      sort_order: 5,  is_enabled: false, config: { events: [] } },
  { section_type: 'countdown',     sort_order: 6,  is_enabled: true,  config: {} },
  { section_type: 'map',           sort_order: 7,  is_enabled: false, config: { embed_url: '', venue_name: '', address: '' } },
  { section_type: 'rsvp',          sort_order: 8,  is_enabled: true,  config: { title: 'Xác nhận tham dự' } },
  { section_type: 'bank_transfer', sort_order: 9,  is_enabled: false, config: { bank_id: 'VCB', account_number: '', account_name: '' } },
  { section_type: 'music',         sort_order: 10, is_enabled: false, config: { enabled: false, autoplay: false } },
  { section_type: 'wishes',        sort_order: 11, is_enabled: true,  config: { title: 'Lời chúc' } },
]
