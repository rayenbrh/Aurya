import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from '../../components/admin/StatusBadge'
import { adminService } from '../../services/admin.service'
import useMediaQuery from '../../hooks/useMediaQuery'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const isMobile = useMediaQuery('(max-width: 767px)')
  useEffect(() => {
    adminService.getOrders({ search, status }).then(({ data }) => setOrders(data.data.orders || [])).catch(() => {})
  }, [search, status])
  return (
    <section>
      <div className="admin-filters-bar border-y border-[0.5px] border-[rgba(255,255,255,0.1)] bg-dark1">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="RECHERCHER..." className="admin-input min-h-[44px] flex-1 border-0 border-b border-[0.5px] border-[rgba(255,255,255,0.15)] bg-transparent px-2 py-2 font-josefin text-[9px] uppercase tracking-[0.12em]" />
        <div className="admin-status-pills">
          {['', 'pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'].map((s) => (
            <button key={s || 'all'} onClick={() => setStatus(s)} className={`min-h-[36px] border border-[0.5px] px-3 font-josefin text-[8px] uppercase tracking-[0.12em] ${status === s ? 'border-gold bg-gold text-black' : 'border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.45)]'}`}>
              {s || 'Toutes'}
            </button>
          ))}
        </div>
      </div>
      <div className="admin-table-wrapper border border-[0.5px] border-[rgba(201,168,76,0.22)]">
        <div className="grid min-w-[860px] grid-cols-[140px_120px_1fr_80px_120px_100px_120px_80px] bg-dark3 px-4 py-3 font-josefin text-[8px] uppercase tracking-[0.12em] text-[rgba(255,255,255,0.45)]">
          <span>Commande</span><span className="admin-col-hide-mobile">Date</span><span>Client</span><span className="admin-col-hide-mobile">Articles</span><span>Total</span><span className="admin-col-hide-tablet">Paiement</span><span>Statut</span><span>Actions</span>
        </div>
        {orders.map((o) => (
          <Link to={`/admin/orders/${o._id}`} key={o._id} className="grid min-w-[860px] grid-cols-[140px_120px_1fr_80px_120px_100px_120px_80px] border-t border-[0.5px] border-[rgba(255,255,255,0.1)] px-4 py-3 hover:bg-[rgba(201,168,76,0.03)]">
            <span className="font-cormorant text-lg text-gold">{o.orderNumber}</span>
            <span className="admin-col-hide-mobile text-xs text-[rgba(255,255,255,0.45)]">{new Date(o.createdAt).toLocaleDateString('fr-FR')}</span>
            <span>{o.customer?.fullName}<span className="block text-xs text-[rgba(255,255,255,0.45)]">{o.customer?.phone}</span></span>
            <span className="admin-col-hide-mobile font-josefin text-[9px] uppercase tracking-[0.1em] text-[rgba(255,255,255,0.45)]">{o.items?.length || 0}</span>
            <span className="font-cormorant text-lg text-gold">{Math.round(o.total)} TND</span>
            <span className="admin-col-hide-tablet font-josefin text-[8px] uppercase tracking-[0.1em] text-[rgba(255,255,255,0.45)]">Espèces</span>
            <StatusBadge status={o.status} />
            <span className="font-josefin text-[8px] uppercase tracking-[0.12em] text-gold">{isMobile ? 'Ouvrir' : 'Voir'}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default Orders
