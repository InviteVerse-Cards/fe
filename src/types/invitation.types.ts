import type { ThemeConfig, Section } from './section.types'

export type InvitationStatus = 'draft' | 'published' | 'archived'
export type InvitationCategory = 'wedding' | 'birthday' | 'baby_shower' | 'corporate' | 'house_warming'

export interface Invitation {
  id: number
  uuid: string
  slug: string
  title: string
  category: InvitationCategory
  status: InvitationStatus
  theme_config: ThemeConfig
  sections: Section[]
  watermark: boolean
  view_count: number
  qr_code_url: string | null
  og_image_url: string | null
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface PublicInvitation {
  id: number
  uuid: string
  slug: string
  title: string
  category: InvitationCategory
  status: 'published'
  theme_config: ThemeConfig
  sections: Section[]
  watermark: boolean
  view_count: number
  qr_code_url: string | null
  published_at: string
  meta: {
    title: string
    description: string | null
    og_image: string | null
  }
}

export interface CreateInvitationPayload {
  template_id?: number
  title: string
  category?: InvitationCategory
}

export interface UpdateInvitationPayload {
  title?: string
  theme_config?: ThemeConfig
  sections?: Array<{
    section_type: string
    sort_order: number
    is_enabled: boolean
    config: Record<string, unknown>
  }>
}

export interface PublishPayload {
  custom_slug?: string
  password?: string
  expires_at?: string
}

export interface PublishResult {
  public_url: string
  qr_code_url: string
  slug: string
}

export interface RSVPPayload {
  name: string
  phone?: string
  email?: string
  status: 'attending' | 'not_attending' | 'maybe'
  note?: string
}

export interface GuestRow {
  id: number
  name: string
  phone: string | null
  email: string | null
  rsvp_status: 'attending' | 'not_attending' | 'maybe'
  rsvp_note: string | null
  rsvp_at: string
}
