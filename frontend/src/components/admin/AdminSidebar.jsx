import { AnimatePresence, motion } from 'framer-motion'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAdminUI } from '../../context/AdminUIContext'
import useMediaQuery from '../../hooks/useMediaQuery'

const sections = [
  {
    label: 'Principal',
    items: [
      { to: '/admin', label: 'Tableau de bord', icon: '📊' },
      { to: '/admin/orders', label: 'Commandes', icon: '📦', badgeKey: 'pending' },
      { to: '/admin/products', label: 'Produits', icon: '🛋' },
      { to: '/admin/categories', label: 'Catégories', icon: '🏷' },
    ],
  },
  {
    label: 'Contenu',
    items: [{ to: '/admin/settings', label: 'Paramètres', icon: '⚙️' }],
  },
  {
    label: 'Analyse',
    items: [
      { to: '/admin/analytics', label: 'Analytiques', icon: '📈' },
      { to: '/admin/customers', label: 'Clients', icon: '👥' },
    ],
  },
]

const AdminSidebar = ({ pendingCount = 0 }) => {
  const { user, logout } = useAuth()
  const { sidebarOpen, setSidebarOpen } = useAdminUI()
  const isMobile = useMediaQuery('(max-width: 767px)')
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin'
    return location.pathname.startsWith(path)
  }

  const sidebarContent = (
    <>
      <div className="border-b border-[0.5px] border-[rgba(255,255,255,0.07)] p-5 pr-10">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Aurya Deco" className="h-8 w-8 object-contain" />
          <div>
            <p className="font-josefin text-[11px] uppercase tracking-[0.22em] text-[rgba(255,255,255,0.92)]">AURYA DECO</p>
            <span className="mt-1 inline-block bg-gold px-2 py-[2px] font-josefin text-[7px] uppercase tracking-[0.15em] text-black">Admin</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto py-3">
        {sections.map((section) => (
          <div key={section.label}>
            <div className="px-5 pb-1 pt-4 font-josefin text-[8px] uppercase tracking-[0.25em] text-[rgba(201,168,76,0.45)]">{section.label}</div>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin'}
                onClick={() => isMobile && setSidebarOpen(false)}
                className="flex h-11 items-center justify-between gap-3 px-5 transition-all duration-200"
                style={{
                  borderLeft: isActive(item.to) ? '2px solid #C9A84C' : '2px solid transparent',
                  background: isActive(item.to) ? 'rgba(201,168,76,0.08)' : 'transparent',
                }}
              >
                <div className="flex items-center gap-3">
                  <span style={{ color: isActive(item.to) ? '#C9A84C' : 'rgba(255,255,255,0.4)', fontSize: '16px' }}>{item.icon}</span>
                  <span
                    style={{
                      fontFamily: "'Josefin Sans', sans-serif",
                      fontSize: '9px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: isActive(item.to) ? '#C9A84C' : 'rgba(255,255,255,0.45)',
                    }}
                  >
                    {item.label}
                  </span>
                </div>
                {item.badgeKey === 'pending' && pendingCount > 0 ? (
                  <span className="min-w-[18px] bg-gold px-1 text-center font-josefin text-[7px] font-bold text-black">{pendingCount}</span>
                ) : null}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      <div className="border-t border-[0.5px] border-[rgba(255,255,255,0.07)] px-5 py-4">
        <p className="text-sm text-[rgba(255,255,255,0.92)]">{user?.firstName} {user?.lastName}</p>
        <p className="text-xs text-[rgba(255,255,255,0.45)]">{user?.email}</p>
        <button
          className="mt-2 border-none bg-transparent p-0 text-left font-josefin text-[8px] uppercase tracking-[0.15em] text-gold"
          onClick={async () => {
            await logout()
            navigate('/admin/login')
          }}
        >
          Se déconnecter
        </button>
      </div>
    </>
  )

  if (!isMobile) {
    return (
      <aside style={{ position: 'fixed', top: 0, left: 0, width: '240px', height: '100vh', background: '#111111', borderRight: '0.5px solid rgba(201,168,76,0.18)', zIndex: 80, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        {sidebarContent}
      </aside>
    )
  }

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSidebarOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 199 }}
          />
          <motion.aside
            key="sidebar"
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            exit={{ x: -260 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            style={{ position: 'fixed', top: 0, left: 0, width: '260px', height: '100vh', background: '#111111', borderRight: '0.5px solid rgba(201,168,76,0.18)', zIndex: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}
          >
            <button
              onClick={() => setSidebarOpen(false)}
              style={{ position: 'absolute', top: '16px', right: '16px', width: '28px', height: '28px', background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '14px' }}
              aria-label="Fermer le menu"
            >
              ✕
            </button>
            {sidebarContent}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default AdminSidebar
