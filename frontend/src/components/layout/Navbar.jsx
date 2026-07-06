import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { FiShoppingBag, FiPhone } from 'react-icons/fi'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import MobileNav from './MobileNav'

const navLinks = [
  { to: '/',           label: 'Home',        end: true },
  { to: '/collections', label: 'Produits', end: false },
  { to: '/a-propos',   label: 'À propos',    end: false },
  { to: '/contact',    label: 'Contact',     end: false },
]

export default function Navbar({ onCartOpen }) {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { totalItems }              = useCart()
  const { user, logout }            = useAuth()
  const navigate                    = useNavigate()
  const location                    = useLocation()
  const isAuthenticated             = Boolean(user)

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const initials = user?.firstName
    ? `${user.firstName[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase()
    : 'AD'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.76, 0, 0.24, 1] }}
        className="fixed left-0 right-0 top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(247,244,239,0.97)' : 'rgba(247,244,239,0.93)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: scrolled ? '0 1px 20px rgba(42,31,26,0.07)' : 'none',
        }}
      >
        {/* Support top bar — desktop only */}
        <div className="hidden md:flex items-center justify-end gap-2 border-b border-nude/20 bg-ink/95 px-10 py-1.5">
          <FiPhone size={9} className="text-bark" />
          <a href="tel:+21693091290" className="font-josefin text-[8px] tracking-[0.14em] text-nude/55 hover:text-nude/90 transition-colors">
            Support : +216 93 091 290
          </a>
        </div>

        {/* Nav row */}
        <div className="mx-auto flex h-[72px] max-w-[1440px] items-center border-b border-nude/40 px-5 md:px-10">

          {/* ── MOBILE: hamburger (far left) ── DESKTOP: hidden ── */}
          <button
            type="button"
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            className="relative h-9 w-9 shrink-0 md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className={`absolute left-[9px] top-[11px] h-[1.5px] w-[18px] bg-ink transition-all duration-300 ${mobileOpen ? 'translate-y-[6px] rotate-45' : ''}`} />
            <span className={`absolute left-[9px] top-[17px] h-[1.5px] w-[18px] bg-ink transition-all duration-300 ${mobileOpen ? 'scale-x-0 opacity-0' : ''}`} />
            <span className={`absolute left-[9px] top-[23px] h-[1.5px] w-[18px] bg-ink transition-all duration-300 ${mobileOpen ? '-translate-y-[6px] -rotate-45' : ''}`} />
          </button>

          {/* ── MOBILE: logo centered (flex-1 + justify-center) ── DESKTOP: logo left ── */}
          <Link
            to="/"
            className="flex flex-1 items-center justify-center gap-2.5 transition-opacity hover:opacity-75 md:flex-none md:justify-start"
          >
            <img
              src="/logo.png"
              alt=""
              aria-hidden="true"
              className="h-8 w-8 object-contain"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
            <span className="font-cormorant text-[26px] italic text-ink">Aurya</span>
          </Link>

          {/* ── DESKTOP only: center nav ── */}
          <nav className="hidden flex-1 items-center justify-center gap-10 md:flex">
            {navLinks.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `font-josefin text-[10px] uppercase tracking-[0.22em] transition-colors duration-200 ${
                    isActive
                      ? 'text-bark relative after:absolute after:-bottom-1 after:left-0 after:h-[1.5px] after:w-full after:bg-bark after:rounded-pill'
                      : 'text-stone hover:text-ink'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* ── Right side: cart (always) + auth (desktop only) ── */}
          <div className="flex shrink-0 items-center gap-2 md:gap-3">

            {/* Auth — desktop only */}
            {!isAuthenticated ? (
              <div className="hidden items-center gap-2 md:flex">
                <button
                  type="button"
                  aria-label="Connexion"
                  onClick={() => navigate('/connexion')}
                  className="border border-bark/30 px-4 py-2 font-josefin text-[9px] uppercase tracking-[0.22em] text-bark transition-all hover:bg-bark hover:text-cream"
                >
                  Connexion
                </button>
                <button
                  type="button"
                  aria-label="S'inscrire"
                  onClick={() => navigate('/inscription')}
                  className="bg-bark px-4 py-2 font-josefin text-[9px] uppercase tracking-[0.22em] text-cream transition-colors hover:bg-bark-light"
                >
                  S'inscrire
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-3 md:flex">
                <button
                  type="button"
                  aria-label="Mon compte"
                  onClick={() => navigate('/compte')}
                  className="grid h-8 w-8 place-items-center rounded-full bg-nude font-josefin text-[9px] tracking-[0.08em] text-bark border border-nude/80 transition-colors hover:border-bark/40"
                >
                  {initials}
                </button>
                <button
                  type="button"
                  aria-label="Se déconnecter"
                  onClick={logout}
                  className="font-josefin text-[8px] uppercase tracking-[0.18em] text-stone-light transition-colors hover:text-bark"
                >
                  Déconnexion
                </button>
              </div>
            )}

            {/* Cart — always visible */}
            <button
              type="button"
              aria-label="Panier"
              onClick={onCartOpen}
              className="relative grid h-9 w-9 place-items-center text-stone transition-colors hover:text-bark"
            >
              <FiShoppingBag size={18} />
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    key={totalItems}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-bark font-josefin text-[7px] text-cream"
                  >
                    {totalItems > 99 ? '99+' : totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </motion.header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  )
}
