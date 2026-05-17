# [SK-FE-03] Vue Query (Server State)

> Trigger: Fetch API data, mutation (create/update/delete), cache invalidation.

---

## Setup

```typescript
// main.ts
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,        // 30s trước khi refetch
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

app.use(VueQueryPlugin, { queryClient })
```

---

## useQuery — Fetch data

```typescript
// composables/useTemplate.ts
import { useQuery } from '@tanstack/vue-query'
import * as templateService from '@/services/templateService'

export function useTemplates(categorySlug?: Ref<string | undefined>) {
  return useQuery({
    queryKey: computed(() => ['templates', categorySlug?.value]),
    queryFn: () => templateService.getTemplates({ category: categorySlug?.value }),
    staleTime: 5 * 60_000,   // Templates ít thay đổi → stale 5 phút
    enabled: true,
  })
}

export function useTemplate(slug: Ref<string>) {
  return useQuery({
    queryKey: computed(() => ['templates', slug.value]),
    queryFn: () => templateService.getTemplate(slug.value),
    enabled: computed(() => !!slug.value),
  })
}

// composables/useInvitation.ts
export function useMyInvitations(page: Ref<number> = ref(1)) {
  return useQuery({
    queryKey: computed(() => ['invitations', 'mine', page.value]),
    queryFn: () => invitationService.getMyInvitations({ page: page.value }),
    placeholderData: keepPreviousData,  // Tránh flash khi chuyển trang
  })
}

export function usePublicInvitation(slug: Ref<string>) {
  return useQuery({
    queryKey: computed(() => ['public-invitation', slug.value]),
    queryFn: () => invitationService.getPublic(slug.value),
    staleTime: 60_000,   // Public page có thể cache lâu hơn
    enabled: computed(() => !!slug.value),
  })
}
```

---

## useMutation — CUD operations

```typescript
// composables/useInvitation.ts
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useUIStore } from '@/stores/ui.store'

export function useCreateInvitation() {
  const qc = useQueryClient()
  const ui = useUIStore()

  return useMutation({
    mutationFn: invitationService.create,
    onSuccess: (newInvitation) => {
      // Invalidate list để refetch
      qc.invalidateQueries({ queryKey: ['invitations', 'mine'] })
      ui.toast('Tạo thiệp thành công!', 'success')
    },
    onError: (error: ApiError) => {
      ui.toast(error.message || 'Tạo thiệp thất bại', 'error')
    },
  })
}

export function usePublishInvitation() {
  const qc = useQueryClient()
  const ui = useUIStore()

  return useMutation({
    mutationFn: (uuid: string) => invitationService.publish(uuid),
    onSuccess: (data, uuid) => {
      // Update cache của invitation cụ thể
      qc.invalidateQueries({ queryKey: ['invitations'] })
      ui.toast('Thiệp đã được xuất bản!', 'success')
    },
    onError: (error: ApiError) => {
      ui.toast(error.message || 'Xuất bản thất bại', 'error')
    },
  })
}

export function useDeleteInvitation() {
  const qc = useQueryClient()
  const ui = useUIStore()

  return useMutation({
    mutationFn: invitationService.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['invitations', 'mine'] })
      ui.toast('Đã xóa thiệp', 'info')
    },
  })
}
```

---

## Dùng trong Component

```vue
<script setup lang="ts">
import { useMyInvitations, useDeleteInvitation } from '@/composables/useInvitation'
import { useRouter } from 'vue-router'

const { data, isPending, isError, error } = useMyInvitations()
const { mutate: deleteInvitation, isPending: isDeleting } = useDeleteInvitation()

function handleDelete(uuid: string) {
  if (confirm('Bạn có chắc muốn xóa thiệp này?')) {
    deleteInvitation(uuid)
  }
}
</script>

<template>
  <div>
    <div v-if="isPending" class="flex justify-center py-12">
      <AppLoader />
    </div>

    <div v-else-if="isError" class="rounded-lg bg-red-50 p-4 text-red-700">
      {{ error?.message || 'Không thể tải thiệp' }}
    </div>

    <template v-else>
      <InvitationCard
        v-for="inv in data?.items"
        :key="inv.uuid"
        :invitation="inv"
        @delete="handleDelete"
      />

      <EmptyState v-if="!data?.items.length" message="Bạn chưa có thiệp nào" />
    </template>
  </div>
</template>
```

---

## Query Keys Convention

```typescript
// Cấu trúc query keys nhất quán để invalidate dễ
const QUERY_KEYS = {
  templates: {
    all: ['templates'] as const,
    list: (filters?: object) => ['templates', 'list', filters] as const,
    detail: (slug: string) => ['templates', slug] as const,
  },
  invitations: {
    all: ['invitations'] as const,
    mine: (page?: number) => ['invitations', 'mine', page] as const,
    detail: (uuid: string) => ['invitations', uuid] as const,
    public: (slug: string) => ['public-invitation', slug] as const,
  },
  credits: {
    balance: ['credits', 'balance'] as const,
    history: ['credits', 'history'] as const,
  },
}

// Dùng
useQuery({ queryKey: QUERY_KEYS.invitations.mine(page.value), ... })

// Invalidate tất cả invitation queries
qc.invalidateQueries({ queryKey: QUERY_KEYS.invitations.all })
```

---

## Optimistic Update

```typescript
export function useToggleSectionEnabled() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: ({ uuid, sectionId, enabled }: TogglePayload) =>
      invitationService.updateSection(uuid, sectionId, { is_enabled: enabled }),

    // Optimistic: cập nhật cache ngay lập tức
    onMutate: async ({ uuid, sectionId, enabled }) => {
      await qc.cancelQueries({ queryKey: ['invitations', uuid] })
      const previous = qc.getQueryData(['invitations', uuid])

      qc.setQueryData(['invitations', uuid], (old: Invitation) => ({
        ...old,
        sections: old.sections.map(s =>
          s.id === sectionId ? { ...s, is_enabled: enabled } : s
        ),
      }))

      return { previous }
    },

    // Rollback nếu thất bại
    onError: (_err, { uuid }, context) => {
      if (context?.previous) {
        qc.setQueryData(['invitations', uuid], context.previous)
      }
    },
  })
}
```

---

## Error Handling Pattern

```typescript
// services/api.ts — Axios interceptor xử lý lỗi chung
api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<ApiErrorResponse>) => {
    if (error.response?.status === 401) {
      // Token hết hạn → redirect login
      useAuthStore().clearUser()
      router.push('/login')
    }

    // Re-throw với message từ server
    const serverMessage = error.response?.data?.error?.message
    if (serverMessage) error.message = serverMessage

    return Promise.reject(error)
  }
)

// Trong component: error từ useQuery/useMutation đã được xử lý qua interceptor
// Chỉ cần hiển thị error.message
```
