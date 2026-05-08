import { motion, useReducedMotion } from 'framer-motion'
import { FiHeart, FiShoppingBag } from 'react-icons/fi'
import { useState } from 'react'
import { categories } from '../../data/categories'
import { formatPrice } from '../../data/products'

export default function ProductCard({ product, onOpen, onAdd, index = 0 }) {
  const reduce = useReducedMotion()
  const [wished, setWished] = useState(false)
  const catLabel = categories.find((c) => c.slug === product.category)?.name || product.category

  return (
    <motion.article
      layout
      initial={reduce ? false : { opacity: 0, y: 30 }}
      whileInView={reduce ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
      whileHover={reduce ? {} : { y: -4 }}
      className="relative w-full shrink-0 overflow-hidden rounded-card border border-nude/60 bg-parchment shadow-soft transition-shadow hover:shadow-card"
    >
      {/* Wishlist */}
      <button
        type="button"
        aria-label={wished ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        onClick={() => setWished((v) => !v)}
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-cream/90 shadow-soft transition-colors hover:bg-nude"
      >
        <FiHeart size={14} className={wished ? 'fill-bark stroke-bark' : 'text-stone/50'} />
      </button>

      {/* Image */}
      <div
        role="presentation"
        className="cursor-pointer"
        onClick={() => onOpen?.(product)}
      >
        <div
          className="relative h-[220px] w-full overflow-hidden"
          style={{ backgroundColor: product.bgColor || '#EDE8E0' }}
        >
          {product.imageUrl ? (
            <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-cormorant text-5xl font-light text-bark/[0.12] italic select-none">
                {product.name?.split(' ')[0]}
              </span>
            </div>
          )}
          {product.isNew && (
            <span className="absolute left-3 top-3 rounded-pill bg-olive px-2.5 py-1 font-josefin text-[7px] uppercase tracking-[0.2em] text-cream">
              Nouveau
            </span>
          )}
        </div>

        {/* Info */}
        <div className="px-4 py-4">
          <p className="font-josefin text-[8px] uppercase tracking-[0.22em] text-stone/60">{catLabel}</p>
          <p className="mt-1 font-cormorant text-[18px] font-light text-ink leading-snug">{product.name}</p>
          <div className="mt-2 flex items-center justify-between">
            <p className="font-cormorant text-[22px] font-light text-olive">{formatPrice(product.price)}</p>
            <button
              type="button"
              aria-label="Ajouter au panier"
              onClick={(e) => {
                e.stopPropagation()
                onAdd?.(product)
              }}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bark text-cream transition-colors hover:bg-bark-light"
            >
              <FiShoppingBag size={13} />
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  )
}
