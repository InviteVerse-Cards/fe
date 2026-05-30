<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useEditorStore } from '@/stores/editor.store'
import type { MapConfig } from '@/types/section.types'
import AppInput from '@/components/common/AppInput.vue'
import { getGoogleMapsApiKey, loadGoogleMapsPlaces, getGoongApiKey, searchGoongPlaces, getGoongPlaceDetail } from '@/utils/googleMaps'

const props = defineProps<{ config: Record<string, unknown>; sectionType: string }>()
const editorStore = useEditorStore()
const form = ref<MapConfig>({ ...(props.config as MapConfig) })
const showManualEmbed = ref(Boolean(form.value.embed_url))

// Unified Search Suggestion Interface
interface MapSuggestion {
  place_id: string
  display_name: string
  name: string
  lat?: number
  lng?: number
  isGoogle?: boolean
  isGoong?: boolean
}

const searchQuery = ref('')
const isSearching = ref(false)
const searchError = ref('')
const suggestions = ref<MapSuggestion[]>([])
let searchTimeout: ReturnType<typeof setTimeout> | null = null

// Google Maps status and API helpers
const googleMapsStatus = ref<'idle' | 'loading' | 'loaded' | 'failed'>('idle')
const autocompleteService = ref<any>(null)
const placesService = ref<any>(null)

const isUsingGoogleMaps = computed(() => {
  return !!getGoogleMapsApiKey() && googleMapsStatus.value !== 'failed'
})

const isUsingGoong = computed(() => {
  return !!getGoongApiKey()
})

watch(() => props.config, (v) => { form.value = { ...(v as MapConfig) } }, { deep: true })

const selectedLabel = computed(() => {
  if (form.value.venue_name && form.value.address) return `${form.value.venue_name} - ${form.value.address}`
  return form.value.venue_name || form.value.address || ''
})

function extractEmbedUrl(raw: string): string {
  const match = raw.match(/src="([^"]+)"/i)
  return match ? match[1] : raw.trim()
}

function update(field: keyof MapConfig, value: string) {
  const resolved = field === 'embed_url' ? extractEmbedUrl(value) : value
  ;(form.value as Record<string, unknown>)[field] = resolved

  const patch: Record<string, unknown> = { [field]: resolved }
  if (field === 'address') {
    patch.place_id = ''
    patch.lat = undefined
    patch.lng = undefined
    form.value.place_id = ''
    form.value.lat = undefined
    form.value.lng = undefined
  }

  editorStore.updateSectionConfig('map', patch)
}

function onSearchInput() {
  if (searchTimeout) clearTimeout(searchTimeout)

  if (!searchQuery.value || searchQuery.value.trim().length < 3) {
    suggestions.value = []
    return
  }

  searchTimeout = setTimeout(() => {
    void searchPlaces(searchQuery.value.trim())
  }, 500)
}

async function runPhotonSearch(query: string) {
  isSearching.value = true
  searchError.value = ''
  try {
    const response = await fetch(
      `https://photon.komoot.io/api?q=${encodeURIComponent(query)}&limit=8`
    )
    if (!response.ok) throw new Error('Không thể kết nối tới dịch vụ tìm kiếm')
    const data = await response.json()
    suggestions.value = (data.features || []).map((feature: any) => {
      const props = feature.properties
      const coords = feature.geometry.coordinates

      const addressParts: string[] = []
      if (props.housenumber) addressParts.push(props.housenumber)
      if (props.street) addressParts.push(props.street)
      if (props.locality) addressParts.push(props.locality)
      if (props.district) addressParts.push(props.district)
      if (props.city) addressParts.push(props.city)
      if (props.state && props.state !== props.city) addressParts.push(props.state)
      if (props.country) addressParts.push(props.country)
      
      const displayAddress = addressParts.join(', ')

      return {
        place_id: props.osm_id?.toString() || Math.random().toString(),
        display_name: displayAddress || props.name || '',
        name: props.name || 'Địa điểm không tên',
        lat: coords[1],
        lng: coords[0],
        isGoogle: false
      }
    })
  } catch (err: any) {
    searchError.value = 'Lỗi tìm kiếm địa điểm. Bạn có thể tự nhập tay địa chỉ bên dưới.'
    console.error(err)
  } finally {
    isSearching.value = false
  }
}

async function runGoongSearch(query: string) {
  const apiKey = getGoongApiKey()
  if (!apiKey) {
    await runPhotonSearch(query)
    return
  }

  isSearching.value = true
  searchError.value = ''
  try {
    const predictions = await searchGoongPlaces(query, apiKey)
    suggestions.value = predictions.map((pred: any) => ({
      place_id: pred.place_id,
      display_name: pred.description,
      name: pred.structured_formatting?.main_text || pred.description,
      isGoong: true
    }))
  } catch (err: any) {
    console.error('Error with Goong Maps search, falling back to Photon:', err)
    await runPhotonSearch(query)
  } finally {
    isSearching.value = false
  }
}

async function searchPlaces(query: string) {
  isSearching.value = true
  searchError.value = ''

  const apiKey = getGoogleMapsApiKey()
  if (!apiKey || googleMapsStatus.value === 'failed') {
    await runGoongSearch(query)
    return
  }

  try {
    if (googleMapsStatus.value !== 'loaded') {
      googleMapsStatus.value = 'loading'
      await loadGoogleMapsPlaces(apiKey)
      googleMapsStatus.value = 'loaded'
    }

    const g = (window as any).google
    if (!g?.maps?.places) {
      throw new Error('Google Maps places library could not be loaded')
    }

    if (!autocompleteService.value || !placesService.value) {
      autocompleteService.value = new g.maps.places.AutocompleteService()
      placesService.value = new g.maps.places.PlacesService(document.createElement('div'))
    }

    autocompleteService.value.getPlacePredictions(
      { input: query, language: 'vi', region: 'VN' },
      (predictions: any[] | null, status: string) => {
        if (status === 'OK' && predictions) {
          suggestions.value = predictions.map((pred: any) => ({
            place_id: pred.place_id,
            display_name: pred.description,
            name: pred.structured_formatting?.main_text || pred.description,
            isGoogle: true
          }))
          isSearching.value = false
        } else {
          console.warn('Google Maps Autocomplete status:', status, 'falling back to Goong')
          if (status !== 'ZERO_RESULTS') {
            googleMapsStatus.value = 'failed'
          }
          void runGoongSearch(query)
        }
      }
    )
  } catch (err: any) {
    console.error('Error with Google Maps search, falling back to Goong:', err)
    googleMapsStatus.value = 'failed'
    await runGoongSearch(query)
  }
}

function applySuggestionDirectly(item: MapSuggestion) {
  const patch: Partial<MapConfig> = {
    venue_name: item.name,
    address: item.display_name || item.name,
    place_id: (item.isGoogle || item.isGoong) ? item.place_id : '',
    lat: item.lat,
    lng: item.lng,
    embed_url: '',
  }

  form.value = { ...form.value, ...patch }
  showManualEmbed.value = false
  editorStore.updateSectionConfig('map', patch as Record<string, unknown>)

  suggestions.value = []
  searchQuery.value = ''
}

async function selectSuggestion(item: MapSuggestion) {
  if (item.isGoogle) {
    isSearching.value = true
    searchError.value = ''
    try {
      if (!placesService.value) {
        throw new Error('PlacesService is not initialized')
      }

      placesService.value.getDetails(
        {
          placeId: item.place_id,
          fields: ['geometry', 'name', 'formatted_address'],
        },
        (place: any, status: string) => {
          isSearching.value = false
          if (status === 'OK' && place) {
            const latVal = place.geometry?.location?.lat()
            const lngVal = place.geometry?.location?.lng()

            const patch: Partial<MapConfig> = {
              venue_name: place.name || item.name,
              address: place.formatted_address || item.display_name || item.name,
              place_id: item.place_id,
              lat: typeof latVal === 'number' ? latVal : undefined,
              lng: typeof lngVal === 'number' ? lngVal : undefined,
              embed_url: '',
            }

            form.value = { ...form.value, ...patch }
            showManualEmbed.value = false
            editorStore.updateSectionConfig('map', patch as Record<string, unknown>)
            suggestions.value = []
            searchQuery.value = ''
          } else {
            console.error('Google Maps Place Details failed with status:', status)
            applySuggestionDirectly(item)
          }
        }
      )
    } catch (err: any) {
      console.error('Error fetching Google Place details:', err)
      isSearching.value = false
      applySuggestionDirectly(item)
    }
  } else if (item.isGoong) {
    isSearching.value = true
    searchError.value = ''
    try {
      const apiKey = getGoongApiKey()
      const detail = await getGoongPlaceDetail(item.place_id, apiKey)
      if (detail && detail.result) {
        const result = detail.result
        const patch: Partial<MapConfig> = {
          venue_name: result.name || item.name,
          address: result.formatted_address || item.display_name || item.name,
          place_id: item.place_id,
          lat: result.geometry?.location?.lat,
          lng: result.geometry?.location?.lng,
          embed_url: '',
        }

        form.value = { ...form.value, ...patch }
        showManualEmbed.value = false
        editorStore.updateSectionConfig('map', patch as Record<string, unknown>)
        suggestions.value = []
        searchQuery.value = ''
      } else {
        applySuggestionDirectly(item)
      }
    } catch (err: any) {
      console.error('Error fetching Goong Place details:', err)
      applySuggestionDirectly(item)
    } finally {
      isSearching.value = false
    }
  } else {
    applySuggestionDirectly(item)
  }
}

onBeforeUnmount(() => {
  if (searchTimeout) clearTimeout(searchTimeout)
})
</script>

<template>
  <div class="space-y-4">
    <div class="space-y-1.5 relative">
      <label class="block text-sm font-medium text-gray-700">
        Tìm địa điểm {{ isUsingGoogleMaps ? '(Sử dụng Google Maps)' : isUsingGoong ? '(Sử dụng Goong Maps)' : '(Miễn phí, không cần API key)' }}
      </label>
      <div class="relative">
        <input
          type="text"
          v-model="searchQuery"
          @input="onSearchInput"
          placeholder="Gõ địa chỉ, nhà hàng, trung tâm tiệc cưới..."
          class="block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <div v-if="isSearching" class="absolute right-3 top-3">
          <svg class="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>

      <!-- Dropdown suggestions -->
      <div
        v-if="suggestions.length > 0"
        class="absolute z-10 w-full mt-1 max-h-60 overflow-y-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200"
      >
        <button
          v-for="item in suggestions"
          :key="item.place_id"
          type="button"
          @click="selectSuggestion(item)"
          class="w-full text-left px-4 py-2.5 hover:bg-indigo-50 transition-colors border-b border-gray-100 last:border-b-0"
        >
          <p class="font-medium text-gray-900">{{ item.name }}</p>
          <p class="text-xs text-gray-500 truncate mt-0.5">{{ item.display_name }}</p>
        </button>
      </div>
      <p v-if="searchError" class="text-xs text-red-500 mt-1">{{ searchError }}</p>
    </div>

    <div v-if="selectedLabel" class="rounded-lg border border-emerald-100 bg-emerald-50 p-3 text-sm text-emerald-800">
      <p class="font-medium">Đã chọn địa điểm</p>
      <p class="mt-1 text-xs leading-relaxed">{{ selectedLabel }}</p>
    </div>

    <AppInput
      label="Tên địa điểm"
      :model-value="form.venue_name ?? ''"
      placeholder="Ví dụ: Nhà hàng tiệc cưới Palace"
      @update:model-value="update('venue_name', $event)"
    />
    <AppInput
      label="Địa chỉ hiển thị"
      :model-value="form.address ?? ''"
      placeholder="Ví dụ: 456 Hai Bà Trưng, Phường Võ Thị Sáu, Quận 3, TP.HCM"
      @update:model-value="update('address', $event)"
    />

    <div class="space-y-1">
      <button
        type="button"
        class="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        @click="showManualEmbed = !showManualEmbed"
      >
        {{ showManualEmbed ? 'Ẩn nhập thủ công' : 'Nhập iframe/embed URL thủ công' }}
      </button>
      <div v-if="showManualEmbed" class="mt-2 space-y-2">
        <label class="block text-sm font-medium text-gray-700">Google Maps Embed URL</label>
        <textarea
          :value="form.embed_url ?? ''"
          rows="3"
          class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
          placeholder="Dán thẻ <iframe> hoặc link embed từ Google Maps vào đây"
          @input="update('embed_url', ($event.target as HTMLTextAreaElement).value)"
        />
        <div class="rounded-lg border border-blue-100 bg-blue-50 p-3 text-xs text-blue-700">
          Hệ thống hỗ trợ cả iframe. Nếu có embed URL thủ công, hệ thống sẽ ưu tiên hiển thị bản đồ này trước địa điểm tìm kiếm.
        </div>
      </div>
    </div>
  </div>
</template>

