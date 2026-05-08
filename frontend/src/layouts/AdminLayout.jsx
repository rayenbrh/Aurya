import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/admin/AdminSidebar'
import AdminTopbar from '../components/admin/AdminTopbar'
import { adminService } from '../services/admin.service'
import { AdminUIProvider } from '../context/AdminUIContext'

const AdminLayout = () => {
  const [pendingCount, setPendingCount] = useState(0)
  useEffect(() => {
    adminService.getSummary().then(({ data }) => setPendingCount(data.data.pendingOrders || 0)).catch(() => {})
  }, [])
  return (
    <AdminUIProvider>
      <div className="min-h-screen bg-cream">
        <AdminSidebar pendingCount={pendingCount} />
        <AdminTopbar />
        <main className="admin-main" style={{ background: '#F7F4EF' }}>
          <Outlet />
        </main>
      </div>
    </AdminUIProvider>
  )
}

export default AdminLayout
