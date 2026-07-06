import mongoose from 'mongoose'
import { slugify } from '../utils/slugify.utils.js'

const { Schema } = mongoose

const productSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, index: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  description: { type: String, required: true },
  descriptionLong: String,
  price: { type: Number, required: true, min: 0 },
  comparePrice: Number,
  dimensions: String,
  material: String,
  bgLabel: String,
  images: [String],
  tags: [String],
  variants: [{
    title: { type: String, required: true },
    name: { type: String, required: true },
    photo: String,
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0 },
  }],
  isAvailable: { type: Boolean, default: true },
  isNew: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  stock: { type: Number, default: 999 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },
  orderCount: { type: Number, default: 0 },
  viewCount: { type: Number, default: 0 },
}, { timestamps: true })

productSchema.pre('save', function setSlug() {
  if (this.isModified('name')) this.slug = slugify(this.name)
})

productSchema.pre('findOneAndUpdate', function setUpdatedAt() {
  this.set({ updatedAt: new Date() })
})

export default mongoose.model('Product', productSchema)
