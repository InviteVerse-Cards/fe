import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Invitation } from '@/types/invitation.types'
import type { Section, ThemeConfig } from '@/types/section.types'
import { DEFAULT_THEME, DEFAULT_SECTIONS } from '@/types/section.types'
import * as invitationService from '@/services/invitation.service'
import { adminService } from '@/services/admin.service'

export const useEditorStore = defineStore('editor', () => {
  const invitation = ref<Invitation | null>(null)
  const sections = ref<Section[]>([])
  const themeConfig = ref<ThemeConfig>({ ...DEFAULT_THEME })
  const isDirty = ref(false)
  const isSaving = ref(false)
  const activeSection = ref<string | null>(null)
  const previewMode = ref<'mobile' | 'desktop'>('mobile')
  const editorMode = ref<'edit' | 'preview'>('edit')

  // Template mode state — null means invitation mode
  const templateUuid = ref<string | null>(null)
  const templateCategory = ref<string | null>(null)
  const templateName = ref<string | null>(null)

  const enabledSections = computed(() =>
    [...sections.value]
      .filter(s => s.is_enabled)
      .sort((a, b) => a.sort_order - b.sort_order)
  )

  async function loadInvitation(uuid: string) {
    const data = await invitationService.getOne(uuid)
    invitation.value = data
    
    // Patch missing sections from DEFAULT_SECTIONS
    const existingTypes = new Set(data.sections.map(s => s.section_type))
    const patchedSections = [...data.sections]
    
    DEFAULT_SECTIONS.forEach(def => {
      if (!existingTypes.has(def.section_type)) {
        patchedSections.push({
          ...def,
          is_enabled: def.section_type === 'couple_images' ? true : def.is_enabled, // Enable couple_images by default for users
        })
      }
    })
    
    sections.value = patchedSections
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((s, i) => ({ ...s, sort_order: i }))
    themeConfig.value = { ...DEFAULT_THEME, ...data.theme_config }
    isDirty.value = false
    
    if (sections.value.length > 0) {
      activeSection.value = sections.value.find(s => s.is_enabled)?.section_type ?? null
    }
  }

  function updateSectionConfig(sectionType: string, patch: Record<string, unknown>) {
    const idx = sections.value.findIndex(s => s.section_type === sectionType)
    if (idx !== -1) {
      sections.value[idx] = {
        ...sections.value[idx],
        config: { ...sections.value[idx].config, ...patch },
      }
      isDirty.value = true
    }
  }

  function toggleSection(sectionType: string) {
    const section = sections.value.find(s => s.section_type === sectionType)
    if (section) {
      section.is_enabled = !section.is_enabled
      isDirty.value = true
    }
  }

  function reorderSections(newSections: Section[]) {
    sections.value = newSections.map((s, i) => ({ ...s, sort_order: i }))
    isDirty.value = true
  }

  function updateTheme(patch: Partial<ThemeConfig>) {
    themeConfig.value = { ...themeConfig.value, ...patch }
    isDirty.value = true
  }

  async function loadTemplate(uuid: string, prefetched?: import('@/services/admin.service').AdminTemplateFull) {
    const data = prefetched ?? await adminService.getTemplateFull(uuid)
    templateUuid.value = uuid
    templateCategory.value = data.category
    templateName.value = data.name
    sections.value = (data.sections as Section[]).sort((a, b) => a.sort_order - b.sort_order)
    themeConfig.value = { ...DEFAULT_THEME, ...(data.theme_config as Partial<ThemeConfig>) }
    isDirty.value = false

    if (sections.value.length > 0) {
      activeSection.value = sections.value.find(s => s.is_enabled)?.section_type ?? null
    }
  }

  async function save() {
    if (!isDirty.value) return
    isSaving.value = true
    try {
      if (templateUuid.value) {
        // Template mode — save to admin API
        await adminService.updateTemplateTheme(templateUuid.value, themeConfig.value)
        await adminService.updateTemplateSections(templateUuid.value, sections.value.map(s => ({
          section_type: s.section_type,
          sort_order: s.sort_order,
          is_enabled: s.is_enabled,
          config: s.config as Record<string, unknown>,
        })))
        isDirty.value = false
        return
      }

      if (!invitation.value) return
      await invitationService.update(invitation.value.uuid, {
        theme_config: themeConfig.value,
        sections: sections.value.map(s => ({
          section_type: s.section_type,
          sort_order: s.sort_order,
          is_enabled: s.is_enabled,
          config: s.config as Record<string, unknown>,
        })),
      })
      isDirty.value = false
    } finally {
      isSaving.value = false
    }
  }

  function reset() {
    invitation.value = null
    sections.value = []
    themeConfig.value = { ...DEFAULT_THEME }
    isDirty.value = false
    isSaving.value = false
    activeSection.value = null
    editorMode.value = 'edit'
    templateUuid.value = null
    templateCategory.value = null
    templateName.value = null
  }

  return {
    invitation, sections, themeConfig, isDirty, isSaving,
    activeSection, previewMode, editorMode,
    templateUuid, templateCategory, templateName,
    enabledSections,
    loadInvitation, loadTemplate, updateSectionConfig, toggleSection, reorderSections,
    updateTheme, save, reset,
  }
})
