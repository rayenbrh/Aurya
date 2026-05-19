const PANEL_COLORS = ['#885B45', '#7F8573', '#D7C5BC', '#3D2418', '#A88A53', '#EDE3DB']

export const formatPrice = (value) =>
  `${new Intl.NumberFormat('fr-FR').format(Math.round(Number(value) || 0)).replace(/\u202f/g, ' ')} TND`

function getApiOrigin() {
  const url = import.meta.env.VITE_API_URL
  if (!url) return ''
  try {
    const u = new URL(url)
    return u.origin
  } catch {
    return ''
  }
}

export function resolveImageUrl(imagePath) {
  if (!imagePath) return ''
  if (/^https?:\/\//i.test(imagePath)) return imagePath
  const origin = getApiOrigin()
  const normalized = imagePath.startsWith('/') ? imagePath : `/${imagePath}`
  return origin ? `${origin}${normalized}` : normalized
}

export function normalizeProduct(p) {
  if (!p) return null
  const cat = p.category
  const categorySlug = typeof cat === 'object' ? cat?.slug : cat
  const categoryName = typeof cat === 'object' ? cat?.name : ''
  const id = p._id || p.id

  return {
    id,
    _id: id,
    name: p.name,
    slug: p.slug,
    category: categorySlug,
    categoryName,
    price: p.price,
    comparePrice: p.comparePrice,
    description: p.description,
    descriptionLong: p.descriptionLong,
    dimensions: p.dimensions,
    material: p.material,
    tags: p.tags || [],
    bgColor: p.bgLabel || '#EDE8E0',
    imageUrl: resolveImageUrl(p.images?.[0]),
    images: (p.images || []).map(resolveImageUrl),
    isNew: Boolean(p.isNew),
    isBestSeller: Boolean(p.isBestSeller),
    isFeatured: Boolean(p.isFeatured),
    rating: p.rating ?? 0,
    reviews: p.reviewCount ?? p.reviews ?? 0,
    stock: p.stock,
  }
}

export function normalizeCategory(c, index = 0) {
  const id = c._id || c.id
  return {
    id,
    _id: id,
    name: c.name,
    slug: c.slug,
    icon: c.icon,
    count: c.count ?? 0,
    tagline: c.tagline || `Découvrez notre sélection ${c.name?.toLowerCase() || ''}`,
    panelColor: PANEL_COLORS[index % PANEL_COLORS.length],
  }
}

export const SORT_TO_API = {
  pertinence: 'newest',
  croissant: 'price_asc',
  decroissant: 'price_desc',
  nouveau: 'newest',
}
