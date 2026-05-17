export function buildShareLinks(publicUrl: string, title: string) {
  const encoded = encodeURIComponent(publicUrl)
  const text = encodeURIComponent(`${title} - Xem thiệp online: ${publicUrl}`)

  return {
    zalo: `https://zalo.me/share?url=${encoded}&title=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
    copy: publicUrl,
    sms: `sms:?body=${text}`,
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const el = document.createElement('textarea')
    el.value = text
    el.style.position = 'fixed'
    el.style.opacity = '0'
    document.body.appendChild(el)
    el.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(el)
    return ok
  }
}
