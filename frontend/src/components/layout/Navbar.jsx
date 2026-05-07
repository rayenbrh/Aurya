// TO ADD YOUR LOGO: place your logo image file in the /public folder
// and name it "logo.png" (or update the src path in LogoMark.jsx)
import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FiSearch, FiShoppingBag } from 'react-icons/fi'
import { useCart } from '../../hooks/useCart'
import { useAuth } from '../../context/AuthContext'
import LogoFull from '../ui/LogoFull'
import LogoMark from '../ui/LogoMark'
import MobileNav from './MobileNav'

const Navbar = ({ onCartOpen }) => {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { totalItems } = useCart()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const isAuthenticated = Boolean(user)
  const initials = user?.firstName
    ? `${user.firstName || ''} ${user.lastName || ''}`
        .trim()
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((n) => n[0]?.toUpperCase() || '')
        .join('')
    : 'AD'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.header initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className={`fixed left-0 right-0 top-0 z-[200] h-[58px] border-b border-[0.5px] bg-[rgba(13,13,13,0.94)] px-5 backdrop-blur-xl transition-colors duration-500 md:h-[68px] md:px-16 ${scrolled ? 'border-[rgba(201,168,76,0.35)]' : 'border-[rgba(201,168,76,0.18)]'}`}>
        <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between">
          <Link aria-label="Accueil Aurya Deco" to="/" className="hidden md:block"><LogoFull /></Link>
          <Link aria-label="Accueil Aurya Deco" to="/" className="md:hidden"><LogoMark size={32} /></Link>
          <nav className="hidden gap-8 md:flex">
            {[
              ['/collections', 'Collections'],
              ['/univers', 'Univers'],
              ['/contact', 'Contact'],
            ].map(([p, label]) => (
              <NavLink key={p} to={p} className={({ isActive }) => `relative font-josefin text-[10px] uppercase tracking-[0.2em] transition-colors ${isActive ? 'text-gold after:absolute after:-bottom-1 after:left-0 after:h-[0.5px] after:w-full after:bg-gold' : 'text-[rgba(255,255,255,0.45)] hover:text-gold'}`}>{label}</NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <button aria-label="Rechercher" className="hidden text-[rgba(255,255,255,0.45)] hover:text-gold md:inline-flex">
              <FiSearch size={18} />
            </button>
            <button aria-label="Ouvrir le panier" onClick={onCartOpen} className="relative text-[rgba(255,255,255,0.45)] hover:text-gold"><FiShoppingBag size={18} />
              <AnimatePresence>{totalItems > 0 && <motion.span key={totalItems} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-gold font-josefin text-[8px] text-black">{totalItems}</motion.span>}</AnimatePresence>
            </button>
            {!isAuthenticated ? (
              <div className="hidden items-center gap-[10px] md:flex">
                <button
                  aria-label="Aller à la connexion"
                  onClick={() => navigate('/connexion')}
                  className="border border-[0.5px] border-[rgba(201,168,76,0.35)] px-[18px] py-2 font-josefin text-[9px] uppercase tracking-[0.2em] text-[rgba(255,255,255,0.7)] transition-colors hover:border-gold hover:text-gold"
                >
                  Connexion
                </button>
                <button
                  aria-label="Aller à l'inscription"
                  onClick={() => navigate('/inscription')}
                  className="bg-gold px-[18px] py-2 font-josefin text-[9px] uppercase tracking-[0.2em] text-black transition-colors hover:bg-gold-light"
                >
                  S'inscrire
                </button>
              </div>
            ) : (
              <div className="hidden items-center gap-3 md:flex">
                <button
                  aria-label="Aller au compte"
                  onClick={() => navigate('/compte')}
                  className="grid h-8 w-8 place-items-center rounded-full border border-[0.5px] border-[rgba(201,168,76,0.4)] bg-[rgba(201,168,76,0.15)] font-josefin text-[10px] tracking-[0.1em] text-gold"
                >
                  {initials}
                </button>
                <button
                  aria-label="Se déconnecter"
                  onClick={logout}
                  className="font-josefin text-[8px] uppercase tracking-[0.15em] text-[rgba(255,255,255,0.35)] transition-colors hover:text-[rgba(201,168,76,0.7)]"
                >
                  Déconnexion
                </button>
              </div>
            )}
            <button aria-label="Menu mobile" className="relative h-9 w-9 md:hidden" onClick={() => setOpen((v) => !v)}>
              <span className={`absolute left-[9px] top-[10px] h-[1.5px] w-[18px] bg-gold transition-all duration-300 ${open ? 'translate-y-[6.5px] rotate-45' : ''}`} />
              <span className={`absolute left-[9px] top-[16px] h-[1.5px] w-[18px] bg-gold transition-all duration-300 ${open ? 'scale-x-0 opacity-0' : ''}`} />
              <span className={`absolute left-[9px] top-[22px] h-[1.5px] w-[18px] bg-gold transition-all duration-300 ${open ? '-translate-y-[6.5px] -rotate-45' : ''}`} />
            </button>
          </div>
        </div>
      </motion.header>
      <MobileNav open={open} onClose={() => setOpen(false)} />
    </>
  )
}

export default Navbar
