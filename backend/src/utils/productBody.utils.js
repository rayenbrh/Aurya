const BOOL_KEYS = ['isAvailable', 'isNew', 'isBestSeller', 'isFeatured']
const NUM_KEYS = ['price', 'stock', 'comparePrice', 'rating', 'reviewCount', 'orderCount', 'viewCount']
const STRIP_KEYS = ['_id', '__v', 'slug', 'createdAt', 'updatedAt', 'images', 'existingImages', 'replaceImages', 'hasNewImages', 'variants']

const toBool = (v) => v === true || v === 'true' || v === '1'
const toNum = (v) => (v === '' || v == null ? undefined : Number(v))

export function parseProductBody(raw = {}) {
  const body = { ...raw }

  BOOL_KEYS.forEach((k) => {
    if (body[k] !== undefined) body[k] = toBool(body[k])
  })
  NUM_KEYS.forEach((k) => {
    if (body[k] !== undefined) body[k] = toNum(body[k])
  })

  if (body.tags) {
    try {
      body.tags = typeof body.tags === 'string' ? JSON.parse(body.tags) : body.tags
    } catch {
      body.tags = []
    }
  } else {
    body.tags = []
  }

  if (body.category && typeof body.category === 'object') {
    body.category = body.category._id || body.category.id || ''
  }
  if (body.category === '') delete body.category

  STRIP_KEYS.forEach((k) => delete body[k])

  return body
}
