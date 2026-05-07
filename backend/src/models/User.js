import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    password: { type: String, required: true, select: false },
    address: {
      street: String,
      city: { type: String, default: 'Tunis' },
      region: String,
      country: { type: String, default: 'Tunisie' },
      notes: String,
    },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    refreshToken: { type: String, select: false },
    orderCount: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastLogin: Date,
  },
  { timestamps: { createdAt: true, updatedAt: false }, toJSON: { virtuals: true } },
)

userSchema.pre('save', async function hashPassword() {
  if (!this.isModified('password')) return
  this.password = await bcrypt.hash(this.password, 12)
})

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password)
}

userSchema.virtual('fullName').get(function fullName() {
  return `${this.firstName} ${this.lastName}`.trim()
})

export default mongoose.model('User', userSchema)
