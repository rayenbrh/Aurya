import { AnimatePresence, motion } from 'framer-motion'
import { NavLink, Link } from 'react-router-dom'
import { FiHome, FiGrid, FiInfo, FiPhone, FiUser } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/',           label: 'Accueil',     Icon: FiHome,  end: true },
  { to: '/collections', label: 'Produits', Icon: FiGrid, end: false },
  { to: '/a-propos',   label: 'À propos',    Icon: FiInfo,  end: false },
  { to: '/contact',    label: 'Contact',     Icon: FiPhone, end: false },
]

export default function MobileNav({ open, onClose }) {
  const { user } = useAuth()

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Fermer le menu"
            className="fixed inset-0 z-[55] md:hidden"
            style={{ background: 'rgba(42,31,26,0.5)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-[56] max-h-[88vh] overflow-hidden rounded-t-[28px] bg-cream shadow-modal md:hidden"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
          >
            {/* Drag handle */}
            <div className="flex justify-center pb-2 pt-3">
              <span className="h-1 w-12 rounded-pill bg-nude" />
            </div>

            <div className="px-8 pb-10 pt-4">
              <p className="font-cormorant text-[24px] italic font-light text-ink">Aurya</p>

              <nav className="mt-8 flex flex-col gap-1">
                {links.map((l, i) => (
                  <motion.div
                    key={l.to}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.35 }}
                  >
                    <NavLink
                      to={l.to}
                      end={l.end}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-4 rounded-card px-4 py-3.5 transition-colors ${
                          isActive
                            ? 'bg-bark/[0.07] text-bark'
                            : 'text-stone hover:bg-nude/40 hover:text-ink'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <l.Icon size={16} className={isActive ? 'text-bark' : 'text-stone/60'} />
                          <span className="font-josefin text-[10px] uppercase tracking-[0.22em]">{l.label}</span>
                          {isActive && (
                            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-bark" />
                          )}
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              {/* Auth */}
              <div className="mt-8 flex flex-col gap-3 border-t border-nude/60 pt-8">
                {user ? (
                  <Link
                    to="/compte"
                    onClick={onClose}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-nude font-josefin text-[9px] text-bark border border-nude">{`${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'AD'}</span>
                    <span className="font-josefin text-[10px] uppercase tracking-[0.2em] text-stone">Mon compte</span>
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/connexion"
                      onClick={onClose}
                      className="flex items-center justify-center gap-2 border border-bark/30 py-3 font-josefin text-[9px] uppercase tracking-[0.22em] text-bark transition-colors hover:bg-bark hover:text-cream"
                    >
                      <FiUser size={13} /> Connexion
                    </Link>
                    <Link
                      to="/inscription"
                      onClick={onClose}
                      className="flex items-center justify-center bg-bark py-3 font-josefin text-[9px] uppercase tracking-[0.22em] text-cream transition-colors hover:bg-bark-light"
                    >
                      S&apos;inscrire
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
