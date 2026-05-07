import { Link, useLocation } from 'react-router-dom'
import { useAdminUI } from '../../context/AdminUIContext'

const mapTitle = (path) => {
  const pageTitles = {
    '/admin': 'Tableau de bord',
    '/admin/orders': 'Commandes',
    '/admin/products': 'Produits',
    '/admin/categories': 'Catégories',
    '/admin/settings': 'Paramètres',
    '/admin/analytics': 'Analytiques',
    '/admin/customers': 'Clients',
  }
  if (pageTitles[path]) return pageTitles[path]
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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: 'rgba(13,13,13,0.94)',
        backdropFilter: 'blur(12px)',
        borderBottom: '0.5px solid rgba(201,168,76,0.15)',
        zIndex: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div className="admin-topbar-left" style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
        <button
          onClick={toggleSidebar}
          aria-label="Ouvrir le menu"
          className="admin-hamburger"
          style={{
            flexDirection: 'column',
            justifyContent: 'center',
            gap: '5px',
            width: '40px',
            height: '40px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
          }}
        >
          <span
            style={{
              display: 'block',
              width: '20px',
              height: '1.5px',
              background: '#C9A84C',
              transform: sidebarOpen ? 'rotate(45deg) translateY(6.5px)' : 'none',
              transformOrigin: 'center',
              transition: 'transform 0.25s cubic-bezier(0.76,0,0.24,1)',
            }}
          />
          <span
            style={{
              display: 'block',
              width: '20px',
              height: '1.5px',
              background: '#C9A84C',
              opacity: sidebarOpen ? 0 : 1,
              transform: sidebarOpen ? 'scaleX(0)' : 'scaleX(1)',
              transition: 'opacity 0.25s, transform 0.25s',
            }}
          />
          <span
            style={{
              display: 'block',
              width: '20px',
              height: '1.5px',
              background: '#C9A84C',
              transform: sidebarOpen ? 'rotate(-45deg) translateY(-6.5px)' : 'none',
              transformOrigin: 'center',
              transition: 'transform 0.25s cubic-bezier(0.76,0,0.24,1)',
            }}
          />
        </button>
        <span
          style={{
            fontFamily: "'Josefin Sans', sans-serif",
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.92)',
          }}
        >
          {mapTitle(location.pathname)}
        </span>
      </div>
      <div style={{ paddingRight: '24px' }}>
        <Link to="/" target="_blank" rel="noopener noreferrer" className="admin-store-link font-josefin text-[8px] uppercase tracking-[0.2em] text-gold">
          <span>VOIR LA BOUTIQUE ↗</span>
        </Link>
      </div>
    </header>
  )
}

export default AdminTopbar
