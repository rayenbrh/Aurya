import SiteSettings from '../models/SiteSettings.js'
import { deleteLocalUpload, toPublicUploadUrl } from '../utils/upload.utils.js'

const getOrCreate = () =>
  SiteSettings.findOneAndUpdate({ key: 'main' }, { $setOnInsert: { key: 'main' } }, { upsert: true, new: true })

export async function getSettings(_req, res) {
  const settings = await getOrCreate()
  res.set('Cache-Control', 'public, max-age=60')
  return res.json({ success: true, data: settings, message: 'Paramètres chargés' })
}

export async function patchHeroText(req, res) {
  const settings = await SiteSettings.findOneAndUpdate({ key: 'main' }, { $set: { hero: { ...req.body } } }, { new: true, upsert: true })
  return res.json({ success: true, data: settings.hero, message: 'Texte héro mis à jour' })
}

export async function patchHeroImage(req, res) {
  if (!req.file) return res.status(400).json({ success: false, message: 'Image hero requise' })
  const settings = await getOrCreate()
  if (settings.hero.imagePublicId) await deleteLocalUpload(settings.hero.imagePublicId)
  const localUrl = toPublicUploadUrl(req.file.path)
  settings.hero.imageUrl = localUrl
  settings.hero.imagePublicId = localUrl
  await settings.save()
  return res.json({ success: true, data: { imageUrl: localUrl }, message: 'Image héro mise à jour' })
}

export async function patchMarquee(req, res) {
  const settings = await SiteSettings.findOneAndUpdate({ key: 'main' }, { $set: { marquee: req.body } }, { new: true, upsert: true })
  return res.json({ success: true, data: settings.marquee, message: 'Marquee mise à jour' })
}

export async function patchContact(req, res) {
  const settings = await SiteSettings.findOneAndUpdate({ key: 'main' }, { $set: { contact: req.body } }, { new: true, upsert: true })
  return res.json({ success: true, data: settings.contact, message: 'Contact mis à jour' })
}

export async function patchSeo(req, res) {
  const settings = await SiteSettings.findOneAndUpdate({ key: 'main' }, { $set: { seo: req.body } }, { new: true, upsert: true })
  return res.json({ success: true, data: settings.seo, message: 'SEO mis à jour' })
}
