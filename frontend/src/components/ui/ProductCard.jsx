import { motion, useReducedMotion } from 'framer-motion'
import { formatPrice } from '../../data/products'

const ProductCard = ({ product, onOpen, onAdd }) => {
  const reduce = useReducedMotion()
  return (
    <motion.article
      onClick={() => onOpen(product)}
      className="group relative w-[220px] md:w-[280px] shrink-0 snap-start border border-[0.5px] border-[rgba(201,168,76,0.15)] bg-dark2"
      whileHover={reduce ? undefined : { y: -5, borderColor: 'rgba(201,168,76,0.55)' }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
      aria-label={`Voir ${product.name}`}
    >
      <div className="relative flex h-[200px] md:h-[260px] items-center justify-center bg-dark3">
        <p className="font-cormorant text-[56px] md:text-[72px] font-light text-[rgba(201,168,76,0.07)]">{product.bgLabel}</p>
        {(product.isNew || product.isBestSeller) && (
          <span className={`absolute left-3 top-3 px-2 py-1 font-josefin text-[7px] uppercase tracking-[0.15em] ${product.isNew ? 'bg-gold text-black' : 'border border-[0.5px] border-gold text-gold'}`}>
            {product.isNew ? 'NOUVEAU' : 'BEST-SELLER'}
          </span>
        )}
        <div className="absolute inset-0 grid place-items-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="border-b border-[0.5px] border-gold font-josefin text-[9px] uppercase tracking-[0.2em] text-gold">Voir le produit</span>
        </div>
      </div>
      <div className="p-4 md:p-5">
        <p className="mb-1 font-josefin text-[8px] uppercase tracking-[0.2em] text-gold">{product.category}</p>
        <h3 className="mb-1 font-cormorant text-2xl font-light">{product.name}</h3>
        <p className="mb-4 text-xs text-[rgba(255,255,255,0.45)]">{product.dimensions} · {product.material}</p>
        <div className="flex items-center justify-between">
          <p className="font-cormorant text-2xl font-light text-gold">{formatPrice(product.price)}</p>
          <button
            aria-label={`Ajouter ${product.name} au panier`}
            className="h-8 w-8 bg-gold text-lg text-black transition-colors hover:bg-gold-light"
            onClick={(e) => {
              e.stopPropagation()
              onAdd(product)
            }}
          >
            +
          </button>
        </div>
      </div>
    </motion.article>
  )
}

export default ProductCard
