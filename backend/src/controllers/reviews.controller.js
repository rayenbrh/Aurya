import Review from '../models/Review.js'
import Product from '../models/Product.js'
import { toAbsoluteMediaUrl, toStoredMediaPath } from '../utils/media.utils.js'

function serializeReview(review, req) {
  if (!review) return review
  const doc = review.toObject ? review.toObject() : { ...review }
  if (doc.product && Array.isArray(doc.product.images)) {
    doc.product.images = doc.product.images.map((img) =>
      toAbsoluteMediaUrl(toStoredMediaPath(img), req)
    )
  }
  return doc
}

export const getApprovedReviews = async (req, res) => {
  const filter = { isApproved: true }
  if (req.query.product) filter.product = req.query.product
  const reviews = await Review.find(filter)
    .populate('product', 'name images')
    .sort({ createdAt: -1 })
    .limit(30)
  res.json({ success: true, data: reviews.map((r) => serializeReview(r, req)) })
}

export const createReview = async (req, res) => {
  const { productId, authorName, rating, comment } = req.body
  if (!productId || !authorName || !rating || !comment) {
    return res.status(400).json({ success: false, message: 'Tous les champs sont obligatoires' })
  }
  const product = await Product.findById(productId)
  if (!product) return res.status(404).json({ success: false, message: 'Produit introuvable' })
  const review = await Review.create({
    product: productId,
    authorName: String(authorName).trim(),
    rating: Math.min(5, Math.max(1, Number(rating))),
    comment: String(comment).trim(),
    isApproved: false,
  })
  res.status(201).json({ success: true, data: review, message: 'Avis soumis, en attente de validation.' })
}

export const getAdminReviews = async (req, res) => {
  const reviews = await Review.find()
    .populate('product', 'name images')
    .sort({ createdAt: -1 })
  res.json({ success: true, data: reviews.map((r) => serializeReview(r, req)) })
}

export const approveReview = async (req, res) => {
  const review = await Review.findByIdAndUpdate(req.params.id, { isApproved: true }, { new: true })
    .populate('product', 'name images')
  if (!review) return res.status(404).json({ success: false, message: 'Avis introuvable' })
  res.json({ success: true, data: serializeReview(review, req) })
}

export const deleteReview = async (req, res) => {
  await Review.findByIdAndDelete(req.params.id)
  res.json({ success: true, message: 'Avis supprimé' })
}

export const createAdminReview = async (req, res) => {
  const { productId, authorName, rating, comment } = req.body
  if (!productId || !authorName || !rating || !comment) {
    return res.status(400).json({ success: false, message: 'Tous les champs sont obligatoires' })
  }
  const product = await Product.findById(productId)
  if (!product) return res.status(404).json({ success: false, message: 'Produit introuvable' })
  const review = await Review.create({
    product: productId,
    authorName: String(authorName).trim(),
    rating: Math.min(5, Math.max(1, Number(rating))),
    comment: String(comment).trim(),
    isApproved: true,
    isAdminAdded: true,
  })
  const populated = await review.populate('product', 'name images')
  res.status(201).json({ success: true, data: serializeReview(populated, req) })
}
