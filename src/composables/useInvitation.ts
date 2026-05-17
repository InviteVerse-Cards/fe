import { computed } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import * as invitationService from '@/services/invitation.service'
import type { CreateInvitationPayload, PublishPayload } from '@/types/invitation.types'
import { useUIStore } from '@/stores/ui'

export function useMyInvitations(page?: Ref<number>) {
  return useQuery({
    queryKey: computed(() => ['invitations', 'mine', page?.value ?? 1]),
    queryFn: () => invitationService.getMyInvitations({ page: page?.value ?? 1 }),
    staleTime: 30_000,
  })
}

export function useInvitation(uuid: Ref<string>) {
  return useQuery({
    queryKey: computed(() => ['invitations', uuid.value]),
    queryFn: () => invitationService.getOne(uuid.value),
    enabled: computed(() => !!uuid.value),
    staleTime: 0,
  })
}

export function useCreateInvitation() {
  const qc = useQueryClient()
  const ui = useUIStore()

  return useMutation({
    mutationFn: (payload: CreateInvitationPayload) => invitationService.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invitations', 'mine'] })
      ui.toast.success('Tạo thiệp thành công!')
    },
    onError: (err: any) => {
      ui.toast.error(err?.response?.data?.error?.message || 'Tạo thiệp thất bại')
    },
  })
}

export function usePublishInvitation() {
  const qc = useQueryClient()
  const ui = useUIStore()

  return useMutation({
    mutationFn: ({ uuid, payload }: { uuid: string; payload: PublishPayload }) =>
      invitationService.publish(uuid, payload),
    onSuccess: (_data, { uuid }) => {
      qc.invalidateQueries({ queryKey: ['invitations', uuid] })
      qc.invalidateQueries({ queryKey: ['invitations', 'mine'] })
    },
    onError: (err: any) => {
      ui.toast.error(err?.response?.data?.error?.message || 'Xuất bản thất bại')
    },
  })
}

export function useDeleteInvitation() {
  const qc = useQueryClient()
  const ui = useUIStore()

  return useMutation({
    mutationFn: (uuid: string) => invitationService.remove(uuid),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invitations', 'mine'] })
      ui.toast.info('Đã xóa thiệp')
    },
    onError: () => {
      ui.toast.error('Xóa thiệp thất bại')
    },
  })
}
