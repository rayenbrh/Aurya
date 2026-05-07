import { useEffect, useState } from 'react'
import { adminService } from '../../services/admin.service'

const Settings = () => {
  const [tab, setTab] = useState('hero')
  const [settings, setSettings] = useState(null)
  const [heroImageFile, setHeroImageFile] = useState(null)

  useEffect(() => {
    adminService.getSettings().then(({ data }) => setSettings(data.data)).catch(() => {})
  }, [])

  if (!settings) return <section className="p-8">Chargement...</section>
  const hero = settings.hero || {}

  const saveHeroText = async () => {
    await adminService.updateHeroText(hero)
  }
  const saveHeroImage = async () => {
    if (!heroImageFile) return
    const fd = new FormData()
    fd.append('heroImage', heroImageFile)
    const { data } = await adminService.updateHeroImage(fd)
    setSettings((s) => ({ ...s, hero: { ...s.hero, imageUrl: data.data.imageUrl } }))
    setHeroImageFile(null)
  }

  return (
    <section className="p-5 md:p-8">
      <div className="admin-status-pills mb-5 border-b border-[0.5px] border-[rgba(255,255,255,0.1)]">
        {['hero', 'marquee', 'contact', 'seo'].map((t) => <button key={t} onClick={() => setTab(t)} className={`pb-3 font-josefin text-[9px] uppercase tracking-[0.2em] ${tab === t ? 'border-b border-gold text-gold' : 'text-[rgba(255,255,255,0.45)]'}`}>{t}</button>)}
      </div>

      {tab === 'hero' && (
        <div className="admin-two-col" style={{ gridTemplateColumns: '55% 45%' }}>
          <div className="border border-[0.5px] border-[rgba(201,168,76,0.22)] bg-dark2 p-5">
            <p className="font-josefin text-[9px] uppercase tracking-[0.2em] text-gold">Image héro</p>
            {hero.imageUrl ? <img src={hero.imageUrl} alt="Hero" className="mt-3 max-h-[200px] w-full object-cover" /> : <div className="mt-3 grid h-[140px] place-items-center bg-dark3 text-xs text-[rgba(255,255,255,0.45)]">Aucune image</div>}
            <input type="file" accept="image/jpeg,image/png,image/webp" className="mt-3 text-xs" onChange={(e) => setHeroImageFile(e.target.files?.[0] || null)} />
            <button onClick={saveHeroImage} className="mt-3 h-10 bg-gold px-4 font-josefin text-[8px] uppercase tracking-[0.2em] text-black">Enregistrer l'image</button>
            <div className="mt-5 space-y-3">
              {['headlineTop', 'headlineItalic', 'headlineBottom', 'subtitle', 'ctaButtonText', 'tag1Name', 'tag1Price', 'tag2Name', 'tag2Price'].map((k) => (
                <input key={k} className="auth-input w-full border-0 border-b border-[0.5px] border-[rgba(255,255,255,0.15)] bg-transparent py-2" value={hero[k] || ''} onChange={(e) => setSettings((s) => ({ ...s, hero: { ...s.hero, [k]: e.target.value } }))} placeholder={k} />
              ))}
            </div>
            <button onClick={saveHeroText} className="mt-5 h-11 w-full bg-gold font-josefin text-[9px] uppercase tracking-[0.2em] text-black">Enregistrer les textes</button>
          </div>
          <div className="admin-preview border border-[0.5px] border-[rgba(201,168,76,0.22)] bg-dark2 p-5">
            <p className="mb-3 text-center font-josefin text-[8px] uppercase tracking-[0.2em] text-gold">Aperçu en direct</p>
            <div className="relative h-[280px] border border-[0.5px] border-[rgba(201,168,76,0.22)] bg-dark3" style={hero.imageUrl ? { backgroundImage: `url(${hero.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
              <div className="absolute bottom-3 left-3 border border-[0.5px] border-[rgba(201,168,76,0.22)] bg-black/70 p-2 text-xs">
                <p>{hero.tag1Name}</p><p className="font-cormorant text-gold">{hero.tag1Price}</p>
              </div>
            </div>
            <p className="mt-4 font-cormorant text-3xl">{hero.headlineTop} <span className="italic text-gold">{hero.headlineItalic}</span> {hero.headlineBottom}</p>
          </div>
        </div>
      )}
    </section>
  )
}

export default Settings
