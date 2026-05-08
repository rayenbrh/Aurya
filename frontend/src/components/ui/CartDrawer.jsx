import { AnimatePresence, motion } from 'framer-motion'
import { Dialog, DialogPanel } from '@headlessui/react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { categories } from '../../data/categories'
import { formatPrice } from '../../data/products'
import { useCart } from '../../context/CartContext'

export default function CartDrawer({ open, onClose }) {
  const { items, totalItems, totalPrice, updateQty, removeFromCart } = useCart()

  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onClose={onClose} className="relative z-[550]">
          <motion.div
            className="fixed inset-0 z-[549]"
            style={{ background: 'rgba(42,31,26,0.45)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <div className="fixed inset-0 flex justify-end">
            <DialogPanel
              as={motion.aside}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 280, damping: 28 }}
              className="flex h-screen w-full max-w-[420px] flex-col bg-cream shadow-drawer"
            >
              {/* Header */}
              <header className="flex items-start justify-between border-b border-nude/60 px-6 py-6">
                <div>
                  <p className="font-cormorant text-2xl font-light text-ink">Mon Panier</p>
                  <p className="mt-0.5 font-josefin text-[8px] uppercase tracking-[0.2em] text-stone/60">
                    {totalItems} article{totalItems !== 1 ? 's' : ''}
                  </p>
                </div>
                <button
                  type="button"
                  aria-label="Fermer"
                  onClick={onClose}
                  className="grid h-8 w-8 place-items-center rounded-full border border-nude text-stone transition-colors hover:border-bark hover:text-bark"
                >
                  <FiX size={14} />
                </button>
              </header>

              {/* Items */}
              <div className="flex-1 overflow-y-auto">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center px-8 py-20 text-center">
                    <div className="mb-6 grid h-24 w-24 place-items-center rounded-full bg-parchment">
                      <FiShoppingBag size={28} className="text-bark/30" />
                    </div>
                    <p className="font-cormorant text-xl font-light text-ink">Votre panier est vide</p>
                    <Link to="/collections" onClick={onClose} className="mt-3 font-josefin text-[9px] uppercase tracking-[0.2em] text-bark hover:text-ink transition-colors">
                      Découvrir nos collections →
                    </Link>
                  </div>
                ) : (
                  items.map(({ product, quantity }) => {
                    const catLabel = categories.find((c) => c.slug === product.category)?.name || product.category
                    return (
                      <div key={product.id} className="flex gap-4 border-b border-nude/50 px-6 py-5">
                        <div
                          className="h-[72px] w-[72px] shrink-0 rounded-card border border-nude/70 overflow-hidden"
                          style={{ backgroundColor: product.bgColor || '#EDE8E0' }}
                        >
                          {product.imageUrl && (
                            <img src={product.imageUrl} alt="" className="h-full w-full object-cover" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-josefin text-[8px] uppercase tracking-[0.18em] text-stone/55">{catLabel}</p>
                              <p className="mt-0.5 font-cormorant text-[16px] font-light text-ink leading-snug">{product.name}</p>
                            </div>
                            <button
                              type="button"
                              aria-label="Supprimer"
                              onClick={() => removeFromCart(product.id)}
                              className="mt-0.5 text-stone/40 transition-colors hover:text-bark"
                            >
                              <FiTrash2 size={13} />
                            </button>
                          </div>
                          <div className="mt-2 flex items-center justify-between">
                            <p className="font-cormorant text-[18px] font-light text-olive">{formatPrice(product.price)}</p>
                            <div className="inline-flex items-center rounded-card border border-nude/80 overflow-hidden">
                              <button
                                type="button"
                                aria-label="Diminuer"
                                className="px-2.5 py-1.5 text-stone transition-colors hover:bg-parchment hover:text-bark"
                                onClick={() => updateQty(product.id, quantity - 1)}
                              >
                                <FiMinus size={11} />
                              </button>
                              <span className="min-w-[2rem] text-center font-josefin text-[10px] text-ink">{quantity}</span>
                              <button
                                type="button"
                                aria-label="Augmenter"
                                className="px-2.5 py-1.5 text-stone transition-colors hover:bg-parchment hover:text-bark"
                                onClick={() => updateQty(product.id, quantity + 1)}
                              >
                                <FiPlus size={11} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <footer className="border-t border-nude/60 bg-parchment px-6 py-6">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-josefin text-[9px] uppercase tracking-[0.2em] text-stone">Sous-total</span>
                    <span className="font-cormorant text-[26px] font-light text-olive">{totalPrice}</span>
                  </div>
                  <button
                    type="button"
                    className="btn-bark h-[52px] w-full justify-center text-[9px]"
                    onClick={() => toast('Bientôt disponible')}
                  >
                    Passer la commande →
                  </button>
                  <p className="mt-3 text-center font-josefin text-[8px] uppercase tracking-[0.18em] text-stone/50">
                    Livraison sécurisée en Tunisie
                  </p>
                </footer>
              )}
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
