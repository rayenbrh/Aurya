import { env } from '../config/env.js'

export function getApiPublicOrigin() {
  const base = (env.API_PUBLIC_URL || '').trim().replace(/\/+$/, '')
  return base
}

/** Turn /uploads/... or full URL into absolute URL for browsers (split frontend/backend deploy). */
export function toAbsoluteMediaUrl(publicPath = '') {
  if (!publicPath) return ''
  if (/^https?:\/\//i.test(publicPath)) return publicPath
  const origin = getApiPublicOrigin()
  const normalized = publicPath.startsWith('/') ? publicPath : `/${publicPath}`
  return origin ? `${origin}${normalized}` : normalized
}

export function serializeProduct(product) {
  if (!product) return product
  const doc = product.toObject ? product.toObject() : { ...product }
  if (Array.isArray(doc.images)) {
    doc.images = doc.images.map((img) => toAbsoluteMediaUrl(img))
  }
  return doc
}

export function serializeProducts(products = []) {
  return products.map(serializeProduct)
}

export function serializeSettings(settings) {
  if (!settings) return settings
  const doc = settings.toObject ? settings.toObject() : { ...settings }
  if (doc.hero?.imageUrl) {
    doc.hero = { ...doc.hero, imageUrl: toAbsoluteMediaUrl(doc.hero.imageUrl) }
  }
  return doc
}
