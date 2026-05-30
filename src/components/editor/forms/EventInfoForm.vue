<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useEditorStore } from '@/stores/editor.store'
import type { EventInfoConfig } from '@/types/section.types'
import AppInput from '@/components/common/AppInput.vue'
import {
  getGoogleMapsApiKey,
  loadGoogleMapsPlaces,
  getGoongApiKey,
  searchGoongPlaces,
  getGoongPlaceDetail
} from '@/utils/googleMaps'

const props = defineProps<{ config: Record<string, unknown>; sectionType: string; category?: string }>()
const editorStore = useEditorStore()
const defaultForm: EventInfoConfig = { ceremonies: [] }
const form = ref<EventInfoConfig>(Object.assign({}, defaultForm, props.config as unknown as Partial<EventInfoConfig>))

interface MapSuggestion {
  place_id: string
  display_name: string
  name: string
  lat?: number
  lng?: number
  isGoogle?: boolean
  isGoong?: boolean
}

// Google Maps & Goong maps autocomplete state
const googleMapsStatus = ref<'idle' | 'loading' | 'loaded' | 'failed'>('idle')
const autocompleteService = ref<any>(null)
const placesService = ref<any>(null)
const isSearching = ref(false)
const searchError = ref('')
const suggestions = ref<MapSuggestion[]>([])
const activeSearchIndex = ref<number | null>(null)
let searchTimeout: ReturnType<typeof setTimeout> | null = null

const isUsingGoogleMaps = computed(() => {
  return !!getGoogleMapsApiKey() && googleMapsStatus.value !== 'failed'
})

const isUsingGoong = computed(() => {
  return !!getGoongApiKey()
})

function onAddressInput(index: number, val: string) {
  form.value.ceremonies[index].address = val
  sync()

  activeSearchIndex.value = index
  if (searchTimeout) clearTimeout(searchTimeout)

  if (!val || val.trim().length < 3) {
    suggestions.value = []
    return
  }

  searchTimeout = setTimeout(() => {
    void searchPlaces(val.trim())
  }, 500)
}

function clearMapPin(index: number) {
  form.value.ceremonies[index].lat = undefined
  form.value.ceremonies[index].lng = undefined
  form.value.ceremonies[index].place_id = undefined
  sync()
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
    searchError.value = 'Lỗi tìm kiếm địa điểm.'
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
  const index = activeSearchIndex.value
  if (index === null) return

  form.value.ceremonies[index].venue = item.name
  form.value.ceremonies[index].address = item.display_name || item.name
  form.value.ceremonies[index].place_id = (item.isGoogle || item.isGoong) ? item.place_id : ''
  form.value.ceremonies[index].lat = item.lat
  form.value.ceremonies[index].lng = item.lng
  sync()

  suggestions.value = []
  activeSearchIndex.value = null
}

async function selectSuggestion(item: MapSuggestion) {
  const index = activeSearchIndex.value
  if (index === null) return

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

            form.value.ceremonies[index].venue = place.name || item.name
            form.value.ceremonies[index].address = place.formatted_address || item.display_name || item.name
            form.value.ceremonies[index].place_id = item.place_id
            form.value.ceremonies[index].lat = typeof latVal === 'number' ? latVal : undefined
            form.value.ceremonies[index].lng = typeof lngVal === 'number' ? lngVal : undefined
            sync()

            suggestions.value = []
            activeSearchIndex.value = null
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
        form.value.ceremonies[index].venue = result.name || item.name
        form.value.ceremonies[index].address = result.formatted_address || item.display_name || item.name
        form.value.ceremonies[index].place_id = item.place_id
        form.value.ceremonies[index].lat = result.geometry?.location?.lat
        form.value.ceremonies[index].lng = result.geometry?.location?.lng
        sync()

        suggestions.value = []
        activeSearchIndex.value = null
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

watch(() => props.config, (v) => {
  form.value = Object.assign({}, defaultForm, v as unknown as Partial<EventInfoConfig>)
}, { deep: true })

const ceremonyLabel = {
  section: {
    birthday: 'Các buổi tiệc',
    baby_shower: 'Các buổi tiệc',
    house_warming: 'Các buổi tiệc',
    housewarming: 'Các buổi tiệc',
    corporate: 'Các buổi / sự kiện',
  } as Record<string, string>,
  add: {
    birthday: '+ Thêm buổi tiệc',
    baby_shower: '+ Thêm buổi tiệc',
    house_warming: '+ Thêm buổi tiệc',
    housewarming: '+ Thêm buổi tiệc',
    corporate: '+ Thêm sự kiện',
  } as Record<string, string>,
  default: {
    birthday: 'Tiệc sinh nhật',
    baby_shower: 'Tiệc thôi nôi',
    house_warming: 'Tân gia',
    housewarming: 'Tân gia',
    corporate: 'Sự kiện',
  } as Record<string, string>,
}

function sectionTitle() { return ceremonyLabel.section[props.category ?? ''] ?? 'Các buổi lễ' }
function addLabel()     { return ceremonyLabel.add[props.category ?? ''] ?? '+ Thêm buổi lễ' }
function defaultName()  { return ceremonyLabel.default[props.category ?? ''] ?? 'Lễ cưới' }

function sync() {
  editorStore.updateSectionConfig('event_info', {
    ceremonies: form.value.ceremonies,
    invitation_message: form.value.invitation_message,
  })
}

function addCeremony() {
  form.value.ceremonies.push({ name: defaultName(), date: '', time: '', venue: '', address: '' })
  sync()
}

function removeCeremony(i: number) {
  form.value.ceremonies.splice(i, 1)
  sync()
}

function updateCeremony(i: number, field: 'name' | 'date' | 'time' | 'venue' | 'address' | 'map_url', value: string) {
  form.value.ceremonies[i][field] = value
  sync()
}
</script>

<template>
  <div class="space-y-4">

    <div class="space-y-1">
      <label class="block text-sm font-medium text-gray-700">Lời mời</label>
      <textarea
        :value="form.invitation_message ?? ''"
        rows="3"
        class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        placeholder="Trân trọng kính mời..."
        @input="form.invitation_message = ($event.target as HTMLTextAreaElement).value; sync()"
      />
    </div>

    <div>
      <div class="mb-2 flex items-center justify-between">
        <label class="text-sm font-medium text-gray-700">{{ sectionTitle() }}</label>
        <button
          class="text-xs text-indigo-600 hover:underline"
          @click="addCeremony"
        >{{ addLabel() }}</button>
      </div>

      <div v-for="(c, i) in form.ceremonies" :key="i" class="mb-3 rounded-lg border border-gray-200 p-3">
        <div class="mb-2 flex items-center justify-between">
          <span class="text-xs font-medium text-gray-500">Buổi lễ {{ i + 1 }}</span>
          <button class="text-xs text-red-500 hover:underline" @click="removeCeremony(i)">Xóa</button>
        </div>
        <div class="space-y-2">
          <AppInput label="Tên buổi lễ" :model-value="c.name" placeholder="Lễ cưới" @update:model-value="updateCeremony(i, 'name', $event)" />
          <AppInput label="Ngày" type="date" :model-value="c.date" @update:model-value="updateCeremony(i, 'date', $event)" />
          <AppInput label="Giờ" type="time" :model-value="c.time" @update:model-value="updateCeremony(i, 'time', $event)" />
          <AppInput label="Địa điểm" :model-value="c.venue" placeholder="Nhà hàng ABC" @update:model-value="updateCeremony(i, 'venue', $event)" />
          <!-- Tích hợp Tìm kiếm địa chỉ bản đồ gợi ý -->
          <div class="space-y-1.5 relative">
            <label class="block text-sm font-medium text-gray-700">
              Địa chỉ {{ isUsingGoogleMaps ? '(Gợi ý bởi Google)' : isUsingGoong ? '(Gợi ý bởi Goong)' : '(Miễn phí, không gợi ý)' }}
            </label>
            <div class="relative">
              <input
                type="text"
                :value="c.address"
                @input="onAddressInput(i, ($event.target as HTMLInputElement).value)"
                @focus="activeSearchIndex = i"
                placeholder="Gõ tên nhà hàng, đường phố để tìm trên bản đồ..."
                class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <div v-if="isSearching && activeSearchIndex === i" class="absolute right-3 top-2.5">
                <svg class="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            </div>

            <!-- Dropdown gợi ý địa điểm -->
            <div
              v-if="suggestions.length > 0 && activeSearchIndex === i"
              class="absolute z-50 w-full mt-1 max-h-60 overflow-y-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200"
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

            <!-- Trạng thái ghim bản đồ -->
            <div v-if="c.lat && c.lng" class="mt-1 flex items-center justify-between rounded-lg border border-emerald-100 bg-emerald-50 px-2.5 py-1.5 text-xs text-emerald-800">
              <span class="flex items-center gap-1.5">
                <svg class="h-3.5 w-3.5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Đã ghim vị trí bản đồ ({{ c.lat.toFixed(5) }}, {{ c.lng.toFixed(5) }})
              </span>
              <button type="button" @click="clearMapPin(i)" class="text-red-600 hover:text-red-800 font-semibold underline">Xóa ghim</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="form.ceremonies.length === 0" class="rounded-lg border border-dashed border-gray-200 p-4 text-center text-sm text-gray-400">
        Chưa có buổi lễ nào. Nhấn "Thêm buổi lễ" để thêm.
      </div>
    </div>
  </div>
</template>
