import { useEffect, useState } from 'react'
import StatCard from '../../components/admin/StatCard'
import { adminService } from '../../services/admin.service'

const Analytics = () => {
  const [summary, setSummary] = useState(null)
  useEffect(() => {
    adminService.getSummary().then(({ data }) => setSummary(data.data)).catch(() => {})
  }, [])
  return (
    <section className="space-y-4">
      <div className="admin-stat-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <StatCard label="CA total" value={Math.round(summary?.totalRevenue || 0)} suffix=" TND" />
        <StatCard label="Commandes total" value={summary?.totalOrders || 0} />
        <StatCard label="Panier moyen" value={Math.round(summary?.avgOrderValue || 0)} suffix=" TND" />
        <StatCard label="Produits actifs" value={summary?.totalProducts || 0} />
        <StatCard label="Clients" value={summary?.totalCustomers || 0} />
        <StatCard label="En attente" value={summary?.pendingOrders || 0} />
      </div>
      <div className="admin-charts-row">
        <div className="h-[220px] border border-[0.5px] border-[rgba(201,168,76,0.22)] bg-dark2 p-5">Revenue chart</div>
        <div className="h-[220px] border border-[0.5px] border-[rgba(201,168,76,0.22)] bg-dark2 p-5">Status chart</div>
      </div>
    </section>
  )
}

export default Analytics
