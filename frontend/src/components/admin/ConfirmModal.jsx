import { AnimatePresence, motion } from 'framer-motion'

const ConfirmModal = ({ isOpen, onConfirm, onCancel, title, message, confirmLabel = 'Confirmer', variant = 'danger' }) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-[700] grid place-items-center bg-black/85 p-4">
        <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.92 }} className="w-full max-w-[400px] border border-[0.5px] border-[rgba(201,168,76,0.22)] bg-dark2 p-8">
          <h3 className="font-cormorant text-3xl">{title}</h3>
          <p className="mt-3 text-sm text-[rgba(255,255,255,0.45)]">{message}</p>
          <div className="mt-7 flex gap-2">
            <button type="button" onClick={onCancel} className="h-11 flex-1 border border-[0.5px] border-[rgba(255,255,255,0.12)] font-josefin text-[8px] uppercase tracking-[0.2em]">Annuler</button>
            <button type="button" onClick={onConfirm} className={`h-11 flex-1 font-josefin text-[8px] uppercase tracking-[0.2em] ${variant === 'gold' ? 'bg-gold text-black' : 'border border-[0.5px] border-[#C0392B] text-[#C0392B]'}`}>{confirmLabel}</button>
          </div>
        </motion.div>
      </div>
    )}
  </AnimatePresence>
)

export default ConfirmModal
