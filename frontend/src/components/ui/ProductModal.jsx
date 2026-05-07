import { AnimatePresence, motion } from 'framer-motion'
import { Dialog, DialogPanel } from '@headlessui/react'
import { useEffect } from 'react'
import { formatPrice } from '../../data/products'
import GoldCorner from './GoldCorner'
import { useCart } from '../../hooks/useCart'

const ProductModal = ({ product, open, onClose }) => {
  const { addToCart } = useCart()
  useEffect(() => {
    if (!open) return undefined
    const old = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = old
    }
  }, [open])
  return (
    <AnimatePresence>
      {open && product && (
        <Dialog open={open} onClose={onClose} className="relative z-[600]">
          <motion.div className="fixed inset-0 bg-black/90 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <div className="fixed inset-0 grid place-items-end p-0 md:place-items-center md:p-6">
            <DialogPanel as={motion.div} initial={{ opacity: 0, y: '100%' }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: '100%' }} transition={{ type: 'spring', stiffness: 280, damping: 28 }} className="relative h-screen w-full overflow-y-auto border border-[0.5px] border-[rgba(201,168,76,0.25)] bg-dark2 md:h-auto md:max-w-3xl md:overflow-visible">
              <button aria-label="Fermer la fenêtre produit" className="absolute right-4 top-4 z-10 h-8 w-8 border border-[0.5px] border-[rgba(255,255,255,0.12)] text-[rgba(255,255,255,0.45)] hover:border-gold hover:text-gold" onClick={onClose}>✕</button>
              <GoldCorner className="absolute left-0 top-0" />
              <GoldCorner className="absolute bottom-0 right-0 rotate-180" />
              <div className="grid md:grid-cols-2">
                <div className="grid min-h-[260px] place-items-center bg-dark3 md:min-h-[380px]">
                  <p className="font-cormorant text-6xl text-[rgba(201,168,76,0.08)] md:text-7xl">{product.bgLabel}</p>
                </div>
                <div className="p-6 md:p-8">
                  <p className="font-josefin text-[8px] uppercase tracking-[0.25em] text-gold">{product.category}</p>
                  <h3 className="mt-2 font-cormorant text-4xl font-light">{product.name}</h3>
                  <span className="gold-rule my-4" />
                  <p className="text-sm leading-7 text-[rgba(255,255,255,0.45)]">{product.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">{product.tags.map((t) => <span key={t} className="border border-[0.5px] border-[rgba(201,168,76,0.22)] px-2 py-1 font-josefin text-[7px] uppercase tracking-[0.12em] text-gold">{t}</span>)}</div>
                  <p className="mt-5 font-josefin text-[9px] uppercase tracking-[0.15em] text-[rgba(255,255,255,0.45)]">{product.dimensions} · {product.material}</p>
                  <div className="mt-6 border-t border-[0.5px] border-[rgba(255,255,255,0.07)] pt-5">
                    <p className="font-josefin text-[8px] uppercase tracking-[0.2em] text-[rgba(255,255,255,0.45)]">Prix</p>
                    <p className="mb-4 font-cormorant text-4xl font-light text-gold">{formatPrice(product.price)}</p>
                    <button aria-label={`Ajouter ${product.name} au panier`} className="h-12 w-full bg-gold font-josefin text-[9px] uppercase tracking-[0.22em] text-black hover:bg-gold-light" onClick={() => addToCart(product)}>Ajouter au panier</button>
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

export default ProductModal
