import dotenv from 'dotenv'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'

dotenv.config()
await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/auryadeco', {
  dbName: process.env.MONGODB_DB_NAME || 'auryadeco',
})

const TEST_EMAIL    = 'admin@auryadeco.tn'
const TEST_PASSWORD = 'AuryaAdmin@2025!'

console.log('\n── Admin Account Diagnostics ──────────────────')

const user = await User.findOne({ email: TEST_EMAIL }).select('+password +refreshToken')

if (!user) {
  console.log('❌ No user found with email:', TEST_EMAIL)
  console.log('   → Run: node src/seeders/seed.js')
} else {
  console.log('✅ User found')
  console.log('   email      :', user.email)
  console.log('   role       :', user.role)
  console.log('   firstName  :', user.firstName)
  console.log('   phone      :', user.phone)
  console.log('   hash prefix:', user.password ? user.password.substring(0, 30) + '…' : 'MISSING')

  if (!user.password) {
    console.log('❌ Password field is empty — re-run seed')
  } else {
    const match = await bcrypt.compare(TEST_PASSWORD, user.password)
    console.log('   bcrypt match:', match ? '✅ YES' : '❌ NO — password hash is wrong, re-run seed')
  }

  if (user.role !== 'admin') {
    console.log('❌ role is', user.role, '— not "admin". Re-run seed.')
  }
}

console.log('────────────────────────────────────────────────\n')
await mongoose.disconnect()
