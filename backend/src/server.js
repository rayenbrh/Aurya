import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDB } from './config/db.js'
import { env } from './config/env.js'
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

app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())
app.use(morgan('dev'))
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

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

if (env.NODE_ENV === 'production') {
  const frontendBuild = path.join(__dirname, '../../frontend/dist')
  app.use(express.static(frontendBuild))
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) return next()
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
