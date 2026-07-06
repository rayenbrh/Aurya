import { env } from '../config/env.js'

export function getApiPublicOrigin() {
  const base = (env.API_PUBLIC_URL || '').trim().replace(/\/+$/, '')
  return base
}

/** Origin for absolute media URLs — env first, then reverse-proxy headers. */
export function getRequestOrigin(req) {
  const fromEnv = getApiPublicOrigin()
  if (fromEnv) return fromEnv
  if (!req) return ''
  const proto = (req.get('x-forwarded-proto') || req.protocol || 'https').split(',')[0].trim()
  const host = (req.get('x-forwarded-host') || req.get('host') || '').split(',')[0].trim()
  return host ? `${proto}://${host}`.replace(/\/+$/, '') : ''
}

/** Turn /uploads/... or full URL into absolute URL for browsers (split frontend/backend deploy). */
export function toStoredMediaPath(publicPath = '') {
  if (!publicPath) return ''
  if (/^https?:\/\//i.test(publicPath)) {
    try {
      return new URL(publicPath).pathname
    } catch {
      return publicPath
    }
  }
  return publicPath.startsWith('/') ? publicPath : `/${publicPath}`
}

export function toAbsoluteMediaUrl(publicPath = '', req) {
  if (!publicPath) return ''
  if (/^https?:\/\//i.test(publicPath)) return publicPath
  const origin = getRequestOrigin(req)
  const normalized = toStoredMediaPath(publicPath)
  return origin ? `${origin}${normalized}` : normalized
}

export function serializeProduct(product, req) {
  if (!product) return product
  const doc = product.toObject ? product.toObject() : { ...product }
  if (Array.isArray(doc.images)) {
    doc.images = doc.images.map((img) => toAbsoluteMediaUrl(toStoredMediaPath(img), req))
  }
  if (Array.isArray(doc.variants)) {
    doc.variants = doc.variants.map((v) => ({
      ...v,
      photo: v.photo ? toAbsoluteMediaUrl(toStoredMediaPath(v.photo), req) : '',
    }))
  }
  return doc
}

export function serializeProducts(products = [], req) {
  return products.map((p) => serializeProduct(p, req))
}

export function serializeSettings(settings, req) {
  if (!settings) return settings
  const doc = settings.toObject ? settings.toObject() : { ...settings }
  if (doc.hero?.imageUrl) {
    const stored = toStoredMediaPath(doc.hero.imageUrl)
    doc.hero = { ...doc.hero, imageUrl: toAbsoluteMediaUrl(stored, req) }
  }
  return doc
}
