
let googleMapsLoader: Promise<void> | null = null

export function getGoogleMapsApiKey(): string {
  return (import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined)?.trim() ?? ''
}

export function getGoongApiKey(): string {
  return (import.meta.env.VITE_GOONG_API_KEY as string | undefined)?.trim() ?? ''
}

export interface GoongSuggestion {
  place_id: string
  description: string
  structured_formatting?: {
    main_text: string
    secondary_text: string
  }
}

export interface GoongPlaceDetail {
  result: {
    geometry: {
      location: {
        lat: number
        lng: number
      }
    }
    name: string
    formatted_address: string
  }
}

export async function searchGoongPlaces(query: string, apiKey: string): Promise<GoongSuggestion[]> {
  if (!apiKey) throw new Error('Missing Goong API key')
  const response = await fetch(
    `https://rsapi.goong.io/Place/AutoComplete?api_key=${encodeURIComponent(apiKey)}&input=${encodeURIComponent(query)}&limit=8`
  )
  if (!response.ok) {
    throw new Error('Không thể kết nối đến dịch vụ tìm kiếm Goong')
  }
  const data = await response.json()
  return data.predictions || []
}

export async function getGoongPlaceDetail(placeId: string, apiKey: string): Promise<GoongPlaceDetail> {
  if (!apiKey) throw new Error('Missing Goong API key')
  const response = await fetch(
    `https://rsapi.goong.io/Place/Detail?api_key=${encodeURIComponent(apiKey)}&place_id=${encodeURIComponent(placeId)}`
  )
  if (!response.ok) {
    throw new Error('Không thể lấy chi tiết địa điểm từ Goong')
  }
  const data = await response.json()
  return data
}


export function buildGoogleMapsEmbedUrl(config: {
  apiKey?: string
  embedUrl?: string
  placeId?: string
  address?: string
  lat?: number
  lng?: number
}): string {
  if (config.embedUrl) return config.embedUrl

  // Nếu có API key, sử dụng Google Maps Embed API chính thức
  if (config.apiKey) {
    const params = new URLSearchParams({ key: config.apiKey })
    if (config.placeId) {
      params.set('q', `place_id:${config.placeId}`)
      return `https://www.google.com/maps/embed/v1/place?${params.toString()}`
    }

    if (config.address) {
      params.set('q', config.address)
      return `https://www.google.com/maps/embed/v1/place?${params.toString()}`
    }

    if (typeof config.lat === 'number' && typeof config.lng === 'number') {
      params.set('center', `${config.lat},${config.lng}`)
      params.set('zoom', '16')
      return `https://www.google.com/maps/embed/v1/view?${params.toString()}`
    }
  }

  // Fallback: Sử dụng URL nhúng miễn phí không cần API key
  if (typeof config.lat === 'number' && typeof config.lng === 'number') {
    return `https://maps.google.com/maps?q=${config.lat},${config.lng}&z=16&output=embed`
  }

  if (config.address) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(config.address)}&z=16&output=embed`
  }

  return ''
}

export function buildGoogleMapsOpenUrl(config: {
  placeId?: string
  address?: string
  lat?: number
  lng?: number
}): string {
  const params = new URLSearchParams({ api: '1' })

  if (config.placeId) {
    params.set('query', config.address || config.placeId)
    params.set('query_place_id', config.placeId)
    return `https://www.google.com/maps/search/?${params.toString()}`
  }

  if (config.address) {
    params.set('query', config.address)
    return `https://www.google.com/maps/search/?${params.toString()}`
  }

  if (typeof config.lat === 'number' && typeof config.lng === 'number') {
    params.set('query', `${config.lat},${config.lng}`)
    return `https://www.google.com/maps/search/?${params.toString()}`
  }

  return ''
}

export async function loadGoogleMapsPlaces(apiKey: string): Promise<Record<string, unknown>> {
  if (!apiKey) throw new Error('Missing Google Maps API key')

  const w = window as any
  if (w.google?.maps?.places) {
    return w.google.maps.places
  }
  if (w.google?.maps?.importLibrary) {
    return w.google.maps.importLibrary('places')
  }

  if (!googleMapsLoader) {
    googleMapsLoader = new Promise((resolve, reject) => {
      const existingScript = document.querySelector<HTMLScriptElement>('script[data-google-maps-loader="true"]')
      if (existingScript) {
        if (existingScript.dataset.loaded === 'true') {
          resolve()
          return
        }
        existingScript.addEventListener('load', () => resolve(), { once: true })
        existingScript.addEventListener('error', () => reject(new Error('Cannot load Google Maps script')), { once: true })
        return
      }

      const script = document.createElement('script')
      const params = new URLSearchParams({
        key: apiKey,
        libraries: 'places',
        v: 'weekly',
        language: 'vi',
        region: 'VN',
        loading: 'async',
      })

      script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`
      script.async = true
      script.defer = true
      script.dataset.googleMapsLoader = 'true'
      script.addEventListener('load', () => {
        script.dataset.loaded = 'true'
        resolve()
      }, { once: true })
      script.addEventListener('error', () => reject(new Error('Cannot load Google Maps script')), { once: true })
      document.head.appendChild(script)
    })
  }

  await googleMapsLoader

  // Đợi một khoảng thời gian ngắn để Google Maps hoàn tất việc khởi tạo bất đồng bộ nếu cần
  let attempts = 0
  while (attempts < 20 && !w.google?.maps?.importLibrary && !w.google?.maps?.places) {
    await new Promise((resolve) => setTimeout(resolve, 50))
    attempts++
  }

  if (w.google?.maps?.places) {
    return w.google.maps.places
  }
  if (w.google?.maps?.importLibrary) {
    return w.google.maps.importLibrary('places')
  }
  throw new Error('Google Maps places library is unavailable')
}
