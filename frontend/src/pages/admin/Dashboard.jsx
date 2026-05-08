import { useEffect, useState } from 'react'
import StatCard from '../../components/admin/StatCard'
import { adminService } from '../../services/admin.service'
import StatusBadge from '../../components/admin/StatusBadge'

const Dashboard = () => {
  const [summary, setSummary] = useState(null)
  useEffect(() => {
    adminService.getSummary().then(({ data }) => setSummary(data.data)).catch(() => {})
  }, [])

  return (
    <section className="space-y-6">
      <div className="admin-stat-grid">
        <StatCard label="Chiffre d'affaires" value={Math.round(summary?.revenueThisMonth || 0)} suffix=" TND" icon="✦" />
        <StatCard label="Commandes ce mois" value={summary?.ordersThisMonth || 0} icon="✦" />
        <StatCard label="En attente" value={summary?.pendingOrders || 0} icon="✦" />
        <StatCard label="Clients" value={summary?.totalCustomers || 0} icon="✦" />
      </div>

      <div className="admin-charts-row" style={{ gridTemplateColumns: '60% 40%' }}>
        <div className="border border-nude/60 bg-cream p-5">
          <p className="mb-4 font-josefin text-[9px] uppercase tracking-[0.2em] text-stone/50">Commandes récentes</p>
          <div className="space-y-0">
            {(summary?.recentOrders || []).map((o) => (
              <div key={o._id} className="flex items-center justify-between border-b border-nude/40 py-2.5">
                <p className="font-cormorant text-lg text-bark">{o.orderNumber}</p>
                <StatusBadge status={o.status} />
              </div>
            ))}
            {!summary?.recentOrders?.length && (
              <p className="py-4 text-center font-josefin text-[8px] uppercase tracking-[0.15em] text-stone/30">Aucune commande</p>
            )}
          </div>
        </div>
        <div className="border border-nude/60 bg-cream p-5">
          <p className="mb-4 font-josefin text-[9px] uppercase tracking-[0.2em] text-stone/50">Top produits</p>
          <div className="space-y-0">
            {(summary?.topProducts || []).map((p, idx) => (
              <div key={p._id} className="flex items-center justify-between border-b border-nude/40 py-2.5">
                <p className="font-cormorant text-lg text-nude">{idx + 1}</p>
                <p className="flex-1 pl-3 font-josefin text-[9px] text-ink">{p.name}</p>
                <p className="font-josefin text-[9px] text-stone/40">{p.orderCount}</p>
              </div>
            ))}
            {!summary?.topProducts?.length && (
              <p className="py-4 text-center font-josefin text-[8px] uppercase tracking-[0.15em] text-stone/30">Aucun produit</p>
            )}
          </div>
        </div>
      </div>

      <div className="admin-two-col">
        <div className="border border-nude/60 bg-cream p-5">
          <p className="font-josefin text-[9px] uppercase tracking-[0.2em] text-stone/50">Aperçu commandes</p>
          <p className="mt-6 py-8 text-center font-josefin text-[8px] uppercase tracking-[0.15em] text-stone/25">Graphique à venir</p>
        </div>
        <div className="border border-nude/60 bg-cream p-5">
          <p className="font-josefin text-[9px] uppercase tracking-[0.2em] text-stone/50">Aperçu produits</p>
          <p className="mt-6 py-8 text-center font-josefin text-[8px] uppercase tracking-[0.15em] text-stone/25">Graphique à venir</p>
        </div>
      </div>
    </section>
  )
}

export default Dashboard
