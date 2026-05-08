import dotenv from 'dotenv'
import mongoose from 'mongoose'
import User from '../models/User.js'

dotenv.config()
await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auryadeco', {
  dbName: process.env.MONGODB_DB_NAME || 'auryadeco',
})

const ADMIN_EMAIL = 'admin@auryadeco.tn'
const ADMIN_PASSWORD = 'AuryaAdmin@2025!'

let admin = await User.findOne({ email: ADMIN_EMAIL }).select('+password')
if (!admin) {
  await User.create({
    firstName: 'Admin',
    lastName:  'Aurya',
    email:     ADMIN_EMAIL,
    phone:     '+21600000000',
    password:  ADMIN_PASSWORD,
    role:      'admin',
  })
  // eslint-disable-next-line no-console
  console.log('✅ Admin créé.')
} else {
  // Force-reset password and ensure required fields exist
  admin.password = ADMIN_PASSWORD
  admin.phone    = admin.phone || '+21600000000'
  admin.role     = 'admin'
  await admin.save()
  // eslint-disable-next-line no-console
  console.log('✅ Mot de passe admin réinitialisé.')
}

// eslint-disable-next-line no-console
console.log(`Admin: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`)
await mongoose.disconnect()
