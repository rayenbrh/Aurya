import mongoose from 'mongoose'
const { Schema } = mongoose

const reviewSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  authorName: { type: String, required: true, trim: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true, trim: true },
  isApproved: { type: Boolean, default: false },
  isAdminAdded: { type: Boolean, default: false },
}, { timestamps: true })

export default mongoose.model('Review', reviewSchema)
