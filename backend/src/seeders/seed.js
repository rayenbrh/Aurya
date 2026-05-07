import dotenv from 'dotenv'
import mongoose from 'mongoose'
import User from '../models/User.js'

dotenv.config()
await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auryadeco', {
  dbName: process.env.MONGODB_DB_NAME || 'auryadeco',
})

let admin = await User.findOne({ email: 'admin@auryadeco.tn' }).select('+password')
if (!admin) {
  admin = await User.create({
    firstName: 'Admin',
    lastName: 'Aurya',
    email: 'admin@auryadeco.tn',
    phone: '+21600000000',
    password: 'AuryaAdmin@2025!',
    role: 'admin',
  })
}

// eslint-disable-next-line no-console
console.log('✅ Seeding admin terminé. Admin: admin@auryadeco.tn / AuryaAdmin@2025!')
await mongoose.disconnect()
