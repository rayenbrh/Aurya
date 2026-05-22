import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { FiHome, FiGrid, FiInfo, FiPhone, FiUser, FiX } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/',            label: 'Accueil',  Icon: FiHome,  end: true },
  { to: '/collections', label: 'Produits', Icon: FiGrid,  end: false },
  { to: '/a-propos',    label: 'À propos', Icon: FiInfo,  end: false },
  { to: '/contact',     label: 'Contact',  Icon: FiPhone, end: false },
]

const panelTransition = { type: 'tween', duration: 0.28, ease: [0.76, 0, 0.24, 1] }

export default function MobileNav({ open, onClose }) {
  const { user } = useAuth()
  const location = useLocation()

  useEffect(() => {
    onClose()
  }, [location.pathname])

  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Fermer le menu"
            className="fixed inset-0 z-[55] md:hidden"
            style={{ background: 'rgba(42,31,26,0.45)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={onClose}
          />

          <motion.aside
            id="mobile-nav-panel"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation"
            className="fixed left-0 top-0 z-[56] flex h-full w-[min(88vw,320px)] flex-col border-r border-nude/70 bg-cream shadow-[4px_0_32px_rgba(42,31,26,0.12)] md:hidden"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={panelTransition}
          >
            {/* Header */}
            <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-nude/50 px-5">
              <Link
                to="/"
                onClick={onClose}
                className="font-cormorant text-[26px] italic text-ink transition-opacity hover:opacity-75"
              >
                Aurya
              </Link>
              <button
                type="button"
                aria-label="Fermer le menu"
                onClick={onClose}
                className="grid h-10 w-10 place-items-center rounded-full text-stone transition-colors hover:bg-nude/60 hover:text-ink"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto px-4 py-6">
              <ul className="flex flex-col gap-1">
                {links.map((l) => (
                  <li key={l.to}>
                    <NavLink
                      to={l.to}
                      end={l.end}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-4 rounded-card px-4 py-4 transition-colors ${
                          isActive
                            ? 'border-l-2 border-bark bg-bark/[0.06] pl-[14px] text-bark'
                            : 'border-l-2 border-transparent text-stone hover:bg-nude/35 hover:text-ink'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <l.Icon size={18} className={isActive ? 'text-bark' : 'text-stone/55'} />
                          <span className="font-josefin text-[11px] uppercase tracking-[0.2em]">
                            {l.label}
                          </span>
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Auth footer */}
            <div className="shrink-0 border-t border-nude/60 px-5 py-6">
              {user ? (
                <Link
                  to="/compte"
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-card px-3 py-3 transition-colors hover:bg-nude/40"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-nude bg-nude font-josefin text-[9px] text-bark">
                    {`${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || 'AD'}
                  </span>
                  <span className="font-josefin text-[10px] uppercase tracking-[0.2em] text-stone">
                    Mon compte
                  </span>
                </Link>
              ) : (
                <div className="flex flex-col gap-2.5">
                  <Link
                    to="/connexion"
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 border border-bark/30 py-3.5 font-josefin text-[9px] uppercase tracking-[0.22em] text-bark transition-colors hover:bg-bark hover:text-cream"
                  >
                    <FiUser size={14} />
                    Connexion
                  </Link>
                  <Link
                    to="/inscription"
                    onClick={onClose}
                    className="flex items-center justify-center bg-bark py-3.5 font-josefin text-[9px] uppercase tracking-[0.22em] text-cream transition-colors hover:bg-bark-light"
                  >
                    S&apos;inscrire
                  </Link>
                </div>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
