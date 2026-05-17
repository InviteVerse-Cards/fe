const FONT_CACHE = new Set<string>()

// Fonts already loaded via index.html — skip redundant requests
const PRELOADED_FONTS = new Set([
  'Playfair Display', 'Inter', 'Cormorant Garamond', 'Great Vibes',
  'Dancing Script', 'Cinzel', 'Cinzel Decorative', 'DM Serif Display',
  'Lato', 'Nunito', 'Raleway', 'Poppins',
])

// Calligraphy fonts that only support weight 400 and no italic axis
const CALLIGRAPHY_FONTS = new Set([
  'Great Vibes', 'Pinyon Script', 'Sacramento', 'Alex Brush',
  'Parisienne', 'Allura', 'Tangerine',
])

// Fonts with variable weight but no italic
const WEIGHT_ONLY_FONTS = new Set([
  'Dancing Script', 'Cinzel', 'Cinzel Decorative', 'Raleway',
  'Nunito', 'Lato', 'Poppins', 'Inter',
])

export function loadGoogleFont(fontName: string): void {
  if (!fontName || FONT_CACHE.has(fontName) || PRELOADED_FONTS.has(fontName)) return
  FONT_CACHE.add(fontName)

  let weights = 'ital,wght@0,400;0,600;0,700;1,400'
  if (CALLIGRAPHY_FONTS.has(fontName)) {
    weights = 'wght@400'
  } else if (WEIGHT_ONLY_FONTS.has(fontName)) {
    weights = 'wght@300;400;600;700'
  }

  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:${weights}&display=swap`
  document.head.appendChild(link)
}

export function loadThemeFonts(fontHeading: string, fontBody: string): void {
  loadGoogleFont(fontHeading)
  if (fontBody !== fontHeading) loadGoogleFont(fontBody)
}
