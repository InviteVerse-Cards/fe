import api from './api'
import type { PaginatedData } from '@/types/api.types'

export interface AIModel {
  id: number
  name: string
  provider: string
  model_id: string
  priority: number
  max_tokens: number
  temperature: number
  is_default: number | boolean
  is_active: number | boolean
  total_tokens?: number
  created_at: string
}

export interface AdminUser {
  id: number
  full_name: string
  email: string
  phone: string | null
  role: string
  is_verified: boolean
  credits_balance: number
  credits_expires_at: string | null
  credits_status: string
  created_at: string
}

export interface AdminStats {
  total_users: number
  active_users: number
  total_invitations: number
  published_invitations: number
  total_orders: number
  paid_orders: number
}

export interface StatsOverview extends AdminStats {
  total_revenue: number
  today_revenue: number
  today_users: number
  today_invitations: number
  recent_orders: CreditOrder[]
}

export interface DailyTraffic {
  date: string
  page_views: number
  unique_visitors: number
}

export interface HourlyTraffic {
  hour: number
  page_views: number
}

export interface PopularTemplate {
  id: number
  name: string
  thumbnail_url: string | null
  plan_required: string
  category_name: string | null
  use_count: number
}

export interface CategoryStats {
  category: string
  count: number
}

export interface OnlineUsersStats {
  total_online: number
  registered_online: number
  anonymous_online: number
  pages: { page: string; count: number }[]
  recent_users: {
    session_id: string
    user_id: number | null
    page: string | null
    ip_address: string | null
    last_seen: string
    user_name: string | null
    user_email: string | null
  }[]
}

export interface RevenueStats {
  daily: { date: string; revenue: number }[]
  monthly: { month: string; revenue: number }[]
  packages: { package_name: string; count: number; revenue: number }[]
}

export interface AdminInvitation {
  id: number
  uuid: string
  slug: string
  title: string
  category: string
  status: 'draft' | 'published' | 'archived'
  view_count: number
  guest_count: number
  created_at: string
  user_name: string
  user_email: string
  template_name: string | null
}

export interface CreditPackage {
  id: number
  name: string
  credits: number
  price: number
  description: string | null
  is_active: boolean
  created_at: string
}

export interface CreditOrder {
  id: number
  user_id: number
  package_id: number | null
  credits: number
  amount: number
  topup_code?: string
  status: 'pending' | 'paid' | 'failed' | 'cancelled'
  payment_method: string | null
  payment_ref: string | null
  user?: { full_name: string; email: string }
  package?: { name: string }
  created_at: string
}

export interface AdminCategory {
  id: number
  slug: string
  name: string
  sort_order: number
  is_active: boolean
  total_templates: number
  active_templates: number
}

export interface AdminTemplate {
  id: number
  uuid: string
  slug: string
  name: string
  description: string | null
  thumbnail_url: string | null
  preview_url: string | null
  plan_required: 'free' | 'pro'
  category: string
  use_count: number
  sort_order: number
  is_active: boolean
  default_config: string
  created_at?: string
}

export interface AdminTemplateSection {
  id?: number
  section_type: string
  sort_order: number
  is_enabled: boolean
  config: Record<string, unknown>
}

export interface AdminTemplateFull {
  id: number
  uuid: string
  slug: string
  name: string
  description: string | null
  thumbnail_url: string | null
  plan_required: 'free' | 'pro'
  category: string
  use_count: number
  is_active: boolean
  theme_config: Record<string, unknown>
  sections: AdminTemplateSection[]
  default_music_track: { id: number; name: string; url: string } | null
}

export const adminService = {
  // ── Stats ──────────────────────────────────────────────
  async getStats(): Promise<AdminStats> {
    const { data } = await api.get('/admin/stats')
    return data.data
  },

  async getStatsOverview(): Promise<StatsOverview> {
    const { data } = await api.get('/admin/stats/overview')
    return data.data
  },

  async getDailyTraffic(): Promise<DailyTraffic[]> {
    const { data } = await api.get('/admin/stats/daily-traffic')
    return data.data
  },

  async getHourlyTraffic(): Promise<HourlyTraffic[]> {
    const { data } = await api.get('/admin/stats/hourly-traffic')
    return data.data
  },

  async getPopularTemplates(): Promise<PopularTemplate[]> {
    const { data } = await api.get('/admin/stats/popular-templates')
    return data.data
  },

  async getCardsByCategory(): Promise<CategoryStats[]> {
    const { data } = await api.get('/admin/stats/cards-by-category')
    return data.data
  },

  async getOnlineUsers(): Promise<OnlineUsersStats> {
    const { data } = await api.get('/admin/stats/online-users')
    return data.data
  },

  async getRevenueStats(): Promise<RevenueStats> {
    const { data } = await api.get('/admin/stats/revenue')
    return data.data
  },

  // ── AI Models ──────────────────────────────────────────
  async getAIModels(): Promise<AIModel[]> {
    const { data } = await api.get('/admin/ai-models')
    return data.data
  },

  async createAIModel(dto: Record<string, unknown>): Promise<AIModel> {
    const { data } = await api.post('/admin/ai-models', dto)
    return data.data
  },

  async updateAIModel(id: number, dto: Record<string, unknown>): Promise<AIModel> {
    const { data } = await api.put(`/admin/ai-models/${id}`, dto)
    return data.data
  },

  async deleteAIModel(id: number): Promise<void> {
    await api.delete(`/admin/ai-models/${id}`)
  },

  async testAIModel(id: number, dto: { prompt: string }): Promise<{ output: string; tokens_used: number }> {
    const { data } = await api.post(`/admin/ai-models/${id}/test`, dto)
    return data.data
  },

  async fetchProviderModels(provider: string, apiKey: string): Promise<string[]> {
    const { data } = await api.post('/admin/ai-models/fetch-models', { provider, api_key: apiKey })
    return data.data
  },

  // ── Users ──────────────────────────────────────────────
  async getUsers(params: Record<string, unknown>): Promise<PaginatedData<AdminUser>> {
    const { data } = await api.get('/admin/users', { params })
    return data.data
  },

  async getUserDetail(id: number): Promise<AdminUser> {
    const { data } = await api.get(`/admin/users/${id}`)
    return data.data
  },

  async updateUser(id: number, dto: Record<string, unknown>): Promise<void> {
    await api.put(`/admin/users/${id}`, dto)
  },

  async grantCredits(id: number, dto: { credits: number; reason: string }): Promise<void> {
    await api.post(`/admin/users/${id}/grant-credits`, dto)
  },

  async deleteUser(id: number): Promise<void> {
    await api.delete(`/admin/users/${id}`)
  },

  // ── Credit Packages ────────────────────────────────────
  async getPackages(): Promise<CreditPackage[]> {
    const { data } = await api.get('/admin/credit-packages')
    return data.data
  },

  async createPackage(dto: Record<string, unknown>): Promise<CreditPackage> {
    const { data } = await api.post('/admin/credit-packages', dto)
    return data.data
  },

  async updatePackage(id: number, dto: Record<string, unknown>): Promise<CreditPackage> {
    const { data } = await api.put(`/admin/credit-packages/${id}`, dto)
    return data.data
  },

  async deletePackage(id: number): Promise<void> {
    await api.delete(`/admin/credit-packages/${id}`)
  },

  // ── Credit Orders ──────────────────────────────────────
  async getOrders(params: Record<string, unknown>): Promise<PaginatedData<CreditOrder>> {
    const { data } = await api.get('/admin/credit-orders', { params })
    return data.data
  },

  async getOrderDetail(id: number): Promise<CreditOrder> {
    const { data } = await api.get(`/admin/credit-orders/${id}`)
    return data.data
  },

  async fulfillOrder(id: number): Promise<void> {
    await api.post(`/admin/credit-orders/${id}/fulfill`)
  },

  async cancelOrder(id: number): Promise<void> {
    await api.post(`/admin/credit-orders/${id}/cancel`)
  },

  // ── Templates ──────────────────────────────────────
  async getTemplates(): Promise<AdminTemplate[]> {
    const { data } = await api.get('/admin/templates')
    return data.data
  },

  async createTemplate(dto: Record<string, unknown>): Promise<AdminTemplate> {
    const { data } = await api.post('/admin/templates', dto)
    return data.data
  },

  async updateTemplate(uuid: string, dto: Record<string, unknown>): Promise<AdminTemplate> {
    const { data } = await api.put(`/admin/templates/${uuid}`, dto)
    return data.data
  },

  async deleteTemplate(uuid: string): Promise<void> {
    await api.delete(`/admin/templates/${uuid}`)
  },

  async getTemplateFull(uuid: string): Promise<AdminTemplateFull> {
    const { data } = await api.get(`/admin/templates/${uuid}/full`)
    return data.data
  },

  async updateTemplateTheme(uuid: string, themeConfig: Record<string, unknown>): Promise<void> {
    await api.put(`/admin/templates/${uuid}/theme`, { theme_config: themeConfig })
  },

  async updateTemplateSections(uuid: string, sections: AdminTemplateSection[]): Promise<void> {
    await api.put(`/admin/templates/${uuid}/sections`, { sections })
  },

  async updateTemplateMusic(uuid: string, trackId: number | null): Promise<void> {
    await api.put(`/admin/templates/${uuid}/music`, { track_id: trackId })
  },

  async reorderTemplates(items: { uuid: string; sort_order: number }[]): Promise<void> {
    await api.put('/admin/templates/reorder', items)
  },

  // ── Categories ─────────────────────────────────
  async getCategories(): Promise<AdminCategory[]> {
    const { data } = await api.get('/admin/categories')
    return data.data
  },

  async toggleCategory(slug: string): Promise<{ is_active: boolean }> {
    const { data } = await api.put(`/admin/categories/${slug}/toggle`)
    return data.data
  },

  async reorderCategories(items: { slug: string; sort_order: number }[]): Promise<void> {
    await api.put('/admin/categories/reorder', items)
  },

  // ── Music ──────────────────────────────────────
  async getMusicTracks(): Promise<MusicTrack[]> {
    const { data } = await api.get('/admin/music')
    return data.data
  },

  async createMusicTrack(dto: Record<string, unknown>): Promise<MusicTrack> {
    const { data } = await api.post('/admin/music', dto)
    return data.data
  },

  async updateMusicTrack(id: number, dto: Record<string, unknown>): Promise<MusicTrack> {
    const { data } = await api.patch(`/admin/music/${id}`, dto)
    return data.data
  },

  async deleteMusicTrack(id: number): Promise<void> {
    await api.delete(`/admin/music/${id}`)
  },

  async setDefaultMusicTrack(id: number): Promise<MusicTrack> {
    const { data } = await api.patch(`/admin/music/${id}/set-default`)
    return data.data
  },

  async uploadMusicTrack(file: File): Promise<{ url: string }> {
    const formData = new FormData()
    formData.append('file', file)
    const { data } = await api.post('/admin/music/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data.data
  },

  // ── Invitations ─────────────────────────────────
  async getInvitations(params: Record<string, unknown>): Promise<PaginatedData<AdminInvitation>> {
    const { data } = await api.get('/admin/invitations', { params })
    return data.data
  },

  async deleteInvitation(uuid: string): Promise<void> {
    await api.delete(`/admin/invitations/${uuid}`)
  },
}

export interface MusicTrack {
  id: number
  name: string
  url: string
  is_active: boolean
  is_default: boolean
  created_at: string
  updated_at: string
}
