import api from './api'
import type { PublicInvitation, RSVPPayload } from '@/types/invitation.types'

export async function getPublicInvitation(slug: string, password?: string): Promise<PublicInvitation> {
  const { data } = await api.get(`/public/invitations/${slug}`, {
    params: password ? { password } : undefined,
  })
  return data.data
}

export async function submitRSVP(slug: string, payload: RSVPPayload): Promise<void> {
  await api.post(`/public/invitations/${slug}/rsvp`, payload)
}
