import dotenv from 'dotenv'

dotenv.config()

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT || 5000),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/auryadeco',
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || 'auryadeco',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_change_me_32_chars_minimum',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_change_me',
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  CORS_ORIGINS: process.env.CORS_ORIGINS || process.env.FRONTEND_URL || 'http://localhost:5173',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  WHATSAPP_PHONE: process.env.WHATSAPP_PHONE || '+21600000000',
}
