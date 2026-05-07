import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { categories } from '../data/categories'
import { products } from '../data/products'
import ProductCard from '../components/ui/ProductCard'
import ProductModal from '../components/ui/ProductModal'
import SectionReveal from '../components/ui/SectionReveal'
import GoldCorner from '../components/ui/GoldCorner'
import PageTransition from '../components/ui/PageTransition'
import { useCart } from '../hooks/useCart'
import { settingsService } from '../services/settings.service'

const Home = () => {
  const defaults = {
    hero: {
      imageUrl: '',
      headlineTop: 'Élever chaque',
      headlineItalic: 'intérieur',
      headlineBottom: "au rang d'oeuvre d'art",
      subtitle: "Mobilier et décoration d'exception, conçus pour les espaces qui méritent la perfection. Livraison dans toute la Tunisie.",
      tag1Name: 'Canapé Velours Imperial',
      tag1Price: '4 800 TND',
      tag2Name: 'Table Marbre Carrara',
      tag2Price: '7 200 TND',
      ctaButtonText: 'Découvrir la collection',
    },
  }
  const [siteSettings, setSiteSettings] = useState(null)
  const reduce = useReducedMotion()
  const { addToCart } = useCart()
  const [active, setActive] = useState('tout')
  const [selected, setSelected] = useState(null)
  const rowRef = useRef(null)
  const filtered = useMemo(() => (active === 'tout' ? products : products.filter((p) => p.category === active)), [active])
  useEffect(() => {
    settingsService.getSettings().then((s) => setSiteSettings(s)).catch(() => {})
  }, [])
  const hero = siteSettings?.hero || defaults.hero
  const words = `${hero.headlineTop} ${hero.headlineItalic} ${hero.headlineBottom}`.split(' ')
  return (
    <PageTransition>
      <main className="pt-[58px] md:pt-[68px]">
        <section className="grid grid-cols-1 md:grid-cols-[52%_48%]">
          <div className="order-2 px-5 py-14 md:order-1 md:px-16 md:py-24">
            <motion.p initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.6, delay: 0.2 }} className="eyebrow mb-6">Art de vivre tunisien</motion.p>
            <h1 className="font-cormorant text-[44px] font-light leading-[1.04] md:text-[68px] lg:text-[76px]">
              {words.map((w, i) => (
                <span key={w + i} className="mr-3 inline-block overflow-hidden align-bottom">
                  <motion.span
                    className={`inline-block ${w === hero.headlineItalic ? 'italic text-gold' : ''}`}
                    initial={reduce ? false : { y: '100%' }}
                    animate={{ y: 0 }}
                    transition={{ duration: reduce ? 0 : 0.7, delay: 0.4 + i * 0.06, ease: [0.76, 0, 0.24, 1] }}
                  >
                    {w}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.span initial={reduce ? false : { clipPath: 'inset(0 100% 0 0)' }} animate={{ clipPath: 'inset(0 0 0 0)' }} transition={{ duration: reduce ? 0 : 0.8, delay: 0.85 }} className="gold-rule my-7" />
            <motion.p initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reduce ? 0 : 0.6, delay: 1 }} className="max-w-md text-[15px] leading-8 text-[rgba(255,255,255,0.45)]">{hero.subtitle}</motion.p>
            <button className="mt-6 h-12 bg-gold px-6 font-josefin text-[9px] uppercase tracking-[0.2em] text-black">{hero.ctaButtonText}</button>
          </div>
          <div className={`order-1 relative h-64 bg-dark2 transition-opacity duration-500 md:order-2 md:h-auto ${hero.imageUrl ? '' : 'grid-pattern'}`}>
            <div
              className="absolute inset-[6%] border border-[0.5px] border-[rgba(201,168,76,0.2)] bg-dark3"
              style={hero.imageUrl ? { backgroundImage: `url(${hero.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            >
              <GoldCorner className="absolute left-0 top-0" />
              <GoldCorner className="absolute bottom-0 right-0 rotate-180" />
              {!hero.imageUrl ? <p className="grid h-full place-items-center whitespace-pre-line text-center font-cormorant text-5xl text-[rgba(201,168,76,0.07)]">Salon{'\n'}Prestige</p> : null}
              <div className="absolute bottom-[16%] left-[8%] border border-[0.5px] border-[rgba(201,168,76,0.22)] bg-[rgba(13,13,13,0.85)] px-3 py-2">
                <p className="font-josefin text-[8px] uppercase tracking-[0.12em]">{hero.tag1Name}</p><p className="font-cormorant text-lg text-gold">{hero.tag1Price}</p>
              </div>
              <div className="absolute right-[8%] top-[14%] hidden border border-[0.5px] border-[rgba(201,168,76,0.22)] bg-[rgba(13,13,13,0.85)] px-3 py-2 md:block">
                <p className="font-josefin text-[8px] uppercase tracking-[0.12em]">{hero.tag2Name}</p><p className="font-cormorant text-lg text-gold">{hero.tag2Price}</p>
              </div>
            </div>
          </div>
        </section>
        <div className="relative flex h-12 w-full items-center overflow-hidden whitespace-nowrap border-y border-[0.5px] border-[rgba(201,168,76,0.15)] bg-dark2 hover:[&>*]:[animation-play-state:paused]">
          <div className="inline-flex h-full items-center animate-marquee whitespace-nowrap font-josefin text-[10px] uppercase tracking-[0.25em] text-[rgba(255,255,255,0.45)]">
            <span className="mx-6 leading-none">Mobilier Haut de Gamme ✦ Décoration Intérieure ✦ Livraison Tunisie ✦ Sur Mesure ✦</span>
            <span className="mx-6 leading-none">Mobilier Haut de Gamme ✦ Décoration Intérieure ✦ Livraison Tunisie ✦ Sur Mesure ✦</span>
          </div>
        </div>
        <section className="px-5 py-14 md:px-16 md:py-24">
          <SectionReveal><p className="eyebrow">Nos univers</p><h2 className="mt-4 font-cormorant text-5xl font-light">Explorez nos <em className="text-gold">collections</em></h2></SectionReveal>
          <div className="mt-10 grid grid-cols-2 gap-[1px] md:grid-cols-4">
            {categories.map((c) => <article key={c.id} className="border border-[0.5px] border-[rgba(201,168,76,0.15)] bg-dark2 p-8 text-center"><div className="mx-auto mb-4 grid h-16 w-16 place-items-center border border-[0.5px] border-[rgba(255,255,255,0.10)] text-2xl">{c.icon}</div><p className="font-josefin text-[10px] uppercase tracking-[0.2em]">{c.name}</p><p className="font-cormorant text-sm text-[rgba(255,255,255,0.45)]">{c.count} pièces</p></article>)}
          </div>
        </section>
        <section className="px-5 py-14 md:px-16 md:py-24">
          <div className="mb-6 flex flex-wrap gap-2 border-b border-[0.5px] border-[rgba(255,255,255,0.10)]">
            {['tout', ...categories.map((c) => c.slug)].map((k) => <button key={k} onClick={() => setActive(k)} className={`px-4 py-3 font-josefin text-[9px] uppercase tracking-[0.2em] ${active === k ? 'border-b border-gold text-gold' : 'text-[rgba(255,255,255,0.45)]'}`}>{k === 'tout' ? 'Tout' : categories.find((c) => c.slug === k)?.name}</button>)}
          </div>
          <div ref={rowRef} className="flex gap-px overflow-x-auto bg-obsidian pb-1 [scrollbar-width:none]">{filtered.map((p) => <ProductCard key={p.id} product={p} onOpen={setSelected} onAdd={addToCart} />)}</div>
        </section>
      </main>
      <ProductModal product={selected} open={Boolean(selected)} onClose={() => setSelected(null)} />
    </PageTransition>
  )
}

export default Home
