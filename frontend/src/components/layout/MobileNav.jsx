import { AnimatePresence, motion } from 'framer-motion'
import { Link, useLocation } from 'react-router-dom'

const links = [
  { to: '/', label: 'Accueil', icon: '🏠' },
  { to: '/collections', label: 'Collections', icon: '🛋' },
  { to: '/univers', label: 'Univers', icon: '✦' },
  { to: '/contact', label: 'Contact', icon: '📞' },
  { to: '/connexion', label: 'Mon compte', icon: '👤' },
]

const MobileNav = ({ open, onClose }) => {
  const location = useLocation()
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button aria-label="Fermer le menu mobile" className="fixed inset-0 z-[499] bg-black/70 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside drag="y" onDragEnd={(_, info) => info.offset.y > 80 && onClose()} className="fixed bottom-0 left-0 right-0 z-[500] max-h-[82vh] rounded-t-[20px] border-t border-[0.5px] border-[rgba(201,168,76,0.22)] bg-dark1 p-5 pb-[max(20px,env(safe-area-inset-bottom))]" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}>
            <div className="mx-auto mb-6 h-1 w-10 rounded-sm bg-white/10" />
            <div className="space-y-1">
              {links.map((l, i) => (
                <motion.div key={l.to} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.05 }}>
                  <Link to={l.to} onClick={onClose} className={`flex h-[52px] items-center justify-between px-3 ${location.pathname === l.to ? 'bg-[rgba(201,168,76,0.08)] text-gold' : 'hover:bg-white/5'}`}>
                    <span className="font-josefin text-[10px] uppercase tracking-[0.16em]"><span className="mr-3 text-gold">{l.icon}</span>{l.label}</span>
                    <span>›</span>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mx-1 my-4 h-[0.5px] bg-[rgba(255,255,255,0.07)]" />
            <div className="grid grid-cols-2 gap-2">
              <Link to="/connexion" onClick={onClose} className="grid h-[46px] place-items-center border border-[0.5px] border-[rgba(201,168,76,0.22)] font-josefin text-[9px] uppercase tracking-[0.2em] text-gold">Connexion</Link>
              <Link to="/inscription" onClick={onClose} className="grid h-[46px] place-items-center bg-gold font-josefin text-[9px] uppercase tracking-[0.2em] text-black">S'inscrire</Link>
            </div>
            <p className="mt-4 text-center font-josefin text-[8px] uppercase tracking-[0.15em] text-[rgba(255,255,255,0.45)]">Tunis, Tunisie · +216 XX XXX XXX</p>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobileNav
