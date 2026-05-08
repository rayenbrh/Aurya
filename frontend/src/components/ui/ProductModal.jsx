import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Dialog, DialogPanel } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiX, FiHeart, FiShoppingBag, FiArrowRight } from 'react-icons/fi'
import { categories } from '../../data/categories'
import { formatPrice } from '../../data/products'

export default function ProductModal({ product, open, onClose, onAdd }) {
  const reduce = useReducedMotion()
  const [added, setAdded] = useState(false)
  const [wished, setWished] = useState(false)

  useEffect(() => {
    if (!open) { setAdded(false); setWished(false) }
  }, [open, product?.id])

  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  if (!product) return null

  const stars = Math.round(product.rating || 5)
  const catLabel = categories.find((c) => c.slug === product.category)?.name || product.category

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onClose={onClose} className="relative z-[600]">
          <motion.div
            className="fixed inset-0"
            style={{ background: 'rgba(42,31,26,0.6)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <div className="fixed inset-0 grid place-items-end p-0 md:place-items-center md:p-6">
            <DialogPanel
              as={motion.div}
              initial={reduce ? false : { opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="relative flex max-h-screen w-full max-w-[720px] flex-col overflow-hidden rounded-none bg-cream shadow-modal md:max-h-[90vh] md:rounded-card-lg"
            >
              {/* Mobile top bar */}
              <div className="sticky top-0 z-20 flex items-center justify-between border-b border-nude/60 bg-cream/95 px-4 py-3 backdrop-blur-md md:hidden">
                <button type="button" className="text-bark" onClick={onClose} aria-label="Retour">
                  ←
                </button>
                <span className="truncate px-2 text-center font-cormorant text-lg font-light text-ink">{product.name}</span>
                <span className="w-8" />
              </div>

              {/* Desktop close */}
              <button
                type="button"
                aria-label="Fermer"
                onClick={onClose}
                className="absolute right-4 top-[52px] z-10 grid h-8 w-8 place-items-center rounded-full border border-nude text-stone transition-colors hover:border-bark hover:text-bark md:right-4 md:top-4"
              >
                <FiX size={14} />
              </button>

              <div className="grid flex-1 overflow-y-auto md:grid-cols-2 md:overflow-hidden">
                {/* Image panel */}
                <div
                  className="relative min-h-[240px] md:min-h-0 overflow-hidden"
                  style={{ backgroundColor: product.bgColor || '#EDE8E0' }}
                >
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-cormorant text-6xl font-light text-bark/[0.1] italic select-none">
                        {product.name?.split(' ')[0]}
                      </span>
                    </div>
                  )}
                  {/* Corner accents */}
                  <span className="absolute left-4 top-4 h-7 w-7 border-l-[1.5px] border-t-[1.5px] border-bark/20 pointer-events-none" />
                  <span className="absolute right-4 bottom-4 h-7 w-7 border-r-[1.5px] border-b-[1.5px] border-bark/20 pointer-events-none" />
                </div>

                {/* Info panel */}
                <div className="flex flex-col bg-cream p-8 md:max-h-[90vh] md:overflow-y-auto md:p-9">
                  <p className="font-josefin text-[8px] uppercase tracking-[0.26em] text-stone/55">{catLabel}</p>
                  <h2 className="mt-2 font-cormorant text-3xl font-light text-ink">{product.name}</h2>

                  {/* Stars */}
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex gap-0.5" aria-hidden>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`text-base leading-none ${i < stars ? 'text-olive' : 'text-stone/20'}`}>★</span>
                      ))}
                    </div>
                    <span className="font-josefin text-[8px] text-stone/50">
                      {product.rating?.toFixed(1)} ({product.reviews} avis)
                    </span>
                  </div>

                  <p className="mt-5 text-[13px] leading-7 text-stone">{product.description}</p>
                  <p className="mt-3 font-josefin text-[8px] uppercase tracking-[0.18em] text-stone/50">
                    {product.dimensions} · {product.material}
                  </p>

                  {product.tags?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {product.tags.map((t) => (
                        <span key={t} className="rounded-pill border border-nude/80 bg-parchment px-3 py-1 font-josefin text-[8px] uppercase tracking-[0.16em] text-stone/70">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Price */}
                  <div className="mt-8 border-t border-nude/60 pt-6">
                    <p className="font-josefin text-[8px] uppercase tracking-[0.2em] text-stone/50">Prix</p>
                    <div className="mt-1 flex flex-wrap items-baseline gap-3">
                      <span className="font-cormorant text-[38px] font-light text-olive">{formatPrice(product.price)}</span>
                      {product.comparePrice && (
                        <span className="font-josefin text-[11px] text-stone/40 line-through">{formatPrice(product.comparePrice)}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-6 flex flex-col gap-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className={`btn-bark flex-1 h-12 justify-center text-[9px] ${added ? '!bg-sage-dark' : ''}`}
                        onClick={() => { onAdd?.(product); setAdded(true) }}
                      >
                        <FiShoppingBag size={13} className="mr-2" />
                        {added ? 'Ajouté ✓' : 'Ajouter au panier'}
                      </button>
                      <button
                        type="button"
                        aria-label={wished ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                        onClick={() => setWished((v) => !v)}
                        className="h-12 w-12 shrink-0 grid place-items-center border border-nude/80 rounded-card transition-colors hover:border-bark"
                      >
                        <FiHeart size={15} className={wished ? 'fill-bark stroke-bark' : 'text-stone/50'} />
                      </button>
                    </div>
                    <Link to="/contact" onClick={onClose}>
                      <button
                        type="button"
                        className="btn-outline-bark h-12 w-full justify-center text-[9px]"
                      >
                        Finaliser la commande <FiArrowRight size={12} />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
