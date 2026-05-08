import { Link, useLocation } from 'react-router-dom'
import { FiMenu, FiExternalLink } from 'react-icons/fi'
import { useAdminUI } from '../../context/AdminUIContext'

const mapTitle = (path) => {
  const titles = {
    '/admin':            'Tableau de bord',
    '/admin/orders':     'Commandes',
    '/admin/products':   'Produits',
    '/admin/categories': 'Catégories',
    '/admin/settings':   'Paramètres',
    '/admin/analytics':  'Analytiques',
    '/admin/customers':  'Clients',
  }
  if (titles[path]) return titles[path]
  if (path.includes('/products/') && path.includes('/edit')) return 'Modifier le produit'
  if (path.includes('/products/new')) return 'Nouveau produit'
  if (path.includes('/orders/')) return 'Détail commande'
  return 'Admin'
}

const AdminTopbar = () => {
  const location = useLocation()
  const { toggleSidebar, sidebarOpen } = useAdminUI()

  return (
    <header
      className="fixed left-0 right-0 top-0 z-[70] flex h-[60px] items-center justify-between border-b border-nude/50 px-5 md:px-6"
      style={{ background: 'rgba(247,244,239,0.97)', backdropFilter: 'blur(16px)', marginLeft: '0' }}
    >
      <div className="admin-topbar-left flex flex-1 items-center gap-4">
        {/* Mobile hamburger */}
        <button
          onClick={toggleSidebar}
          aria-label="Menu"
          className="admin-hamburger flex h-9 w-9 flex-col items-center justify-center gap-[5px]"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="block h-[1.5px] w-[18px] bg-ink transition-all duration-300"
              style={
                i === 0 ? { transform: sidebarOpen ? 'rotate(45deg) translateY(6.5px)' : 'none' }
                : i === 1 ? { opacity: sidebarOpen ? 0 : 1, transform: sidebarOpen ? 'scaleX(0)' : 'scaleX(1)' }
                : { transform: sidebarOpen ? 'rotate(-45deg) translateY(-6.5px)' : 'none' }
              }
            />
          ))}
        </button>

        <span className="font-josefin text-[10px] uppercase tracking-[0.22em] text-ink">
          {mapTitle(location.pathname)}
        </span>
      </div>

      <Link
        to="/"
        target="_blank"
        rel="noopener noreferrer"
        className="admin-store-link flex items-center gap-1.5 font-josefin text-[8px] uppercase tracking-[0.2em] text-bark transition-colors hover:text-ink"
      >
        <span>Voir la boutique</span>
        <FiExternalLink size={11} />
      </Link>
    </header>
  )
}

export default AdminTopbar
