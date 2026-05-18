import mongoose from 'mongoose'
import { slugify } from '../utils/slugify.utils.js'

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true },
  icon: String,
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  count: { type: Number, default: 0 },
})

categorySchema.pre('save', function setSlug() {
  if (this.isModified('name')) this.slug = slugify(this.name)
})

export default mongoose.model('Category', categorySchema)
