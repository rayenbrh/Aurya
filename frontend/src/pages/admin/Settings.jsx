import { useEffect, useState } from 'react'
import { adminService } from '../../services/admin.service'
import { resolveImageUrl } from '../../utils/catalog'

const TABS = ['hero', 'marquee', 'contact', 'seo']

const HERO_FIELDS = [
  ['headlineTop',    'Titre haut'],
  ['headlineItalic', 'Titre italique (en gras/bark)'],
  ['headlineBottom', 'Titre bas'],
  ['subtitle',       'Sous-titre'],
  ['ctaButtonText',  'Texte bouton CTA'],
  ['tag1Name',       'Tag 1 — nom produit'],
  ['tag1Price',      'Tag 1 — prix'],
  ['tag2Name',       'Tag 2 — nom produit'],
  ['tag2Price',      'Tag 2 — prix'],
]

function Toast({ msg, isError }) {
  if (!msg) return null
  return (
    <div className={`fixed bottom-6 right-6 z-[999] border px-4 py-3 font-josefin text-[9px] uppercase tracking-[0.18em] shadow-lg ${
      isError ? 'border-red-200 bg-red-50 text-red-700' : 'border-bark/30 bg-bark/[0.07] text-bark'
    }`}>
      {isError ? '✗ ' : '✓ '}{msg}
    </div>
  )
}

const Settings = () => {
  const [tab, setTab]           = useState('hero')
  const [settings, setSettings] = useState(null)
  const [heroImageFile, setHeroImageFile] = useState(null)
  const [saving, setSaving]     = useState(false)
  const [toast, setToast]       = useState({ msg: '', isError: false })

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError })
    setTimeout(() => setToast({ msg: '', isError: false }), 3000)
  }

  useEffect(() => {
    adminService.getSettings()
      .then(({ data }) => setSettings(data.data))
      .catch(() => showToast('Erreur chargement paramètres', true))
  }, [])

  if (!settings) return (
    <section className="grid min-h-[200px] place-items-center">
      <p className="font-josefin text-[9px] uppercase tracking-[0.2em] text-stone/40">Chargement…</p>
    </section>
  )

  const hero = settings.hero || {}

  const setHeroField = (k, v) =>
    setSettings((s) => ({ ...s, hero: { ...s.hero, [k]: v } }))

  const saveHeroText = async () => {
    setSaving(true)
    try {
      const payload = {}
      HERO_FIELDS.forEach(([k]) => { payload[k] = hero[k] ?? '' })
      await adminService.updateHeroText(payload)
      showToast('Textes héro enregistrés')
    } catch (err) {
      showToast(err?.response?.data?.message || 'Erreur lors de la sauvegarde', true)
    } finally {
      setSaving(false)
    }
  }

  const saveHeroImage = async () => {
    if (!heroImageFile) return
    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('heroImage', heroImageFile)
      const { data } = await adminService.updateHeroImage(fd)
      const url = resolveImageUrl(data.data.imageUrl)
      const bust = `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`
      setSettings((s) => ({ ...s, hero: { ...s.hero, imageUrl: bust } }))
      setHeroImageFile(null)
      showToast('Image héro enregistrée')
    } catch (err) {
      showToast(err?.response?.data?.message || "Erreur upload image", true)
    } finally {
      setSaving(false)
    }
  }

  const inputCls = 'w-full border-b border-nude/80 bg-transparent pb-2.5 font-josefin text-[11px] text-ink outline-none transition-colors placeholder:text-stone/30 focus:border-bark'

  return (
    <section>
      <Toast msg={toast.msg} isError={toast.isError} />

      {/* Tabs */}
      <div className="admin-status-pills mb-6 border-b border-nude/60">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 pr-6 font-josefin text-[9px] uppercase tracking-[0.2em] transition-colors ${
              tab === t ? 'border-b-2 border-bark text-bark' : 'text-stone/40 hover:text-stone'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── Hero ── */}
      {tab === 'hero' && (
        <div className="admin-two-col" style={{ gridTemplateColumns: '55% 45%' }}>
          <div className="border border-nude/60 bg-cream p-6">

            {/* Image section */}
            <p className="mb-4 font-josefin text-[8px] uppercase tracking-[0.2em] text-stone/50">Image héro</p>
            {hero.imageUrl
              ? <img src={resolveImageUrl(hero.imageUrl)} alt="Hero" className="mb-3 max-h-[160px] w-full object-cover border border-nude/60" />
              : <div className="mb-3 grid h-[100px] place-items-center bg-parchment font-josefin text-[8px] uppercase tracking-[0.15em] text-stone/30">Aucune image</div>
            }
            <input type="file" accept="image/jpeg,image/png,image/webp" className="mb-3 block w-full font-josefin text-[9px] text-stone/50"
              onChange={(e) => setHeroImageFile(e.target.files?.[0] || null)} />
            <button onClick={saveHeroImage} disabled={!heroImageFile || saving}
              className="mb-8 h-10 w-full border border-bark bg-transparent font-josefin text-[8px] uppercase tracking-[0.2em] text-bark transition-colors hover:bg-bark hover:text-cream disabled:opacity-30">
              Enregistrer l'image
            </button>

            {/* Text fields */}
            <p className="mb-4 font-josefin text-[8px] uppercase tracking-[0.2em] text-stone/50">Textes</p>
            <div className="space-y-5">
              {HERO_FIELDS.map(([k, label]) => (
                <label key={k} className="block">
                  <span className="mb-1.5 block font-josefin text-[7px] uppercase tracking-[0.18em] text-stone/40">{label}</span>
                  <input
                    className={inputCls}
                    value={hero[k] ?? ''}
                    onChange={(e) => setHeroField(k, e.target.value)}
                    placeholder={label}
                  />
                </label>
              ))}
            </div>

            <button onClick={saveHeroText} disabled={saving}
              className="btn-bark mt-7 h-12 w-full justify-center disabled:opacity-60">
              {saving ? 'Enregistrement…' : 'Enregistrer les textes'}
            </button>
          </div>

          {/* Live preview */}
          <div className="admin-preview border border-nude/60 bg-parchment p-6">
            <p className="mb-4 text-center font-josefin text-[8px] uppercase tracking-[0.2em] text-stone/40">Aperçu en direct</p>
            <div className="relative border border-nude/60" style={{
              height: 200,
              background: hero.imageUrl ? `url(${resolveImageUrl(hero.imageUrl)}) center/cover` : '#EDE8E0',
            }}>
              {hero.tag1Name && (
                <div className="absolute bottom-3 left-3 border border-nude/60 bg-cream/90 px-3 py-2">
                  <p className="font-josefin text-[7px] uppercase tracking-[0.12em] text-stone/60">{hero.tag1Name}</p>
                  <p className="font-cormorant text-lg text-bark">{hero.tag1Price}</p>
                </div>
              )}
            </div>
            <p className="mt-4 font-cormorant text-3xl leading-tight text-ink">
              {hero.headlineTop} <span className="italic text-bark">{hero.headlineItalic}</span> {hero.headlineBottom}
            </p>
            {hero.subtitle && <p className="mt-2 font-josefin text-[9px] text-stone/60">{hero.subtitle}</p>}
            {hero.ctaButtonText && (
              <span className="mt-4 inline-block bg-bark px-4 py-2 font-josefin text-[8px] uppercase tracking-[0.2em] text-cream">
                {hero.ctaButtonText}
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Marquee ── */}
      {tab === 'marquee' && (
        <MarqueeTab settings={settings} setSettings={setSettings} showToast={showToast} />
      )}

      {/* ── Contact ── */}
      {tab === 'contact' && (
        <ContactTab settings={settings} setSettings={setSettings} showToast={showToast} />
      )}

      {/* ── SEO ── */}
      {tab === 'seo' && (
        <SeoTab settings={settings} setSettings={setSettings} showToast={showToast} />
      )}
    </section>
  )
}

function TabPanel({ children, onSave, saving }) {
  return (
    <div className="max-w-[560px] border border-nude/60 bg-cream p-6 space-y-5">
      {children}
      <button onClick={onSave} disabled={saving} className="btn-bark mt-2 h-11 w-full justify-center disabled:opacity-60">
        {saving ? 'Enregistrement…' : 'Enregistrer'}
      </button>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text' }) {
  const cls = 'w-full border-b border-nude/80 bg-transparent pb-2.5 font-josefin text-[11px] text-ink outline-none transition-colors placeholder:text-stone/30 focus:border-bark'
  return (
    <label className="block">
      <span className="mb-1.5 block font-josefin text-[7px] uppercase tracking-[0.18em] text-stone/40">{label}</span>
      <input type={type} className={cls} value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={label} />
    </label>
  )
}

function MarqueeTab({ settings, setSettings, showToast }) {
  const [saving, setSaving] = useState(false)
  const m = settings.marquee || {}
  const set = (k, v) => setSettings((s) => ({ ...s, marquee: { ...s.marquee, [k]: v } }))
  const save = async () => {
    setSaving(true)
    try {
      await adminService.updateMarquee({ text: m.text, speed: m.speed })
      showToast('Marquee enregistrée')
    } catch (err) { showToast(err?.response?.data?.message || 'Erreur sauvegarde', true) }
    finally { setSaving(false) }
  }
  return (
    <TabPanel onSave={save} saving={saving}>
      <Field label="Texte du défilé" value={m.text} onChange={(v) => set('text', v)} />
      <Field label="Vitesse (secondes)" value={m.speed} onChange={(v) => set('speed', v)} type="number" />
    </TabPanel>
  )
}

function ContactTab({ settings, setSettings, showToast }) {
  const [saving, setSaving] = useState(false)
  const c = settings.contact || {}
  const set = (k, v) => setSettings((s) => ({ ...s, contact: { ...s.contact, [k]: v } }))
  const save = async () => {
    setSaving(true)
    try {
      await adminService.updateContact(c)
      showToast('Contact enregistré')
    } catch (err) { showToast(err?.response?.data?.message || 'Erreur sauvegarde', true) }
    finally { setSaving(false) }
  }
  return (
    <TabPanel onSave={save} saving={saving}>
      <Field label="Téléphone" value={c.phone} onChange={(v) => set('phone', v)} />
      <Field label="WhatsApp" value={c.whatsapp} onChange={(v) => set('whatsapp', v)} />
      <Field label="Adresse" value={c.address} onChange={(v) => set('address', v)} />
      <Field label="Horaires" value={c.hours} onChange={(v) => set('hours', v)} />
    </TabPanel>
  )
}

function SeoTab({ settings, setSettings, showToast }) {
  const [saving, setSaving] = useState(false)
  const s = settings.seo || {}
  const set = (k, v) => setSettings((prev) => ({ ...prev, seo: { ...prev.seo, [k]: v } }))
  const save = async () => {
    setSaving(true)
    try {
      await adminService.updateSEO(s)
      showToast('SEO enregistré')
    } catch (err) { showToast(err?.response?.data?.message || 'Erreur sauvegarde', true) }
    finally { setSaving(false) }
  }
  return (
    <TabPanel onSave={save} saving={saving}>
      <Field label="Meta titre" value={s.metaTitle} onChange={(v) => set('metaTitle', v)} />
      <Field label="Meta description" value={s.metaDescription} onChange={(v) => set('metaDescription', v)} />
    </TabPanel>
  )
}

export default Settings
