import mongoose from 'mongoose'

const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'main', unique: true },
    hero: {
      imageUrl: { type: String, default: '' },
      imagePublicId: { type: String, default: '' },
      headlineTop: { type: String, default: 'Élever chaque' },
      headlineItalic: { type: String, default: 'intérieur' },
      headlineBottom: { type: String, default: "au rang d'œuvre d'art" },
      subtitle: { type: String, default: "Mobilier et décoration d'exception..." },
      tag1Name: { type: String, default: 'Canapé Velours Imperial' },
      tag1Price: { type: String, default: '4 800 TND' },
      tag2Name: { type: String, default: 'Table Marbre Carrara' },
      tag2Price: { type: String, default: '7 200 TND' },
      ctaButtonText: { type: String, default: 'Découvrir la collection' },
    },
    marquee: {
      text: { type: String, default: 'Mobilier Haut de Gamme ✦ ...' },
      speed: { type: Number, default: 28 },
    },
    contact: {
      phone: { type: String, default: '+216 XX XXX XXX' },
      address: { type: String, default: 'Tunis, Tunisie' },
      hours: { type: String, default: 'Lun–Sam: 9h–19h' },
      whatsapp: { type: String, default: '+21600000000' },
    },
    seo: {
      metaTitle: { type: String, default: 'Aurya Deco — Interiors' },
      metaDescription: { type: String, default: 'Mobilier et décoration...' },
    },
  },
  { timestamps: true },
)

export default mongoose.model('SiteSettings', settingsSchema)
