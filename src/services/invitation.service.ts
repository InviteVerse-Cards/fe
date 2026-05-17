import api from './api'
import type { Invitation, CreateInvitationPayload, UpdateInvitationPayload, PublishPayload, PublishResult, GuestRow } from '@/types/invitation.types'

interface PaginatedResult<T> {
  items: T[]
  pagination: { total: number; page: number; limit: number; total_pages: number }
}

export async function getMyInvitations(opts?: { page?: number; status?: string }): Promise<PaginatedResult<Invitation>> {
  const { data } = await api.get('/invitations', { params: opts })
  return data.data
}

export async function getOne(uuid: string): Promise<Invitation> {
  const { data } = await api.get(`/invitations/${uuid}`)
  return data.data
}

export async function create(payload: CreateInvitationPayload): Promise<Invitation> {
  const { data } = await api.post('/invitations', payload)
  return data.data
}

export async function update(uuid: string, payload: UpdateInvitationPayload): Promise<Invitation> {
  const { data } = await api.put(`/invitations/${uuid}`, payload)
  return data.data
}

export async function publish(uuid: string, payload: PublishPayload): Promise<PublishResult> {
  const { data } = await api.post(`/invitations/${uuid}/publish`, payload)
  return data.data
}

export async function remove(uuid: string): Promise<void> {
  await api.delete(`/invitations/${uuid}`)
}

export async function getGuests(uuid: string): Promise<GuestRow[]> {
  const { data } = await api.get(`/invitations/${uuid}/guests`)
  return data.data
}
