import SiteSettings from '../models/SiteSettings.js'
import { deleteLocalUpload, toPublicUploadUrl } from '../utils/upload.utils.js'
import { serializeSettings, toAbsoluteMediaUrl } from '../utils/media.utils.js'

const getOrCreate = () =>
  SiteSettings.findOneAndUpdate({ key: 'main' }, { $setOnInsert: { key: 'main' } }, { upsert: true, new: true })

export async function getSettings(req, res) {
  const settings = await getOrCreate()
  res.set('Cache-Control', 'no-cache')
  return res.json({ success: true, data: serializeSettings(settings, req), message: 'Paramètres chargés' })
}

export async function patchHeroText(req, res) {
  const updates = {}
  Object.entries(req.body).forEach(([k, v]) => {
    if (k !== '_id') updates[`hero.${k}`] = v
  })
  const settings = await SiteSettings.findOneAndUpdate({ key: 'main' }, { $set: updates }, { new: true, upsert: true })
  return res.json({ success: true, data: settings.hero, message: 'Texte héro mis à jour' })
}

export async function patchHeroImage(req, res) {
  if (!req.file) return res.status(400).json({ success: false, message: 'Image hero requise' })
  const settings = await getOrCreate()
  const oldUrl = settings.hero?.imageUrl || settings.hero?.imagePublicId
  if (oldUrl) await deleteLocalUpload(oldUrl)
  const localUrl = toPublicUploadUrl(req.file.path)
  await SiteSettings.findOneAndUpdate(
    { key: 'main' },
    { $set: { 'hero.imageUrl': localUrl, 'hero.imagePublicId': localUrl } },
    { new: true },
  )
  return res.json({
    success: true,
    data: { imageUrl: toAbsoluteMediaUrl(localUrl, req) },
    message: 'Image héro mise à jour',
  })
}

export async function patchMarquee(req, res) {
  const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => k !== '_id').map(([k, v]) => [`marquee.${k}`, v]))
  const settings = await SiteSettings.findOneAndUpdate({ key: 'main' }, { $set: updates }, { new: true, upsert: true })
  return res.json({ success: true, data: settings.marquee, message: 'Marquee mise à jour' })
}

export async function patchContact(req, res) {
  const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => k !== '_id').map(([k, v]) => [`contact.${k}`, v]))
  const settings = await SiteSettings.findOneAndUpdate({ key: 'main' }, { $set: updates }, { new: true, upsert: true })
  return res.json({ success: true, data: settings.contact, message: 'Contact mis à jour' })
}

export async function patchSeo(req, res) {
  const updates = Object.fromEntries(Object.entries(req.body).filter(([k]) => k !== '_id').map(([k, v]) => [`seo.${k}`, v]))
  const settings = await SiteSettings.findOneAndUpdate({ key: 'main' }, { $set: updates }, { new: true, upsert: true })
  return res.json({ success: true, data: settings.seo, message: 'SEO mis à jour' })
}
