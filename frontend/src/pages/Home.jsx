import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { FiArrowRight, FiShoppingBag } from 'react-icons/fi'
import { settingsService } from '../services/settings.service'
import { productsService } from '../services/products.service'
import { normalizeCategory, normalizeProduct } from '../utils/catalog'
import SectionReveal from '../components/ui/SectionReveal'
import CategoryCard from '../components/ui/CategoryCard'
import ProductCard from '../components/ui/ProductCard'
import ProductModal from '../components/ui/ProductModal'
import { useCart } from '../context/CartContext'

const defaultHero = {
  imageUrl: '',
  headlineTop: 'Luxury living',
  headlineItalic: 'reimagined',
  headlineBottom: 'for Tunisia',
  subtitle: 'Curated furniture and décor with showroom presence — delivered across Tunisia with white-glove care.',
  ctaButtonText: 'Découvrir la collection',
}

function WarmCorner({ pos }) {
  const isRight = pos === 'br'
  return (
    <svg
      className={`absolute pointer-events-none ${isRight ? 'right-5 bottom-5' : 'left-5 top-5'}`}
      width="44" height="44" viewBox="0 0 44 44" fill="none"
      aria-hidden
    >
      {isRight ? (
        <>
          <path d="M44 44 L44 20 M44 44 L20 44" stroke="rgba(123,79,58,0.35)" strokeWidth="1.2"
            strokeDasharray="60" strokeDashoffset="60">
            <animate attributeName="stroke-dashoffset" from="60" to="0" dur="1.1s" fill="freeze" begin="0.6s" />
          </path>
        </>
      ) : (
        <>
          <path d="M0 0 L0 24 M0 0 L24 0" stroke="rgba(123,79,58,0.35)" strokeWidth="1.2"
            strokeDasharray="60" strokeDashoffset="60">
            <animate attributeName="stroke-dashoffset" from="60" to="0" dur="1.1s" fill="freeze" begin="0.4s" />
          </path>
        </>
      )}
    </svg>
  )
}

export default function Home() {
  const reduce = useReducedMotion()
  const { addToCart } = useCart()
  const [hero, setHero] = useState(defaultHero)
  const [modalProduct, setModalProduct] = useState(null)
  const [categories, setCategories] = useState([])
  const [best, setBest] = useState([])

  useEffect(() => {
    settingsService.getSettings().then((s) => s?.hero && setHero({ ...defaultHero, ...s.hero })).catch(() => {})
  }, [])

  useEffect(() => {
    productsService.getCategories()
      .then(({ data }) => setCategories((data.data || []).map(normalizeCategory)))
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    const loadBest = async () => {
      try {
        const { data } = await productsService.getProducts({ isBestSeller: true, limit: 8 })
        let items = (data.data?.products || []).map(normalizeProduct)
        if (!items.length) {
          const fallback = await productsService.getProducts({ limit: 8 })
          items = (fallback.data.data?.products || []).map(normalizeProduct)
        }
        setBest(items)
      } catch {
        setBest([])
      }
    }
    loadBest()
  }, [])

  const headlineWords = `${hero.headlineTop} ${hero.headlineItalic} ${hero.headlineBottom}`.trim().split(' ')
  const italicWord = hero.headlineItalic?.trim()

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-[52%_48%] md:min-h-[calc(100vh-72px)] pt-[60px] md:pt-[72px]">

        {/* Left — text */}
        <div className="flex flex-col justify-center px-6 py-16 md:px-14 lg:px-20 order-2 md:order-1">
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="eyebrow mb-5"
          >
            Nouvelle collection
          </motion.p>

          <h1
            className="font-cormorant font-light leading-[1.06] text-ink"
            style={{ fontSize: 'clamp(44px, 5.5vw, 82px)' }}
            aria-label={`${hero.headlineTop} ${hero.headlineItalic} ${hero.headlineBottom}`}
          >
            {headlineWords.map((word, i) => (
              <motion.span
                key={i}
                initial={reduce ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.15 + i * 0.07, ease: [0.76, 0, 0.24, 1] }}
                className={`inline-block mr-[0.28em] ${word === italicWord ? 'italic text-bark' : ''}`}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.span
            className="warm-rule my-6"
            initial={reduce ? false : { scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            style={{ originX: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          />

          <motion.p
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            className="max-w-[400px] text-[14px] leading-8 text-stone"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.7 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              to="/collections"
              className="btn-bark inline-flex items-center gap-2"
            >
              {hero.ctaButtonText || 'Découvrir la collection'} <FiArrowRight size={13} />
            </Link>
          </motion.div>
        </div>

        {/* Right — admin image panel */}
        <div
          className="relative order-1 md:order-2 min-h-[340px] overflow-hidden"
          style={{ background: '#D4C4B5' }}
        >
          {/* Dot pattern */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(123,79,58,0.18) 1px, transparent 1px)',
              backgroundSize: '22px 22px',
            }}
          />

          {/* Inner frame */}
          <div
            className="absolute inset-[6%] overflow-hidden"
            style={{
              border: '1px solid rgba(123,79,58,0.22)',
              boxShadow: 'inset 0 0 40px rgba(42,31,26,0.06)',
            }}
          >
            {hero.imageUrl ? (
              <img
                src={hero.imageUrl}
                alt="Collection vedette"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: '#EDE8E0' }}>
                <img
                  src="/logo2.png"
                  alt=""
                  aria-hidden="true"
                  className="w-32 md:w-44 opacity-[0.10]"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
              </div>
            )}
          </div>

          {/* Corner accents */}
          <WarmCorner pos="tl" />
          <WarmCorner pos="br" />

          {/* Price tag — top */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="absolute right-[9%] top-[12%] hidden md:block"
          >
            <div className="rounded-card bg-cream/90 px-4 py-2 shadow-float backdrop-blur-sm">
              <p className="font-josefin text-[7px] uppercase tracking-[0.22em] text-stone">Nouvelle pièce</p>
              <p className="mt-0.5 font-cormorant text-[18px] font-light text-bark">À partir de 890 TND</p>
            </div>
          </motion.div>

          {/* Price tag — bottom */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="absolute bottom-[12%] left-[9%] hidden md:block"
          >
            <div className="flex items-center gap-2 rounded-card bg-bark px-4 py-2 shadow-float">
              <FiShoppingBag size={11} className="text-cream/70" />
              <p className="font-josefin text-[7px] uppercase tracking-[0.22em] text-cream/90">Livraison offerte</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Marquee band ─────────────────────────────────────── */}
      <div className="overflow-hidden border-y border-nude/50 bg-parchment py-3">
        <div className="animate-marquee flex whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, si) => (
            <span key={si} className="flex shrink-0">
              {['Artisanat Local', 'Design Intemporel', 'Matériaux Premium', 'Livraison Tunisie', 'Service Sur Mesure'].map((item) => (
                <span key={item} className="mx-8 font-josefin text-[9px] uppercase tracking-[0.3em] text-stone/60">
                  {item} <span className="mx-3 text-bark/40">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── Collections ──────────────────────────────────────── */}
      <section className="bg-cream px-5 py-20 md:px-16 md:py-28">
        <SectionReveal>
          <div className="mx-auto flex max-w-[1280px] flex-wrap items-end justify-between gap-4 mb-12">
            <div>
              <p className="eyebrow mb-3">Collections</p>
              <h2
                className="font-cormorant font-light text-ink"
                style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}
              >
                Explorez notre <em className="italic text-bark">univers</em>
              </h2>
            </div>
            <Link to="/collections" className="font-josefin text-[9px] uppercase tracking-[0.22em] text-bark hover:text-ink transition-colors flex items-center gap-1">
              Voir tout <FiArrowRight size={11} />
            </Link>
          </div>
        </SectionReveal>
        <div className="mx-auto max-w-[1280px] grid grid-cols-2 gap-5 lg:grid-cols-3">
          {categories.map((c, i) => (
            <motion.div
              key={c.id || c._id}
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.08 }}
            >
              <CategoryCard category={c} panelColor={c.panelColor} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Best Sellers ─────────────────────────────────────── */}
      <section className="bg-parchment px-5 py-20 md:px-16 md:py-28">
        <SectionReveal>
          <div className="mx-auto flex max-w-[1280px] flex-wrap items-end justify-between gap-6 mb-12">
            <div>
              <p className="eyebrow mb-3">Sélection</p>
              <h2
                className="font-cormorant font-light text-ink"
                style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}
              >
                Nos best <em className="italic text-bark">sellers</em>
              </h2>
            </div>
            <Link to="/collections" className="font-josefin text-[9px] uppercase tracking-[0.22em] text-bark hover:text-ink transition-colors flex items-center gap-1">
              Voir tout <FiArrowRight size={11} />
            </Link>
          </div>
        </SectionReveal>

        <div className="mx-auto max-w-[1280px] grid grid-cols-2 gap-5 lg:grid-cols-4">
          {best.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} onOpen={setModalProduct} onAdd={addToCart} />
          ))}
        </div>
      </section>

      {/* ── Brand Story ──────────────────────────────────────── */}
      <section className="px-5 py-16 md:px-16 md:py-24">
        <div className="mx-auto grid max-w-[1320px] overflow-hidden rounded-card-lg md:grid-cols-[40%_60%]">
          {/* Left stat cards */}
          <div className="relative min-h-[280px] bg-parchment p-8 md:p-12 flex flex-col justify-between">
            <svg className="absolute inset-0 h-full w-full opacity-[0.08]" aria-hidden>
              <defs>
                <pattern id="warmGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M0 40 L40 0 M-10 10 L10 -10 M30 50 L50 30" stroke="#A89140" strokeWidth="0.6" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#warmGrid)" />
            </svg>
            <div className="relative grid grid-cols-2 gap-6">
              {[['200+', 'Pièces curatées'], ['2015', 'Fondée à Tunis'], ['18', 'Artisans partenaires'], ['100%', 'Matériaux premium']].map(([n, l]) => (
                <motion.div
                  key={l}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="rounded-card border border-nude/60 bg-cream/70 p-5"
                >
                  <p className="font-cormorant text-[36px] font-light text-bark leading-none">{n}</p>
                  <p className="mt-1 font-josefin text-[8px] uppercase tracking-[0.22em] text-stone">{l}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right dark panel */}
          <div className="flex flex-col justify-center bg-sage-dark px-8 py-14 md:px-14 md:py-16">
            <p className="font-josefin text-[8px] uppercase tracking-[0.34em] text-nude/60 mb-4">L&apos;essence d&apos;Aurya</p>
            <h3
              className="font-cormorant font-light text-cream leading-[1.1]"
              style={{ fontSize: 'clamp(32px, 3.5vw, 52px)' }}
            >
              Design qui <em className="italic text-nude">transcende</em> le temps
            </h3>
            <span className="warm-rule my-6 opacity-30" />
            <p className="text-[14px] leading-8 text-nude/70">
              Nous composons des intérieurs comme des récits éditoriaux — proportion, texture et lumière chaude. Chaque pièce est choisie pour vieillir beauté dans les maisons tunisiennes.
            </p>
            <Link
              to="/a-propos"
              className="mt-8 inline-flex w-fit items-center gap-2 border border-cream/25 px-7 py-3 font-josefin text-[9px] uppercase tracking-[0.22em] text-cream/80 transition-colors hover:bg-cream/10 hover:text-cream"
            >
              Notre histoire <FiArrowRight size={11} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trust band ───────────────────────────────────────── */}
      <section className="bg-cream border-t border-nude/50 px-5 py-14 md:px-16">
        <div className="mx-auto max-w-[1280px] grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: '✦', title: 'Qualité Premium', body: 'Matières nobles sélectionnées par nos experts.' },
            { icon: '✦', title: 'Livraison Tunisie', body: 'Livraison et installation professionnelle.' },
            { icon: '✦', title: 'Conseil Sur Mesure', body: 'Nos designers se déplacent à votre domicile.' },
            { icon: '✦', title: 'Garantie 5 Ans', body: 'Chaque meuble garanti 5 ans.' },
          ].map((t, i) => (
            <motion.article
              key={t.title}
              initial={reduce ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={reduce ? {} : { y: -4 }}
              className="rounded-card border border-nude/60 bg-parchment p-8 shadow-soft transition-shadow hover:shadow-card"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-bark/10 text-bark text-sm font-light">{t.icon}</div>
              <h4 className="mt-4 font-cormorant text-xl font-light text-ink">{t.title}</h4>
              <p className="mt-2 text-[13px] leading-7 text-stone">{t.body}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <ProductModal product={modalProduct} open={Boolean(modalProduct)} onClose={() => setModalProduct(null)} onAdd={addToCart} />
    </>
  )
}
