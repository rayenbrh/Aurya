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

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp']
  cb(null, allowed.includes(file.mimetype))
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
  const normalized = filePath.replaceAll('\\', '/')
  const idx = normalized.lastIndexOf('/uploads/')
  return idx >= 0 ? normalized.slice(idx) : `/uploads/${path.basename(filePath)}`
}

export async function deleteLocalUpload(publicPath) {
  if (!publicPath) return
  const cleaned = publicPath.replace(/^\/+/, '')
  const abs = path.join(__dirname, '../../', cleaned)
  if (fs.existsSync(abs)) fs.unlinkSync(abs)
}
