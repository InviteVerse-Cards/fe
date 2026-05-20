import api from './api'
import type { Template } from '@/types/template.types'
import type { ThemeConfig, Section } from '@/types/section.types'

export interface TemplateDemo {
  id: number
  slug: string
  name: string
  description: string | null
  thumbnail_url: string | null
  plan_required: 'free' | 'pro'
  category: 'wedding' | 'birthday' | 'baby_shower' | 'corporate' | 'house_warming'
  theme_config: ThemeConfig
  sections: Section[]
  default_music_track: { id: number; name: string; url: string } | null
}

export async function getTemplates(opts?: { category?: string }): Promise<Template[]> {
  const { data } = await api.get('/templates', { params: opts })
  return data.data
}

export async function getActiveCategories(): Promise<{ slug: string; name: string }[]> {
  const { data } = await api.get('/templates/categories')
  return data.data
}

export async function getTemplateDemo(slug: string): Promise<TemplateDemo> {
  const { data } = await api.get(`/public/templates/${slug}`)
  return data.data
}
