import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import ProductCard from '../components/ui/ProductCard'
import ProductModal from '../components/ui/ProductModal'
import SectionReveal from '../components/ui/SectionReveal'
import { useCart } from '../context/CartContext'
import { productsService } from '../services/products.service'
import { normalizeCategory, normalizeProduct, SORT_TO_API } from '../utils/catalog'

const sortOpts = [
  { v: 'pertinence', label: 'Pertinence' },
  { v: 'croissant', label: 'Prix croissant' },
  { v: 'decroissant', label: 'Prix décroissant' },
  { v: 'nouveau', label: 'Nouveautés' },
]

export default function Collections() {
  const [params, setParams] = useSearchParams()
  const cat = params.get('cat') || 'all'
  const [sort, setSort] = useState('pertinence')
  const [modalProduct, setModalProduct] = useState(null)
  const [categories, setCategories] = useState([])
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const reduce = useReducedMotion()

  useEffect(() => {
    productsService.getCategories()
      .then(({ data }) => setCategories((data.data || []).map(normalizeCategory)))
      .catch(() => setCategories([]))
  }, [])

  useEffect(() => {
    setLoading(true)
    const apiParams = {
      sort: SORT_TO_API[sort] || 'newest',
      limit: 100,
    }
    if (cat !== 'all') apiParams.category = cat
    if (sort === 'nouveau') apiParams.isNew = true

    productsService.getProducts(apiParams)
      .then(({ data }) => setList((data.data?.products || []).map(normalizeProduct)))
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }, [cat, sort])

  const setCat = (slug) => {
    const next = new URLSearchParams(params)
    if (slug === 'all') next.delete('cat')
    else next.set('cat', slug)
    setParams(next)
  }

  return (
    <main className="bg-cream pt-[60px] md:pt-[72px]">

      {/* Page header */}
      <section className="relative overflow-hidden bg-parchment px-5 py-16 md:py-20 text-center border-b border-nude/50">
        
        <div className="absolute inset-0 warm-pattern opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
          <img src="/logo2.png" alt="" aria-hidden className="w-48 opacity-[0.04]" onError={(e) => { e.currentTarget.style.display = 'none' }} />
        </div>
        <SectionReveal className="relative">
          <p className="eyebrow mb-4">Notre catalogue</p>
          <h1
            className="font-cormorant font-light text-ink"
            style={{ fontSize: 'clamp(44px, 5vw, 72px)' }}
          >
            Collections
          </h1>
          <p className="mt-3 font-josefin text-[9px] uppercase tracking-[0.24em] text-stone/60">
            {loading ? 'Chargement…' : `${list.length} pièce${list.length !== 1 ? 's' : ''}`}
          </p>
        </SectionReveal>
      </section>

      {/* Filter bar */}
      <section
        className="sticky top-[60px] md:top-[72px] z-30 border-b border-nude/60 px-5 py-4 md:px-16"
        style={{ background: 'rgba(247,244,239,0.97)', backdropFilter: 'blur(16px)' }}
      >
        <div className="mx-auto flex max-w-[1280px] flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setCat('all')}
              className={`rounded-pill border px-4 py-2 font-josefin text-[9px] uppercase tracking-[0.18em] transition-colors ${
                cat === 'all'
                  ? 'border-bark bg-bark text-cream'
                  : 'border-nude/80 text-stone hover:border-bark hover:text-ink'
              }`}
            >
              Tout
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCat(c.slug)}
                className={`rounded-pill border px-4 py-2 font-josefin text-[9px] uppercase tracking-[0.18em] transition-colors ${
                  cat === c.slug
                    ? 'border-bark bg-bark text-cream'
                    : 'border-nude/80 text-stone hover:border-bark hover:text-ink'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="sr-only">Trier</label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-nude/80 bg-cream px-4 py-2.5 font-josefin text-[9px] uppercase tracking-[0.14em] text-stone outline-none focus:border-bark"
              style={{
                appearance: 'none',
                WebkitAppearance: 'none',
                backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%237B4F3A' stroke-width='1.2' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
                paddingRight: '36px',
              }}
            >
              {sortOpts.map((o) => (
                <option key={o.v} value={o.v}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="mx-auto max-w-[1280px] px-5 py-10 md:px-16 md:py-14">
        {loading ? (
          <p className="py-20 text-center font-josefin text-[9px] uppercase tracking-[0.2em] text-stone/40">Chargement des produits…</p>
        ) : (
          <motion.div
            key={cat + sort}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {list.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} onOpen={setModalProduct} onAdd={addToCart} />
            ))}
          </motion.div>
        )}

        {!loading && list.length === 0 && (
          <div className="py-20 text-center">
            <p className="font-cormorant text-2xl font-light text-stone">Aucun produit trouvé</p>
          </div>
        )}
      </section>

      <ProductModal product={modalProduct} open={Boolean(modalProduct)} onClose={() => setModalProduct(null)} onAdd={addToCart} />
    </main>
  )
}
