import Product from '../models/Product.js'
import Category from '../models/Category.js'

export async function getProducts(req, res) {
  const {
    category, search, sort = 'newest', featured, isNew, isBestSeller, limit = 12, page = 1,
  } = req.query
  const q = { isAvailable: true }
  if (category) {
    const cat = await Category.findOne({ slug: category })
    if (cat) q.category = cat._id
  }
  if (search) q.name = { $regex: search, $options: 'i' }
  if (featured === 'true') q.isFeatured = true
  if (isNew === 'true') q.isNew = true
  if (isBestSeller === 'true') q.isBestSeller = true
  const sortMap = { price_asc: { price: 1 }, price_desc: { price: -1 }, popular: { orderCount: -1 }, newest: { createdAt: -1 } }
  const total = await Product.countDocuments(q)
  const products = await Product.find(q).populate('category').sort(sortMap[sort] || sortMap.newest).limit(Number(limit)).skip((Number(page) - 1) * Number(limit))
  return res.json({ success: true, data: { products, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) }, message: 'Produits chargés' })
}

export async function getCategoriesAll(_req, res) {
  const categories = await Category.find({ isActive: true }).sort({ order: 1 })
  return res.json({ success: true, data: categories, message: 'Catégories chargées' })
}

export async function getProductBySlug(req, res) {
  const product = await Product.findOneAndUpdate({ slug: req.params.slug, isAvailable: true }, { $inc: { viewCount: 1 } }, { new: true }).populate('category')
  if (!product) return res.status(404).json({ success: false, message: 'Produit introuvable' })
  return res.json({ success: true, data: product, message: 'Produit chargé' })
}
