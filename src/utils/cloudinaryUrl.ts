export function getOptimizedUrl(url: string, width: number): string {
  if (!url.includes('cloudinary')) return url
  return url.replace('/upload/', `/upload/w_${width},q_auto,f_auto/`)
}

export function getThumbnailUrl(url: string): string {
  if (!url.includes('cloudinary')) return url
  return url.replace('/upload/', '/upload/w_400,h_300,c_fill,q_auto,f_auto/')
}
