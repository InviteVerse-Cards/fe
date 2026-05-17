import { computed } from 'vue'
import { useQuery, useMutation } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import * as publicService from '@/services/public.service'
import type { RSVPPayload } from '@/types/invitation.types'

export function usePublicInvitation(slug: Ref<string>, password?: Ref<string | undefined>) {
  return useQuery({
    queryKey: computed(() => ['public-invitation', slug.value, password?.value]),
    queryFn: () => publicService.getPublicInvitation(slug.value, password?.value),
    enabled: computed(() => !!slug.value),
    staleTime: 60_000,
    retry: (count, err: any) => {
      const code = err?.response?.data?.error?.code
      if (code === 'PASSWORD_REQUIRED' || code === 'NOT_FOUND') return false
      return count < 1
    },
  })
}

export function useSubmitRSVP(slug: Ref<string>) {
  return useMutation({
    mutationFn: (payload: RSVPPayload) => publicService.submitRSVP(slug.value, payload),
  })
}
