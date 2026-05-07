import { env } from './env.js'

const allowed = env.CORS_ORIGINS.split(',').map((x) => x.trim()).filter(Boolean)

export const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true)
    if (allowed.includes(origin)) return cb(null, true)
    if (env.NODE_ENV === 'production' && origin.startsWith('http')) return cb(null, true)
    return cb(new Error('Origine non autorisée par CORS'))
  },
  credentials: true,
}
