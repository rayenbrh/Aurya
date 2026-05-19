import fs from 'fs'
import path from 'path'
import multer from 'multer'
import { fileURLToPath } from 'url'
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const uploadsRoot = path.join(__dirname, '../../uploads')

const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
}

ensureDir(uploadsRoot)

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.uploadFolder || 'misc'
    const target = path.join(uploadsRoot, folder)
    ensureDir(target)
    cb(null, target)
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '.jpg')
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`)
  },
})

const fileFilter = (_req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp']
  if (allowed.includes(file.mimetype)) return cb(null, true)
  cb(new Error('Only image files are allowed'))
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 8 * 1024 * 1024 },
})

export function withUploadFolder(folder) {
  return (req, _res, next) => {
    req.uploadFolder = folder
    next()
  }
}

export function toPublicUploadUrl(filePath) {
  const relative = path.relative(uploadsRoot, filePath).replace(/\\/g, '/')
  if (!relative || relative.startsWith('..')) {
    return `/uploads/${path.basename(filePath)}`
  }
  return `/uploads/${relative}`.replace(/\/+/g, '/')
}

/** Store relative path in DB; expose absolute URL in API responses via media.utils */
export function toStoredUploadUrl(filePath) {
  return toPublicUploadUrl(filePath)
}

export function toResponseUploadUrl(storedPath) {
  return toAbsoluteMediaUrl(storedPath)
}

export async function deleteLocalUpload(publicPath) {
  if (!publicPath) return
  const cleaned = publicPath.replace(/^\/+/, '')
  const abs = path.join(__dirname, '../../', cleaned)
  if (fs.existsSync(abs)) fs.unlinkSync(abs)
}
