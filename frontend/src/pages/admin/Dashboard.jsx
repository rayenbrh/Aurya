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
        <StatCard label="Chiffre d'affaires" value={Math.round(summary?.revenueThisMonth || 0)} suffix=" TND" icon="💰" />
        <StatCard label="Commandes ce mois" value={summary?.ordersThisMonth || 0} icon="📦" />
        <StatCard label="En attente" value={summary?.pendingOrders || 0} icon="⏳" />
        <StatCard label="Clients" value={summary?.totalCustomers || 0} icon="👥" />
      </div>
      <div className="admin-charts-row" style={{ gridTemplateColumns: '60% 40%' }}>
        <div className="border border-[0.5px] border-[rgba(201,168,76,0.22)] bg-dark2 p-5">
          <p className="mb-4 font-josefin text-[9px] uppercase tracking-[0.2em] text-gold">Commandes récentes</p>
          <div className="space-y-2">
            {(summary?.recentOrders || []).map((o) => (
              <div key={o._id} className="flex items-center justify-between border-b border-[0.5px] border-[rgba(255,255,255,0.08)] py-2">
                <p className="font-cormorant text-lg text-gold">{o.orderNumber}</p>
                <StatusBadge status={o.status} />
              </div>
            ))}
          </div>
        </div>
        <div className="border border-[0.5px] border-[rgba(201,168,76,0.22)] bg-dark2 p-5">
          <p className="mb-4 font-josefin text-[9px] uppercase tracking-[0.2em] text-gold">Top produits</p>
          <div className="space-y-2">
            {(summary?.topProducts || []).map((p, idx) => (
              <div key={p._id} className="flex items-center justify-between border-b border-[0.5px] border-[rgba(255,255,255,0.08)] py-2">
                <p className="font-cormorant text-lg text-[rgba(201,168,76,0.45)]">{idx + 1}</p>
                <p className="flex-1 pl-3">{p.name}</p>
                <p className="font-josefin text-xs text-[rgba(255,255,255,0.45)]">{p.orderCount}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="admin-two-col">
        <div className="border border-[0.5px] border-[rgba(201,168,76,0.22)] bg-dark2 p-5">
          <p className="font-josefin text-[9px] uppercase tracking-[0.2em] text-gold">Aperçu commandes</p>
        </div>
        <div className="border border-[0.5px] border-[rgba(201,168,76,0.22)] bg-dark2 p-5">
          <p className="font-josefin text-[9px] uppercase tracking-[0.2em] text-gold">Aperçu produits</p>
        </div>
      </div>
    </section>
  )
}

export default Dashboard
