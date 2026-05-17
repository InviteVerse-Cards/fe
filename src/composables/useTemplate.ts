import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import * as templateService from '@/services/template.service'

export function useTemplates(category?: Ref<string | undefined>) {
  return useQuery({
    queryKey: computed(() => ['templates', category?.value]),
    queryFn: () => templateService.getTemplates({ category: category?.value }),
    staleTime: 5 * 60_000,
  })
}
