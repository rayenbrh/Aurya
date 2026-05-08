import { AnimatePresence, motion } from 'framer-motion'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { FiGrid, FiPackage, FiBox, FiTag, FiSettings, FiBarChart2, FiUsers, FiX, FiLogOut } from 'react-icons/fi'
import { useAuth } from '../../context/AuthContext'
import { useAdminUI } from '../../context/AdminUIContext'
import useMediaQuery from '../../hooks/useMediaQuery'

const sections = [
  {
    label: 'Principal',
    items: [
      { to: '/admin',            label: 'Tableau de bord', Icon: FiGrid },
      { to: '/admin/orders',     label: 'Commandes',        Icon: FiPackage, badgeKey: 'pending' },
      { to: '/admin/products',   label: 'Produits',         Icon: FiBox },
      { to: '/admin/categories', label: 'Catégories',       Icon: FiTag },
    ],
  },
  {
    label: 'Contenu',
    items: [
      { to: '/admin/settings', label: 'Paramètres', Icon: FiSettings },
    ],
  },
  {
    label: 'Analyse',
    items: [
      { to: '/admin/analytics', label: 'Analytiques', Icon: FiBarChart2 },
      { to: '/admin/customers', label: 'Clients',      Icon: FiUsers },
    ],
  },
]

const AdminSidebar = ({ pendingCount = 0 }) => {
  const { user, logout }              = useAuth()
  const { sidebarOpen, setSidebarOpen } = useAdminUI()
  const isMobile                      = useMediaQuery('(max-width: 767px)')
  const location                      = useLocation()
  const navigate                      = useNavigate()

  const isActive = (path) =>
    path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(path)

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-cream/[0.08] px-5 py-5">
        <img src="/logo.png" alt="" className="h-8 w-8 object-contain" onError={(e) => { e.currentTarget.style.display = 'none' }} />
        <div>
          <p className="font-josefin text-[11px] uppercase tracking-[0.22em] text-cream/90">Aurya Deco</p>
          <span className="mt-0.5 inline-block bg-bark px-2 py-[2px] font-josefin text-[7px] uppercase tracking-[0.15em] text-cream">Admin</span>
        </div>
        {isMobile && (
          <button onClick={() => setSidebarOpen(false)} className="ml-auto grid h-7 w-7 place-items-center text-cream/40 hover:text-cream" aria-label="Fermer">
            <FiX size={14} />
          </button>
        )}
      </div>

      {/* Nav */}
      <div className="flex-1 overflow-y-auto py-2">
        {sections.map((section) => (
          <div key={section.label} className="mb-2">
            <p className="px-5 pb-1 pt-4 font-josefin text-[8px] uppercase tracking-[0.26em] text-bark/50">
              {section.label}
            </p>
            {section.items.map(({ to, label, Icon, badgeKey }) => {
              const active = isActive(to)
              return (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/admin'}
                  onClick={() => isMobile && setSidebarOpen(false)}
                  className={`flex h-10 items-center justify-between gap-3 px-5 transition-all ${
                    active
                      ? 'border-l-2 border-bark bg-bark/[0.12] text-bark'
                      : 'border-l-2 border-transparent text-cream/40 hover:bg-cream/[0.05] hover:text-cream/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={14} />
                    <span className="font-josefin text-[9px] uppercase tracking-[0.14em]">{label}</span>
                  </div>
                  {badgeKey === 'pending' && pendingCount > 0 && (
                    <span className="min-w-[18px] bg-bark px-1.5 py-0.5 text-center font-josefin text-[7px] text-cream">
                      {pendingCount}
                    </span>
                  )}
                </NavLink>
              )
            })}
          </div>
        ))}
      </div>

      {/* User footer */}
      <div className="border-t border-cream/[0.07] px-5 py-4">
        <p className="font-josefin text-[9px] uppercase tracking-[0.14em] text-cream/80">{user?.firstName} {user?.lastName}</p>
        <p className="mt-0.5 font-josefin text-[8px] text-cream/35">{user?.email}</p>
        <button
          onClick={async () => { await logout(); navigate('/admin/login') }}
          className="mt-3 flex items-center gap-1.5 font-josefin text-[8px] uppercase tracking-[0.18em] text-bark transition-colors hover:text-bark-light"
        >
          <FiLogOut size={11} /> Se déconnecter
        </button>
      </div>
    </div>
  )

  if (!isMobile) {
    return (
      <aside className="fixed left-0 top-0 z-[80] flex h-screen w-[240px] flex-col overflow-y-auto border-r border-cream/[0.07]" style={{ background: '#2A1F1A' }}>
        <SidebarContent />
      </aside>
    )
  }

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-[199]"
            style={{ background: 'rgba(42,31,26,0.7)' }}
          />
          <motion.aside
            key="sidebar"
            initial={{ x: -260 }} animate={{ x: 0 }} exit={{ x: -260 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="fixed left-0 top-0 z-[200] flex h-screen w-[260px] flex-col overflow-y-auto border-r border-cream/[0.07]"
            style={{ background: '#2A1F1A' }}
          >
            <SidebarContent />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}

export default AdminSidebar
