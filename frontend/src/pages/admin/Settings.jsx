import { useEffect, useState } from 'react'
import { adminService } from '../../services/admin.service'

const TABS = ['hero', 'marquee', 'contact', 'seo']

const Settings = () => {
  const [tab, setTab]               = useState('hero')
  const [settings, setSettings]     = useState(null)
  const [heroImageFile, setHeroImageFile] = useState(null)
  const [saving, setSaving]         = useState(false)
  const [saved, setSaved]           = useState(false)

  useEffect(() => {
    adminService.getSettings().then(({ data }) => setSettings(data.data)).catch(() => {})
  }, [])

  if (!settings) return (
    <section className="grid min-h-[200px] place-items-center">
      <p className="font-josefin text-[9px] uppercase tracking-[0.2em] text-stone/40">Chargement…</p>
    </section>
  )

  const hero = settings.hero || {}

  const saveHeroText = async () => {
    setSaving(true)
    await adminService.updateHeroText(hero)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const saveHeroImage = async () => {
    if (!heroImageFile) return
    const fd = new FormData()
    fd.append('heroImage', heroImageFile)
    const { data } = await adminService.updateHeroImage(fd)
    setSettings((s) => ({ ...s, hero: { ...s.hero, imageUrl: data.data.imageUrl } }))
    setHeroImageFile(null)
  }

  const heroFields = [
    ['headlineTop', 'Titre haut'],
    ['headlineItalic', 'Titre italique'],
    ['headlineBottom', 'Titre bas'],
    ['subtitle', 'Sous-titre'],
    ['ctaButtonText', 'Texte bouton CTA'],
    ['tag1Name', 'Tag 1 — nom'],
    ['tag1Price', 'Tag 1 — prix'],
    ['tag2Name', 'Tag 2 — nom'],
    ['tag2Price', 'Tag 2 — prix'],
  ]

  return (
    <section>
      {/* Tabs */}
      <div className="admin-status-pills mb-6 border-b border-nude/60">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`pb-3 pr-6 font-josefin text-[9px] uppercase tracking-[0.2em] transition-colors ${
              tab === t
                ? 'border-b-2 border-bark text-bark'
                : 'text-stone/40 hover:text-stone'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'hero' && (
        <div className="admin-two-col" style={{ gridTemplateColumns: '55% 45%' }}>
          {/* Edit panel */}
          <div className="border border-nude/60 bg-cream p-6">
            <p className="mb-5 font-josefin text-[9px] uppercase tracking-[0.2em] text-stone/50">Image héro</p>
            {hero.imageUrl
              ? <img src={hero.imageUrl} alt="Hero" className="mb-3 max-h-[180px] w-full object-cover" />
              : <div className="mb-3 grid h-[120px] place-items-center bg-parchment font-josefin text-[8px] uppercase tracking-[0.15em] text-stone/30">Aucune image</div>
            }
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="mb-3 block w-full font-josefin text-[9px] text-stone/50"
              onChange={(e) => setHeroImageFile(e.target.files?.[0] || null)}
            />
            <button
              onClick={saveHeroImage}
              disabled={!heroImageFile}
              className="mb-8 h-10 w-full border border-bark bg-transparent font-josefin text-[8px] uppercase tracking-[0.2em] text-bark transition-colors hover:bg-bark hover:text-cream disabled:opacity-30"
            >
              Enregistrer l'image
            </button>

            <p className="mb-4 font-josefin text-[9px] uppercase tracking-[0.2em] text-stone/50">Textes</p>
            <div className="space-y-4">
              {heroFields.map(([k, label]) => (
                <label key={k} className="block">
                  <span className="mb-1 block font-josefin text-[7px] uppercase tracking-[0.18em] text-stone/40">{label}</span>
                  <input
                    className="w-full border-b border-nude/80 bg-transparent pb-2 font-josefin text-[11px] text-ink outline-none transition-colors focus:border-bark"
                    value={hero[k] || ''}
                    onChange={(e) => setSettings((s) => ({ ...s, hero: { ...s.hero, [k]: e.target.value } }))}
                    placeholder={k}
                  />
                </label>
              ))}
            </div>

            <button
              onClick={saveHeroText}
              disabled={saving}
              className="btn-bark mt-6 h-11 w-full justify-center"
            >
              {saved ? '✓ Enregistré' : saving ? 'Enregistrement…' : 'Enregistrer les textes'}
            </button>
          </div>

          {/* Preview panel */}
          <div className="admin-preview border border-nude/60 bg-parchment p-6">
            <p className="mb-4 text-center font-josefin text-[8px] uppercase tracking-[0.2em] text-stone/40">Aperçu en direct</p>
            <div
              className="relative h-[240px] border border-nude/60"
              style={hero.imageUrl ? { backgroundImage: `url(${hero.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: '#EDE8E0' }}
            >
              {hero.tag1Name && (
                <div className="absolute bottom-3 left-3 border border-nude/60 bg-cream/90 px-3 py-2">
                  <p className="font-josefin text-[7px] uppercase tracking-[0.12em] text-stone/60">{hero.tag1Name}</p>
                  <p className="font-cormorant text-lg text-bark">{hero.tag1Price}</p>
                </div>
              )}
            </div>
            <p className="mt-5 font-cormorant text-3xl text-ink leading-tight">
              {hero.headlineTop} <span className="italic text-bark">{hero.headlineItalic}</span> {hero.headlineBottom}
            </p>
            {hero.subtitle && (
              <p className="mt-2 font-josefin text-[9px] text-stone/60">{hero.subtitle}</p>
            )}
          </div>
        </div>
      )}

      {tab !== 'hero' && (
        <div className="border border-nude/60 bg-cream p-8 text-center">
          <p className="font-josefin text-[8px] uppercase tracking-[0.2em] text-stone/30">Section «{tab}» à configurer</p>
        </div>
      )}
    </section>
  )
}

export default Settings
