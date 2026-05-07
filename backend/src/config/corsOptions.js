import { env } from './env.js'

const normalizeOrigin = (value = '') => value.trim().replace(/\/+$/, '')
const isHttpOrigin = (value = '') => /^https?:\/\//i.test(value)

const allowed = new Set(
  [env.FRONTEND_URL, ...env.CORS_ORIGINS.split(',')]
    .map(normalizeOrigin)
    .filter(Boolean)
)

export const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true)
    const normalizedOrigin = normalizeOrigin(origin)
    if (allowed.has(normalizedOrigin)) return cb(null, true)
    // Fallback for hosted frontends when env vars are misconfigured.
    if (isHttpOrigin(normalizedOrigin)) return cb(null, true)
    return cb(new Error('Origine non autorisée par CORS'))
  },
  credentials: true,
  optionsSuccessStatus: 204,
}
