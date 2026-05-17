import type { ThemeConfig } from './section.types'

export type TemplatePlan = 'free' | 'pro'
export type TemplateCategory = 'wedding' | 'birthday' | 'baby_shower' | 'corporate'

export type LayoutType =
  | 'botanical'
  | 'chinese-red'
  | 'luxury-dark'
  | 'minimalist'
  | 'romantic-photo'
  | 'rustic'
  | 'traditional-viet'
  | 'birthday-playful'
  | 'birthday-elegant'
  | 'baby-soft'
  | 'house-warm'

export interface TemplateHeroConfig {
  background_url?: string
  background_overlay?: number
  tagline?: string
  bride_name?: string
  groom_name?: string
  show_countdown?: boolean
  layout_variant?: string
}

export interface Template {
  id: number
  uuid: string
  slug: string
  name: string
  description: string | null
  thumbnail_url: string | null
  preview_url: string | null
  plan_required: TemplatePlan
  category: TemplateCategory
  use_count: number
  theme_preview: ThemeConfig
  hero_config?: TemplateHeroConfig | null
  layout_type: LayoutType
}
