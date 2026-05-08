import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import StatusBadge from '../../components/admin/StatusBadge'
import { adminService } from '../../services/admin.service'
import useMediaQuery from '../../hooks/useMediaQuery'

const STATUSES = ['', 'pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled']
const LABELS   = { '': 'Toutes', pending: 'Pending', confirmed: 'Confirmed', preparing: 'Preparing', out_for_delivery: 'Out for delivery', delivered: 'Delivered', cancelled: 'Cancelled' }

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
      <div className="admin-filters-bar border-y border-nude/60 bg-cream">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher…"
          className="admin-input min-h-[44px] flex-1 border-0 border-b border-nude/60 bg-transparent px-2 py-2 font-josefin text-[9px] uppercase tracking-[0.12em] text-ink outline-none placeholder:text-stone/30"
        />
        <div className="admin-status-pills">
          {STATUSES.map((s) => (
            <button
              key={s || 'all'}
              onClick={() => setStatus(s)}
              className={`min-h-[36px] border px-3 font-josefin text-[8px] uppercase tracking-[0.12em] transition-colors ${
                status === s
                  ? 'border-bark bg-bark text-cream'
                  : 'border-nude/60 text-stone/50 hover:border-bark/40 hover:text-bark'
              }`}
            >
              {LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      <div className="admin-table-wrapper border border-nude/60">
        <div className="grid min-w-[860px] grid-cols-[140px_120px_1fr_80px_120px_100px_120px_80px] bg-parchment px-4 py-3 font-josefin text-[8px] uppercase tracking-[0.12em] text-stone/50">
          <span>Commande</span>
          <span className="admin-col-hide-mobile">Date</span>
          <span>Client</span>
          <span className="admin-col-hide-mobile">Articles</span>
          <span>Total</span>
          <span className="admin-col-hide-tablet">Paiement</span>
          <span>Statut</span>
          <span>Actions</span>
        </div>

        {orders.map((o) => (
          <Link
            to={`/admin/orders/${o._id}`}
            key={o._id}
            className="grid min-w-[860px] grid-cols-[140px_120px_1fr_80px_120px_100px_120px_80px] border-t border-nude/40 px-4 py-3 transition-colors hover:bg-parchment/60"
          >
            <span className="font-cormorant text-lg text-bark">{o.orderNumber}</span>
            <span className="admin-col-hide-mobile font-josefin text-[9px] text-stone/50">{new Date(o.createdAt).toLocaleDateString('fr-FR')}</span>
            <span className="font-josefin text-[9px] text-ink">
              {o.customer?.fullName}
              <span className="block text-stone/40">{o.customer?.phone}</span>
            </span>
            <span className="admin-col-hide-mobile font-josefin text-[9px] text-stone/50">{o.items?.length || 0}</span>
            <span className="font-cormorant text-lg text-bark">{Math.round(o.total)} TND</span>
            <span className="admin-col-hide-tablet font-josefin text-[8px] uppercase tracking-[0.1em] text-stone/40">Espèces</span>
            <StatusBadge status={o.status} />
            <span className="font-josefin text-[8px] uppercase tracking-[0.12em] text-bark">{isMobile ? 'Voir' : 'Voir →'}</span>
          </Link>
        ))}

        {orders.length === 0 && (
          <p className="py-10 text-center font-josefin text-[8px] uppercase tracking-[0.2em] text-stone/30">Aucune commande</p>
        )}
      </div>
    </section>
  )
}

export default Orders
