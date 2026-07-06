import Category from '../models/Category.js'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import SiteSettings from '../models/SiteSettings.js'
import User from '../models/User.js'
import { deleteLocalUpload, toPublicUploadUrl } from '../utils/upload.utils.js'
import { serializeProduct, serializeProducts, toStoredMediaPath } from '../utils/media.utils.js'
import { parseProductBody } from '../utils/productBody.utils.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const getAdminProducts = async (req, res) => {
  const products = await Product.find().populate('category').sort({ createdAt: -1 })
  res.json({ success: true, data: serializeProducts(products, req), message: 'Produits admin' })
}

function parseVariantsFromRequest(req) {
  const raw = req.body?.variants
  if (!raw) return []
  try {
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function attachVariantPhotos(variants, files) {
  const variantFiles = (files || []).filter((f) => f.fieldname?.startsWith('variantPhoto_'))
  return variants.map((v, i) => {
    const file = variantFiles.find((f) => f.fieldname === `variantPhoto_${i}`)
    return {
      title: String(v.title || '').trim(),
      name: String(v.name || '').trim(),
      price: Number(v.price) || 0,
      stock: Number(v.stock) || 0,
      photo: file ? toPublicUploadUrl(file.path) : (v.photo || ''),
    }
  })
}

export const createAdminProduct = async (req, res) => {
  const body = parseProductBody(req.body)
  if (!body.category) {
    return res.status(400).json({ success: false, message: 'La catégorie est obligatoire' })
  }
  if (!body.description?.trim()) {
    return res.status(400).json({ success: false, message: 'La description est obligatoire' })
  }
  const files = req.files || []
  const imageFiles = files.filter((f) => f.fieldname === 'images')
  body.images = imageFiles.map((f) => toPublicUploadUrl(f.path))
  const variants = parseVariantsFromRequest(req)
  body.variants = attachVariantPhotos(variants, files)
  const product = await Product.create(body)
  res.status(201).json({ success: true, data: serializeProduct(product, req), message: 'Produit créé' })
}

export const updateAdminProduct = async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) return res.status(404).json({ success: false, message: 'Produit introuvable' })
  const allFiles = req.files || []
  const body = parseProductBody(req.body)
  const newImages = allFiles.filter((f) => f.fieldname === 'images').map((f) => toPublicUploadUrl(f.path))
  const expectsFiles = req.body?.hasNewImages === 'true' || req.body?.hasNewImages === true
  if (expectsFiles && newImages.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Les images n\'ont pas été reçues par le serveur. Réessayez (évitez les très gros fichiers).',
    })
  }

  const replaceImages = req.body?.replaceImages === 'true' || req.body?.replaceImages === true
  let finalImages = [...(product.images || [])]

  if (newImages.length > 0) {
    if (replaceImages) {
      finalImages = newImages
    } else {
      let existingImages = product.images || []
      if (req.body?.existingImages !== undefined) {
        try {
          const raw = req.body.existingImages
          const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
          existingImages = Array.isArray(parsed) ? parsed.map(toStoredMediaPath) : []
        } catch {
          existingImages = []
        }
      }
      finalImages = [...existingImages, ...newImages].slice(0, 4)
    }
  } else if (req.body?.existingImages !== undefined) {
    try {
      const raw = req.body.existingImages
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
      finalImages = Array.isArray(parsed) ? parsed.map(toStoredMediaPath).slice(0, 4) : finalImages
    } catch {
      /* keep current */
    }
  }

  const kept = new Set(finalImages.map(toStoredMediaPath))
  const removed = (product.images || []).filter((img) => !kept.has(toStoredMediaPath(img)))
  await Promise.all(removed.map((img) => deleteLocalUpload(img)))

  body.images = finalImages

  const variants = parseVariantsFromRequest(req)
  if (req.body?.variants !== undefined) {
    body.variants = attachVariantPhotos(variants, allFiles)
  }

  const updated = await Product.findByIdAndUpdate(req.params.id, { $set: body }, { new: true, runValidators: true })
  res.json({ success: true, data: serializeProduct(updated, req), message: 'Produit mis à jour' })
}

export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id)
  if (!product) {
    return res.status(404).json({ success: false, message: 'Produit introuvable' })
  }
  await Promise.all((product.images || []).map((img) => deleteLocalUpload(img)))
  await Product.findByIdAndDelete(req.params.id)
  return res.json({ success: true, data: { id: req.params.id }, message: 'Produit supprimé définitivement' })
}

export const toggleProduct = async (req, res) => {
  const p = await Product.findById(req.params.id)
  p.isAvailable = !p.isAvailable
  await p.save()
  res.json({ success: true, data: p, message: 'Disponibilité mise à jour' })
}

export const getAdminCategories = async (_req, res) => res.json({ success: true, data: await Category.find().sort({ order: 1 }), message: 'Catégories' })
export const createCategory = async (req, res) => {
  const name = String(req.body.name || '').trim()
  if (!name) {
    return res.status(400).json({ success: false, message: 'Le nom de la catégorie est obligatoire' })
  }
  const icon = String(req.body.icon || '🏷').trim() || '🏷'
  const order = Number(req.body.order)
  const payload = { name, icon, order: Number.isFinite(order) ? order : 0 }
  try {
    const data = await Category.create(payload)
    return res.status(201).json({ success: true, data, message: 'Catégorie créée' })
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ success: false, message: 'Une catégorie avec ce nom existe déjà' })
    }
    throw err
  }
}
export const updateCategory = async (req, res) => res.json({ success: true, data: await Category.findByIdAndUpdate(req.params.id, req.body, { new: true }), message: 'Catégorie mise à jour' })
export const deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.id)
  if (!category) return res.status(404).json({ success: false, message: 'Catégorie introuvable' })
  const productCount = await Product.countDocuments({ category: req.params.id })
  if (productCount > 0) {
    return res.status(400).json({
      success: false,
      message: `Impossible de supprimer : ${productCount} produit(s) lié(s) à cette catégorie`,
    })
  }
  await Category.findByIdAndDelete(req.params.id)
  return res.json({ success: true, data: category, message: 'Catégorie supprimée' })
}
export const reorderCategories = async (req, res) => {
  await Promise.all(req.body.map((i) => Category.findByIdAndUpdate(i.id, { order: i.order })))
  res.json({ success: true, data: await Category.find().sort({ order: 1 }), message: 'Ordre sauvegardé' })
}

export const getAdminOrders = async (req, res) => {
  const { status, search, page = 1, limit = 10 } = req.query
  const q = {}
  if (status) q.status = status
  if (search) q.$or = [{ orderNumber: { $regex: search, $options: 'i' } }, { 'customer.fullName': { $regex: search, $options: 'i' } }, { 'customer.phone': { $regex: search, $options: 'i' } }]
  const total = await Order.countDocuments(q)
  const orders = await Order.find(q).sort({ createdAt: -1 }).limit(Number(limit)).skip((Number(page) - 1) * Number(limit))
  res.json({ success: true, data: { orders, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) }, message: 'Commandes admin' })
}
export const getAdminOrderById = async (req, res) => res.json({ success: true, data: await Order.findById(req.params.id).populate('items.product'), message: 'Détail commande' })
export const updateOrderStatus = async (req, res) => {
  const { status, note } = req.body
  const order = await Order.findById(req.params.id)
  order.status = status
  order.statusHistory.push({ status, note: note || '' })
  await order.save()
  res.json({ success: true, data: order, message: 'Statut mis à jour' })
}
export const updateOrderNotes = async (req, res) => res.json({ success: true, data: await Order.findByIdAndUpdate(req.params.id, { notes: req.body.notes || '' }, { new: true }), message: 'Notes mises à jour' })

export const getUsers = async (req, res) => {
  const { page = 1, limit = 20, search } = req.query
  const q = { role: 'customer' }
  if (search) q.$or = [{ firstName: { $regex: search, $options: 'i' } }, { lastName: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }, { phone: { $regex: search, $options: 'i' } }]
  const total = await User.countDocuments(q)
  const users = await User.find(q).sort({ createdAt: -1 }).limit(Number(limit)).skip((Number(page) - 1) * Number(limit))
  res.json({ success: true, data: { users, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) }, message: 'Clients' })
}
export const getUserById = async (req, res) => res.json({ success: true, data: { user: await User.findById(req.params.id), orders: await Order.find({ user: req.params.id }).sort({ createdAt: -1 }) }, message: 'Profil client' })
export const patchUserRole = async (req, res) => res.json({ success: true, data: await User.findByIdAndUpdate(req.params.id, { role: req.body.role }, { new: true }), message: 'Rôle mis à jour' })

const walkFiles = (dir) => {
  if (!fs.existsSync(dir)) return []
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  return entries.flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return walkFiles(full)
    return [full]
  })
}

export const cleanupOrphanUploads = async (_req, res) => {
  const [products, settings] = await Promise.all([
    Product.find({}, { images: 1 }),
    SiteSettings.findOne({ key: 'main' }),
  ])

  const referenced = new Set()
  products.forEach((p) => (p.images || []).forEach((img) => referenced.add(img)))
  if (settings?.hero?.imageUrl) referenced.add(settings.hero.imageUrl)

  const uploadsDir = path.join(__dirname, '../../uploads')
  const allFiles = walkFiles(uploadsDir)
  const allPublicUrls = allFiles.map((f) => toPublicUploadUrl(f))

  const orphanUrls = allPublicUrls.filter((url) => !referenced.has(url))
  await Promise.all(orphanUrls.map((url) => deleteLocalUpload(url)))

  return res.json({
    success: true,
    data: {
      scanned: allPublicUrls.length,
      referenced: referenced.size,
      deleted: orphanUrls.length,
      deletedFiles: orphanUrls,
    },
    message: 'Nettoyage des uploads orphelins terminé',
  })
}
