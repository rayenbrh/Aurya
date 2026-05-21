import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDB } from './config/db.js'
import { env } from './config/env.js'
import { getRequestOrigin } from './utils/media.utils.js'
import { corsOptions } from './config/corsOptions.js'
import authRoutes from './routes/auth.routes.js'
import productRoutes from './routes/products.routes.js'
import orderRoutes from './routes/orders.routes.js'
import adminRoutes from './routes/admin.routes.js'
import settingsRoutes from './routes/settings.routes.js'
import { errorHandler } from './middleware/errorHandler.middleware.js'
import { generalLimiter, strictLimiter } from './middleware/rateLimiter.middleware.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

app.set('trust proxy', 1)

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}))
app.use(cors(corsOptions))
app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())
app.use(morgan('dev'))

const uploadsDir = path.join(__dirname, '../uploads')
app.use('/uploads', (_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
  next()
}, express.static(uploadsDir, {
  maxAge: env.NODE_ENV === 'production' ? '7d' : 0,
}))

app.use('/api', generalLimiter)
app.use('/api/orders', strictLimiter)

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/settings', settingsRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString(), env: env.NODE_ENV }, message: 'API OK' })
})

app.get('/api/config', (req, res) => {
  const origin = getRequestOrigin(req)
  res.json({
    success: true,
    data: {
      apiBase: origin ? `${origin}/api` : '/api',
      uploadsBase: origin ? `${origin}/uploads` : '/uploads',
    },
    message: 'Config publique',
  })
})

if (env.NODE_ENV === 'production') {
  const frontendBuild = path.join(__dirname, '../../frontend/dist')
  app.use(express.static(frontendBuild))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/') || req.path.startsWith('/uploads/')) return next()
    return res.sendFile(path.join(frontendBuild, 'index.html'))
  })
}

app.use(errorHandler)

connectDB()
  .then(() => {
    app.listen(env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`🏛 Aurya Deco server running on port ${env.PORT}`)
    })
  })
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error('DB connection error', e)
    process.exit(1)
  })
