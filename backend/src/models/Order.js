import mongoose from 'mongoose'

const { Schema } = mongoose

const itemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product' },
  productName: String,
  productBgLabel: String,
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
  subtotal: Number,
}, { _id: false })

const orderSchema = new Schema({
  orderNumber: { type: String, unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User', default: null },
  customer: {
    fullName: { type: String, required: true },
    email: String,
    phone: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, default: 'Tunis' },
      region: String,
      country: { type: String, default: 'Tunisie' },
      notes: String,
    },
    comments: String,
    isGuest: { type: Boolean, default: true },
  },
  items: [itemSchema],
  subtotal: { type: Number, required: true, default: 0 },
  deliveryFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true, default: 0 },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'pending',
    index: true,
  },
  statusHistory: [{ status: String, note: String, changedAt: { type: Date, default: Date.now } }],
  paymentMethod: { type: String, default: 'cash_on_delivery' },
  isPaid: { type: Boolean, default: false },
  notes: String,
  source: { type: String, default: 'website' },
}, { timestamps: true })

orderSchema.index({ createdAt: -1 })
orderSchema.index({ 'customer.phone': 1 })

orderSchema.pre('save', async function hydrateOrder(next) {
  if (!this.orderNumber) {
    const year = new Date().getFullYear()
    const count = await this.constructor.countDocuments({
      createdAt: { $gte: new Date(`${year}-01-01`), $lt: new Date(`${year + 1}-01-01`) },
    })
    this.orderNumber = `AD-${year}-${String(count + 1).padStart(4, '0')}`
  }
  this.items = this.items.map((i) => ({ ...i.toObject?.() || i, subtotal: i.quantity * i.price }))
  this.subtotal = this.items.reduce((acc, i) => acc + i.subtotal, 0)
  this.total = this.subtotal + this.deliveryFee - this.discount
  if (!this.statusHistory?.length) this.statusHistory = [{ status: this.status, note: 'Commande créée' }]
  next()
})

export default mongoose.model('Order', orderSchema)
