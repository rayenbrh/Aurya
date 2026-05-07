import { AnimatePresence, motion } from 'framer-motion'
import { Dialog, DialogPanel } from '@headlessui/react'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import { useCart } from '../../hooks/useCart'

const CartDrawer = ({ open, onClose }) => {
  const { items, totalItems, totalPrice, updateQty, removeFromCart } = useCart()
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
      {open && (
        <Dialog open={open} onClose={onClose} className="relative z-[550]">
          <motion.div className="fixed inset-0 z-[549] bg-black/80 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
          <div className="fixed inset-0 flex justify-end">
            <DialogPanel as={motion.aside} initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 300, damping: 30 }} className="flex h-screen w-full max-w-[440px] flex-col border-l border-[0.5px] border-[rgba(201,168,76,0.22)] bg-dark1">
              <header className="flex h-[68px] items-center justify-between border-b border-[0.5px] border-[rgba(201,168,76,0.12)] px-5">
                <p className="font-josefin text-[11px] uppercase tracking-[0.25em]">MON PANIER <span className="font-cormorant text-base text-[rgba(255,255,255,0.45)]">({totalItems} articles)</span></p>
                <button aria-label="Fermer le panier" onClick={onClose}>✕</button>
              </header>
              <div className="flex-1 overflow-y-auto">
                {items.length === 0 ? <div className="grid h-full place-items-center text-center"><p className="font-cormorant text-3xl">Votre panier est vide</p></div> : items.map(({ product, quantity }) => (
                  <div key={product.id} className="flex gap-3 border-b border-[0.5px] border-[rgba(255,255,255,0.10)] p-4">
                    <div className="grid h-[72px] w-[72px] place-items-center border border-[0.5px] border-[rgba(201,168,76,0.22)] bg-dark3 font-cormorant text-[22px] text-[rgba(201,168,76,0.1)]">{product.bgLabel}</div>
                    <div className="flex-1">
                      <p className="font-cormorant text-xl">{product.name}</p>
                      <p className="font-josefin text-[8px] uppercase tracking-[0.15em] text-[rgba(255,255,255,0.45)]">{product.material}</p>
                      <p className="font-cormorant text-lg text-gold">{product.price} TND</p>
                    </div>
                    <div className="text-center">
                      <div className="mb-2 flex items-center gap-2">
                        <button aria-label="Réduire quantité" className="h-8 w-8 border border-[0.5px] border-[rgba(201,168,76,0.22)] text-gold" onClick={() => updateQty(product.id, quantity - 1)}>-</button>
                        <span className="w-8 font-cormorant text-xl text-gold">{quantity}</span>
                        <button aria-label="Augmenter quantité" className="h-8 w-8 border border-[0.5px] border-[rgba(201,168,76,0.22)] text-gold" onClick={() => updateQty(product.id, quantity + 1)}>+</button>
                      </div>
                      <button aria-label={`Supprimer ${product.name}`} className="font-josefin text-[10px] uppercase tracking-[0.12em] text-[rgba(255,255,255,0.45)] hover:text-red-400" onClick={() => removeFromCart(product.id)}>Supprimer</button>
                    </div>
                  </div>
                ))}
              </div>
              <footer className="border-t border-[0.5px] border-[rgba(201,168,76,0.12)] p-5">
                <div className="mb-4 flex items-center justify-between font-josefin text-[9px] uppercase tracking-[0.2em] text-[rgba(255,255,255,0.45)]"><span>Subtotal</span><span className="font-cormorant text-2xl text-gold">{totalPrice}</span></div>
                <button aria-label="Passer la commande" className="h-[52px] w-full bg-gold font-josefin text-[9px] uppercase tracking-[0.22em] text-black" onClick={() => toast('Bientôt disponible')}>PASSER LA COMMANDE →</button>
              </footer>
            </DialogPanel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  )
}

export default CartDrawer
